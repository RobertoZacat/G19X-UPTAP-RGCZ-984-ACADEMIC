import { useEffect, useState } from "react";
import api from "../api/axios";
import { ui } from "../ui/tailwind";

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
      <h1 className={ui.pageTitle}>Banco de preguntas</h1>
      <p className={ui.pageSubtitle}>
        Cada pregunta pertenece a un perfil y tiene una rúbrica que la IA usa para calificarla.
      </p>

      <div className={ui.grid}>
        <div className={ui.card}>
          <h2 className={ui.cardTitle}>
            {editandoId ? "Editar pregunta" : "Nueva pregunta"}
          </h2>
          <form onSubmit={handleSubmit} className={ui.form}>
            <label className={ui.label}>
              Perfil
              <select
                value={perfilId}
                onChange={(e) => setPerfilId(e.target.value)}
                required
                className={ui.select}
              >
                <option value="" disabled>Selecciona un perfil</option>
                {perfiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </label>

            <label className={ui.label}>
              Tipo de pregunta
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className={ui.select}
              >
                <option value="abierta">Abierta / código</option>
                <option value="opcion_multiple">Opción múltiple</option>
              </select>
            </label>

            <label className={ui.label}>
              Enunciado
              <textarea
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                required
                className={`${ui.textarea} min-h-[80px]`}
                placeholder="Explica qué es un decorador en Python..."
              />
            </label>

            {tipo === "opcion_multiple" && (
              <label className={ui.label}>
                Opciones (una por línea)
                <textarea
                  value={opcionesTexto}
                  onChange={(e) => setOpcionesTexto(e.target.value)}
                  className={`${ui.textarea} min-h-[80px]`}
                  placeholder={"Opción A\nOpción B\nOpción C"}
                />
              </label>
            )}

            <label className={ui.label}>
              Rúbrica de evaluación
              <textarea
                value={rubrica}
                onChange={(e) => setRubrica(e.target.value)}
                className={`${ui.textarea} min-h-[80px]`}
                placeholder="Qué debe incluir una buena respuesta..."
              />
            </label>

            {error && <p className="m-0 text-sm text-[#B3492E]">{error}</p>}
            <div className="flex gap-2.5">
              <button type="submit" disabled={cargando} className="flex-1 rounded-lg bg-[#2D5F4C] px-4 py-[11px] text-sm font-semibold text-white transition hover:bg-[#24493C] disabled:cursor-not-allowed disabled:opacity-70">
                {cargando ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear pregunta"}
              </button>
              {editandoId && (
                <button type="button" onClick={limpiarFormulario} className={ui.secondaryButton}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className={ui.card}>
          <h2 className={ui.cardTitle}>Preguntas existentes ({preguntas.length})</h2>

          {cargandoLista ? (
            <div className={ui.loadingRow}>
              <div className={ui.spinner} />
              <span className={ui.emptyText}>Cargando preguntas...</span>
            </div>
          ) : preguntas.length === 0 ? (
            <p className={ui.emptyText}>Todavía no hay preguntas creadas.</p>
          ) : (
            <ul className="list-none p-0 m-0">
              {preguntas.map((p) => (
                <li key={p.id} className="border-b border-[#DCD9D0] py-4 last:border-b-0">
                  <div className="mb-2 flex gap-2">
                    <span className={ui.pillAccent}>{nombrePerfil(p.perfil_id)}</span>
                    <span className={ui.pillMuted}>
                      {p.tipo === "opcion_multiple" ? "Opción múltiple" : "Abierta"}
                    </span>
                  </div>
                  <p className="m-0 mb-2.5 text-sm leading-6 text-[#1C1E1B]">{p.enunciado}</p>
                  <div className="flex gap-2">
                    <button onClick={() => iniciarEdicion(p)} className={ui.ghostButton}>
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(p)} className={ui.dangerButton}>
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