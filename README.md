# G19X-UPTAP-RGCZ-984-ACADEMIC

# Sistema de Evaluación Técnica Automatizada

**Alumno:** Roberto Guadalupe Cruz Zacatenco · **Matrícula:** G19X-UPTAP-RGCZ-984
**Institución:** Universidad Politécnica de Tapachula
**Empresa:** PluriOne S.A. de C.V. (Develop Talent & Technology)

## Qué hace

Sistema que permite crear, administrar y calificar evaluaciones técnicas de manera automática para distintos perfiles profesionales. Un administrador arma perfiles, bancos de preguntas y exámenes; un candidato presenta su examen desde un enlace público; y la IA (Google Gemini) califica automáticamente sus respuestas contra una rúbrica, generando retroalimentación.

## Qué necesitas instalado

- Python 3.12 o superior
- Node.js 20 o superior
- Docker y Docker Compose
- Una API key gratuita de Google Gemini ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))

## Base de datos

Levanta PostgreSQL con Docker (igual en Windows y Linux, usando una terminal en la raíz del proyecto):

```
docker compose up -d
```

Importa la estructura y datos de prueba:

**Linux / macOS:**
```
docker compose exec -T db psql -U eval_user -d eval_tecnica < db/base-de-datos.sql
```

**Windows (PowerShell):**
```
Get-Content db/base-de-datos.sql | docker compose exec -T db psql -U eval_user -d eval_tecnica
```

## Configuración

Copia los archivos de ejemplo de variables de entorno:

**Linux / macOS:**
```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**Windows (PowerShell):**
```
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Luego abre `backend/.env` y llena los valores reales (están en "Accesos de prueba", en Mis documentos). El `frontend/.env` ya funciona con su valor por defecto para desarrollo local.

## Cómo instalarlo y ejecutarlo

### Backend

**Linux / macOS:**
```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Windows (PowerShell):**
```
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Corre en http://127.0.0.1:8000 — documentación interactiva en http://127.0.0.1:8000/docs

### Frontend

(En otra terminal, es el mismo comando en ambos sistemas)

```
cd frontend
npm install
npm run dev
```

Se abre en http://localhost:5173

## Usuario de prueba

- **Panel de administración:** http://localhost:5173/login
  - usuario: `admin@develop.com.mx`
  - contraseña: `claveSegura123`
- **Presentar examen (sin login):** http://localhost:5173/presentar

## Estructura del proyecto

```
eval-tecnica/
├── backend/      API en FastAPI + SQLAlchemy + PostgreSQL
├── frontend/     Panel en React + Vite
├── db/           Script de base de datos
└── docs/         Documentación técnica y de usuario
```

## Lo que todavía no funciona / mejoras pendientes

- Generación automática de preguntas con IA (actualmente las preguntas se crean manualmente)
- Envío automático de resultados por correo al candidato
