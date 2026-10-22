from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/preguntas", tags=["preguntas"])


@router.post("", response_model=schemas.PreguntaOut)
def crear_pregunta(
    pregunta: schemas.PreguntaCreate,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    nueva_pregunta = models.Pregunta(**pregunta.model_dump())
    db.add(nueva_pregunta)
    db.commit()
    db.refresh(nueva_pregunta)
    return nueva_pregunta


@router.get("", response_model=List[schemas.PreguntaOut])
def listar_preguntas(
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    return db.query(models.Pregunta).all()


@router.get("/{pregunta_id}", response_model=schemas.PreguntaOut)
def obtener_pregunta(
    pregunta_id: int,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    pregunta = db.query(models.Pregunta).filter(models.Pregunta.id == pregunta_id).first()
    if not pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")
    return pregunta


@router.put("/{pregunta_id}", response_model=schemas.PreguntaOut)
def actualizar_pregunta(
    pregunta_id: int,
    datos: schemas.PreguntaCreate,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    pregunta = db.query(models.Pregunta).filter(models.Pregunta.id == pregunta_id).first()
    if not pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")

    pregunta.perfil_id = datos.perfil_id
    pregunta.tipo = datos.tipo
    pregunta.enunciado = datos.enunciado
    pregunta.rubrica = datos.rubrica
    pregunta.opciones = datos.opciones
    pregunta.respuesta_correcta = datos.respuesta_correcta
    db.commit()
    db.refresh(pregunta)
    return pregunta


@router.delete("/{pregunta_id}")
def eliminar_pregunta(
    pregunta_id: int,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    pregunta = db.query(models.Pregunta).filter(models.Pregunta.id == pregunta_id).first()
    if not pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")

    asignaciones = db.query(models.ExamenPregunta).filter(models.ExamenPregunta.pregunta_id == pregunta_id).count()
    if asignaciones > 0:
        raise HTTPException(
            status_code=400,
            detail=f"No se puede eliminar: esta pregunta está asignada a {asignaciones} examen(es)."
        )

    db.delete(pregunta)
    db.commit()
    return {"mensaje": "Pregunta eliminada correctamente"}
