from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app import models, schemas, ia, auth

from fastapi.security import OAuth2PasswordRequestForm


app = FastAPI(title="Sistema de Evaluación Técnica")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"mensaje": "API del sistema de evaluación funcionando correctamente"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


# ---------- Endpoints de Perfiles ----------

@app.post("/perfiles", response_model=schemas.PerfilOut)
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


@app.get("/perfiles", response_model=List[schemas.PerfilOut])
def listar_perfiles(db: Session = Depends(get_db)):
    return db.query(models.Perfil).all()


@app.get("/perfiles/{perfil_id}", response_model=schemas.PerfilOut)
def obtener_perfil(perfil_id: int, db: Session = Depends(get_db)):
    perfil = db.query(models.Perfil).filter(models.Perfil.id == perfil_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    return perfil


@app.put("/perfiles/{perfil_id}", response_model=schemas.PerfilOut)
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


@app.delete("/perfiles/{perfil_id}")
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


# ---------- Endpoints de Preguntas ----------

@app.post("/preguntas", response_model=schemas.PreguntaOut)
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


@app.get("/preguntas", response_model=List[schemas.PreguntaOut])
def listar_preguntas(db: Session = Depends(get_db)):
    return db.query(models.Pregunta).all()


@app.get("/preguntas/{pregunta_id}", response_model=schemas.PreguntaOut)
def obtener_pregunta(pregunta_id: int, db: Session = Depends(get_db)):
    pregunta = db.query(models.Pregunta).filter(models.Pregunta.id == pregunta_id).first()
    if not pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")
    return pregunta


@app.put("/preguntas/{pregunta_id}", response_model=schemas.PreguntaOut)
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
    db.commit()
    db.refresh(pregunta)
    return pregunta


@app.delete("/preguntas/{pregunta_id}")
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


# ---------- Endpoints de Candidatos ----------

@app.post("/candidatos", response_model=schemas.CandidatoOut)
def crear_candidato(candidato: schemas.CandidatoCreate, db: Session = Depends(get_db)):
    nuevo_candidato = models.Candidato(**candidato.model_dump())
    db.add(nuevo_candidato)
    db.commit()
    db.refresh(nuevo_candidato)
    return nuevo_candidato


@app.get("/candidatos", response_model=List[schemas.CandidatoOut])
def listar_candidatos(db: Session = Depends(get_db)):
    return db.query(models.Candidato).all()


@app.post("/candidatos/acceso", response_model=schemas.CandidatoOut)
def acceso_candidato(candidato: schemas.CandidatoCreate, db: Session = Depends(get_db)):
    existente = db.query(models.Candidato).filter(models.Candidato.email == candidato.email).first()
    if existente:
        return existente

    nuevo_candidato = models.Candidato(**candidato.model_dump())
    db.add(nuevo_candidato)
    db.commit()
    db.refresh(nuevo_candidato)
    return nuevo_candidato


# ---------- Endpoints de Examenes ----------

@app.post("/examenes", response_model=schemas.ExamenOut)
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


@app.get("/examenes", response_model=List[schemas.ExamenOut])
def listar_examenes(db: Session = Depends(get_db)):
    return db.query(models.Examen).all()


# ---------- Endpoints de Examen-Pregunta ----------

@app.post("/examenes/{examen_id}/preguntas", response_model=schemas.ExamenPreguntaOut)
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


@app.get("/examenes/{examen_id}/preguntas", response_model=List[schemas.PreguntaOut])
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


@app.put("/examenes/{examen_id}", response_model=schemas.ExamenOut)
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


@app.delete("/examenes/{examen_id}")
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


@app.delete("/examenes/{examen_id}/preguntas/{pregunta_id}")
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


# ---------- Endpoints de Intentos ----------

@app.post("/intentos", response_model=schemas.IntentoOut)
def crear_intento(intento: schemas.IntentoCreate, db: Session = Depends(get_db)):
    candidato = db.query(models.Candidato).filter(models.Candidato.id == intento.candidato_id).first()
    if not candidato:
        raise HTTPException(status_code=404, detail="Candidato no encontrado")

    examen = db.query(models.Examen).filter(models.Examen.id == intento.examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen no encontrado")

    nuevo_intento = models.Intento(
        candidato_id=intento.candidato_id,
        examen_id=intento.examen_id
    )
    db.add(nuevo_intento)
    db.commit()
    db.refresh(nuevo_intento)
    return nuevo_intento


@app.get("/intentos/{intento_id}", response_model=schemas.IntentoOut)
def obtener_intento(intento_id: int, db: Session = Depends(get_db)):
    intento = db.query(models.Intento).filter(models.Intento.id == intento_id).first()
    if not intento:
        raise HTTPException(status_code=404, detail="Intento no encontrado")
    return intento


# ---------- Endpoints de Respuestas ----------

@app.post("/intentos/{intento_id}/respuestas", response_model=schemas.RespuestaOut)
def guardar_respuesta(
    intento_id: int,
    respuesta: schemas.RespuestaCreate,
    db: Session = Depends(get_db)
):
    intento = db.query(models.Intento).filter(models.Intento.id == intento_id).first()
    if not intento:
        raise HTTPException(status_code=404, detail="Intento no encontrado")

    pregunta = db.query(models.Pregunta).filter(models.Pregunta.id == respuesta.pregunta_id).first()
    if not pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")

    nueva_respuesta = models.Respuesta(
        intento_id=intento_id,
        pregunta_id=respuesta.pregunta_id,
        respuesta_texto=respuesta.respuesta_texto
    )
    db.add(nueva_respuesta)
    db.commit()
    db.refresh(nueva_respuesta)
    return nueva_respuesta


@app.get("/intentos/{intento_id}/respuestas", response_model=List[schemas.RespuestaOut])
def listar_respuestas_de_intento(intento_id: int, db: Session = Depends(get_db)):
    intento = db.query(models.Intento).filter(models.Intento.id == intento_id).first()
    if not intento:
        raise HTTPException(status_code=404, detail="Intento no encontrado")

    return db.query(models.Respuesta).filter(models.Respuesta.intento_id == intento_id).all()


# ---------- Endpoint de Calificación con IA ----------

@app.post("/intentos/{intento_id}/calificar", response_model=schemas.ResultadoOut)
def calificar_intento(intento_id: int, db: Session = Depends(get_db)):
    intento = db.query(models.Intento).filter(models.Intento.id == intento_id).first()
    if not intento:
        raise HTTPException(status_code=404, detail="Intento no encontrado")

    respuestas = db.query(models.Respuesta).filter(models.Respuesta.intento_id == intento_id).all()
    if not respuestas:
        raise HTTPException(status_code=400, detail="Este intento no tiene respuestas guardadas")

    calificaciones = []
    retroalimentaciones = []

    for respuesta in respuestas:
        pregunta = db.query(models.Pregunta).filter(models.Pregunta.id == respuesta.pregunta_id).first()

        resultado_ia = ia.calificar_respuesta(
            enunciado=pregunta.enunciado,
            rubrica=pregunta.rubrica or "Evalúa la calidad y correctitud técnica de la respuesta.",
            respuesta_candidato=respuesta.respuesta_texto
        )

        calificaciones.append(resultado_ia["calificacion"])
        retroalimentaciones.append(f"Pregunta {pregunta.id}: {resultado_ia['retroalimentacion']}")

    calificacion_promedio = sum(calificaciones) / len(calificaciones)
    retroalimentacion_completa = "\n".join(retroalimentaciones)

    nuevo_resultado = models.Resultado(
        intento_id=intento_id,
        calificacion_total=calificacion_promedio,
        retroalimentacion_ia=retroalimentacion_completa
    )
    db.add(nuevo_resultado)
    db.commit()
    db.refresh(nuevo_resultado)

    intento.estado = "calificado"
    intento.finalizado_en = datetime.utcnow()
    db.commit()

    return nuevo_resultado


# ---------- Endpoints de Autenticación ----------

@app.post("/registro", response_model=schemas.UsuarioOut)
def registrar_usuario(
    usuario: schemas.UsuarioCreate,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    if usuario_actual.rol != "admin":
        raise HTTPException(status_code=403, detail="Solo un administrador puede crear nuevos usuarios")

    existente = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ese email ya está registrado")

    nuevo_usuario = models.Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password_hash=auth.hash_password(usuario.password),
        rol=usuario.rol
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario


@app.get("/usuarios", response_model=List[schemas.UsuarioOut])
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)
):
    if usuario_actual.rol != "admin":
        raise HTTPException(status_code=403, detail="Solo un administrador puede ver esta lista")

    return db.query(models.Usuario).all()


@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()

    if not usuario or not auth.verificar_password(form_data.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
        )

    token = auth.crear_token(data={"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/usuarios/yo", response_model=schemas.UsuarioOut)
def obtener_mi_usuario(usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual)):
    return usuario_actual


# ---------- Endpoint de Resultados (vista general) ----------

@app.get("/resultados", response_model=List[schemas.ResultadoDetalle])
def listar_resultados(db: Session = Depends(get_db)):
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