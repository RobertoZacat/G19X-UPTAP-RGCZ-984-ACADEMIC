import { useEffect, useState } from "react";
import api from "../api/axios";
import { ui } from "../ui/tailwind";
import { useConfirm, useToast } from "../components/Feedback";

function mensajeDeError(err, porDefecto) {
  const detalle = err.response?.data?.detail;
  if (typeof detalle === "string") return detalle;
  if (Array.isArray(detalle) && detalle[0]?.msg) {
    return detalle[0].msg.replace(/^Value error,\s*/, "");
  }
  return porDefecto;
}

export default function Preguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  const confirmar = useConfirm();
  const avisar = useToast();

  const [perfilId, setPerfilId] = useState("");
  const [tipo, setTipo] = useState("abierta");
  const [enunciado, setEnunciado] = useState("");
  const [rubrica, setRubrica] = useState("");
  const [opcionesTexto, setOpcionesTexto] = useState("");
  const [respuestaCorrecta, setRespuestaCorrecta] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const opcionesLista = opcionesTexto.split("\n").map((o) => o.trim()).filter(Boolean);
  const correctaValida = opcionesLista.includes(respuestaCorrecta) ? respuestaCorrecta : "";
  const esOpcionMultiple = tipo === "opcion_multiple";

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
    setRespuestaCorrecta("");
    setEditandoId(null);
    setError("");
  }

  function iniciarEdicion(p) {
    setPerfilId(p.perfil_id);
    setTipo(p.tipo);
    setEnunciado(p.enunciado);
    setRubrica(p.rubrica || "");
    setOpcionesTexto((p.opciones || []).join("\n"));
    setRespuestaCorrecta(p.respuesta_correcta || "");
    setEditandoId(p.id);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (esOpcionMultiple) {
      if (opcionesLista.length < 2) {
        setError("Escribe al menos 2 opciones, una por línea.");
        return;
      }
      if (!correctaValida) {
        setError("Elige cuál es la respuesta correcta.");
        return;
      }
    }

    setCargando(true);

    try {
      const payload = {
        perfil_id: Number(perfilId),
        tipo,
        enunciado,
        rubrica,
        opciones: esOpcionMultiple ? opcionesLista : null,
        respuesta_correcta: esOpcionMultiple ? correctaValida : null,
      };

      if (editandoId) {
        await api.put(`/preguntas/${editandoId}`, payload);
      } else {
        await api.post("/preguntas", payload);
      }

      limpiarFormulario();
      cargarDatos();
    } catch (err) {
      setError(mensajeDeError(err, "No se pudo guardar la pregunta. Verifica los datos."));
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(pregunta) {
    const ok = await confirmar({
      titulo: "Eliminar pregunta",
      mensaje: "¿Eliminar esta pregunta? Esta acción no se puede deshacer.",
      textoConfirmar: "Eliminar",
      peligro: true,
    });
    if (!ok) return;

    try {
      await api.delete(`/preguntas/${pregunta.id}`);
      avisar("Pregunta eliminada correctamente.", "exito");
      cargarDatos();
    } catch (err) {
      avisar(err.response?.data?.detail || "No se pudo eliminar la pregunta.", "error");
    }
  }

  return (
    <div>
      <h1 className={ui.pageTitle}>Banco de preguntas</h1>
      <p className={ui.pageSubtitle}>
        Cada pregunta pertenece a un perfil. Las abiertas se califican con la IA según su rúbrica;
        las de opción múltiple se califican automáticamente con la respuesta correcta que indiques.
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

            {esOpcionMultiple && (
              <>
                <label className={ui.label}>
                  Opciones (una por línea)
                  <textarea
                    value={opcionesTexto}
                    onChange={(e) => setOpcionesTexto(e.target.value)}
                    className={`${ui.textarea} min-h-[80px]`}
                    placeholder={"Opción A\nOpción B\nOpción C"}
                  />
                </label>

                <label className={ui.label}>
                  Respuesta correcta
                  <select
                    value={correctaValida}
                    onChange={(e) => setRespuestaCorrecta(e.target.value)}
                    disabled={opcionesLista.length < 2}
                    className={ui.select}
                  >
                    <option value="">
                      {opcionesLista.length < 2
                        ? "Primero escribe al menos 2 opciones"
                        : "Selecciona la opción correcta"}
                    </option>
                    {opcionesLista.map((op) => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </label>
              </>
            )}

            <label className={ui.label}>
              {esOpcionMultiple ? "Rúbrica o explicación (opcional)" : "Rúbrica de evaluación"}
              <textarea
                value={rubrica}
                onChange={(e) => setRubrica(e.target.value)}
                className={`${ui.textarea} min-h-[80px]`}
                placeholder={
                  esOpcionMultiple
                    ? "Opcional: por qué esa es la respuesta correcta..."
                    : "Qué debe incluir una buena respuesta..."
                }
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
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className={ui.pillAccent}>{nombrePerfil(p.perfil_id)}</span>
                    <span className={ui.pillMuted}>
                      {p.tipo === "opcion_multiple" ? "Opción múltiple" : "Abierta"}
                    </span>
                    {p.tipo === "opcion_multiple" && !p.respuesta_correcta && (
                      <span className="rounded-full bg-[#FBEFD5] px-2.5 py-[3px] text-xs font-semibold text-[#8A6100]">
                        Sin respuesta correcta
                      </span>
                    )}
                  </div>
                  <p className="m-0 mb-2.5 text-sm leading-6 text-[#1C1E1B]">{p.enunciado}</p>

                  {p.tipo === "opcion_multiple" && p.opciones?.length > 0 && (
                    <ul className="m-0 mb-2.5 list-none space-y-1 p-0">
                      {p.opciones.map((op) => {
                        const esCorrecta = op === p.respuesta_correcta;
                        return (
                          <li
                            key={op}
                            className={`text-[13px] ${esCorrecta ? "font-semibold text-[#2D5F4C]" : "text-[#5C5B54]"}`}
                          >
                            {esCorrecta ? "✓ " : "• "}
                            {op}
                          </li>
                        );
                      })}
                    </ul>
                  )}

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