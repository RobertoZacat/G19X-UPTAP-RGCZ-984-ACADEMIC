import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Perfiles() {
  const [perfiles, setPerfiles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoLista, setCargandoLista] = useState(true);

  async function cargarPerfiles() {
    const res = await api.get("/perfiles");
    setPerfiles(res.data);
    setCargandoLista(false);
  }

  useEffect(() => {
    cargarPerfiles();
  }, []);

  function limpiarFormulario() {
    setNombre("");
    setDescripcion("");
    setEditandoId(null);
    setError("");
  }

  function iniciarEdicion(perfil) {
    setNombre(perfil.nombre);
    setDescripcion(perfil.descripcion || "");
    setEditandoId(perfil.id);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      if (editandoId) {
        await api.put(`/perfiles/${editandoId}`, { nombre, descripcion });
      } else {
        await api.post("/perfiles", { nombre, descripcion });
      }
      limpiarFormulario();
      cargarPerfiles();
    } catch (err) {
      setError("No se pudo guardar el perfil. Verifica los datos.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(perfil) {
    if (!confirm(`¿Eliminar el perfil "${perfil.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await api.delete(`/perfiles/${perfil.id}`);
      cargarPerfiles();
    } catch (err) {
      alert(err.response?.data?.detail || "No se pudo eliminar el perfil.");
    }
  }

  return (
    <div>
      <h1 style={styles.titulo}>Perfiles profesionales</h1>
      <p style={styles.subtitulo}>
        Los perfiles agrupan preguntas y exámenes por área (ej. Backend Junior, Frontend con React).
      </p>

      <div className="page-grid">
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>
            {editandoId ? "Editar perfil" : "Nuevo perfil"}
          </h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Nombre
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={styles.input}
                placeholder="Backend Junior Python"
              />
            </label>
            <label style={styles.label}>
              Descripción
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
                placeholder="Evaluación para desarrolladores backend junior"
              />
            </label>
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.botonesForm}>
              <button type="submit" disabled={cargando} style={styles.boton}>
                {cargando ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear perfil"}
              </button>
              {editandoId && (
                <button type="button" onClick={limpiarFormulario} style={styles.botonSecundario}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Perfiles existentes ({perfiles.length})</h2>

          {cargandoLista ? (
            <div style={styles.cargandoFila}>
              <div className="spinner"></div>
              <span style={styles.vacio}>Cargando perfiles...</span>
            </div>
          ) : perfiles.length === 0 ? (
            <p style={styles.vacio}>Todavía no hay perfiles creados.</p>
          ) : (
            <ul style={styles.lista}>
              {perfiles.map((p) => (
                <li key={p.id} style={styles.item}>
                  <div style={styles.itemContenido}>
                    <span style={styles.itemNombre}>{p.nombre}</span>
                    {p.descripcion && <p style={styles.itemDesc}>{p.descripcion}</p>}
                  </div>
                  <div style={styles.itemAcciones}>
                    <button onClick={() => iniciarEdicion(p)} style={styles.accionBoton}>
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(p)} style={styles.accionBotonEliminar}>
                      Eliminar
                    </button>
                  </div>
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
  botonesForm: { display: "flex", gap: "10px" },
  boton: {
    flex: 1,
    padding: "11px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "white",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
  botonSecundario: {
    padding: "11px 16px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "none",
    color: "var(--ink-soft)",
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
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 0",
    borderBottom: "1px solid var(--border)",
  },
  itemContenido: { flex: 1 },
  itemNombre: { fontWeight: 600, fontSize: "15px" },
  itemDesc: { color: "var(--ink-soft)", fontSize: "13px", margin: "4px 0 0 0" },
  itemAcciones: { display: "flex", gap: "8px", flexShrink: 0 },
  accionBoton: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "none",
    color: "var(--ink)",
    fontSize: "12px",
    cursor: "pointer",
  },
  accionBotonEliminar: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid var(--error)",
    background: "none",
    color: "var(--error)",
    fontSize: "12px",
    cursor: "pointer",
  },
};