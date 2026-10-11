import { useEffect, useState } from "react";
import api from "../api/axios";
import { ui } from "../ui/tailwind";

export default function Perfiles() {
  const [perfiles, setPerfiles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoLista, setCargandoLista] = useState(true);

  async function cargarPerfiles() {
    const res = await api.get("/perfiles");
    setPerfiles(res.data);
    setCargandoLista(false);
  }

  useEffect(() => {
    cargarPerfiles();
  }, []);

  function limpiarFormulario() {
    setNombre("");
    setDescripcion("");
    setEditandoId(null);
    setError("");
  }

  function iniciarEdicion(perfil) {
    setNombre(perfil.nombre);
    setDescripcion(perfil.descripcion || "");
    setEditandoId(perfil.id);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      if (editandoId) {
        await api.put(`/perfiles/${editandoId}`, { nombre, descripcion });
      } else {
        await api.post("/perfiles", { nombre, descripcion });
      }
      limpiarFormulario();
      cargarPerfiles();
    } catch (err) {
      setError("No se pudo guardar el perfil. Verifica los datos.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(perfil) {
    if (!confirm(`¿Eliminar el perfil "${perfil.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await api.delete(`/perfiles/${perfil.id}`);
      cargarPerfiles();
    } catch (err) {
      alert(err.response?.data?.detail || "No se pudo eliminar el perfil.");
    }
  }

  return (
    <div>
      <h1 className={ui.pageTitle}>Perfiles profesionales</h1>
      <p className={ui.pageSubtitle}>
        Los perfiles agrupan preguntas y exámenes por área (ej. Backend Junior, Frontend con React).
      </p>

      <div className={ui.grid}>
        <div className={ui.card}>
          <h2 className={ui.cardTitle}>
            {editandoId ? "Editar perfil" : "Nuevo perfil"}
          </h2>
          <form onSubmit={handleSubmit} className={ui.form}>
            <label className={ui.label}>
              Nombre
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className={ui.input}
                placeholder="Backend Junior Python"
              />
            </label>
            <label className={ui.label}>
              Descripción
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={`${ui.textarea} min-h-[80px]`}
                placeholder="Evaluación para desarrolladores backend junior"
              />
            </label>
            {error && <p className="m-0 text-sm text-[#B3492E]">{error}</p>}
            <div className="flex gap-2.5">
              <button type="submit" disabled={cargando} className="flex-1 rounded-lg bg-[#2D5F4C] px-4 py-[11px] text-sm font-semibold text-white transition hover:bg-[#24493C] disabled:cursor-not-allowed disabled:opacity-70">
                {cargando ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear perfil"}
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
          <h2 className={ui.cardTitle}>Perfiles existentes ({perfiles.length})</h2>

          {cargandoLista ? (
            <div className={ui.loadingRow}>
              <div className={ui.spinner} />
              <span className={ui.emptyText}>Cargando perfiles...</span>
            </div>
          ) : perfiles.length === 0 ? (
            <p className={ui.emptyText}>Todavía no hay perfiles creados.</p>
          ) : (
            <ul className="list-none p-0 m-0">
              {perfiles.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3 border-b border-[#DCD9D0] py-3.5 last:border-b-0">
                  <div className="flex-1">
                    <span className="text-[15px] font-semibold text-[#1C1E1B]">{p.nombre}</span>
                    {p.descripcion && <p className="m-0 mt-1 text-[13px] text-[#5C5B54]">{p.descripcion}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
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