from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/perfiles", tags=["perfiles"])


@router.post("", response_model=schemas.PerfilOut)
def crear_perfil(
    perfil: schemas.PerfilCreate,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    nuevo_perfil = models.Perfil(**perfil.model_dump())
    db.add(nuevo_perfil)
    db.commit()
    db.refresh(nuevo_perfil)
    return nuevo_perfil


@router.get("", response_model=List[schemas.PerfilOut])
def listar_perfiles(db: Session = Depends(get_db)):
    return db.query(models.Perfil).all()


@router.get("/{perfil_id}", response_model=schemas.PerfilOut)
def obtener_perfil(perfil_id: int, db: Session = Depends(get_db)):
    perfil = db.query(models.Perfil).filter(models.Perfil.id == perfil_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    return perfil


@router.put("/{perfil_id}", response_model=schemas.PerfilOut)
def actualizar_perfil(
    perfil_id: int,
    datos: schemas.PerfilCreate,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    perfil = db.query(models.Perfil).filter(models.Perfil.id == perfil_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")

    perfil.nombre = datos.nombre
    perfil.descripcion = datos.descripcion
    db.commit()
    db.refresh(perfil)
    return perfil


@router.delete("/{perfil_id}")
def eliminar_perfil(
    perfil_id: int,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    perfil = db.query(models.Perfil).filter(models.Perfil.id == perfil_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")

    preguntas_asociadas = db.query(models.Pregunta).filter(models.Pregunta.perfil_id == perfil_id).count()
    if preguntas_asociadas > 0:
        raise HTTPException(
            status_code=400,
            detail=f"No se puede eliminar: este perfil tiene {preguntas_asociadas} pregunta(s) asociada(s)."
        )

    db.delete(perfil)
    db.commit()
    return {"mensaje": "Perfil eliminado correctamente"}
