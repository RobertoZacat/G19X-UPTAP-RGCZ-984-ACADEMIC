from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.routers import perfiles, preguntas, candidatos, examenes, intentos, auth, resultados


app = FastAPI(title="Sistema de Evaluación Técnica")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
