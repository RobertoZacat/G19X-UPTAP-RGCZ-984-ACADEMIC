# Pruebas Manuales — Sistema de Evaluación Técnica Automatizada para Candidatos

> **Empresa:** PluriOne S.A. de C.V. (Develop Talent & Technology)
> **Producto:** Sistema de Evaluación Técnica Automatizada (MVP)
> **Código:** PLU-PRU-2026-V1
> **Alumno:** Roberto Guadalupe Cruz Zacatenco · G19X-UPTAP-RGCZ-984

Este documento registra las pruebas manuales realizadas sobre el MVP. Cada caso indica qué se probó, los pasos, el resultado esperado, el resultado obtenido, la fecha y el commit en el que se verificó.

---

## 1. Cómo leer la tabla

- **Caso:** qué comportamiento se valida.
- **Pasos:** la secuencia exacta para reproducirlo.
- **Resultado esperado:** lo que debería pasar según el PRD.
- **Resultado obtenido:** lo que pasó en la prueba.
- **Fecha / commit:** cuándo y sobre qué versión se verificó.

---

## 2. Casos de prueba

| # | Caso | Pasos | Resultado esperado | Resultado obtenido | Fecha / commit |
|---|---|---|---|---|---|
| 1 | Examen sin preguntas | Crear un examen sin asignarle preguntas y abrirlo como candidato. | Se muestra «Este examen todavía no tiene preguntas» y no se muestra el formulario. | ✅ Se muestra el mensaje de examen no disponible. | 23 oct · `ba1ea78` |
| 2 | Respuesta vacía | Entrar a una pregunta abierta, salir del campo sin escribir y finalizar. | La pregunta cuenta como «sin respuesta» (0) y no se envía a la IA. | ✅ Se califica con 0 y se marca «Sin respuesta». | 26 oct · `6ae33ca` |
| 3 | Candidato repetido | Presentar dos veces con el mismo correo. | Se reutiliza el candidato existente y se crea un intento nuevo. | ✅ No se duplica el candidato; se genera un intento nuevo. | 23 oct · `ba1ea78` |
| 4 | Recarga a mitad de examen | Responder una pregunta, recargar la página y volver a entrar. | Las respuestas guardadas se recuperan y rellenan el formulario. | ✅ El formulario se rellena con lo ya contestado. | 23 oct · `c388e43` |
| 5 | Examen mixto | Presentar un examen con preguntas abiertas y de opción múltiple. | Las abiertas se califican con IA y las de opción múltiple de forma automática. | ✅ Ambas se califican según su tipo. | 23 oct · `ba1ea78` |
| 6 | Examen que se vence | Dejar pasar el tiempo límite sin finalizar. | El sistema envía automáticamente lo contestado y califica; lo no contestado cuenta 0. | ✅ Se envía y califica automáticamente al llegar a 0. | 23 oct · `ba1ea78` |
| 7 | Reintento tras vencimiento | Forzar un error 503 de la IA, esperar más de 30 s tras el límite y reintentar. | El reintento califica sin reenviar respuestas (no choca con el 409). | ✅ Se califica llamando directo a `/calificar`. | 26 oct · `bf95048` |
| 8 | Guardado por tecla | Escribir en una pregunta abierta y observar las peticiones. | No se hace un POST por cada tecla; se guarda al salir del campo. | ✅ Se guarda solo al salir del campo (onBlur). | 26 oct · `2d032d2` |
| 9 | Pregunta ajena al examen | Intentar guardar una respuesta con un `pregunta_id` que no pertenece al examen del intento. | El backend responde 400 y no guarda. | ✅ Responde 400 «La pregunta no pertenece al examen». | 26 oct · `6ae33ca` |
| 10 | Cierre por tiempo con texto sin guardar | Escribir en una pregunta abierta y, sin salir del campo, dejar que el contador llegue a 0. | Se envía también el texto que se estaba escribiendo (lo pendiente) y se califica. | ✅ Se envía lo que cambió desde el último guardado y se califica. | 28 oct · `b8c5adf` |
| 11 | Reintento con preguntas sin contestar | Dejar preguntas sin responder, forzar un 503 de la IA al vencer y pulsar «Finalizar examen». | El reintento llama a `/calificar` sin exigir responder todas las preguntas. | ✅ Califica (o navega a completado) sin exigir responder todo. | 28 oct · `b8c5adf` |
| 12 | Error no temporal al calificar | Forzar un error no temporal al calificar (409 por doble calificación u otro código distinto de 502/503). | Si es 409, navega a la pantalla de completado; si es otro error, muestra qué hacer con el número de intento. | ✅ 409 lleva a completado; otro error muestra «avisa al reclutador (intento N)». | 28 oct · `f2f0925` |
| 13 | Escribir, salir del campo y recargar | Responder una pregunta abierta, salir del campo (onBlur) y recargar la página. | La respuesta guardada al salir se recupera y rellena el campo. | ✅ El campo se rellena con lo guardado al salir del campo. | 28 oct · `b8c5adf` |
| 14 | Error permanente de la IA (502) | Dejar `GEMINI_API_KEY` vacía (o poner un modelo inexistente), presentar un examen con una pregunta abierta y finalizar. | El backend responde 502 y el frontend **no** ofrece reintentar: muestra «avisa al reclutador (intento N)». Solo el 503 y la falta de red se ofrecen como reintentables. | API: ✅ Con `GEMINI_API_KEY` vacía, `POST /intentos/{id}/calificar` del «Examen Backend Junior Python» (una pregunta abierta) responde **502** «Falta configurar GEMINI_API_KEY en el servidor.», y al repetirlo vuelve a dar 502, no 503. El intento sigue `en_progreso`, sin resultado, y la respuesta queda guardada. Interfaz: ⏳ por confirmar en el navegador; en el código, el 502 cae en «avisa al reclutador (intento N)» (`frontend/src/pages/ResponderExamen.jsx`, `esTemporal` solo es 503 o falta de red). | 7 nov · `3d9de68` |

---

## 3. Notas

- Las pruebas se realizaron de forma manual, sin suite automatizada (pytest/Playwright quedan pendientes, ver `docs/PRD.md` §4.22).
- Desconfigurar `GEMINI_API_KEY` o usar un modelo inexistente produce un **502** (error permanente de la IA), no un 503: sirve para el caso 14, no para los casos 7 y 11. El **503** solo aparece cuando Gemini responde saturación (429/500/502/503/504) y se agotan los reintentos y el modelo de respaldo (`backend/app/ia.py`).
- Hasta el commit `c4ff204` el frontend trataba el 502 igual que el 503 (como reintentable); desde la corrección del caso 14 el 502 lleva al mensaje de «avisa al reclutador».
- Los commits referidos corresponden a la rama en la que se aplicó cada corrección.
- **Margen de 30 s tras el límite (decisión de diseño).** El backend acepta respuestas hasta 30 s después del tiempo límite (`MARGEN_LATENCIA_SEGUNDOS` en `backend/app/routers/intentos.py`). El margen existe para que llegue lo que el candidato escribía justo en 0:00, aunque la red tarde (caso 10). Desde que el frontend bloquea las opciones y los campos de texto al llegar a 0:00, ya no se puede contestar tarde desde la interfaz; solo quedaría llamando a la API directamente con el token del intento, dentro de esos 30 s.

---

## 4. Instalación limpia

Bitácora de reproducibilidad: se clonó el repositorio en una carpeta vacía y se siguió únicamente el `README.md`. Commit instalado: `e4d7515` (28 oct).

| Paso (según README) | Resultado |
|---|---|
| `git clone` en una carpeta limpia | ✅ El repositorio llega sin `backend/.env`, `venv` ni `node_modules` (los ignora `.gitignore`). |
| `docker compose up -d` | ⚠️ El puerto 5432 ya estaba ocupado por el contenedor local de desarrollo (`eval-tecnica-db-1`). Para no interferir, esta prueba levantó la base limpia sobre el puerto 5433. Sin ese choque, queda tal cual lo indica el README. |
| Importar `db/base-de-datos.sql` | ✅ Importa sin errores y quedan las 9 tablas (`candidatos`, `examen_preguntas`, `examenes`, `intentos`, `perfiles`, `preguntas`, `respuestas`, `resultados`, `usuarios`). |
| Copiar y llenar los `.env` | ✅ Solo hizo falta `GEMINI_API_KEY` y `SECRET_KEY`; el `DATABASE_URL` ya coincide con el usuario y la base del compose. |
| Backend: venv + `pip install -r requirements.txt` | ✅ Instala todas las dependencias sin errores. |
| `uvicorn app.main:app` | ✅ Arranca y `GET /health` responde `{"status":"ok"}` (se usó el puerto 8011 para no chocar con el backend local en 8000). |
| `POST /login` con `admin@develop.com.mx` | ✅ Devuelve `access_token`, lo que verifica de punta a punta la conexión a la base y el hash de contraseña. |
| Frontend: `npm install` y `npm run dev` | ✅ Instala 72 paquetes y compila el build de Vite sin errores. |

Notas de esta prueba:
- La calificación con IA no se ejecutó porque el `GEMINI_API_KEY` era de relleno (no una clave real de Gemini); sí se verificó el arranque, la base y todo lo demás.
- Las dos variaciones frente al README (puertos 5433 y 8011) son solo para no interferir con los servicios de desarrollo ya levantados en esta misma máquina.
