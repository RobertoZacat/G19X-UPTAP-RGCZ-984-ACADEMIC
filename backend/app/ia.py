import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def calificar_respuesta(enunciado: str, rubrica: str, respuesta_candidato: str) -> dict:
    prompt = f"""
Eres un evaluador técnico experto. Vas a calificar la respuesta de un candidato a una pregunta de examen.

PREGUNTA:
{enunciado}

RÚBRICA DE EVALUACIÓN (lo que se espera en una buena respuesta):
{rubrica}

RESPUESTA DEL CANDIDATO:
{respuesta_candidato}

Califica la respuesta del candidato en una escala de 0 a 10, basándote en qué tan bien cumple con la rúbrica.
Da también una retroalimentación breve y constructiva (2-3 líneas).

Responde ÚNICAMENTE con un JSON válido, sin texto adicional, sin markdown, con esta forma exacta:
{{"calificacion": <número del 0 al 10>, "retroalimentacion": "<texto breve>"}}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    texto = response.text.strip()

    # Por si Gemini regresa el JSON envuelto en ```json ... ```
    if texto.startswith("```"):
        texto = texto.strip("`")
        texto = texto.replace("json", "", 1).strip()

    resultado = json.loads(texto)
    return resultado