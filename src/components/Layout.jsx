import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Layout() {
  const { logout } = useAuth();
  const nav = useNavigate();

  const doLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <aside className="sidebar d-flex flex-column p-3">
        <h5 className="text-white-50 mb-3">Prestadores – Grupo 16</h5>
        <nav className="nav nav-pills flex-column gap-1">
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/afiliados">
            Afiliados
          </NavLink>
          <div className="mt-2 text-white-50 small">Solicitudes</div>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/solicitudes/reintegros">
            ◇ Reintegros
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/solicitudes/autorizaciones">
            ◇ Autorizaciones
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/solicitudes/recetas">
            ◇ Recetas
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/turnos">
            Turnos
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/historia">
            Historia Clínica
          </NavLink>
        </nav>
        <div className="mt-auto">
          <button className="btn btn-sm btn-outline-light w-100" onClick={doLogout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>
      <main className="flex-fill p-3 p-md-4">
        <Outlet />
      </main>
    </div>
  );
}
