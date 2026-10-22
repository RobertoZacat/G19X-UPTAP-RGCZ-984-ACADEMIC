from pydantic import BaseModel, model_validator
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
    respuesta_correcta: Optional[str] = None  # solo para opción múltiple

class PreguntaCreate(PreguntaBase):
    @model_validator(mode="after")
    def validar_segun_tipo(self):
        if self.tipo == "opcion_multiple":
            opciones = [o.strip() for o in (self.opciones or []) if o and o.strip()]
            if len(opciones) < 2:
                raise ValueError("Una pregunta de opción múltiple necesita al menos 2 opciones.")

            claves = [o.casefold() for o in opciones]
            if len(set(claves)) != len(claves):
                raise ValueError("Las opciones no deben repetirse.")

            correcta = (self.respuesta_correcta or "").strip()
            if not correcta:
                raise ValueError("Indica cuál es la respuesta correcta.")
            if correcta.casefold() not in claves:
                raise ValueError("La respuesta correcta debe ser una de las opciones.")

            self.opciones = opciones
            self.respuesta_correcta = opciones[claves.index(correcta.casefold())]
        else:
            self.opciones = None
            self.respuesta_correcta = None
        return self

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
    tiempo_limite_min: Optional[int] = None

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


# ---------- Pregunta visible para el candidato (sin rúbrica ni respuesta correcta) ----------
class PreguntaPublica(BaseModel):
    id: int
    tipo: str
    enunciado: str
    opciones: Optional[List[str]] = None

    class Config:
        from_attributes = True