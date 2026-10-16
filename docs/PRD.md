# PRD — Sistema de Evaluación Técnica Automatizada para Candidatos

> **Documento:** Product Requirements Document
> **Código:** PLU-PRD-2026-V1
> **Estado:** Borrador técnico (proyecto de estadías)
> **Propietario:** Líder de Proyecto / Evaluaciones
> **Alumno:** Roberto Guadalupe Cruz Zacatenco · Matrícula G19X-UPTAP-RGCZ-984
> **Empresa:** PluriOne S.A. de C.V. (Develop Talent & Technology)

Este documento distingue explícitamente entre:

- **[DOC]** — Información proveniente de los documentos fuente (ficha del proyecto de estadía asignado por la empresa).
- **[TEC]** — Decisión técnica propuesta por el equipo de ingeniería (el alumno).

No se atribuye ninguna decisión técnica a la organización.

---

## 4.1 Resumen del producto

Plataforma web para **crear, administrar y calificar evaluaciones técnicas** de candidatos de forma automática, para distintos perfiles profesionales. Incorpora bancos de preguntas, rúbricas de evaluación y un módulo de calificación con inteligencia artificial que compara cada respuesta contra la rúbrica de su pregunta y entrega una nota de 0 a 10 con retroalimentación, para apoyar el proceso de selección. [DOC]

No es únicamente un "calificador con IA": la IA es un componente de una plataforma que incluye autenticación con roles, administración de perfiles, preguntas y exámenes, un flujo público para que el candidato presente su examen sin crear cuenta, y un panel de resultados. [TEC]

El sistema contempla dos roles con cuenta (**administrador** y **evaluador**) y un tercer tipo de usuario sin cuenta (**candidato**), que accede únicamente al flujo público de presentación de examen. La IA apoya al evaluador humano; no sustituye su decisión ni se comunica directamente con el candidato. [TEC]

## 4.2 Problema

**[DOC]** El documento fuente establece que el sistema debe reducir los tiempos y estandarizar las evaluaciones técnicas, fortaleciendo la oferta HRTech de PluriOne mediante automatización inteligente.

**Planteamiento (redactado por el alumno a partir de lo anterior; pendiente de validar con el asesor empresarial)** [TEC]:

- La evaluación técnica de candidatos suele ser manual: cada evaluador define sus preguntas y su criterio de calificación.
- No existe un banco de preguntas reutilizable por perfil profesional.
- Calificar y analizar resultados consume tiempo del equipo de reclutamiento y retrasa la selección.
- Es difícil comparar candidatos de forma objetiva cuando el criterio cambia de un evaluador a otro.

**Impacto esperado:**

- Reducir tiempos y estandarizar las evaluaciones técnicas. [DOC]
- Fortalecer la oferta HRTech de PluriOne mediante automatización inteligente. [DOC]
- Integrar en el alumno competencias de desarrollo de software, IA y analítica. [DOC]

## 4.3 Objetivo general

Desarrollar un sistema inteligente para la evaluación técnica automatizada de candidatos. [DOC]

## 4.4 Objetivos específicos

- Analizar los procesos actuales de evaluación. [DOC]
- Diseñar la arquitectura tecnológica. [DOC]
- Implementar módulos de evaluación y calificación. [DOC]
- Validar la confiabilidad de los resultados. [DOC]
- Documentar la solución y el plan de soporte. [DOC]

## 4.5 Alcance

**Incluye:**

- Delimitación del proyecto: crear, administrar y calificar evaluaciones técnicas de manera automática para distintos perfiles profesionales, con bancos de preguntas, ejercicios prácticos, rúbricas de evaluación y análisis inteligente de resultados. [DOC]
- Autenticación y autorización con roles (administrador, evaluador). [TEC]
- Gestión de perfiles profesionales: crear, listar, editar y eliminar. [TEC]
- Banco de preguntas por perfil, con tipo (abierta u opción múltiple), enunciado, rúbrica y opciones. [TEC]
- Armado de exámenes: crear, editar y eliminar exámenes; asignar y quitar preguntas con orden. [TEC]
- Flujo público del candidato: identificación con nombre y correo, respuesta al examen y confirmación de envío, sin crear cuenta. [TEC]
- Calificación automática con IA (Google Gemini) contra la rúbrica de cada pregunta, con nota de 0 a 10 y retroalimentación. [TEC]
- Panel de resultados con candidato, examen, calificación y retroalimentación de la IA. [TEC]
- Gestión de usuarios del sistema (alta y listado) restringida al administrador. [TEC]
- Script de inicialización para crear el primer administrador (`crear_admin.py`). [TEC]
- Interfaz web (React + Tailwind CSS) responsive, con estados de carga, confirmaciones antes de eliminar y protección de rutas. [TEC]
- Repositorio en GitHub con README, script de base de datos y archivos `.env.example`. [TEC]

## 4.6 Fuera de alcance

- Generación automática de preguntas con IA (evaluada; queda como mejora futura). [TEC]
- Envío automático de resultados por correo al candidato. [TEC]
- Enlaces de invitación únicos por candidato (hoy el candidato elige su examen de una lista). [TEC]
- Reportes avanzados y exportación de datos. [TEC]
- Dashboard en Power BI (se sustituyó por el panel de resultados en React). [TEC]
- Pipeline de CI/CD con GitHub Actions y pruebas end-to-end con Playwright (pendientes). [TEC]
- Aplicaciones móviles nativas. [TEC]
- Múltiples proveedores de IA simultáneos. [TEC]
- Despliegue en servidor de producción y migración de datos históricos reales de la organización. [TEC]

## 4.7 Usuarios

1. **Administrador** — administra el sistema: crea y gestiona perfiles, preguntas y exámenes, da de alta a otros usuarios (administradores o evaluadores), consulta el listado de usuarios y revisa resultados. [TEC]
2. **Evaluador** — gestiona perfiles, preguntas y exámenes y revisa los resultados calificados por la IA. No puede crear ni listar usuarios. [TEC]
3. **Candidato** — no tiene cuenta. Presenta su examen desde el flujo público indicando nombre y correo. No ve su calificación. [TEC]
4. **Líder de Proyecto / Evaluaciones (Edgar Loheffelmman)** — referencia del proyecto y de la evaluación. [DOC]
5. **Asesor empresarial y Responsable de Programas de Estadías (Juan Méndez Herrera)** — asesoría y seguimiento del proyecto. [DOC]

## 4.8 Personas

> Personas ilustrativas para orientar el diseño; no representan personas reales.

| Persona | Descripción |
|---|---|
| **Ana (Reclutadora técnica)** | 32 años, evaluadora. Necesita armar exámenes por perfil en poco tiempo, reutilizar preguntas y revisar resultados sin calificar todo a mano. |
| **Luis (Candidato a Backend Junior)** | 24 años. Recibe la indicación de presentar una evaluación técnica; quiere hacerlo sin crear cuentas ni instalar nada, desde el navegador. |
| **Carlos (Administrador del sistema)** | 36 años, responsable de TI. Da de alta a los evaluadores, cuida el acceso al panel y la seguridad de los datos de candidatos. |
| **Edgar (Líder de Proyecto / Evaluaciones)** | Valida que el sistema cumpla los objetivos del proyecto y revisa la confiabilidad de los resultados. [DOC] |

## 4.9 User Stories

> Como **administrador**,
> quiero **iniciar sesión de forma segura**,
> para **acceder al panel de administración**.

> Como **evaluador**,
> quiero **crear perfiles profesionales**,
> para **agrupar preguntas y exámenes por área (p. ej. Backend Junior)**.

> Como **evaluador**,
> quiero **crear preguntas con enunciado y rúbrica**,
> para **que la IA califique con un criterio específico y consistente**.

> Como **evaluador**,
> quiero **armar un examen asignando preguntas de un perfil**,
> para **reutilizar mi banco de preguntas en distintas evaluaciones**.

> Como **evaluador**,
> quiero **quitar preguntas de un examen o editar sus datos**,
> para **corregir errores sin rehacer el examen**.

> Como **evaluador**,
> quiero **revisar la nota y la retroalimentación de la IA por candidato**,
> para **decidir quién avanza en el proceso de selección**.

> Como **administrador**,
> quiero **dar de alta a otros administradores y evaluadores**,
> para **controlar quién accede al panel**.

> Como **administrador**,
> quiero **crear el primer administrador desde la terminal al instalar el sistema**,
> para **poder entrar por primera vez sin un registro público inseguro**.

> Como **candidato**,
> quiero **presentar mi examen escribiendo solo mi nombre y correo**,
> para **no tener que crear una cuenta**.

> Como **candidato**,
> quiero **recibir una confirmación al terminar**,
> para **saber que mis respuestas fueron registradas**.

> Como **evaluador**,
> quiero **que el sistema me impida eliminar un perfil, pregunta o examen con datos asociados**,
> para **no dejar información huérfana o inconsistente**.

> Como **candidato**,
> quiero **ver un mensaje claro si el examen aún no tiene preguntas**,
> para **saber que debo contactar al equipo de reclutamiento**.

## 4.10 Requerimientos funcionales

### Módulo Autenticación
- FR-AUTH-01: Login con correo y contraseña mediante el flujo OAuth2 (formulario `username`/`password`). [TEC]
- FR-AUTH-02: Roles: `admin` y `evaluador` (por defecto, `evaluador`). [TEC]
- FR-AUTH-03: Contraseñas con hash seguro (bcrypt); nunca en texto plano. [TEC]
- FR-AUTH-04: Sesión mediante JWT (HS256) firmado con `SECRET_KEY` de variable de entorno; vigencia de 8 horas. [TEC]
- FR-AUTH-05: Consulta del usuario autenticado (`GET /usuarios/yo`). [TEC]
- FR-WEB-06: Confirmación antes de eliminar mediante un cuadro de diálogo propio, y avisos flotantes (toasts) para éxitos y errores del backend. [TEC]
- FR-AUTH-07: Listado de usuarios (`GET /usuarios`) restringido al rol `admin`. [TEC]
- FR-AUTH-08: Script `crear_admin.py` para crear el primer administrador directo en la base de datos. [TEC]
- FR-AUTH-09: Cierre de sesión eliminando el token del navegador. [TEC]

### Módulo Perfiles
- FR-PER-01: Crear, listar y consultar perfiles (nombre y descripción). [TEC]
- FR-PER-02: Editar un perfil. [TEC]
- FR-PER-03: Eliminar un perfil solo si no tiene preguntas asociadas; en caso contrario, responder con el motivo. [TEC]
- FR-PER-04: Crear, editar y eliminar requieren sesión; listar y consultar no. [TEC]

### Módulo Preguntas
- FR-PRE-01: Crear, listar, consultar y editar preguntas. [TEC]
- FR-PRE-02: Cada pregunta pertenece a un perfil y tiene tipo (`abierta` u `opcion_multiple`), enunciado, rúbrica y opciones. [TEC]
- FR-PRE-03: Las opciones se almacenan como lista (JSON) y solo aplican al tipo opción múltiple. [TEC]
- FR-PRE-04: Eliminar una pregunta solo si no está asignada a ningún examen. [TEC]

### Módulo Exámenes
- FR-EXA-01: Crear, listar, editar y eliminar exámenes (perfil, título y tiempo límite en minutos, 60 por defecto). [TEC]
- FR-EXA-02: Asignar preguntas a un examen indicando su orden. [TEC]
- FR-EXA-03: Listar las preguntas asignadas a un examen. [TEC]
- FR-EXA-04: Quitar una pregunta de un examen. [TEC]
- FR-EXA-05: Eliminar un examen solo si ningún candidato lo ha presentado; al eliminarlo se borran sus asignaciones de preguntas. [TEC]
- FR-EXA-06: La interfaz solo ofrece para asignar las preguntas del mismo perfil que el examen que aún no estén asignadas. [TEC]

### Módulo Candidato (acceso, intentos y respuestas)
- FR-CAN-01: Acceso sin cuenta: `POST /candidatos/acceso` devuelve el candidato existente por correo o lo crea, sin duplicar. [TEC]
- FR-CAN-02: Crear un intento (candidato + examen) con estado inicial `en_progreso` y fecha de inicio. [TEC]
- FR-CAN-03: Guardar y listar las respuestas de un intento. [TEC]
- FR-CAN-04: La interfaz exige responder todas las preguntas antes de finalizar. [TEC]
- FR-CAN-05: Si el examen no tiene preguntas, mostrar un mensaje de "examen no disponible" en lugar del formulario. [TEC]
- FR-CAN-06: Al finalizar, el candidato ve únicamente una confirmación de envío, sin su calificación. [TEC]

### Módulo Calificación con IA
- FR-AI-01: Calificar un intento (`POST /intentos/{id}/calificar`): para cada respuesta, construir un prompt con enunciado, rúbrica y respuesta del candidato. [TEC]
- FR-AI-02: Si la pregunta no tiene rúbrica, usar un criterio genérico de calidad y correctitud técnica. [TEC]
- FR-AI-03: La IA responde únicamente en JSON con `calificacion` (0 a 10) y `retroalimentacion` breve. [TEC]
- FR-AI-04: La calificación total del intento es el promedio de las notas por pregunta. [TEC]
- FR-AI-05: La retroalimentación se guarda concatenada, una línea por pregunta. [TEC]
- FR-AI-06: Al calificar, el intento pasa a estado `calificado` y se registra su fecha de finalización. [TEC]
- FR-AI-07: Rechazar la calificación de un intento sin respuestas. [TEC]

### Módulo Resultados
- FR-RES-01: Listar resultados con candidato (nombre y correo), examen, calificación total, retroalimentación y fecha de finalización (`GET /resultados`). [TEC]
- FR-RES-02: Mostrar la nota con color según rango: verde (≥ 8), ámbar (≥ 6) y rojo (< 6). [TEC]

### Módulo Web (frontend)
- FR-WEB-01: Pantallas: Login, Perfiles, Preguntas, Exámenes, Resultados, Usuarios, Presentar examen, Responder examen y Examen completado. [TEC]
- FR-WEB-02: Rutas públicas (`/login`, `/presentar`, `/examen/:id`, `/examen/:id/completado`) y rutas protegidas (panel de administración). [TEC]
- FR-WEB-03: El token se guarda en el navegador y un interceptor lo envía en cada petición. [TEC]
- FR-WEB-04: Layout con menú lateral y botón de cerrar sesión. [TEC]
- FR-WEB-05: Diseño responsive (columnas que se apilan en pantallas angostas) y estados de carga con indicador. [TEC]
- FR-WEB-06: Confirmación antes de eliminar y mensajes de error del backend visibles al usuario. [TEC]
- FR-WEB-07: La URL del backend se configura mediante variable de entorno (`VITE_API_URL`). [TEC]
- FR-WEB-08: Desde el login hay un enlace directo para quien viene a presentar un examen. [TEC]

## 4.11 Requerimientos no funcionales

- **Seguridad:** secretos fuera del código (`.env`, `.env.example`); hash de contraseñas; JWT con expiración; control de rol en endpoints de administración; consultas a base de datos mediante ORM (parametrizadas); validación de entradas con Pydantic; CORS limitado al origen del frontend. [TEC]
- **Rendimiento:** la calificación llama a la IA una vez por pregunta, de forma secuencial; en desarrollo se midió ≈ 8 s para un examen de una pregunta, por lo que el tiempo crece con el número de preguntas. [TEC]
- **Integridad de datos:** no se permite borrar perfiles, preguntas o exámenes con datos asociados; llaves foráneas y restricciones de unicidad en base de datos. [TEC]
- **Mantenibilidad:** separación en módulos (`models`, `schemas`, `auth`, `ia`, `database`, `main`); la lógica de IA está aislada en un solo archivo, de modo que cambiar de proveedor impacta un solo punto. [TEC]
- **Portabilidad:** base de datos en Docker; README con instrucciones para Linux/macOS y Windows; dependencias congeladas en `requirements.txt` y `package.json`. [TEC]
- **Usabilidad:** interfaz en español, responsive, con estados de carga, mensajes de error claros y confirmaciones. [TEC]
- **Privacidad:** se almacena la mínima información del candidato (nombre y correo); el resultado de la IA solo lo ve el personal autenticado. [TEC]
- **Observabilidad:** logs de acceso y errores de Uvicorn; documentación interactiva de la API en `/docs` (Swagger). [TEC]

## 4.12 Reglas de negocio

- La calificación de cada pregunta es de 0 a 10; la del examen es el promedio simple de sus preguntas. [TEC]
- La IA califica contra la rúbrica de la pregunta, no con un criterio global. [TEC]
- La IA es una herramienta de apoyo: el evaluador humano decide cómo y cuándo comunicar el resultado; el candidato no ve su nota. [TEC]
- No existe registro público: solo un administrador autenticado puede crear usuarios; el primer administrador se crea con `crear_admin.py`. [TEC]
- El rol por defecto de un usuario nuevo es `evaluador`. [TEC]
- Un perfil con preguntas asociadas no se puede eliminar. [TEC]
- Una pregunta asignada a algún examen no se puede eliminar. [TEC]
- Un examen con intentos de candidatos no se puede eliminar. [TEC]
- Un candidato se identifica por su correo; si ya existe, se reutiliza el registro. [TEC]
- Un mismo candidato puede presentar un examen más de una vez; cada vez genera un intento nuevo. [TEC]
- Un intento sin respuestas no se puede calificar. [TEC]
- Solo se muestran para asignar a un examen las preguntas de su mismo perfil. [TEC]
- La sesión vence a las 8 horas y exige iniciar sesión de nuevo. [TEC]

## 4.13 Casos de uso

| ID | Caso de uso | Actor principal |
|---|---|---|
| UC-01 | Iniciar sesión | Administrador / Evaluador |
| UC-02 | Gestionar perfiles profesionales | Administrador / Evaluador |
| UC-03 | Gestionar banco de preguntas (con rúbrica) | Administrador / Evaluador |
| UC-04 | Armar examen (asignar y quitar preguntas) | Administrador / Evaluador |
| UC-05 | Presentar un examen | Candidato |
| UC-06 | Calificar un examen con IA | Sistema (al finalizar el candidato) |
| UC-07 | Consultar resultados y retroalimentación | Administrador / Evaluador |
| UC-08 | Dar de alta usuarios del sistema | Administrador |
| UC-09 | Listar usuarios del sistema | Administrador |
| UC-10 | Crear el primer administrador (script) | Responsable de la instalación |
| UC-11 | Eliminar perfil, pregunta o examen (con validaciones) | Administrador / Evaluador |
| UC-12 | Cerrar sesión | Administrador / Evaluador |

## 4.14 Flujos principales

### Login → Panel → Acciones
```
Login (POST /login) → Token JWT (8 h) → Panel (React)
   ├─ Perfiles    → CRUD de perfiles
   ├─ Preguntas   → CRUD con rúbrica
   ├─ Exámenes    → CRUD + asignar/quitar preguntas
   ├─ Resultados  → notas + retroalimentación de la IA
   └─ Usuarios    → alta y listado (solo admin)
```

### Presentación de un examen (candidato)
```
/presentar  (nombre + correo + examen)
  → POST /candidatos/acceso   (reutiliza o crea al candidato)
  → POST /intentos            (estado: en_progreso)
  → /examen/{intento}         (muestra las preguntas)
  → "Finalizar examen"
       → POST /intentos/{id}/respuestas   (una por pregunta)
       → POST /intentos/{id}/calificar    (IA)
  → /examen/{intento}/completado   (solo confirmación)
```

### Calificación con IA
```
Para cada respuesta del intento:
  → Prompt = enunciado + rúbrica + respuesta del candidato
  → Gemini → JSON {"calificacion": 0-10, "retroalimentacion": "..."}
Calificación total = promedio de las notas
  → Guardar Resultado (nota + retroalimentación)
  → Intento: estado = calificado, finalizado_en = ahora
```

### Armado de un examen
```
Evaluador crea perfil → crea preguntas con rúbrica → crea examen del perfil
  → abre el examen → "Agregar" pregunta (solo del mismo perfil)
  → puede "Quitar" preguntas mientras el examen no tenga intentos
```

### Primer acceso al sistema (instalación)
```
Levantar PostgreSQL (Docker) → crear tablas (create_tables.py)
  → python crear_admin.py   (correo, nombre, contraseña)
  → Login en el panel → alta de más usuarios desde "Usuarios"
```

## 4.15 Arquitectura propuesta

Arquitectura de tres capas con una API monolítica modular [TEC]:

1. **Frontend** (React + Vite + Tailwind CSS): panel de administración y flujo público del candidato.
2. **Backend** (Python + FastAPI + SQLAlchemy): API REST, autenticación, lógica de negocio y módulo de IA.
3. **Base de datos** (PostgreSQL 16 en Docker).

Servicio externo: **Google Gemini API** para la calificación. [TEC]

Estructura del backend: `main.py` (endpoints), `models.py` (tablas), `schemas.py` (validación), `auth.py` (seguridad), `ia.py` (integración con Gemini), `database.py` (conexión).

Infraestructura: Docker Compose (PostgreSQL), Git y GitHub. El backend y el frontend se ejecutan localmente. [TEC]

### Endpoints de la API

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/login` | Público | Inicia sesión y devuelve el token |
| GET | `/usuarios/yo` | Autenticado | Datos del usuario actual |
| POST | `/registro` | Admin | Crea un usuario |
| GET | `/usuarios` | Admin | Lista usuarios |
| GET | `/perfiles`, `/perfiles/{id}` | Público | Lista / consulta perfiles |
| POST, PUT, DELETE | `/perfiles`, `/perfiles/{id}` | Autenticado | Crea / edita / elimina perfiles |
| GET | `/preguntas`, `/preguntas/{id}` | Público | Lista / consulta preguntas |
| POST, PUT, DELETE | `/preguntas`, `/preguntas/{id}` | Autenticado | Crea / edita / elimina preguntas |
| GET | `/examenes` | Público | Lista exámenes |
| POST, PUT, DELETE | `/examenes`, `/examenes/{id}` | Autenticado | Crea / edita / elimina exámenes |
| GET | `/examenes/{id}/preguntas` | Público | Preguntas de un examen |
| POST | `/examenes/{id}/preguntas` | Autenticado | Asigna una pregunta |
| DELETE | `/examenes/{id}/preguntas/{pregunta_id}` | Autenticado | Quita una pregunta |
| POST, GET | `/candidatos`, `/candidatos` | Público | Crea / lista candidatos |
| POST | `/candidatos/acceso` | Público | Obtiene o crea candidato por correo |
| POST | `/intentos` | Público | Crea un intento |
| GET | `/intentos/{id}` | Público | Consulta un intento |
| POST, GET | `/intentos/{id}/respuestas` | Público | Guarda / lista respuestas |
| POST | `/intentos/{id}/calificar` | Público | Califica con IA y guarda el resultado |
| GET | `/resultados` | Público | Lista resultados detallados |
| GET | `/`, `/health` | Público | Estado de la API |

> El acceso "Público" de algunos endpoints es una limitación conocida; ver sección 4.22.

## 4.16 Seguridad

Implementado:

- Contraseñas con bcrypt. [TEC]
- JWT firmado (HS256) con clave secreta en variable de entorno; vigencia de 8 horas. [TEC]
- Control de rol: solo `admin` crea y lista usuarios. [TEC]
- Secretos (API key de Gemini, URL de base de datos, `SECRET_KEY`) en `.env`, excluido de Git; solo se publica `.env.example`. [TEC]
- CORS limitado al origen del frontend. [TEC]
- ORM con consultas parametrizadas (mitigación de inyección SQL) y validación de entradas con Pydantic. [TEC]
- Sin registro público; primer administrador creado por script en el servidor. [TEC]
- Restricciones de borrado para evitar datos huérfanos. [TEC]
- La API key de Gemini reside únicamente en el backend. [TEC]

Pendiente de implementar: ver sección 4.22.

## 4.17 Datos

**Base de datos:** PostgreSQL 16 (`eval_tecnica`). Las tablas se crean con SQLAlchemy (`create_tables.py`) y se entrega un respaldo con estructura y datos de prueba en `db/base-de-datos.sql`. [TEC]

**Entidades principales** [TEC]:

| Tabla | Campos principales |
|---|---|
| `perfiles` | `id`, `nombre`, `descripcion` |
| `candidatos` | `id`, `nombre`, `email` (único) |
| `preguntas` | `id`, `perfil_id`, `tipo`, `enunciado`, `rubrica`, `opciones` (JSON) |
| `examenes` | `id`, `perfil_id`, `titulo`, `tiempo_limite_min` |
| `examen_preguntas` | `examen_id`, `pregunta_id` (llave compuesta), `orden` |
| `intentos` | `id`, `candidato_id`, `examen_id`, `iniciado_en`, `finalizado_en`, `estado` |
| `respuestas` | `id`, `intento_id`, `pregunta_id`, `respuesta_texto` |
| `resultados` | `id`, `intento_id` (único), `calificacion_total`, `retroalimentacion_ia` |
| `usuarios` | `id`, `nombre`, `email` (único), `password_hash`, `rol` |

**Relaciones:** un perfil tiene muchas preguntas y exámenes; un examen y una pregunta se relacionan muchos a muchos mediante `examen_preguntas`; un candidato tiene muchos intentos; un intento tiene muchas respuestas y un único resultado.

**Estados de un intento:** `en_progreso` (al crearse) y `calificado` (tras la calificación con IA).

**Información sensible** [TEC]: nombre y correo de candidatos (datos personales), respuestas de los candidatos, hashes de contraseñas, API key de Gemini, `SECRET_KEY` y cadena de conexión. Ninguna se sube al repositorio.

## 4.18 Inteligencia artificial

- **Proveedor:** Google Gemini API, modelo `gemini-3.6-flash`, mediante el SDK `google-genai`. [TEC]
- **Sustitución de Azure OpenAI:** el documento fuente propone Azure OpenAI [DOC]; se usó Gemini por disponibilidad de acceso y costo durante el desarrollo, y porque su capa gratuita permite desarrollar y probar sin tarjeta. [TEC]
- **Enfoque:** evaluación por rúbrica. Para cada respuesta se arma un prompt con rol de "evaluador técnico experto", la pregunta, la rúbrica y la respuesta del candidato. [TEC]
- **Contrato de salida:** la IA debe responder solo con JSON `{"calificacion": <0-10>, "retroalimentacion": "<texto breve>"}`; el sistema limpia envolturas de markdown antes de interpretarlo. [TEC]
- **Agregación:** calificación total = promedio de las notas por pregunta; retroalimentación = una línea por pregunta. [TEC]
- **Aislamiento:** toda la integración vive en `ia.py` (función `calificar_respuesta`), por lo que cambiar de proveedor implica modificar un solo archivo. [TEC]
- **Nota sobre modelos:** los nombres de modelos de Gemini se retiran con el tiempo (el modelo `gemini-2.0-flash` ya no está disponible); el nombre del modelo debe revisarse periódicamente. [TEC]
- **No se usan** RAG, embeddings, LangChain ni function calling en esta versión; el documento fuente menciona LangChain [DOC], y se decidió no incluirlo porque el caso de uso se resuelve con llamadas directas a la API. [TEC]

## 4.19 Criterios de aceptación

1. Un administrador o evaluador puede iniciar sesión y las rutas del panel rechazan a quien no tiene sesión.
2. Se puede crear un perfil, preguntas con rúbrica y un examen sin salir del sistema.
3. Se pueden asignar y quitar preguntas de un examen, y solo se ofrecen las del mismo perfil.
4. Un candidato puede presentar un examen desde `/presentar` sin crear cuenta.
5. Al finalizar, el sistema califica automáticamente con IA y guarda nota y retroalimentación.
6. La calificación es coherente con la rúbrica de cada pregunta (validación pendiente de comparar con un evaluador humano).
7. El evaluador ve la nota y la retroalimentación en el panel de Resultados sin usar herramientas externas.
8. Solo un administrador puede crear usuarios; el primer administrador se crea con `crear_admin.py`.
9. No se pueden eliminar perfiles, preguntas o exámenes con datos asociados, y el sistema explica el motivo.
10. Un examen sin preguntas muestra un mensaje claro al candidato.
11. Ningún secreto aparece en el repositorio ni en el frontend.
12. El proyecto se instala y ejecuta en otra máquina siguiendo únicamente el README.

## 4.20 Métricas / KPIs

- Tiempo promedio de calificación por examen (según número de preguntas). [TEC]
- Concordancia entre la calificación de la IA y la de un evaluador humano sobre una muestra (evaluación manual). [TEC]
- % de exámenes completados vs. iniciados (intentos `calificado` vs. `en_progreso`). [TEC]
- Distribución de calificaciones por perfil y por examen. [TEC]
- Tiempo ahorrado frente a la calificación manual. [TEC]
- Número de preguntas reutilizadas en más de un examen. [TEC]

## 4.21 Roadmap

| Fase | Entregable | Estado |
|---|---|---|
| FASE 0 | Requerimientos, PRD y MVP | ✅ Completado |
| FASE 1 | Entorno e infraestructura (Docker + PostgreSQL, entorno virtual, estructura del proyecto) | ✅ Completado |
| FASE 2 | Modelo de datos y endpoints base (perfiles, preguntas, exámenes, candidatos) | ✅ Completado |
| FASE 3 | Intentos, respuestas y calificación con IA (Gemini) | ✅ Completado |
| FASE 4 | Autenticación, roles y gestión de usuarios | ✅ Completado |
| FASE 5 | Frontend: panel de administración | ✅ Completado |
| FASE 6 | Frontend: flujo público del candidato | ✅ Completado |
| FASE 7 | Pulido: CRUD completo, validaciones, variables de entorno, responsive, estados de carga | ✅ Completado |
| FASE 8 | Repositorio GitHub, README, script de base de datos y `.env.example` | ✅ Completado |
| QA | Pruebas de casos límite (examen sin preguntas ✅; respuesta vacía, candidato repetido y recarga a mitad de examen pendientes) | 🔄 En curso |
| Documentación | Informe técnico, manual técnico y manual de usuario | 🔄 En curso |
| Mantenimiento | Plan de mantenimiento y soporte multinivel | ⏳ Pendiente |
| Cierre | Capacitación, acta y evaluación post-implementación | ⏳ Pendiente |
| Post-MVP | Pruebas automatizadas, CI/CD, protección de endpoints de lectura, mejoras de IA y de experiencia | ⏳ Pendiente |

## 4.22 Limitaciones conocidas y deuda técnica

Se documentan de forma explícita para que el alcance real del MVP quede claro:

**Seguridad**
- Varios endpoints de lectura son públicos, incluido `GET /resultados`, y `GET /preguntas` expone las rúbricas. Debe protegerse con sesión.
- Los endpoints del flujo del candidato (intentos, respuestas, calificar) no validan que quien llama sea el candidato dueño del intento; los identificadores son consecutivos.
- Sin límite de intentos de login, sin bloqueo temporal, sin refresh token y sin auditoría de accesos.
- El token se guarda en el navegador (`localStorage`), lo que lo expone ante un ataque XSS; lo recomendable es una cookie `HttpOnly`.
- Las respuestas del candidato se insertan directamente en el prompt de la IA, sin defensa contra *prompt injection* (un candidato podría intentar manipular la nota).
- Falta aviso de privacidad y consentimiento del candidato sobre el tratamiento de sus datos personales.

**Funcionalidad**
- Las preguntas de opción múltiple se pueden registrar con sus opciones, pero la pantalla del candidato muestra un cuadro de texto libre para todas las preguntas, y la calificación pasa siempre por la IA con la rúbrica (no hay respuesta correcta predefinida).
- El tiempo límite del examen se guarda pero no se aplica ni se muestra al candidato.
- Las respuestas se guardan solo al finalizar; recargar la página a mitad del examen borra lo escrito.
- La calificación llama a la IA una pregunta a la vez; en exámenes largos el candidato espera varios segundos.
- Si la IA devuelve un formato inesperado, la calificación falla sin reintento automático.
- Calificar dos veces el mismo intento no está controlado.
- Se está investigando un error al enviar el examen en un segundo intento del mismo candidato.
- El backend no valida que la pregunta asignada pertenezca al mismo perfil del examen, ni evita asignarla dos veces (la interfaz sí lo evita).
- El menú muestra "Usuarios" a todos los roles aunque el backend rechace al evaluador.
- Un candidato elige su examen de la lista completa de exámenes.

**Calidad y operación**
- Sin pruebas automatizadas (pytest, Playwright) ni CI/CD (GitHub Actions).
- Sin migraciones de base de datos (se usa `create_all`).
- Backend y frontend no están contenerizados ni desplegados en un servidor.
- Fechas almacenadas en UTC, sin conversión a zona horaria local en la interfaz.

## 4.23 Trazabilidad de tecnologías: documento fuente vs. implementación

| Tecnología del documento fuente [DOC] | Estado en la implementación [TEC] |
|---|---|
| Python | ✅ Utilizada |
| FastAPI | ✅ Utilizada |
| React.js | ✅ Utilizada (con Vite) |
| PostgreSQL | ✅ Utilizada |
| Docker | ✅ Utilizada para la base de datos |
| Azure OpenAI | 🔁 Sustituida por Google Gemini |
| LangChain | ❌ No utilizada (llamadas directas a la API) |
| GitHub Actions | ⏳ Pendiente |
| Playwright | ⏳ Pendiente |
| Power BI | 🔁 Sustituido por el panel de resultados en React |
| Scrum | ✅ Adaptado a un proyecto individual (backlog y ciclos semanales) |
| *(no está en el documento fuente)* | ✅ Se agregó Tailwind CSS (v4) en el frontend [TEC] |

---

## Nota sobre la procedencia de la información

Los datos institucionales (nombre y razón social de la empresa, RFC, dirección, giro, responsables, título, tecnologías propuestas, delimitación, objetivos, justificación y cronograma) provienen exclusivamente de la ficha del proyecto de estadía y se marcan como [DOC]. Los datos de prueba del sistema son de demostración (por ejemplo, `admin@develop.com.mx`). Toda decisión técnica (stack, arquitectura, modelo de datos, uso de Gemini) es propuesta del alumno y está marcada como [TEC].
