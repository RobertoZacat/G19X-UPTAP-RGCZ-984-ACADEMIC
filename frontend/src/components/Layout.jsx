import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { logout } = useAuth();

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "10px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    color: isActive ? "white" : "var(--ink)",
    background: isActive ? "var(--accent)" : "transparent",
    fontWeight: isActive ? 600 : 500,
    fontSize: "14px",
    marginBottom: "4px",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={styles.sidebar}>
        <div>
          <p style={styles.marca}>Eval Técnica</p>
          <nav>
            <NavLink to="/perfiles" style={linkStyle}>Perfiles</NavLink>
            <NavLink to="/preguntas" style={linkStyle}>Preguntas</NavLink>
            <NavLink to="/examenes" style={linkStyle}>Exámenes</NavLink>
            <NavLink to="/resultados" style={linkStyle}>Resultados</NavLink>
            <NavLink to="/usuarios" style={linkStyle}>Usuarios</NavLink>
          </nav>
        </div>
        <button onClick={logout} style={styles.botonSalir}>
          Cerrar sesión
        </button>
      </aside>

      <main style={styles.contenido}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    background: "var(--surface)",
    borderRight: "1px solid var(--border)",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  marca: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--accent)",
    marginBottom: "24px",
  },
  botonSalir: {
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "14px",
    color: "var(--ink-soft)",
    cursor: "pointer",
  },
  contenido: {
    flex: 1,
    padding: "40px",
  },
};