// src/components/Header.jsx
import { useState } from "react";
import { FaSun, FaMoon, FaEnvelope, FaUser } from "react-icons/fa";

export default function Header() {
  const [dark, setDark] = useState(true);

  return (
    <header
      className="d-flex align-items-center justify-content-between"
      style={{
        background: "var(--header-bg, #242424)",
        height: "60px",
        padding: 0,    // sin padding
        margin: 0,     // sin margen
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      {/* Título */}
      <div className="fw-bold ms-2">Prestadores – Grupo 16</div>

      {/* Acciones (tema, mensajes, usuario) */}
      <div className="d-flex align-items-center gap-2 me-2">
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
