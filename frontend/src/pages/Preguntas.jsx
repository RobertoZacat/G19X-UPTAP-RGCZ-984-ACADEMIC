import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Preguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  const [perfilId, setPerfilId] = useState("");
  const [tipo, setTipo] = useState("abierta");
  const [enunciado, setEnunciado] = useState("");
  const [rubrica, setRubrica] = useState("");
  const [opcionesTexto, setOpcionesTexto] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function cargarDatos() {
    const [resPreguntas, resPerfiles] = await Promise.all([
      api.get("/preguntas"),
      api.get("/perfiles"),
    ]);
    setPreguntas(resPreguntas.data);
    setPerfiles(resPerfiles.data);
    setCargandoLista(false);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function nombrePerfil(perfilId) {
    const perfil = perfiles.find((p) => p.id === perfilId);
    return perfil ? perfil.nombre : "—";
  }

  function limpiarFormulario() {
    setPerfilId("");
    setTipo("abierta");
    setEnunciado("");
    setRubrica("");
    setOpcionesTexto("");
    setEditandoId(null);
    setError("");
  }

  function iniciarEdicion(p) {
    setPerfilId(p.perfil_id);
    setTipo(p.tipo);
    setEnunciado(p.enunciado);
    setRubrica(p.rubrica || "");
    setOpcionesTexto((p.opciones || []).join("\n"));
    setEditandoId(p.id);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const payload = {
        perfil_id: Number(perfilId),
        tipo,
        enunciado,
        rubrica,
        opciones:
          tipo === "opcion_multiple"
            ? opcionesTexto.split("\n").map((o) => o.trim()).filter(Boolean)
            : null,
      };

      if (editandoId) {
        await api.put(`/preguntas/${editandoId}`, payload);
      } else {
        await api.post("/preguntas", payload);
      }

      limpiarFormulario();
      cargarDatos();
    } catch (err) {
      setError("No se pudo guardar la pregunta. Verifica los datos.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(pregunta) {
    if (!confirm("¿Eliminar esta pregunta? Esta acción no se puede deshacer.")) return;

    try {
      await api.delete(`/preguntas/${pregunta.id}`);
      cargarDatos();
    } catch (err) {
      alert(err.response?.data?.detail || "No se pudo eliminar la pregunta.");
    }
  }

  return (
    <div>
      <h1 style={styles.titulo}>Banco de preguntas</h1>
      <p style={styles.subtitulo}>
        Cada pregunta pertenece a un perfil y tiene una rúbrica que la IA usa para calificarla.
      </p>

      <div className="page-grid">
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>
            {editandoId ? "Editar pregunta" : "Nueva pregunta"}
          </h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Perfil
              <select
                value={perfilId}
                onChange={(e) => setPerfilId(e.target.value)}
                required
                style={styles.input}
              >
                <option value="" disabled>Selecciona un perfil</option>
                {perfiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              Tipo de pregunta
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={styles.input}
              >
                <option value="abierta">Abierta / código</option>
                <option value="opcion_multiple">Opción múltiple</option>
              </select>
            </label>

            <label style={styles.label}>
              Enunciado
              <textarea
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                required
                style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
                placeholder="Explica qué es un decorador en Python..."
              />
            </label>

            {tipo === "opcion_multiple" && (
              <label style={styles.label}>
                Opciones (una por línea)
                <textarea
                  value={opcionesTexto}
                  onChange={(e) => setOpcionesTexto(e.target.value)}
                  style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
                  placeholder={"Opción A\nOpción B\nOpción C"}
                />
              </label>
            )}

            <label style={styles.label}>
              Rúbrica de evaluación
              <textarea
                value={rubrica}
                onChange={(e) => setRubrica(e.target.value)}
                style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
                placeholder="Qué debe incluir una buena respuesta..."
              />
            </label>

            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.botonesForm}>
              <button type="submit" disabled={cargando} style={styles.boton}>
                {cargando ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear pregunta"}
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
          <h2 style={styles.cardTitulo}>Preguntas existentes ({preguntas.length})</h2>

          {cargandoLista ? (
            <div style={styles.cargandoFila}>
              <div className="spinner"></div>
              <span style={styles.vacio}>Cargando preguntas...</span>
            </div>
          ) : preguntas.length === 0 ? (
            <p style={styles.vacio}>Todavía no hay preguntas creadas.</p>
          ) : (
            <ul style={styles.lista}>
              {preguntas.map((p) => (
                <li key={p.id} style={styles.item}>
                  <div style={styles.itemHeader}>
                    <span style={styles.badge}>{nombrePerfil(p.perfil_id)}</span>
                    <span style={styles.badgeTipo}>
                      {p.tipo === "opcion_multiple" ? "Opción múltiple" : "Abierta"}
                    </span>
                  </div>
                  <p style={styles.itemEnunciado}>{p.enunciado}</p>
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
    padding: "16px 0",
    borderBottom: "1px solid var(--border)",
  },
  itemHeader: { display: "flex", gap: "8px", marginBottom: "8px" },
  badge: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--accent)",
    background: "#EAF1EE",
    padding: "3px 10px",
    borderRadius: "999px",
  },
  badgeTipo: {
    fontSize: "12px",
    color: "var(--ink-soft)",
    background: "var(--bg)",
    padding: "3px 10px",
    borderRadius: "999px",
  },
  itemEnunciado: { fontSize: "14px", margin: "0 0 10px 0", lineHeight: 1.5 },
  itemAcciones: { display: "flex", gap: "8px" },
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