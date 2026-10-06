import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const response = await api.post("/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      login(response.data.access_token);
      navigate("/perfiles");
    } catch (err) {
      setError("Email o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div className="login-panel-marca" style={styles.panelMarca}>
        <div style={styles.marcaContenido}>
          <div style={styles.logo}>ET</div>
          <h2 style={styles.marcaTitulo}>Sistema de Evaluación Técnica</h2>
          <p style={styles.marcaTexto}>
            Gestiona perfiles, bancos de preguntas y exámenes calificados automáticamente con IA.
          </p>

          <div style={styles.lineaDecorativa}></div>

          <div style={styles.statsFila}>
            <div>
              <p style={styles.statNumero}>IA</p>
              <p style={styles.statLabel}>Calificación automática</p>
            </div>
            <div>
              <p style={styles.statNumero}>24/7</p>
              <p style={styles.statLabel}>Disponible para candidatos</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.panelForm}>
        <div style={styles.card}>
          <p style={styles.eyebrow}>Bienvenido de nuevo</p>
          <h1 style={styles.titulo}>Inicia sesión</h1>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="tu@correo.com"
              />
            </label>

            <label style={styles.label}>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="••••••••"
              />
            </label>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" disabled={cargando} style={styles.boton}>
              {cargando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p style={styles.linkCandidato}>
            ¿Vienes a presentar un examen?{" "}
            <Link to="/presentar" style={styles.link}>
              Entra aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
  },
  panelMarca: {
    flex: 1,
    background: "linear-gradient(160deg, #2D5F4C 0%, #1C3A2F 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
  },
  marcaContenido: {
    maxWidth: "380px",
  },
  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "16px",
    marginBottom: "28px",
    letterSpacing: "0.5px",
  },
  marcaTitulo: {
    color: "white",
    fontSize: "28px",
    fontWeight: 600,
    lineHeight: 1.3,
    margin: "0 0 16px 0",
  },
  marcaTexto: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "15px",
    lineHeight: 1.6,
    margin: 0,
  },
  lineaDecorativa: {
    width: "48px",
    height: "3px",
    background: "rgba(255,255,255,0.3)",
    borderRadius: "999px",
    margin: "32px 0",
  },
  statsFila: {
    display: "flex",
    gap: "32px",
  },
  statNumero: {
    color: "white",
    fontSize: "22px",
    fontWeight: 700,
    margin: "0 0 4px 0",
  },
  statLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "13px",
    margin: 0,
  },
  panelForm: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "var(--bg)",
  },
  card: {
    width: "100%",
    maxWidth: "360px",
  },
  eyebrow: {
    color: "var(--accent)",
    fontSize: "13px",
    fontWeight: 600,
    margin: "0 0 8px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  titulo: {
    fontSize: "30px",
    fontWeight: 700,
    margin: "0 0 32px 0",
    color: "var(--ink)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--ink-soft)",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    fontSize: "15px",
    fontFamily: "inherit",
    background: "var(--surface)",
  },
  error: {
    color: "var(--error)",
    fontSize: "14px",
    margin: 0,
    background: "#FBEAE5",
    padding: "10px 14px",
    borderRadius: "8px",
  },
  boton: {
    marginTop: "8px",
    padding: "13px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
  linkCandidato: {
    marginTop: "24px",
    fontSize: "13px",
    color: "var(--ink-soft)",
    textAlign: "center",
  },
  link: {
    color: "var(--accent)",
    fontWeight: 600,
    textDecoration: "none",
  },
};