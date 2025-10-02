// src/components/Header.jsx
import { useState } from "react";
import { FaSun, FaMoon, FaEnvelope, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png"; // <-- reemplaza con la ruta de tu logo

export default function Header() {
  const [dark, setDark] = useState(true);

  return (
    <header
      className="d-flex align-items-center justify-content-between"
      style={{
        background: "var(--header-bg, #242424)",
        height: "80px",          // header más grueso y estático
        padding: "0 20px",       // espacio desde los bordes
        margin: 0,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottomLeftRadius: "15px"
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

      {/* Acciones (tema, mensajes, usuario) */}
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setDark(!dark)}
          title="Cambiar tema"
          aria-label="Cambiar tema"
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>

        <button
          className="btn btn-sm btn-outline-light"
          title="Mensajes"
          aria-label="Mensajes"
        >
          <FaEnvelope />
        </button>

        <button
          className="btn btn-sm btn-outline-light"
          title="Perfil"
          aria-label="Perfil"
        >
          <FaUser />
        </button>
      </div>
    </header>
  );
}
