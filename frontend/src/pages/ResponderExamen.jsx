import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ResponderExamen() {
  const { intentoId } = useParams();
  const navigate = useNavigate();

  const [intento, setIntento] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const resIntento = await api.get(`/intentos/${intentoId}`);
        setIntento(resIntento.data);

        const resPreguntas = await api.get(`/examenes/${resIntento.data.examen_id}/preguntas`);
        setPreguntas(resPreguntas.data);
      } catch (err) {
        setError("No se pudo cargar el examen.");
      } finally {
        setCargandoInicial(false);
      }
    }
    cargar();
  }, [intentoId]);

  function handleCambio(preguntaId, texto) {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: texto }));
  }

  async function handleFinalizar() {
    setError("");

    const faltantes = preguntas.filter((p) => !respuestas[p.id]?.trim());
    if (faltantes.length > 0) {
      setError("Responde todas las preguntas antes de finalizar.");
      return;
    }

    setEnviando(true);
    try {
      for (const pregunta of preguntas) {
        await api.post(`/intentos/${intentoId}/respuestas`, {
          pregunta_id: pregunta.id,
          respuesta_texto: respuestas[pregunta.id],
        });
      }

      await api.post(`/intentos/${intentoId}/calificar`);
      navigate(`/examen/${intentoId}/completado`);
    } catch (err) {
      setError("Hubo un problema al enviar tus respuestas. Intenta de nuevo.");
      setEnviando(false);
    }
  }

  if (cargandoInicial) {
    return <div style={styles.wrapper}><p>Cargando examen...</p></div>;
  }

  if (error && preguntas.length === 0) {
    return <div style={styles.wrapper}><p style={styles.error}>{error}</p></div>;
  }

  if (!cargandoInicial && preguntas.length === 0 && !error) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.contenedor}>
          <p style={styles.eyebrow}>Examen no disponible</p>
          <h1 style={styles.titulo}>Este examen todavía no tiene preguntas</h1>
          <p style={styles.subtitulo}>
            Contacta al equipo de reclutamiento, parece que el examen aún no está listo para presentarse.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.contenedor}>
        <p style={styles.eyebrow}>Examen en curso</p>
        <h1 style={styles.titulo}>Responde cada pregunta</h1>
        <p style={styles.subtitulo}>
          Tienes {preguntas.length} pregunta{preguntas.length !== 1 ? "s" : ""} por responder.
        </p>

        <div style={styles.lista}>
          {preguntas.map((p, i) => (
            <div key={p.id} style={styles.card}>
              <p style={styles.numero}>Pregunta {i + 1}</p>
              <p style={styles.enunciado}>{p.enunciado}</p>
              <textarea
                value={respuestas[p.id] || ""}
                onChange={(e) => handleCambio(p.id, e.target.value)}
                style={styles.textarea}
                placeholder="Escribe tu respuesta aquí..."
              />
            </div>
          ))}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handleFinalizar} disabled={enviando} style={styles.boton}>
          {enviando ? "Enviando y calificando..." : "Finalizar examen"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    padding: "40px 24px",
    display: "flex",
    justifyContent: "center",
  },
  contenedor: { width: "100%", maxWidth: "640px" },
  eyebrow: { color: "var(--ink-soft)", fontSize: "13px", margin: "0 0 8px 0" },
  titulo: { fontSize: "26px", fontWeight: 600, margin: "0 0 6px 0" },
  subtitulo: { color: "var(--ink-soft)", fontSize: "14px", margin: "0 0 28px 0" },
  lista: { display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "24px",
  },
  numero: {
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--accent)",
    textTransform: "uppercase",
    margin: "0 0 8px 0",
  },
  enunciado: { fontSize: "15px", lineHeight: 1.5, margin: "0 0 16px 0" },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
  },
  error: { color: "var(--error)", fontSize: "14px", marginBottom: "16px" },
  boton: {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
};