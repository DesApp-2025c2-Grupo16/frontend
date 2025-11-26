import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import reinicio from "../assets/reinicio.png";

export default function SolicitudesReintegros() {
  const navigate = useNavigate();

  const [reintegros, setReintegros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros
  const [filtro, setFiltro] = useState("Recibido,En análisis");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [ordenFecha, setOrdenFecha] = useState(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [user, setUser] = useState({});
  const [prestadorId, setPrestadorId] = useState();
  const [prestadores, setPrestadores] = useState([])

  const getUser = ()=>{
    const stored = localStorage.getItem("auth_user");
    const parsed = JSON.parse(stored);
    return parsed
  }

  useEffect(()=>{
    const handlePrestador = async () => {
      setUser(getUser())
      if(!user.esCentro){
        setPrestadorId(user.id)
      } else {
        const medicosAsociados = await fetch(`http://localhost:3001/prestadores/medicos/${user.id}`)
        const data = await medicosAsociados.json()
        setPrestadores(data)
        setPrestadorId(data[0].id)
      }
    }
    handlePrestador()
  }, [user.esCentro, user.id])

  // === PAGINADO ===
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginasTotales, setPaginasTotales] = useState()
  const itemsPorPagina = 20; 

  // Resetear página cuando cambia algún filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, filtroBusqueda, fechaDesde, fechaHasta, ordenFecha]);

  useEffect(() => {
    const fetchReintegros = async () => {
      try {
        setLoading(true);
        const id = parseInt(prestadorId)
        if(!isNaN(id)){
          const res = await fetch(`http://localhost:3001/reintegros/prestador/${id}/${filtro}?pagina=${paginaActual}&tamaño=${itemsPorPagina}`);
          if (!res.ok) {
            const msg = await res.json().catch(() => ({}));
            throw new Error(msg?.message || "Error al cargar los reintegros");
          }
          const data = await res.json();
          setReintegros(data.reintegros || []);
          setPaginasTotales(Math.ceil(data.count / itemsPorPagina))
        }
      } catch (err) {
        setError(err.message || "Fallo al cargar");
      } finally {
        setLoading(false);
      }
    };

    fetchReintegros();
  }, [prestadorId, filtro, paginaActual]);

  if (loading) return <p className="text-center mt-5">Cargando solicitudes...</p>;
  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <h4 className="text-dark">{error}</h4>
        <button className="btn btn-dark mt-3" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );

  const estados = [
    { label: "Recibido", color: "#b3b3b3" },
    { label: "En análisis", color: "#1d4ed8" },
    { label: "Observado", color: "#ff9c41" },
    { label: "Aprobado", color: "#22c55e" },
    { label: "Rechazado", color: "#ef4444" },
  ];

  const ordenEstados = ["Recibido", "En análisis", "Observado", "Aprobado", "Rechazado"];

  let filtradas = reintegros

  if (fechaDesde) {
    filtradas = filtradas.filter(
      (r) => new Date(r.fecha) >= new Date(fechaDesde)
    );
  }

  if (fechaHasta) {
    filtradas = filtradas.filter(
      (r) => new Date(r.fecha) <= new Date(fechaHasta)
    );
  }

  if (ordenFecha === "desc") {
    filtradas = filtradas.sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );
  } else if (ordenFecha === "asc") {
    filtradas = filtradas.sort(
      (a, b) => new Date(a.fecha) - new Date(b.fecha)
    );
  } else {
    filtradas = filtradas.sort((a, b) => {
      const ordenA = ordenEstados.indexOf(a.estado);
      const ordenB = ordenEstados.indexOf(b.estado);
      if (ordenA !== ordenB) return ordenA - ordenB;
      return new Date(b.fecha) - new Date(a.fecha);
    });
  }

  return (
    <div className="mt-4">
      <h2
        className="text-white fw-bold py-2 px-5 mx-auto rounded-pill"
        style={{
          background: "#242424",
          display: "block",
          width: "90%",
          textAlign: "center",
          lineHeight: "50px",
        }}
      >
        SOLICITUDES - REINTEGROS
      </h2>

      <hr className="border-dark border-5 rounded-pill mt-4 mx-auto" style={{ width: "90%" }} />

      {/* Filtros principales */}
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

          {filtro !== "Recibido,En análisis" && (
            <button
              onClick={() => setFiltro("Recibido,En análisis")}
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

      {/* Filtro de fechas */}
      <div
        className="d-flex gap-2 mt-3"
        style={{ width: "90%", margin: "5px auto", alignItems: "center" }}
      >
        <div>
          <label style={{ color: "black", fontWeight: 600 }}>
            <span style={{ marginRight: "10px" }}>Desde:</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              style={{
                borderRadius: "10px",
                border: "3px solid #242424",
                padding: "5px",
                outline: "none",
                backgroundColor: "#b3b3b3",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </label>
        </div>

        <div>
          <label style={{ color: "black", fontWeight: 600 }}>
            <span style={{ marginRight: "10px" }}>Hasta:</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              style={{
                borderRadius: "10px",
                border: "3px solid #242424",
                padding: "5px",
                outline: "none",
                backgroundColor: "#b3b3b3",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </label>
        </div>
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
                onClick={() => setOrdenFecha((prev) =>
                  prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
                )}
              >
                Fecha {ordenFecha === "desc" ? "↓" : ordenFecha === "asc" ? "↑" : ""}
              </th>
            </tr>
          </thead>

          <tbody>
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: "#555" }}>
                  No se encuentran solicitudes con este filtro.
                </td>
              </tr>
            )}

            {filtradas.map((r) => (
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
                  {r.Afiliado.nombre} {r.Afiliado.apellido}
                </td>
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
      </div>

      {/* PAGINADO */}
      {paginasTotales > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "20px 0" }}>

          {/* Botón anterior */}
          <button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
            style={{
              padding: "5px 12px",
              borderRadius: "10px",
              border: "2px solid #242424",
              background: paginaActual === 1 ? "#ccc" : "#242424",
              color: "white",
              cursor: paginaActual === 1 ? "not-allowed" : "pointer"
            }}
          >
            ‹
          </button>

          {/* Números */}
          {[...Array(paginasTotales).keys()].map((i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setPaginaActual(page)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "10px",
                  border: "2px solid #242424",
                  background: paginaActual === page ? "#242424" : "white",
                  color: paginaActual === page ? "white" : "#242424",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {page}
              </button>
            );
          })}

          {/* Botón siguiente */}
          <button
            disabled={paginaActual === paginasTotales}
            onClick={() => setPaginaActual(paginaActual + 1)}
            style={{
              padding: "5px 12px",
              borderRadius: "10px",
              border: "2px solid #242424",
              background: paginaActual === paginasTotales ? "#ccc" : "#242424",
              color: "white",
              cursor: paginaActual === paginasTotales ? "not-allowed" : "pointer"
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}