# MVP — Sistema de Evaluación Técnica Automatizada para Candidatos

> **Empresa:** PluriOne S.A. de C.V. (Develop Talent & Technology)
> **Producto:** Sistema de Evaluación Técnica Automatizada (MVP)
> **Código:** PLU-MVP-2026-V1
> **Alumno:** Roberto Guadalupe Cruz Zacatenco · G19X-UPTAP-RGCZ-984
> **Estado:** Funcional e integrado (QA en curso)

---

## 1. ¿Qué es?

Plataforma web para **crear, administrar y calificar evaluaciones técnicas** de candidatos de forma automática. Un evaluador arma **perfiles profesionales**, un **banco de preguntas con rúbrica** y **exámenes**; el candidato presenta el examen desde un enlace público **sin crear cuenta**; y una **IA (Google Gemini)** califica cada respuesta contra la rúbrica de su pregunta, entregando una nota de 0 a 10 con retroalimentación que el evaluador revisa en un panel de resultados.

No es solo un calificador con IA: la calificación es un componente de una plataforma integrada con autenticación por roles, administración de contenido, flujo público del candidato y panel de resultados.

La IA es una herramienta de apoyo: **el evaluador humano decide cómo y cuándo comunicar el resultado**, por eso el candidato solo ve una confirmación de envío y no su calificación.

---

## 2. Roles

| Rol | Responsabilidades | Acceso |
|---|---|---|
| **Administrador** | Gestiona perfiles, preguntas y exámenes; da de alta y lista usuarios del sistema; revisa resultados. | Perfiles, Preguntas, Exámenes, Resultados, Usuarios |
| **Evaluador** | Gestiona perfiles, preguntas y exámenes; revisa la nota y la retroalimentación de la IA. | Perfiles, Preguntas, Exámenes, Resultados |
| **Candidato** (sin cuenta) | Presenta su examen indicando nombre y correo. | Flujo público: Presentar examen, Responder examen, Confirmación |

---

## 3. Funcionalidades por módulo

### Autenticación
- Login con correo y contraseña; sesión mediante **JWT** (HS256) con vigencia de 8 horas.
- Contraseñas con **bcrypt** (nunca en texto plano).
- Roles `admin` y `evaluador`; solo el administrador crea y lista usuarios.
- **Sin registro público:** el primer administrador se crea con el script `crear_admin.py`; los demás, desde la pantalla "Usuarios".
- Cierre de sesión y rutas del panel protegidas.

### Perfiles
- Crear, listar, editar y eliminar perfiles profesionales (p. ej. "Backend Junior Python").
- No se puede eliminar un perfil que tenga preguntas asociadas (el sistema explica el motivo).

### Banco de preguntas
- Crear, listar, editar y eliminar preguntas ligadas a un perfil.
- Tipo `abierta` u `opción múltiple` (con lista de opciones), enunciado y **rúbrica de evaluación**.
- No se puede eliminar una pregunta asignada a un examen.

### Exámenes
- Crear, listar, editar y eliminar exámenes (perfil, título y tiempo límite en minutos).
- Asignar y quitar preguntas con orden; solo se ofrecen las del mismo perfil que aún no estén asignadas.
- No se puede eliminar un examen que ya fue presentado por algún candidato.

### Flujo del candidato (público)
- Acceso con nombre y correo, sin cuenta; si el correo ya existe, se reutiliza el candidato.
- Pantalla con las preguntas del examen y un campo de respuesta por pregunta.
- Validación de que todas las preguntas estén respondidas antes de finalizar.
- Mensaje claro cuando el examen aún no tiene preguntas.
- Pantalla de confirmación al terminar (sin mostrar la calificación).

### Calificación con IA (módulo `ia.py`)
- Prompt dinámico con enunciado, rúbrica y respuesta del candidato.
- Respuesta estructurada en JSON: nota de 0 a 10 y retroalimentación breve.
- Calificación total = promedio de las notas por pregunta; el intento pasa a `calificado`.
- Integración aislada en un solo archivo, para cambiar de proveedor sin tocar el resto del sistema.

### Resultados
- Panel con candidato, correo, examen, calificación total y retroalimentación de la IA por pregunta.
- Nota con código de color: verde (≥ 8), ámbar (≥ 6) y rojo (< 6).

### Interfaz (Frontend)
- React + Vite con diseño propio (paleta verde bosque, tipografía Inter).
- Login de dos paneles con enlace directo para quien viene a presentar un examen.
- Menú lateral, **diseño responsive**, estados de carga con indicador, confirmación antes de eliminar y mensajes de error del backend.
- URL del backend configurable por variable de entorno (`VITE_API_URL`).

---

## 4. Flujos principales

```
Administrador / Evaluador → Login → Panel
   ├─ Perfiles    → crear / editar / eliminar
   ├─ Preguntas   → banco con rúbrica por pregunta
   ├─ Exámenes    → armar examen (asignar / quitar preguntas)
   ├─ Resultados  → nota + retroalimentación de la IA
   └─ Usuarios    → alta y listado (solo admin)

Candidato → /presentar (nombre + correo + examen)
   → responde las preguntas → "Finalizar examen"
   → guarda respuestas → IA califica contra la rúbrica
   → pantalla de confirmación (sin nota)

Calificación
   → por cada respuesta: prompt (pregunta + rúbrica + respuesta) → Gemini → JSON
   → promedio → Resultado guardado → intento "calificado"
```

---

## 5. Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | React · Vite · Tailwind CSS · React Router · Axios |
| Backend | Python · FastAPI · Uvicorn |
| ORM / validación | SQLAlchemy · Pydantic |
| Autenticación | JWT (python-jose) · bcrypt |
| IA | Google Gemini API · modelo `gemini-3.6-flash` · SDK `google-genai` |
| Base de datos | PostgreSQL 16 |
| Infraestructura | Docker Compose (base de datos) |
| Control de versiones | Git · GitHub |
| Pruebas | Manuales (QA); Postman y Swagger (`/docs`) para la API |

> Frente al documento fuente: Azure OpenAI se sustituyó por Gemini; LangChain no se utilizó; GitHub Actions y Playwright quedan pendientes; Power BI se sustituyó por el panel de resultados en React.

---

## 6. Seguridad (resumen)

- Contraseñas con bcrypt y JWT firmado con `SECRET_KEY` de variable de entorno.
- Control de rol en la administración de usuarios; sin registro público.
- Secretos (API key de Gemini, URL de base de datos, `SECRET_KEY`) fuera del código: `.env` excluido de Git y `.env.example` publicado.
- La API key de Gemini solo reside en el backend.
- ORM con consultas parametrizadas y validación de entradas con Pydantic; CORS limitado al frontend.
- Restricciones de borrado para evitar datos huérfanos.
- **Pendiente** (ver PRD, sección 4.22): proteger los endpoints de lectura, límite de intentos de login, cookie `HttpOnly`, defensa contra *prompt injection*, auditoría y aviso de privacidad.

---

## 7. Cómo ejecutarlo

**1. Base de datos**
```bash
docker compose up -d
# Linux / macOS
docker compose exec -T db psql -U eval_user -d eval_tecnica < db/base-de-datos.sql
# Windows (PowerShell)
Get-Content db/base-de-datos.sql | docker compose exec -T db psql -U eval_user -d eval_tecnica
```

**2. Configuración**
```bash
# Linux / macOS
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Windows (PowerShell)
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```
Completar en `backend/.env`: `GEMINI_API_KEY`, `DATABASE_URL` y `SECRET_KEY`.

**3. Backend** (en `backend/`)
```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API en **http://127.0.0.1:8000** · documentación en **http://127.0.0.1:8000/docs**

**4. Frontend** (en `frontend/`, otra terminal)
```bash
npm install
npm run dev
```
Panel en **http://localhost:5173/login** · examen público en **http://localhost:5173/presentar**

**Primer administrador** (si la base está vacía; en `backend/`, con el entorno virtual activo):
```bash
python create_tables.py
python crear_admin.py
```

---

## 8. Credenciales DEMO

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@develop.com.mx` | `claveSegura123` |

> Credenciales de demostración. En producción, los usuarios se crean desde la pantalla "Usuarios" y el primer administrador con `crear_admin.py`.

---

## 9. Alcance

**Incluido:** autenticación con roles, gestión de perfiles / preguntas con rúbrica / exámenes, flujo público del candidato, calificación automática con IA, panel de resultados, gestión de usuarios, script de primer administrador, interfaz responsive y repositorio documentado.

**Fuera de alcance (MVP):** generación de preguntas con IA, envío de resultados por correo, enlaces de invitación únicos por candidato, reportes avanzados y exportación, dashboard en Power BI, CI/CD y pruebas end-to-end, aplicaciones móviles, despliegue en producción.

---

## 10. Estado

| Área | Estado |
|---|---|
| Entorno e infraestructura (Docker + PostgreSQL) | ✅ Completado |
| Modelo de datos y endpoints (perfiles, preguntas, exámenes, candidatos) | ✅ Completado |
| Intentos, respuestas y calificación con IA | ✅ Completado |
| Autenticación, roles y gestión de usuarios | ✅ Completado |
| Frontend: panel de administración | ✅ Completado |
| Frontend: flujo público del candidato | ✅ Completado |
| Pulido (CRUD completo, validaciones, variables de entorno, responsive) | ✅ Completado |
| Repositorio GitHub + README + script de base de datos | ✅ Completado |
| Pruebas manuales de casos límite (examen sin preguntas) | ✅ Completado y corregido |
| Pruebas manuales restantes (respuesta vacía, candidato repetido, recarga a mitad de examen) | 🔄 En curso |
| Pruebas automatizadas (pytest, Playwright) y CI/CD | ⏳ Pendiente |
| Documentación técnica y de usuario, plan de mantenimiento, capacitación y cierre | 🔄 En curso |

**MVP funcional.** El sistema completa el flujo de principio a fin: un evaluador arma un examen, un candidato lo presenta y la IA lo califica, dejando el resultado disponible en el panel. Las limitaciones conocidas están documentadas en el PRD (sección 4.22).

---

*Documento complementario al PRD (`docs/PRD.md`) y a la documentación técnica (`docs/`).*
