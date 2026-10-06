from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ---------- Perfil ----------
class PerfilBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

class PerfilCreate(PerfilBase):
    pass

class PerfilOut(PerfilBase):
    id: int

    class Config:
        from_attributes = True


# ---------- Pregunta ----------
class PreguntaBase(BaseModel):
    perfil_id: int
    tipo: str  # "opcion_multiple" o "abierta"
    enunciado: str
    rubrica: Optional[str] = None
    opciones: Optional[List[str]] = None

class PreguntaCreate(PreguntaBase):
    pass

class PreguntaOut(PreguntaBase):
    id: int

    class Config:
        from_attributes = True


# ---------- Candidato ----------
class CandidatoBase(BaseModel):
    nombre: str
    email: str

class CandidatoCreate(CandidatoBase):
    pass

class CandidatoOut(CandidatoBase):
    id: int

    class Config:
        from_attributes = True


# ---------- Examen ----------
class ExamenBase(BaseModel):
    perfil_id: int
    titulo: str
    tiempo_limite_min: Optional[int] = 60

class ExamenCreate(ExamenBase):
    pass

class ExamenOut(ExamenBase):
    id: int

    class Config:
        from_attributes = True


# ---------- ExamenPregunta ----------
class AsignarPregunta(BaseModel):
    pregunta_id: int
    orden: Optional[int] = 0

class ExamenPreguntaOut(BaseModel):
    examen_id: int
    pregunta_id: int
    orden: int

    class Config:
        from_attributes = True


# ---------- Intento ----------
class IntentoCreate(BaseModel):
    candidato_id: int
    examen_id: int

class IntentoOut(BaseModel):
    id: int
    candidato_id: int
    examen_id: int
    iniciado_en: datetime
    finalizado_en: Optional[datetime] = None
    estado: str

    class Config:
        from_attributes = True


# ---------- Respuesta ----------
class RespuestaCreate(BaseModel):
    pregunta_id: int
    respuesta_texto: str

class RespuestaOut(BaseModel):
    id: int
    intento_id: int
    pregunta_id: int
    respuesta_texto: str

    class Config:
        from_attributes = True


# ---------- Resultado ----------
class ResultadoOut(BaseModel):
    id: int
    intento_id: int
    calificacion_total: float
    retroalimentacion_ia: str

    class Config:
        from_attributes = True


# ---------- Usuario / Auth ----------
class UsuarioCreate(BaseModel):
    nombre: str
    email: str
    password: str
    rol: Optional[str] = "evaluador"

class UsuarioOut(BaseModel):
    id: int
    nombre: str
    email: str
    rol: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


# ---------- Resultado detallado (para el panel) ----------
class ResultadoDetalle(BaseModel):
    intento_id: int
    candidato_nombre: str
    candidato_email: str
    examen_titulo: str
    calificacion_total: float
    retroalimentacion_ia: str
    finalizado_en: Optional[datetime] = None

    class Config:
        from_attributes = True