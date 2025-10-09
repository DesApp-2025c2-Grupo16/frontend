// src/components/Layout.jsx
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import Header from "../components/Header";

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [solOpen, setSolOpen] = useState(
    location.pathname.startsWith("/solicitudes")
  );
  useEffect(() => {
    if (location.pathname.startsWith("/solicitudes")) setSolOpen(true);
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    "nav-link px-2 py-2 rounded " + (isActive ? "active" : "text-light");

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-dark text-light">
      {/* Header fijo arriba */}
      <Header />

      {/* Sidebar fijo debajo del header */}
      <aside
        className="d-none d-md-block"
        style={{
          width: 260,
          background: "var(--sidebar, #242424)",
          marginTop: "60px",                // arranca debajo del header
          height: "calc(100vh - 60px)",     // ocupa el resto de la pantalla
          position: "fixed",
          left: 0,
          top: 0,
          overflowY: "auto",
          border: "none",                   // 🔹 elimina bordes blancos
        }}
      >
        <nav className="p-2 m-0">           {/* 🔹 quitamos margenes extras */}
          <ul className="nav flex-column gap-1 m-0 p-0">
            <li className="nav-item">
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <button
                className="w-100 text-start nav-link px-2 py-2 rounded text-light"
                style={{ background: "transparent", border: "none" }}
                onClick={() => setSolOpen((v) => !v)}
              >
                Solicitudes {solOpen ? "▾" : "▸"}
              </button>
              {solOpen && (
                <ul className="list-unstyled ms-3 mt-1 mb-2 d-flex flex-column gap-1">
                  <li><NavLink to="/solicitudes/reintegros" className={linkClass}>Reintegros</NavLink></li>
                  <li><NavLink to="/solicitudes/autorizaciones" className={linkClass}>Autorizaciones</NavLink></li>
                  <li><NavLink to="/solicitudes/recetas" className={linkClass}>Recetas</NavLink></li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <NavLink to="/afiliados" className={linkClass}>
                Afiliados
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main
        style={{
          marginTop: "60px",   // altura del header
          marginLeft: "260px", // ancho del sidebar
          minHeight: "calc(100vh - 60px)",
           background: "#ffffff",
           color: "#000000",
           padding: "20px",
        }}
      >
        <div className="p-3 m-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
