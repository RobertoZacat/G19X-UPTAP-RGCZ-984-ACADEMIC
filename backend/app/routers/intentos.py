import secrets
from datetime import timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app import models, schemas, auth, ia, calificacion_automatica
from app.models import utcnow

router = APIRouter(prefix="/intentos", tags=["intentos"])

MARGEN_LATENCIA_SEGUNDOS = 30


def _verificar_token_intento(intento: models.Intento, token: Optional[str]) -> None:
    if not token or not secrets.compare_digest(token, intento.token):
        raise HTTPException(status_code=403, detail="Token de intento inválido o faltante")


def _intento_vencido(intento: models.Intento, db: Session) -> bool:
    examen = db.query(models.Examen).filter(models.Examen.id == intento.examen_id).first()
    if not examen or not examen.tiempo_limite_min:
        return False
    limite = intento.iniciado_en + timedelta(
        minutes=examen.tiempo_limite_min, seconds=MARGEN_LATENCIA_SEGUNDOS
    )
    return utcnow() > limite


@router.post("", response_model=schemas.IntentoOut)
def crear_intento(intento: schemas.IntentoCreate, db: Session = Depends(get_db)):
    candidato = db.query(models.Candidato).filter(models.Candidato.id == intento.candidato_id).first()
    if not candidato:
        raise HTTPException(status_code=404, detail="Candidato no encontrado")

    examen = db.query(models.Examen).filter(models.Examen.id == intento.examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen no encontrado")

    nuevo_intento = models.Intento(
        candidato_id=intento.candidato_id,
        examen_id=intento.examen_id,
        token=secrets.token_urlsafe(32)
    )
    db.add(nuevo_intento)
    db.commit()
    db.refresh(nuevo_intento)
    return nuevo_intento


@router.get("/{intento_id}", response_model=schemas.IntentoOut)
def obtener_intento(intento_id: int, token: Optional[str] = Query(None), db: Session = Depends(get_db)):
    intento = db.query(models.Intento).filter(models.Intento.id == intento_id).first()
    if not intento:
        raise HTTPException(status_code=404, detail="Intento no encontrado")
    _verificar_token_intento(intento, token)
    return intento


@router.post("/{intento_id}/respuestas", response_model=schemas.RespuestaOut)
def guardar_respuesta(
    intento_id: int,
    respuesta: schemas.RespuestaCreate,
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    intento = db.query(models.Intento).filter(models.Intento.id == intento_id).first()
    if not intento:
        raise HTTPException(status_code=404, detail="Intento no encontrado")

    _verificar_token_intento(intento, token)

    if intento.estado == "calificado":
        raise HTTPException(status_code=409, detail="Este intento ya fue calificado y no admite cambios")

    if _intento_vencido(intento, db):
        raise HTTPException(status_code=409, detail="El tiempo límite del examen ya venció")

    pregunta = db.query(models.Pregunta).filter(models.Pregunta.id == respuesta.pregunta_id).first()
    if not pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")

    asignada = db.query(models.ExamenPregunta).filter(
        models.ExamenPregunta.examen_id == intento.examen_id,
        models.ExamenPregunta.pregunta_id == respuesta.pregunta_id,
    ).first()
    if not asignada:
        raise HTTPException(status_code=400, detail="La pregunta no pertenece al examen de este intento")

    if pregunta.tipo == "opcion_multiple" and pregunta.opciones:
        validas = {o.strip().casefold() for o in pregunta.opciones}
        if respuesta.respuesta_texto.strip().casefold() not in validas:
            raise HTTPException(status_code=400, detail="La opción elegida no es válida para esta pregunta")

    existente = db.query(models.Respuesta).filter(
        models.Respuesta.intento_id == intento_id,
        models.Respuesta.pregunta_id == respuesta.pregunta_id,
    ).first()

    if existente:
        existente.respuesta_texto = respuesta.respuesta_texto
        db.commit()
        db.refresh(existente)
        return existente

    nueva_respuesta = models.Respuesta(
        intento_id=intento_id,
        pregunta_id=respuesta.pregunta_id,
        respuesta_texto=respuesta.respuesta_texto
    )
    db.add(nueva_respuesta)
    db.commit()
    db.refresh(nueva_respuesta)
    return nueva_respuesta


@router.get("/{intento_id}/respuestas", response_model=List[schemas.RespuestaOut])
def listar_respuestas_de_intento(
    intento_id: int,
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    usuario_actual: Optional[models.Usuario] = Depends(auth.obtener_usuario_actual_opcional)
):
    intento = db.query(models.Intento).filter(models.Intento.id == intento_id).first()
    if not intento:
        raise HTTPException(status_code=404, detail="Intento no encontrado")

    if token:
        _verificar_token_intento(intento, token)
    elif not usuario_actual:
        raise HTTPException(status_code=401, detail="Se requiere sesión o el token del intento")

    return db.query(models.Respuesta).filter(models.Respuesta.intento_id == intento_id).all()


@router.post("/{intento_id}/calificar", response_model=schemas.ResultadoOut)
def calificar_intento(intento_id: int, token: Optional[str] = Query(None), db: Session = Depends(get_db)):
    intento = db.query(models.Intento).filter(models.Intento.id == intento_id).first()
    if not intento:
        raise HTTPException(status_code=404, detail="Intento no encontrado")

    _verificar_token_intento(intento, token)

    if intento.resultado is not None:
        raise HTTPException(status_code=409, detail="Este intento ya fue calificado")

    respuestas = db.query(models.Respuesta).filter(models.Respuesta.intento_id == intento_id).all()

    preguntas_examen = (
        db.query(models.Pregunta)
        .join(models.ExamenPregunta)
        .filter(models.ExamenPregunta.examen_id == intento.examen_id)
        .all()
    )

    if not preguntas_examen:
        raise HTTPException(status_code=400, detail="Este examen no tiene preguntas asignadas")

    respuestas_por_pregunta = {r.pregunta_id: r for r in respuestas}

    calificaciones = []
    retroalimentaciones = []

    for pregunta in preguntas_examen:
        respuesta = respuestas_por_pregunta.get(pregunta.id)

        if respuesta is None or not (respuesta.respuesta_texto or "").strip():
            calificaciones.append(0.0)
            retroalimentaciones.append(f"Pregunta {pregunta.id}: Sin respuesta (0 puntos).")
            continue

        if pregunta.tipo == "opcion_multiple" and pregunta.respuesta_correcta:
            resultado = calificacion_automatica.calificar_opcion_multiple(
                correcta=pregunta.respuesta_correcta,
                elegida=respuesta.respuesta_texto
            )
        else:
            try:
                resultado = ia.calificar_respuesta(
                    enunciado=pregunta.enunciado,
                    rubrica=pregunta.rubrica or "Evalúa la calidad y correctitud técnica de la respuesta.",
                    respuesta_candidato=respuesta.respuesta_texto
                )
            except ia.IAError as e:
                codigo = 503 if e.temporal else 502
                raise HTTPException(status_code=codigo, detail=str(e))

        calificaciones.append(resultado["calificacion"])
        retroalimentaciones.append(f"Pregunta {pregunta.id}: {resultado['retroalimentacion']}")

    nuevo_resultado = models.Resultado(
        intento_id=intento_id,
        calificacion_total=sum(calificaciones) / len(preguntas_examen),
        retroalimentacion_ia="\n".join(retroalimentaciones)
    )
    intento.estado = "calificado"
    intento.finalizado_en = utcnow()
    db.add(nuevo_resultado)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Este intento ya fue calificado")

    db.refresh(nuevo_resultado)
    return nuevo_resultado
