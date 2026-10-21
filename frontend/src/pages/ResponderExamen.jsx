import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ui } from "../ui/tailwind";

export default function ResponderExamen() {
  const { intentoId } = useParams();
  const navigate = useNavigate();

  const [intento, setIntento] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const resIntento = await api.get(`/intentos/${intentoId}`);
        setIntento(resIntento.data);

        const resPreguntas = await api.get(`/examenes/${resIntento.data.examen_id}/preguntas`);
        setPreguntas(resPreguntas.data);
      } catch (err) {
        setError("No se pudo cargar el examen.");
      } finally {
        setCargandoInicial(false);
      }
    }
    cargar();
  }, [intentoId]);

  function handleCambio(preguntaId, texto) {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: texto }));
  }

  async function handleFinalizar() {
    setError("");

    const faltantes = preguntas.filter((p) => !respuestas[p.id]?.trim());
    if (faltantes.length > 0) {
      setError("Responde todas las preguntas antes de finalizar.");
      return;
    }

    setEnviando(true);
    try {
      for (const pregunta of preguntas) {
        await api.post(`/intentos/${intentoId}/respuestas`, {
          pregunta_id: pregunta.id,
          respuesta_texto: respuestas[pregunta.id],
        });
      }

      await api.post(`/intentos/${intentoId}/calificar`);
      navigate(`/examen/${intentoId}/completado`);
    } catch (err) {
      const estado = err.response?.status;
      const detalle = err.response?.data?.detail;

      if ((estado === 503 || estado === 502) && typeof detalle === "string") {
        setError(`${detalle} Tus respuestas están guardadas: presiona «Finalizar examen» para reintentar.`);
      } else {
        setError("Hubo un problema al enviar tus respuestas. Intenta de nuevo.");
      }
      setEnviando(false);
    }
  }

  if (cargandoInicial) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F7F6F3] px-6"><p className="text-sm text-[#5C5B54]">Cargando examen...</p></div>;
  }

  if (error && preguntas.length === 0) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F7F6F3] px-6"><p className="text-sm text-[#B3492E]">{error}</p></div>;
  }

  if (!cargandoInicial && preguntas.length === 0 && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6F3] px-6 py-10">
        <div className="max-w-[640px]">
          <p className="mb-2 text-[13px] text-[#5C5B54]">Examen no disponible</p>
          <h1 className="mb-1.5 text-[26px] font-semibold text-[#1C1E1B]">Este examen todavía no tiene preguntas</h1>
          <p className="mb-0 text-sm text-[#5C5B54]">
            Contacta al equipo de reclutamiento, parece que el examen aún no está listo para presentarse.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#F7F6F3] px-6 py-10">
      <div className="w-full max-w-[640px]">
        <p className="mb-2 text-[13px] text-[#5C5B54]">Examen en curso</p>
        <h1 className="mb-1.5 text-[26px] font-semibold text-[#1C1E1B]">Responde cada pregunta</h1>
        <p className="mb-7 text-sm text-[#5C5B54]">
          Tienes {preguntas.length} pregunta{preguntas.length !== 1 ? "s" : ""} por responder.
        </p>

        <div className="mb-6 flex flex-col gap-5">
          {preguntas.map((p, i) => {
            const esOpcionMultiple = p.tipo === "opcion_multiple" && p.opciones?.length > 0;

            return (
              <div key={p.id} className="rounded-xl border border-[#DCD9D0] bg-white p-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#2D5F4C]">Pregunta {i + 1}</p>
                <p className="mb-4 text-[15px] leading-6 text-[#1C1E1B]">{p.enunciado}</p>

                {esOpcionMultiple ? (
                  <div
                    className="flex flex-col gap-2.5"
                    role="radiogroup"
                    aria-label={`Opciones de la pregunta ${i + 1}`}
                  >
                    {p.opciones.map((op) => {
                      const seleccionada = respuestas[p.id] === op;
                      return (
                        <label
                          key={op}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                            seleccionada
                              ? "border-[#2D5F4C] bg-[#EAF1EE]"
                              : "border-[#DCD9D0] bg-white hover:bg-[#F7F6F3]"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`pregunta-${p.id}`}
                            value={op}
                            checked={seleccionada}
                            onChange={() => handleCambio(p.id, op)}
                            className="mt-0.5 accent-[#2D5F4C]"
                          />
                          <span className="leading-6 text-[#1C1E1B]">{op}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    value={respuestas[p.id] || ""}
                    onChange={(e) => handleCambio(p.id, e.target.value)}
                    className={`${ui.textarea} min-h-[120px]`}
                    placeholder="Escribe tu respuesta aquí..."
                  />
                )}
              </div>
            );
          })}
        </div>

        {error && <p className="mb-4 text-sm text-[#B3492E]">{error}</p>}

        <button onClick={handleFinalizar} disabled={enviando} className="w-full rounded-lg bg-[#2D5F4C] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#24493C] disabled:cursor-not-allowed disabled:opacity-70">
          {enviando ? "Enviando y calificando..." : "Finalizar examen"}
        </button>
      </div>
    </div>
  );
}