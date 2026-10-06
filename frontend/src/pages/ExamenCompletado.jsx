export default function ExamenCompletado() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.icono}>✓</div>
        <h1 style={styles.titulo}>¡Examen enviado!</h1>
        <p style={styles.texto}>
          Tus respuestas fueron registradas y calificadas correctamente.
          El equipo de reclutamiento revisará tus resultados y se pondrá en contacto contigo.
        </p>
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
    padding: "48px 40px",
    textAlign: "center",
    maxWidth: "420px",
  },
  icono: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "var(--accent)",
    color: "white",
    fontSize: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px auto",
  },
  titulo: { fontSize: "24px", fontWeight: 600, margin: "0 0 12px 0" },
  texto: { color: "var(--ink-soft)", fontSize: "14px", lineHeight: 1.6, margin: 0 },
};