import { useEffect, useState } from "react";
import api from "../api/axios";
import { ui } from "../ui/tailwind";
import { useConfirm, useToast } from "../components/Feedback";

export default function Examenes() {
  const [examenes, setExamenes] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  const confirmar = useConfirm();
  const avisar = useToast();

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
    const ok = await confirmar({
      titulo: "Eliminar examen",
      mensaje: `¿Eliminar el examen "${ex.titulo}"? Esta acción no se puede deshacer.`,
      textoConfirmar: "Eliminar",
      peligro: true,
    });
    if (!ok) return;

    try {
      await api.delete(`/examenes/${ex.id}`);
      avisar("Examen eliminado correctamente.", "exito");
      cargarDatos();
    } catch (err) {
      avisar(err.response?.data?.detail || "No se pudo eliminar el examen.", "error");
    }
  }

  async function quitarPregunta(examen, pregunta) {
    const ok = await confirmar({
      titulo: "Quitar pregunta",
      mensaje: "¿Quitar esta pregunta del examen? Seguirá en el banco de preguntas; solo se desvincula de este examen.",
      textoConfirmar: "Quitar",
      peligro: true,
    });
    if (!ok) return;

    try {
      await api.delete(`/examenes/${examen.id}/preguntas/${pregunta.id}`);
      const res = await api.get(`/examenes/${examen.id}/preguntas`);
      setPreguntasPorExamen((prev) => ({ ...prev, [examen.id]: res.data }));
    } catch (err) {
      avisar(err.response?.data?.detail || "No se pudo quitar la pregunta.", "error");
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
      <h1 className={ui.pageTitle}>Exámenes</h1>
      <p className={ui.pageSubtitle}>Arma un examen por perfil y asígnale preguntas del banco.</p>

      <div className={ui.grid}>
        <div className={ui.card}>
          <h2 className={ui.cardTitle}>{editandoId ? "Editar examen" : "Nuevo examen"}</h2>
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
              Título del examen
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className={ui.input}
                placeholder="Examen Backend Junior Python"
              />
            </label>

            <label className={ui.label}>
              Tiempo límite (minutos)
              <input
                type="number"
                value={tiempoLimite}
                onChange={(e) => setTiempoLimite(e.target.value)}
                className={ui.input}
              />
            </label>

            {error && <p className="m-0 text-sm text-[#B3492E]">{error}</p>}
            <div className="flex gap-2.5">
              <button type="submit" disabled={cargando} className="flex-1 rounded-lg bg-[#2D5F4C] px-4 py-[11px] text-sm font-semibold text-white transition hover:bg-[#24493C] disabled:cursor-not-allowed disabled:opacity-70">
                {cargando ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear examen"}
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
          <h2 className={ui.cardTitle}>Exámenes existentes ({examenes.length})</h2>

          {cargandoLista ? (
            <div className={ui.loadingRow}>
              <div className={ui.spinner} />
              <span className={ui.emptyText}>Cargando exámenes...</span>
            </div>
          ) : examenes.length === 0 ? (
            <p className={ui.emptyText}>Todavía no hay exámenes creados.</p>
          ) : (
            <ul className="list-none p-0 m-0 space-y-4">
              {examenes.map((ex) => {
                const preguntasDelPerfil = preguntas.filter((p) => p.perfil_id === ex.perfil_id);
                const preguntasAsignadas = preguntasPorExamen[ex.id] || [];
                const idsAsignadas = preguntasAsignadas.map((p) => p.id);
                const disponibles = preguntasDelPerfil.filter((p) => !idsAsignadas.includes(p.id));

                return (
                  <li key={ex.id} className="rounded-xl border border-[#DCD9D0] bg-white p-0">
                    <div className="flex items-start justify-between gap-3 p-4">
                      <button type="button" onClick={() => abrirExamen(ex)} className="flex flex-1 items-start justify-between gap-3 bg-transparent p-0 text-left font-inherit">
                        <div>
                          <span className={ui.pillAccent}>{nombrePerfil(ex.perfil_id)}</span>
                          <p className="mt-2 mb-0.5 text-[15px] font-semibold text-[#1C1E1B]">{ex.titulo}</p>
                          <p className="m-0 text-[13px] text-[#5C5B54]">{ex.tiempo_limite_min} minutos</p>
                        </div>
                        <span className="pt-1 text-xl leading-none text-[#5C5B54]">{examenExpandido === ex.id ? "−" : "+"}</span>
                      </button>
                      <div className="flex shrink-0 gap-2">
                        <button type="button" onClick={() => iniciarEdicion(ex)} className={ui.ghostButton}>
                          Editar
                        </button>
                        <button type="button" onClick={() => handleEliminarExamen(ex)} className={ui.dangerButton}>
                          Eliminar
                        </button>
                      </div>
                    </div>

                    {examenExpandido === ex.id && (
                      <div className="border-t border-[#DCD9D0] bg-[#F7F6F3] px-4 py-4">
                        <p className="mb-2 text-sm font-semibold text-[#1C1E1B]">Preguntas asignadas ({preguntasAsignadas.length})</p>
                        {preguntasAsignadas.length === 0 ? (
                          <p className={ui.emptyText}>Sin preguntas todavía.</p>
                        ) : (
                          <ul className="mb-3 list-none p-0 m-0">
                            {preguntasAsignadas.map((p) => (
                              <li key={p.id} className="flex items-center justify-between gap-3 border-b border-[#DCD9D0] py-2 text-sm last:border-b-0">
                                <span className="text-[#1C1E1B]">{p.enunciado}</span>
                                <button type="button" onClick={() => quitarPregunta(ex, p)} className="text-xs font-medium text-[#B3492E] transition hover:text-[#8F341E]">
                                  Quitar
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex gap-2">
                          <select
                            value={preguntaSeleccionada}
                            onChange={(e) => setPreguntaSeleccionada(e.target.value)}
                            className={`${ui.select} flex-1`}
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
                            type="button"
                            onClick={() => agregarPregunta(ex)}
                            disabled={!preguntaSeleccionada}
                            className="rounded-lg bg-[#2D5F4C] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#24493C] disabled:cursor-not-allowed disabled:opacity-70"
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