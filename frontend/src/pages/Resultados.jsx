import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Resultados() {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);

  async function cargarResultados() {
    setCargando(true);
    const res = await api.get("/resultados");
    setResultados(res.data);
    setCargando(false);
  }

  useEffect(() => {
    cargarResultados();
  }, []);

  function colorCalificacion(nota) {
    if (nota >= 8) return "#2D5F4C";
    if (nota >= 6) return "#A87B1F";
    return "#B3492E";
  }

  return (
    <div>
      <h1 style={styles.titulo}>Resultados</h1>
      <p style={styles.subtitulo}>
        Candidatos evaluados y calificados automáticamente por la IA.
      </p>

      {cargando ? (
        <p style={styles.vacio}>Cargando...</p>
      ) : resultados.length === 0 ? (
        <p style={styles.vacio}>Todavía no hay candidatos calificados.</p>
      ) : (
        <div style={styles.lista}>
          {resultados.map((r) => (
            <div key={r.intento_id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.nombre}>{r.candidato_nombre}</p>
                  <p style={styles.email}>{r.candidato_email}</p>
                </div>
                <div
                  style={{
                    ...styles.calificacion,
                    color: colorCalificacion(r.calificacion_total),
                    borderColor: colorCalificacion(r.calificacion_total),
                  }}
                >
                  {r.calificacion_total.toFixed(1)} / 10
                </div>
              </div>

              <p style={styles.examen}>{r.examen_titulo}</p>

              <div style={styles.retroBox}>
                <p style={styles.retroLabel}>Retroalimentación de la IA</p>
                <p style={styles.retroTexto}>{r.retroalimentacion_ia}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  titulo: { fontSize: "26px", fontWeight: 600, margin: "0 0 6px 0" },
  subtitulo: { color: "var(--ink-soft)", fontSize: "14px", margin: "0 0 28px 0" },
  vacio: { color: "var(--ink-soft)", fontSize: "14px" },
  lista: { display: "flex", flexDirection: "column", gap: "16px" },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "24px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  nombre: { fontSize: "16px", fontWeight: 600, margin: 0 },
  email: { fontSize: "13px", color: "var(--ink-soft)", margin: "2px 0 0 0" },
  calificacion: {
    fontSize: "15px",
    fontWeight: 700,
    border: "1.5px solid",
    borderRadius: "999px",
    padding: "6px 14px",
    whiteSpace: "nowrap",
  },
  examen: {
    fontSize: "14px",
    color: "var(--ink-soft)",
    margin: "0 0 16px 0",
  },
  retroBox: {
    background: "var(--bg)",
    borderRadius: "8px",
    padding: "14px 16px",
  },
  retroLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--accent)",
    margin: "0 0 6px 0",
  },
  retroTexto: {
    fontSize: "14px",
    lineHeight: 1.5,
    margin: 0,
    whiteSpace: "pre-line",
  },
};