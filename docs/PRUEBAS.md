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

---

## 3. Notas

- Las pruebas se realizaron de forma manual, sin suite automatizada (pytest/Playwright quedan pendientes, ver `docs/PRD.md` §4.22).
- Para forzar fallas de la IA se desconfiguró `GEMINI_API_KEY` o se usó un modelo inexistente, y luego se restauró para reintentar.
- Los commits referidos corresponden a la rama en la que se aplicó cada corrección.
