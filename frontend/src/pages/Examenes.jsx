import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Examenes() {
  const [examenes, setExamenes] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  const [perfilId, setPerfilId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [tiempoLimite, setTiempoLimite] = useState(60);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const [examenExpandido, setExamenExpandido] = useState(null);
  const [preguntasPorExamen, setPreguntasPorExamen] = useState({});
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState("");

  async function cargarDatos() {
    const [resExamenes, resPerfiles, resPreguntas] = await Promise.all([
      api.get("/examenes"),
      api.get("/perfiles"),
      api.get("/preguntas"),
    ]);
    setExamenes(resExamenes.data);
    setPerfiles(resPerfiles.data);
    setPreguntas(resPreguntas.data);
    setCargandoLista(false);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function nombrePerfil(id) {
    const perfil = perfiles.find((p) => p.id === id);
    return perfil ? perfil.nombre : "—";
  }

  function limpiarFormulario() {
    setPerfilId("");
    setTitulo("");
    setTiempoLimite(60);
    setEditandoId(null);
    setError("");
  }

  function iniciarEdicion(ex) {
    setPerfilId(ex.perfil_id);
    setTitulo(ex.titulo);
    setTiempoLimite(ex.tiempo_limite_min);
    setEditandoId(ex.id);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const payload = {
        perfil_id: Number(perfilId),
        titulo,
        tiempo_limite_min: Number(tiempoLimite),
      };

      if (editandoId) {
        await api.put(`/examenes/${editandoId}`, payload);
      } else {
        await api.post("/examenes", payload);
      }

      limpiarFormulario();
      cargarDatos();
    } catch (err) {
      setError("No se pudo guardar el examen. Verifica los datos.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminarExamen(ex) {
    if (!confirm(`¿Eliminar el examen "${ex.titulo}"? Esta acción no se puede deshacer.`)) return;

    try {
      await api.delete(`/examenes/${ex.id}`);
      cargarDatos();
    } catch (err) {
      alert(err.response?.data?.detail || "No se pudo eliminar el examen.");
    }
  }

  async function abrirExamen(examen) {
    if (examenExpandido === examen.id) {
      setExamenExpandido(null);
      return;
    }
    setExamenExpandido(examen.id);
    setPreguntaSeleccionada("");

    const res = await api.get(`/examenes/${examen.id}/preguntas`);
    setPreguntasPorExamen((prev) => ({ ...prev, [examen.id]: res.data }));
  }

  async function agregarPregunta(examen) {
    if (!preguntaSeleccionada) return;

    await api.post(`/examenes/${examen.id}/preguntas`, {
      pregunta_id: Number(preguntaSeleccionada),
      orden: (preguntasPorExamen[examen.id]?.length || 0) + 1,
    });

    const res = await api.get(`/examenes/${examen.id}/preguntas`);
    setPreguntasPorExamen((prev) => ({ ...prev, [examen.id]: res.data }));
    setPreguntaSeleccionada("");
  }

  async function quitarPregunta(examen, pregunta) {
    if (!confirm(`¿Quitar esta pregunta del examen?`)) return;

    await api.delete(`/examenes/${examen.id}/preguntas/${pregunta.id}`);
    const res = await api.get(`/examenes/${examen.id}/preguntas`);
    setPreguntasPorExamen((prev) => ({ ...prev, [examen.id]: res.data }));
  }

  return (
    <div>
      <h1 style={styles.titulo}>Exámenes</h1>
      <p style={styles.subtitulo}>
        Arma un examen por perfil y asígnale preguntas del banco.
      </p>

      <div className="page-grid">
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>
            {editandoId ? "Editar examen" : "Nuevo examen"}
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
              Título del examen
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                style={styles.input}
                placeholder="Examen Backend Junior Python"
              />
            </label>

            <label style={styles.label}>
              Tiempo límite (minutos)
              <input
                type="number"
                value={tiempoLimite}
                onChange={(e) => setTiempoLimite(e.target.value)}
                style={styles.input}
              />
            </label>

            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.botonesForm}>
              <button type="submit" disabled={cargando} style={styles.boton}>
                {cargando ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear examen"}
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
          <h2 style={styles.cardTitulo}>Exámenes existentes ({examenes.length})</h2>

          {cargandoLista ? (
            <div style={styles.cargandoFila}>
              <div className="spinner"></div>
              <span style={styles.vacio}>Cargando exámenes...</span>
            </div>
          ) : examenes.length === 0 ? (
            <p style={styles.vacio}>Todavía no hay exámenes creados.</p>
          ) : (
            <ul style={styles.lista}>
              {examenes.map((ex) => {
                const preguntasDelPerfil = preguntas.filter((p) => p.perfil_id === ex.perfil_id);
                const preguntasAsignadas = preguntasPorExamen[ex.id] || [];
                const idsAsignadas = preguntasAsignadas.map((p) => p.id);
                const disponibles = preguntasDelPerfil.filter((p) => !idsAsignadas.includes(p.id));

                return (
                  <li key={ex.id} style={styles.item}>
                    <div style={styles.itemHeaderFila}>
                      <button onClick={() => abrirExamen(ex)} style={styles.itemHeaderBoton}>
                        <div>
                          <span style={styles.badge}>{nombrePerfil(ex.perfil_id)}</span>
                          <p style={styles.itemTitulo}>{ex.titulo}</p>
                          <p style={styles.itemMeta}>{ex.tiempo_limite_min} minutos</p>
                        </div>
                        <span>{examenExpandido === ex.id ? "−" : "+"}</span>
                      </button>
                      <div style={styles.itemAcciones}>
                        <button onClick={() => iniciarEdicion(ex)} style={styles.accionBoton}>
                          Editar
                        </button>
                        <button onClick={() => handleEliminarExamen(ex)} style={styles.accionBotonEliminar}>
                          Eliminar
                        </button>
                      </div>
                    </div>

                    {examenExpandido === ex.id && (
                      <div style={styles.panelPreguntas}>
                        <p style={styles.panelSubtitulo}>
                          Preguntas asignadas ({preguntasAsignadas.length})
                        </p>
                        {preguntasAsignadas.length === 0 ? (
                          <p style={styles.vacio}>Sin preguntas todavía.</p>
                        ) : (
                          <ul style={styles.subLista}>
                            {preguntasAsignadas.map((p) => (
                              <li key={p.id} style={styles.subItem}>
                                <span>{p.enunciado}</span>
                                <button
                                  onClick={() => quitarPregunta(ex, p)}
                                  style={styles.quitarBoton}
                                >
                                  Quitar
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div style={styles.agregarFila}>
                          <select
                            value={preguntaSeleccionada}
                            onChange={(e) => setPreguntaSeleccionada(e.target.value)}
                            style={{ ...styles.input, flex: 1 }}
                          >
                            <option value="" disabled>
                              {disponibles.length === 0 ? "No hay más preguntas de este perfil" : "Selecciona una pregunta"}
                            </option>
                            {disponibles.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.enunciado.slice(0, 50)}...
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => agregarPregunta(ex)}
                            disabled={!preguntaSeleccionada}
                            style={styles.botonChico}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
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
  botonChico: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "white",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  vacio: { color: "var(--ink-soft)", fontSize: "14px" },
  cargandoFila: { display: "flex", alignItems: "center", gap: "10px" },
  lista: { listStyle: "none", padding: 0, margin: 0 },
  item: {
    borderBottom: "1px solid var(--border)",
    padding: "16px 0",
  },
  itemHeaderFila: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  itemHeaderBoton: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
  },
  badge: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--accent)",
    background: "#EAF1EE",
    padding: "3px 10px",
    borderRadius: "999px",
  },
  itemTitulo: { fontSize: "15px", fontWeight: 600, margin: "8px 0 2px 0" },
  itemMeta: { fontSize: "13px", color: "var(--ink-soft)", margin: 0 },
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
  panelPreguntas: {
    background: "var(--bg)",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "16px",
  },
  panelSubtitulo: { fontSize: "13px", fontWeight: 600, margin: "0 0 10px 0" },
  subLista: { listStyle: "none", padding: 0, margin: "0 0 14px 0" },
  subItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    fontSize: "13px",
    padding: "8px 0",
    borderBottom: "1px solid var(--border)",
  },
  quitarBoton: {
    background: "none",
    border: "none",
    color: "var(--error)",
    fontSize: "12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  agregarFila: { display: "flex", gap: "8px" },
};