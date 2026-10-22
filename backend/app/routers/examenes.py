from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/examenes", tags=["examenes"])


@router.post("", response_model=schemas.ExamenOut)
def crear_examen(
    examen: schemas.ExamenCreate,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    nuevo_examen = models.Examen(**examen.model_dump())
    db.add(nuevo_examen)
    db.commit()
    db.refresh(nuevo_examen)
    return nuevo_examen


@router.get("", response_model=List[schemas.ExamenOut])
def listar_examenes(db: Session = Depends(get_db)):
    return db.query(models.Examen).all()


@router.post("/{examen_id}/preguntas", response_model=schemas.ExamenPreguntaOut)
def asignar_pregunta_a_examen(
    examen_id: int,
    asignacion: schemas.AsignarPregunta,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    examen = db.query(models.Examen).filter(models.Examen.id == examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen no encontrado")

    pregunta = db.query(models.Pregunta).filter(models.Pregunta.id == asignacion.pregunta_id).first()
    if not pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")

    nueva_asignacion = models.ExamenPregunta(
        examen_id=examen_id,
        pregunta_id=asignacion.pregunta_id,
        orden=asignacion.orden
    )
    db.add(nueva_asignacion)
    db.commit()
    db.refresh(nueva_asignacion)
    return nueva_asignacion


@router.get("/{examen_id}/preguntas", response_model=List[schemas.PreguntaPublica])
def listar_preguntas_de_examen(examen_id: int, db: Session = Depends(get_db)):
    examen = db.query(models.Examen).filter(models.Examen.id == examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen no encontrado")

    preguntas = (
        db.query(models.Pregunta)
        .join(models.ExamenPregunta)
        .filter(models.ExamenPregunta.examen_id == examen_id)
        .all()
    )
    return preguntas


@router.put("/{examen_id}", response_model=schemas.ExamenOut)
def actualizar_examen(
    examen_id: int,
    datos: schemas.ExamenCreate,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    examen = db.query(models.Examen).filter(models.Examen.id == examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen no encontrado")

    examen.perfil_id = datos.perfil_id
    examen.titulo = datos.titulo
    examen.tiempo_limite_min = datos.tiempo_limite_min
    db.commit()
    db.refresh(examen)
    return examen


@router.delete("/{examen_id}")
def eliminar_examen(
    examen_id: int,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    examen = db.query(models.Examen).filter(models.Examen.id == examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen no encontrado")

    intentos_asociados = db.query(models.Intento).filter(models.Intento.examen_id == examen_id).count()
    if intentos_asociados > 0:
        raise HTTPException(
            status_code=400,
            detail=f"No se puede eliminar: {intentos_asociados} candidato(s) ya presentaron este examen."
        )

    db.query(models.ExamenPregunta).filter(models.ExamenPregunta.examen_id == examen_id).delete()
    db.delete(examen)
    db.commit()
    return {"mensaje": "Examen eliminado correctamente"}


@router.delete("/{examen_id}/preguntas/{pregunta_id}")
def quitar_pregunta_de_examen(
    examen_id: int,
    pregunta_id: int,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    asignacion = db.query(models.ExamenPregunta).filter(
        models.ExamenPregunta.examen_id == examen_id,
        models.ExamenPregunta.pregunta_id == pregunta_id
    ).first()

    if not asignacion:
        raise HTTPException(status_code=404, detail="Esa pregunta no está asignada a este examen")

    db.delete(asignacion)
    db.commit()
    return {"mensaje": "Pregunta removida del examen"}
