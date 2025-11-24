import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaEnvelope, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Header() {
  const [dark, setDark] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.nombre || "Usuario");
      } catch {
        setUser("Usuario");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_user");
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="d-flex align-items-center justify-content-between"
      style={{
        background: "#242424",
        height: "80px",
        padding: "0 20px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo + Título */}
      <div className="d-flex align-items-center gap-3">
        <img
          src={logo}
          alt="Logo"
          style={{ height: "50px", width: "50px", objectFit: "contain" }}
        />
        <div className="fw-bold" style={{ fontSize: "1.6rem" }}>
          Prestadores – Grupo 16
        </div>
      </div>

      {/* Acciones */}
      <div className="d-flex align-items-center gap-2 position-relative">
        {/* Tema claro/oscuro */}
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setDark(!dark)}
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>

        {/* Ir a Mensajes */}
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => navigate("/mensajes")}
        >
          <FaEnvelope />
        </button>

        {/* Usuario con dropdown */}
        <div className="position-relative">
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FaUser />
          </button>

          {showMenu && (
            <div
              className="position-absolute end-0 mt-2 p-3 rounded shadow"
              style={{
                background: "#1c1c1c",
                color: "white",
                width: "220px",
                border: "1px solid #333",
              }}
            >
              <div className="fw-semibold mb-2">
                Bienvenido/a,<br />
                <span style={{ color: "#00bcd4" }}>{user}</span>
              </div>
              <hr style={{ borderColor: "#444" }} />
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-danger w-100"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
