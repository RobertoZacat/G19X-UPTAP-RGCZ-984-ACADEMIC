import { useEffect, useState } from "react";
import api from "../api/axios";
import { ui } from "../ui/tailwind";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("evaluador");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  async function cargarUsuarios() {
    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } finally {
      setCargandoLista(false);
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setExito("");
    setCargando(true);

    try {
      await api.post("/registro", { nombre, email, password, rol });
      setNombre("");
      setEmail("");
      setPassword("");
      setRol("evaluador");
      setExito("Usuario creado correctamente.");
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo crear el usuario.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <h1 className={ui.pageTitle}>Usuarios del sistema</h1>
      <p className={ui.pageSubtitle}>
        Administradores y evaluadores que pueden acceder al panel.
      </p>

      <div className={ui.grid}>
        <div className={ui.card}>
          <h2 className={ui.cardTitle}>Nuevo usuario</h2>
          <form onSubmit={handleSubmit} className={ui.form}>
            <label className={ui.label}>
              Nombre
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className={ui.input}
              />
            </label>
            <label className={ui.label}>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={ui.input}
              />
            </label>
            <label className={ui.label}>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={ui.input}
              />
            </label>
            <label className={ui.label}>
              Rol
              <select value={rol} onChange={(e) => setRol(e.target.value)} className={ui.select}>
                <option value="evaluador">Evaluador</option>
                <option value="admin">Administrador</option>
              </select>
            </label>

            {error && <p className="m-0 text-sm text-[#B3492E]">{error}</p>}
            {exito && <p className="m-0 text-sm text-[#2D5F4C]">{exito}</p>}

            <button type="submit" disabled={cargando} className={ui.primaryButton}>
              {cargando ? "Creando..." : "Crear usuario"}
            </button>
          </form>
        </div>

        <div className={ui.card}>
          <h2 className={ui.cardTitle}>Usuarios existentes ({usuarios.length})</h2>

          {cargandoLista ? (
            <div className={ui.loadingRow}>
              <div className={ui.spinner} />
              <span className={ui.emptyText}>Cargando usuarios...</span>
            </div>
          ) : (
            <ul className="list-none p-0 m-0">
              {usuarios.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-3 border-b border-[#DCD9D0] py-3.5 last:border-b-0">
                  <div>
                    <span className="text-[15px] font-semibold text-[#1C1E1B]">{u.nombre}</span>
                    <p className="m-0 mt-0.5 text-[13px] text-[#5C5B54]">{u.email}</p>
                  </div>
                  <span className={u.rol === "admin" ? ui.pillAccent : ui.pillMuted}>
                    {u.rol}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}