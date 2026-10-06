import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("evaluador");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  async function cargarUsuarios() {
    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } finally {
      setCargandoLista(false);
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setExito("");
    setCargando(true);

    try {
      await api.post("/registro", { nombre, email, password, rol });
      setNombre("");
      setEmail("");
      setPassword("");
      setRol("evaluador");
      setExito("Usuario creado correctamente.");
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo crear el usuario.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <h1 style={styles.titulo}>Usuarios del sistema</h1>
      <p style={styles.subtitulo}>
        Administradores y evaluadores que pueden acceder al panel.
      </p>

      <div className="page-grid">
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Nuevo usuario</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Nombre
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
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
              />
            </label>
            <label style={styles.label}>
              Rol
              <select value={rol} onChange={(e) => setRol(e.target.value)} style={styles.input}>
                <option value="evaluador">Evaluador</option>
                <option value="admin">Administrador</option>
              </select>
            </label>

            {error && <p style={styles.error}>{error}</p>}
            {exito && <p style={styles.exito}>{exito}</p>}

            <button type="submit" disabled={cargando} style={styles.boton}>
              {cargando ? "Creando..." : "Crear usuario"}
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Usuarios existentes ({usuarios.length})</h2>

          {cargandoLista ? (
            <div style={styles.cargandoFila}>
              <div className="spinner"></div>
              <span style={styles.vacio}>Cargando usuarios...</span>
            </div>
          ) : (
            <ul style={styles.lista}>
              {usuarios.map((u) => (
                <li key={u.id} style={styles.item}>
                  <div>
                    <span style={styles.itemNombre}>{u.nombre}</span>
                    <p style={styles.itemEmail}>{u.email}</p>
                  </div>
                  <span style={u.rol === "admin" ? styles.badgeAdmin : styles.badgeEvaluador}>
                    {u.rol}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  titulo: { fontSize: "26px", fontWeight: 600, margin: "0 0 6px 0" },
  subtitulo: { color: "var(--ink-soft)", fontSize: "14px", margin: "0 0 28px 0" },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "24px",
  },
  cardTitulo: { fontSize: "16px", fontWeight: 600, margin: "0 0 18px 0" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "13px",
    color: "var(--ink-soft)",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  error: { color: "var(--error)", fontSize: "13px", margin: 0 },
  exito: { color: "var(--accent)", fontSize: "13px", margin: 0 },
  boton: {
    padding: "11px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "white",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
  vacio: { color: "var(--ink-soft)", fontSize: "14px" },
  cargandoFila: { display: "flex", alignItems: "center", gap: "10px" },
  lista: { listStyle: "none", padding: 0, margin: 0 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid var(--border)",
  },
  itemNombre: { fontWeight: 600, fontSize: "15px" },
  itemEmail: { color: "var(--ink-soft)", fontSize: "13px", margin: "2px 0 0 0" },
  badgeAdmin: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--accent)",
    background: "#EAF1EE",
    padding: "4px 12px",
    borderRadius: "999px",
  },
  badgeEvaluador: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--ink-soft)",
    background: "var(--bg)",
    padding: "4px 12px",
    borderRadius: "999px",
  },
};