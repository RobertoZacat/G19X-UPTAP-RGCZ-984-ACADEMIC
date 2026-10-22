import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ui } from "../ui/tailwind";

export default function PresentarExamen() {
  const [examenes, setExamenes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [examenId, setExamenId] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/examenes").then((res) => setExamenes(res.data));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const resCandidato = await api.post("/candidatos/acceso", { nombre, email });
      const candidatoId = resCandidato.data.id;

      const resIntento = await api.post("/intentos", {
        candidato_id: candidatoId,
        examen_id: Number(examenId),
      });

      navigate(`/examen/${resIntento.data.id}?token=${resIntento.data.token}`);
    } catch (err) {
      setError("No se pudo iniciar el examen. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F3] p-6">
      <div className="w-full max-w-[420px] rounded-xl border border-[#DCD9D0] bg-white p-10">
        <p className="mb-2 text-[13px] text-[#5C5B54]">Sistema de Evaluación Técnica</p>
        <h1 className="mb-7 text-[26px] font-semibold text-[#1C1E1B]">Presenta tu examen</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
          <label className="flex flex-col gap-1.5 text-sm text-[#5C5B54]">
            Nombre completo
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className={ui.input}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-[#5C5B54]">
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={ui.input}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-[#5C5B54]">
            Examen a presentar
            <select
              value={examenId}
              onChange={(e) => setExamenId(e.target.value)}
              required
              className={ui.select}
            >
              <option value="" disabled>Selecciona un examen</option>
              {examenes.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.titulo}</option>
              ))}
            </select>
          </label>

          {error && <p className="m-0 text-sm text-[#B3492E]">{error}</p>}

          <button type="submit" disabled={cargando} className={ui.primaryButton}>
            {cargando ? "Iniciando..." : "Comenzar examen"}
          </button>
        </form>
      </div>
    </div>
  );
}