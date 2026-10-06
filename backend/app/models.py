from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Perfil(Base):
    __tablename__ = "perfiles"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(Text)

    preguntas = relationship("Pregunta", back_populates="perfil")
    examenes = relationship("Examen", back_populates="perfil")


class Candidato(Base):
    __tablename__ = "candidatos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

    intentos = relationship("Intento", back_populates="candidato")


class Pregunta(Base):
    __tablename__ = "preguntas"

    id = Column(Integer, primary_key=True, index=True)
    perfil_id = Column(Integer, ForeignKey("perfiles.id"))
    tipo = Column(String, nullable=False)  # "opcion_multiple" o "abierta"
    enunciado = Column(Text, nullable=False)
    rubrica = Column(Text)  # criterio de evaluación para la IA
    opciones = Column(JSON, nullable=True)  # solo para opción múltiple

    perfil = relationship("Perfil", back_populates="preguntas")


class Examen(Base):
    __tablename__ = "examenes"

    id = Column(Integer, primary_key=True, index=True)
    perfil_id = Column(Integer, ForeignKey("perfiles.id"))
    titulo = Column(String, nullable=False)
    tiempo_limite_min = Column(Integer, default=60)

    perfil = relationship("Perfil", back_populates="examenes")
    preguntas = relationship("ExamenPregunta", back_populates="examen")
    intentos = relationship("Intento", back_populates="examen")


class ExamenPregunta(Base):
    __tablename__ = "examen_preguntas"

    examen_id = Column(Integer, ForeignKey("examenes.id"), primary_key=True)
    pregunta_id = Column(Integer, ForeignKey("preguntas.id"), primary_key=True)
    orden = Column(Integer, default=0)

    examen = relationship("Examen", back_populates="preguntas")
    pregunta = relationship("Pregunta")


class Intento(Base):
    __tablename__ = "intentos"

    id = Column(Integer, primary_key=True, index=True)
    candidato_id = Column(Integer, ForeignKey("candidatos.id"))
    examen_id = Column(Integer, ForeignKey("examenes.id"))
    iniciado_en = Column(DateTime, default=datetime.utcnow)
    finalizado_en = Column(DateTime, nullable=True)
    estado = Column(String, default="en_progreso")

    candidato = relationship("Candidato", back_populates="intentos")
    examen = relationship("Examen", back_populates="intentos")
    respuestas = relationship("Respuesta", back_populates="intento")
    resultado = relationship("Resultado", back_populates="intento", uselist=False)


class Respuesta(Base):
    __tablename__ = "respuestas"

    id = Column(Integer, primary_key=True, index=True)
    intento_id = Column(Integer, ForeignKey("intentos.id"))
    pregunta_id = Column(Integer, ForeignKey("preguntas.id"))
    respuesta_texto = Column(Text)

    intento = relationship("Intento", back_populates="respuestas")
    pregunta = relationship("Pregunta")


class Resultado(Base):
    __tablename__ = "resultados"

    id = Column(Integer, primary_key=True, index=True)
    intento_id = Column(Integer, ForeignKey("intentos.id"), unique=True)
    calificacion_total = Column(Float)
    retroalimentacion_ia = Column(Text)

    intento = relationship("Intento", back_populates="resultado")


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    rol = Column(String, default="evaluador")  # "admin" o "evaluador"