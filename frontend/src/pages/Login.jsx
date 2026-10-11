import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ui } from "../ui/tailwind";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const response = await api.post("/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      login(response.data.access_token);
      navigate("/perfiles");
    } catch (err) {
      setError("Email o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="hidden flex-1 items-center justify-center bg-[linear-gradient(160deg,#2D5F4C_0%,#1C3A2F_100%)] p-12 text-white lg:flex">
        <div className="max-w-[380px]">
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-base font-bold tracking-[0.5px] text-white">
            ET
          </div>
          <h2 className="mb-4 text-[28px] font-semibold leading-[1.3] text-white">Sistema de Evaluación Técnica</h2>
          <p className="m-0 text-[15px] leading-6 text-white/70">
            Gestiona perfiles, bancos de preguntas y exámenes calificados automáticamente con IA.
          </p>

          <div className="my-8 h-[3px] w-12 rounded-full bg-white/30" />

          <div className="flex gap-8">
            <div>
              <p className="m-0 mb-1 text-[22px] font-bold text-white">IA</p>
              <p className="m-0 text-[13px] text-white/60">Calificación automática</p>
            </div>
            <div>
              <p className="m-0 mb-1 text-[22px] font-bold text-white">24/7</p>
              <p className="m-0 text-[13px] text-white/60">Disponible para candidatos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#F7F6F3] p-6">
        <div className="w-full max-w-[360px]">
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.5px] text-[#2D5F4C]">Bienvenido de nuevo</p>
          <h1 className="mb-8 text-[30px] font-bold text-[#1C1E1B]">Inicia sesión</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#5C5B54]">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={ui.input}
                placeholder="tu@correo.com"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#5C5B54]">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={ui.input}
                placeholder="••••••••"
              />
            </label>

            {error && <p className="m-0 rounded-lg bg-[#FBEAE5] px-3.5 py-2.5 text-sm text-[#B3492E]">{error}</p>}

            <button type="submit" disabled={cargando} className={ui.primaryButton}>
              {cargando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-[#5C5B54]">
            ¿Vienes a presentar un examen?{" "}
            <Link to="/presentar" className="font-semibold text-[#2D5F4C] no-underline">
              Entra aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}