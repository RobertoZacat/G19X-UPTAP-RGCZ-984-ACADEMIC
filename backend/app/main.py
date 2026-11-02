import os

from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.routers import perfiles, preguntas, candidatos, examenes, intentos, auth, resultados


load_dotenv()

ORIGENES_POR_DEFECTO = "http://localhost:5173,http://127.0.0.1:5173"
# Orígenes del frontend separados por coma (por ejemplo, si Vite toma el puerto 5174).
CORS_ORIGINS = [
    origen.strip()
    for origen in os.getenv("CORS_ORIGINS", ORIGENES_POR_DEFECTO).split(",")
    if origen.strip()
]

app = FastAPI(title="Sistema de Evaluación Técnica")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(perfiles.router)
app.include_router(preguntas.router)
app.include_router(candidatos.router)
app.include_router(examenes.router)
app.include_router(intentos.router)
app.include_router(auth.router)
app.include_router(resultados.router)


@app.get("/")
def read_root():
    return {"mensaje": "API del sistema de evaluación funcionando correctamente"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
