import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PresentarExamen() {
  const [examenes, setExamenes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [examenId, setExamenId] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/examenes").then((res) => setExamenes(res.data));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const resCandidato = await api.post("/candidatos/acceso", { nombre, email });
      const candidatoId = resCandidato.data.id;

      const resIntento = await api.post("/intentos", {
        candidato_id: candidatoId,
        examen_id: Number(examenId),
      });

      navigate(`/examen/${resIntento.data.id}`);
    } catch (err) {
      setError("No se pudo iniciar el examen. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>Sistema de Evaluación Técnica</p>
        <h1 style={styles.titulo}>Presenta tu examen</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Nombre completo
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Examen a presentar
            <select
              value={examenId}
              onChange={(e) => setExamenId(e.target.value)}
              required
              style={styles.input}
            >
              <option value="" disabled>Selecciona un examen</option>
              {examenes.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.titulo}</option>
              ))}
            </select>
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={cargando} style={styles.boton}>
            {cargando ? "Iniciando..." : "Comenzar examen"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
  },
  eyebrow: { color: "var(--ink-soft)", fontSize: "13px", margin: "0 0 8px 0" },
  titulo: { fontSize: "26px", fontWeight: 600, margin: "0 0 28px 0" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "14px",
    color: "var(--ink-soft)",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    fontSize: "15px",
    fontFamily: "inherit",
  },
  error: { color: "var(--error)", fontSize: "14px", margin: 0 },
  boton: {
    marginTop: "8px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
};