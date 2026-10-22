from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/resultados", tags=["resultados"])


@router.get("", response_model=List[schemas.ResultadoDetalle])
def listar_resultados(
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    resultados = db.query(models.Resultado).all()

    detalles = []
    for r in resultados:
        intento = r.intento
        detalles.append({
            "intento_id": intento.id,
            "candidato_nombre": intento.candidato.nombre,
            "candidato_email": intento.candidato.email,
            "examen_titulo": intento.examen.titulo,
            "calificacion_total": r.calificacion_total,
            "retroalimentacion_ia": r.retroalimentacion_ia,
            "finalizado_en": intento.finalizado_en,
        })

    return detalles
