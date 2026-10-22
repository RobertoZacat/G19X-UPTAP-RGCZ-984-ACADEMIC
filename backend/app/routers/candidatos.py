from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/candidatos", tags=["candidatos"])


@router.post("", response_model=schemas.CandidatoOut)
def crear_candidato(
    candidato: schemas.CandidatoCreate,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    nuevo_candidato = models.Candidato(**candidato.model_dump())
    db.add(nuevo_candidato)
    db.commit()
    db.refresh(nuevo_candidato)
    return nuevo_candidato


@router.get("", response_model=List[schemas.CandidatoOut])
def listar_candidatos(
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    return db.query(models.Candidato).all()


@router.post("/acceso", response_model=schemas.CandidatoOut)
def acceso_candidato(candidato: schemas.CandidatoCreate, db: Session = Depends(get_db)):
    existente = db.query(models.Candidato).filter(models.Candidato.email == candidato.email).first()
    if existente:
        return existente

    nuevo_candidato = models.Candidato(**candidato.model_dump())
    db.add(nuevo_candidato)
    db.commit()
    db.refresh(nuevo_candidato)
    return nuevo_candidato
