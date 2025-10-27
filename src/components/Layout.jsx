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
    `nav-link d-flex justify-content-center align-items-center fs-5 px-2 py-2 rounded ${
      isActive ? "fw-bold text-light" : "text-light"
    }`;

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
          width: 170,
          background: "var(--sidebar, #242424)",
          marginTop: "80px",               // altura del header
          height: "calc(100vh - 80px)",
          position: "fixed",
          left: 0,
          top: 0,
          overflowY: "auto",
          border: "none",
          borderTopRightRadius: "15px",    // esquina superior derecha redondeada
        }}
      >
        <nav className="p-0 m-0">
          <ul className="nav flex-column gap-3 m-2 p-2">
            {/* Dashboard */}
            <li className="nav-item">
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            </li>

            {/* Línea tipo pill */}
            <li>
              <div
                style={{
                  height: "2px",
                  width: "80%",
                  margin: "0 auto",
                  background: "#6c757d",
                  borderRadius: "10px",
                }}
              />
            </li>

            {/* Solicitudes */}
            <li className="nav-item">
              <div className="d-flex flex-column w-100">
                <button
                  className={`w-100 d-flex justify-content-center align-items-center fs-5 nav-link px-2 py-2 rounded text-light ${
                    solOpen ? "fw-bold" : ""
                  }`}
                  style={{ background: "transparent", border: "none" }}
                  onClick={() => setSolOpen((v) => !v)}
                >
                  Solicitudes
                </button>

                {/* Sublista animada */}
                <div
                  style={{
                    maxHeight: solOpen ? "500px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                  }}
                >
                  <ul
                    className="list-unstyled mt-1 mb-2 d-flex flex-column gap-1"
                    style={{ paddingLeft: 0 }}
                  >
                    <li>
                      <NavLink
                        to="/solicitudes/reintegros"
                        className={linkClass}
                      >
                        Reintegros
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/solicitudes/autorizaciones"
                        className={linkClass}
                      >
                        Autorizaciones
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/solicitudes/recetas"
                        className={linkClass}
                      >
                        Recetas
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            </li>

            {/* Segunda línea tipo pill */}
            <li>
              <div
                style={{
                  height: "2px",
                  width: "80%",
                  margin: "0 auto",
                  background: "#6c757d",
                  borderRadius: "10px",
                }}
              />
            </li>

            {/* Afiliados */}
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
          marginTop: "80px",   // altura del header
          marginLeft: "170px", // ancho del sidebar
          minHeight: "calc(100vh - 80px)",
          background: "#ffffff",
          color: "#242424",
          padding: "20px",
          borderTopLeftRadius: "40px", // esquina superior izquierda redondeada
          borderTopRightRadius: "40px", // esquina superior derecha redondeada
          overflow: "hidden",
        }}
      >
        <div className="p-3 m-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
