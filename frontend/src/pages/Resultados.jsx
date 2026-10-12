import { useEffect, useState } from "react";
import api from "../api/axios";
import { ui } from "../ui/tailwind";

export default function Resultados() {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);

  async function cargarResultados() {
    setCargando(true);
    const res = await api.get("/resultados");
    setResultados(res.data);
    setCargando(false);
  }

  useEffect(() => {
    cargarResultados();
  }, []);

  function colorCalificacion(nota) {
    if (nota >= 8) return "#2D5F4C";
    if (nota >= 6) return "#A87B1F";
    return "#B3492E";
  }

  return (
    <div>
      <h1 className="mb-1.5 text-[26px] font-semibold text-[#1C1E1B]">Resultados</h1>
      <p className="mb-7 text-sm text-[#5C5B54]">
        Candidatos evaluados y calificados automáticamente por la IA.
      </p>

      {cargando ? (
        <p className="text-sm text-[#5C5B54]">Cargando...</p>
      ) : resultados.length === 0 ? (
        <p className="text-sm text-[#5C5B54]">Todavía no hay candidatos calificados.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {resultados.map((r) => (
            <div key={r.intento_id} className="rounded-xl border border-[#DCD9D0] bg-white p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-base font-semibold text-[#1C1E1B]">{r.candidato_nombre}</p>
                  <p className="m-0 mt-0.5 text-[13px] text-[#5C5B54]">{r.candidato_email}</p>
                </div>
                <div className="rounded-full border px-3.5 py-1.5 text-[15px] font-bold whitespace-nowrap" style={{ color: colorCalificacion(r.calificacion_total), borderColor: colorCalificacion(r.calificacion_total) }}>
                  {r.calificacion_total.toFixed(1)} / 10
                </div>
              </div>

              <p className="mb-4 text-sm text-[#5C5B54]">{r.examen_titulo}</p>

              <div className="rounded-lg bg-[#F7F6F3] px-4 py-3.5">
                <p className="mb-1.5 text-xs font-semibold text-[#2D5F4C]">Retroalimentación de la IA</p>
                <p className="m-0 whitespace-pre-line text-sm leading-6 text-[#1C1E1B]">{r.retroalimentacion_ia}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}