import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import reinicio from "../assets/reinicio.png";

export default function SolicitudesReintegros() {
  const [reintegros, setReintegros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros
  const [filtro, setFiltro] = useState("nuevos");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [ordenFecha, setOrdenFecha] = useState(null); // null | "asc" | "desc"

  // Rango fechas (yyyy-mm-dd)
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReintegros = async () => {
      try {
        const prestadorId = 1;
        const res = await fetch(`http://localhost:3001/reintegros/${prestadorId}`);
        if (!res.ok) {
          const msg = await res.json().catch(() => ({}));
          throw new Error(msg?.message || "Error al cargar los reintegros");
        }
        const data = await res.json();
        setReintegros(data || []);
      } catch (err) {
        setError(err.message || "Fallo al cargar");
      } finally {
        setLoading(false);
      }
    };
    fetchReintegros();
  }, []);

  if (loading) return <p className="text-center mt-5">Cargando solicitudes...</p>;
  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        <h5 className="text-dark">{error}</h5>
        <button className="btn btn-dark mt-3" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  const estados = [
    { label: "Recibido", color: "#b3b3b3" },
    { label: "En análisis", color: "#1d4ed8" },
    { label: "Observado", color: "#ff9c41" },
    { label: "Aprobado", color: "#22c55e" },
    { label: "Rechazado", color: "#ef4444" },
  ];
  const ordenEstados = ["Recibido", "En análisis", "Observado", "Aprobado", "Rechazado"];

  // Base: filtro por estado + búsqueda
  let filtradas = (reintegros || [])
    .filter((r) =>
      filtro === "nuevos"
        ? r.estado === "Recibido" || r.estado === "En análisis"
        : (r.estado || "").toLowerCase() === filtro.toLowerCase()
    )
    .filter((r) => {
      const t = (filtroBusqueda || "").toLowerCase();
      const fullName = r.Afiliado ? `${r.Afiliado.nombre} ${r.Afiliado.apellido}`.toLowerCase() : "";
      const asunto = (r.asunto || "").toLowerCase();
      return fullName.includes(t) || asunto.includes(t);
    });

  // Filtro por rango de fechas (usa r.fecha obligatoria)
  if (fechaDesde) {
    const d = new Date(fechaDesde);
    filtradas = filtradas.filter((r) => new Date(r.fecha) >= d);
  }
  if (fechaHasta) {
    const h = new Date(fechaHasta);
    filtradas = filtradas.filter((r) => new Date(r.fecha) <= h);
  }

  // Orden (copia defensiva)
  const sorted = [...filtradas];
  if (ordenFecha === "desc") {
    sorted.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  } else if (ordenFecha === "asc") {
    sorted.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  } else {
    // por defecto: por estado y, dentro del mismo estado, fecha desc
    sorted.sort((a, b) => {
      const aO = ordenEstados.indexOf(a.estado);
      const bO = ordenEstados.indexOf(b.estado);
      if (aO !== bO) return aO - bO;
      return new Date(b.fecha) - new Date(a.fecha);
    });
  }

  const toggleOrdenFecha = () =>
    setOrdenFecha((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"));

  const badgeStyle = (estado) => {
    const base = {
      Recibido: { color: "#555", background: "#e5e5e5" },
      Observado: { color: "#ff9c41", background: "#fff3e6" },
      "En análisis": { color: "#1d4ed8", background: "#e0e7ff" },
      Aprobado: { color: "#22c55e", background: "#dcfce7" },
      Rechazado: { color: "#ef4444", background: "#fee2e2" },
    };
    return base[estado] || {};
  };

  return (
    <div className="mt-4">
      {/* Título pill */}
      <h2
        className="text-white fw-bold py-2 px-5 mx-auto rounded-pill"
        style={{
          background: "#242424",
          display: "block",
          width: "90%",
          textAlign: "center",
          margin: "0 auto",
          lineHeight: "50px",
        }}
      >
        SOLICITUDES - REINTEGROS
      </h2>

      <hr className="border-dark border-5 rounded-pill mt-4 mx-auto" style={{ width: "90%" }} />

      {/* Filtros + búsqueda */}
      <div
        className="d-flex justify-content-between flex-wrap"
        style={{ width: "90%", margin: "5px auto", alignItems: "center" }}
      >
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

          {filtro !== "nuevos" && (
            <button
              onClick={() => setFiltro("nuevos")}
              style={{ backgroundColor: "#242424", border: "none", borderRadius: "25px", padding: "5px 10px" }}
              title="Mostrar nuevos (Recibido / En análisis)"
            >
              <img src={reinicio} alt="Todos" style={{ width: 20, height: 20 }} />
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Buscar asunto o afiliado..."
          value={filtroBusqueda}
          onChange={(e) => setFiltroBusqueda(e.target.value)}
          style={{
            borderRadius: "25px",
            border: "2px solid #242424",
            padding: "5px 10px",
            outline: "none",
            width: 250,
            backgroundColor: "#242424",
            color: "white",
          }}
        />
      </div>

      {/* Fechas */}
      <div className="d-flex gap-2 mt-3" style={{ width: "90%", margin: "5px auto", alignItems: "center" }}>
        <label style={{ color: "black", fontWeight: 600 }}>
          <span style={{ marginRight: 10 }}>Desde:</span>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            style={{
              borderRadius: 10,
              border: "3px solid #242424",
              padding: 5,
              outline: "none",
              backgroundColor: "#b3b3b3",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </label>
        <label style={{ color: "black", fontWeight: 600 }}>
          <span style={{ marginRight: 10 }}>Hasta:</span>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            style={{
              borderRadius: 10,
              border: "3px solid #242424",
              padding: 5,
              outline: "none",
              backgroundColor: "#b3b3b3",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </label>
      </div>

      {/* Tabla */}
      <div
        className="mt-4"
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
              <th
                style={{ padding: "12px 15px", cursor: "pointer" }}
                onClick={toggleOrdenFecha}
                title="Ordenar por Fecha"
              >
                Fecha {ordenFecha === "desc" ? "↓" : ordenFecha === "asc" ? "↑" : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#555" }}>
                  No se encuentran solicitudes con este filtro.
                </td>
              </tr>
            )}

            {sorted.map((r) => (
              <tr
                key={r.id}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  opacity: r.estado === "Recibido" || r.estado === "En análisis" ? 1 : 0.5,
                }}
                onClick={() => navigate(`/solicitudes/reintegros/${r.id}`)}
              >
                <td style={{ padding: "10px 15px" }}>{r.solicitud || `#${r.id}`}</td>
                <td style={{ padding: "10px 15px" }}>{r.asunto}</td>
                <td style={{ padding: "10px 15px" }}>
                  {r.Afiliado ? `${r.Afiliado.nombre} ${r.Afiliado.apellido}` : "-"}
                </td>
                <td style={{ padding: "10px 15px" }}>
                  <span className="px-2 py-1 rounded-pill" style={{ fontWeight: "bold", fontSize: ".9rem", ...badgeStyle(r.estado) }}>
                    {r.estado}
                  </span>
                </td>
                <td style={{ padding: "10px 15px" }}>
                  {new Date(r.fecha).toLocaleDateString("es-AR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
