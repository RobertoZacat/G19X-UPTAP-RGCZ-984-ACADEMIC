import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ui } from "../ui/tailwind";

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex w-full flex-row justify-between border-b border-[#DCD9D0] bg-white px-4 py-6 lg:w-[220px] lg:flex-col lg:border-b-0 lg:border-r">
        <div>
          <p className="mb-6 text-base font-bold text-[#2D5F4C]">Eval Técnica</p>
          <nav>
            <NavLink to="/perfiles" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkIdle}`}>Perfiles</NavLink>
            <NavLink to="/preguntas" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkIdle}`}>Preguntas</NavLink>
            <NavLink to="/examenes" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkIdle}`}>Exámenes</NavLink>
            <NavLink to="/resultados" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkIdle}`}>Resultados</NavLink>
            <NavLink to="/usuarios" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkIdle}`}>Usuarios</NavLink>
          </nav>
        </div>
        <button onClick={logout} className={ui.secondaryButton}>
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}

const navLinkBase = "mb-1 block rounded-lg px-4 py-2.5 text-sm font-medium no-underline transition";
const navLinkActive = "bg-[#2D5F4C] text-white";
const navLinkIdle = "text-[#1C1E1B] hover:bg-[#F7F6F3]";