"""Calificación automática de preguntas de opción múltiple (sin IA)."""


def _normalizar(texto: str) -> str:
    return (texto or "").strip().casefold()


def calificar_opcion_multiple(correcta: str, elegida: str) -> dict:
    """Compara la opción elegida con la correcta. Devuelve 10 si acierta y 0 si no."""
    if _normalizar(elegida) == _normalizar(correcta):
        return {"calificacion": 10.0, "retroalimentacion": "Respuesta correcta."}

    return {
        "calificacion": 0.0,
        "retroalimentacion": (
            f"Respuesta incorrecta. Eligió: «{(elegida or '').strip()}». "
            f"La correcta era: «{(correcta or '').strip()}»."
        ),
    }