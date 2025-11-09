import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import reinicio from "../assets/reinicio.png";

export default function SolicitudesReintegros() {
  const [reintegros, setReintegros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("nuevos");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReintegros = async () => {
      try {
        const prestadorId = 1; // cambiar por el ID real
        const response = await fetch(`http://localhost:3001/reintegros/${prestadorId}`);

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Error al cargar los reintegros");
        }

        const data = await response.json();
        setReintegros(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReintegros();
  }, []);

  if (loading) return <p className="text-center mt-5">Cargando solicitudes...</p>;
  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <h5 className="text-dark">{error}</h5>
        <button className="btn btn-dark mt-3" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );

  const estados = [
    { label: "Recibido", color: "#b3b3b3" },
    { label: "Observado", color: "#ff9c41" },
    { label: "En análisis", color: "#1d4ed8" },
    { label: "Aprobado", color: "#22c55e" },
    { label: "Rechazado", color: "#ef4444" },
  ];

  const ordenEstados = ["Recibido", "En análisis", "Observado", "Aprobado", "Rechazado"];

  const reintegrosFiltrados = reintegros
    .filter((r) => (filtro === "nuevos" ? (r.estado === "Recibido" || r.estado == "En análisis") : r.estado.toLowerCase() === filtro.toLowerCase()))
    .filter(
      (r) =>
        r.asunto.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        (r.Afiliado &&
          `${r.Afiliado.nombre} ${r.Afiliado.apellido}`
            .toLowerCase()
            .includes(filtroBusqueda.toLowerCase()))
    )
    .sort((a, b) => {
      // Ordenar por estado según el orden definido
      const ordenA = ordenEstados.indexOf(a.estado);
      const ordenB = ordenEstados.indexOf(b.estado);

      if (ordenA !== ordenB) return ordenA - ordenB;

      // Si el estado es igual, ordenar por fecha más reciente
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaB - fechaA; // más reciente primero
    });

  return (
    <div className="mt-4">
      {/* TÍTULO */}
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

      {/* FILTROS Y BÚSQUEDA */}
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
              style={{
                backgroundColor: "#242424",
                border: "none",
                borderRadius: "25px",
                padding: "5px 10px",
              }}
            >
              <img src={reinicio} alt="Todos" style={{ width: "20px", height: "20px" }} />
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
            {reintegrosFiltrados.map((r) => (
              <tr
                key={r.id}
                style={{
                  cursor:
                    r.estado === "Recibido" || r.estado === "En análisis"
                      ? "pointer" : "",
                  opacity:
                    r.estado === "Recibido" || r.estado === "En análisis" ? 1 : 0.6,
                  borderBottom: "1px solid #ddd",
                }}
                onClick={() => {
                  if (r.estado === "Recibido" || r.estado === "En análisis") {
                    navigate(`/solicitudes/reintegros/${r.id}`);
                  }
                }}
              >
                <td style={{ padding: "10px 15px" }}>{r.solicitud || `#${r.id}`}</td>
                <td style={{ padding: "10px 15px" }}>{r.asunto}</td>
                <td style={{ padding: "10px 15px" }}>{r.Afiliado.nombre} {r.Afiliado.apellido}</td>
                <td style={{ padding: "10px 15px" }}>
                  <span
                    className="px-2 py-1 rounded-pill"
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      ...(() => {
                        const base = {
                          Recibido: { color: "#555", background: "#e5e5e5" },
                          Observado: { color: "#ff9c41", background: "#fff3e6" },
                          "En análisis": { color: "#1d4ed8", background: "#e0e7ff" },
                          Aprobado: { color: "#22c55e", background: "#dcfce7" },
                          Rechazado: { color: "#ef4444", background: "#fee2e2" },
                        };
                        return base[r.estado] || {};
                      })(),
                    }}
                  >
                    {r.estado}
                  </span>
                </td>
                <td style={{ padding: "10px 15px" }}>
                  {r.fecha ? new Date(r.fecha).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* {reintegrosFiltrados.length === 0 && (
          <div className="text-center text-muted py-4">
            No hay solicitudes de reintegro registradas.
          </div>
        )} */}
      </div>
    </div>
  );
}
