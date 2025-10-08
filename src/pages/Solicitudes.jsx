// src/pages/Solicitudes.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSolicitudes } from "../components/SolicitudesContext.jsx";
import reinicio from "../assets/reinicio.png";

const statusClass = (estado) => {
  const map = {
    "recibido": "text-gray-700 bg-gray-200",
    "en análisis": "text-blue-700 bg-blue-100",
    "observado": "text-orange-700 bg-orange-100",
    "aprobado": "text-green-700 bg-green-100",
    "rechazado": "text-red-700 bg-red-100",
  };
  const key = estado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return map[key] || "bg-gray-100 text-gray-700";
};

export default function Solicitudes() {
  const { solicitudes } = useSolicitudes();
  const [filtro, setFiltro] = useState("todos");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const navigate = useNavigate();

  const estados = [
    { label: "Recibido", color: "#b3b3b3" },
    { label: "Observado", color: "#ff9c41" },
    { label: "En análisis", color: "#1d4ed8" },
    { label: "Aprobado", color: "#22c55e" },
    { label: "Rechazado", color: "#ef4444" },
  ];

  const solicitudesFiltradas = solicitudes
    .filter((s) =>
      filtro === "todos" ? true : s.estado.toLowerCase() === filtro.toLowerCase()
    )
    .filter(
      (s) =>
        s.afiliado.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        s.motivo.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );

  return (
    <div className="mt-4">
      {/* ENCABEZADO*/}
      <h2
        className="text-white fw-bold py-2 px-5 mx-auto rounded-pill"
        style={{
          background: "#242424",
          width: "90%",
          textAlign: "center",
        }}
      >
        SOLICITUDES - REINTEGROS
      </h2>

      <hr className="border-dark border-5 rounded-pill mt-4 mx-auto" style={{ width: "90%" }} />

      {/* BOTONES Y BÚSQUEDA */}
      <div
        className="d-flex justify-content-between flex-wrap"
        style={{ width: "90%", margin: "5px auto", alignItems: "center" }}
      >
        {/* BOTONES */}
        <div className="d-flex flex-wrap gap-1">
          {estados.map((e) => (
            <button
              key={e.label}
              onClick={() => setFiltro(e.label)}
              style={{
                backgroundColor: e.color,
                color: "white",
                border: "none",
                borderRadius: "25px",
                padding: "5px 10px",
                fontWeight: "bold",
                boxShadow: filtro === e.label ? "0 0 0 3px #242424 inset" : "none",
              }}
            >
              {e.label}
            </button>
          ))}

          {filtro !== "todos" && (
            <button
              onClick={() => setFiltro("todos")}
              style={{
                backgroundColor: "#242424",
                border: "none",
                borderRadius: "25px",
                padding: "5px 10px",
              }}
            >
              <img
                src={reinicio}
                alt="Todos"
                style={{ width: "20px", height: "20px" }}
              />
            </button>
          )}
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <input
          type="text"
          placeholder="Buscar afiliado o asunto..."
          value={filtroBusqueda}
          onChange={(e) => setFiltroBusqueda(e.target.value)}
          style={{
            borderRadius: "25px",
            border: "2px solid #242424",
            padding: "5px 10px",
            outline: "none",
            width: "250px",
            backgroundColor: "#242424",
            color: "white",
          }}
        />
      </div>

      {/* TABLA */}
      <div
        className="mt-3"
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          width: "90%",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
          border: "20px solid #242424",
          margin: "auto",
          backgroundColor: "white",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead style={{ backgroundColor: "#242424", color: "white" }}>
            <tr>
              <th style={{ padding: "12px 15px" }}>Solicitud</th>
              <th style={{ padding: "12px 15px" }}>Asunto</th>
              <th style={{ padding: "12px 15px" }}>Afiliado</th>
              <th style={{ padding: "12px 15px" }}>Estado</th>
              <th style={{ padding: "12px 15px" }}>Fecha</th>
            </tr>
          </thead>

          <tbody>
            {solicitudesFiltradas.map((s) => (
              <tr
                key={s.id}
                onClick={() => navigate(`/solicitudes/reintegros/${s.id}`)}
                style={{ cursor: "pointer", borderBottom: "1px solid #ddd" }}
              >
                <td style={{ padding: "10px 15px" }}>{s.id}</td>
                <td style={{ padding: "10px 15px" }}>{s.motivo}</td>
                <td style={{ padding: "10px 15px" }}>{s.afiliado}</td>
                <td style={{ padding: "10px 15px" }}>
                  <span
                    className="px-2 py-1 rounded-pill"
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      ...((() => {
                        const base = {
                          "Recibido": { color: "#555", background: "#e5e5e5" },
                          "Observado": { color: "#ff9c41", background: "#fff3e6" },
                          "En análisis": { color: "#1d4ed8", background: "#e0e7ff" },
                          "Aprobado": { color: "#22c55e", background: "#dcfce7" },
                          "Rechazado": { color: "#ef4444", background: "#fee2e2" },
                        };
                        return base[s.estado] || {};
                      })()),
                    }}
                  >
                    {s.estado}
                  </span>
                </td>
                <td style={{ padding: "10px 15px" }}>{s.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


