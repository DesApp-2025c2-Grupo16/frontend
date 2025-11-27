// src/pages/SolicitudesRecetas.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import reinicio from "../assets/reinicio.png";

export default function SolicitudesRecetas() {
  const navigate = useNavigate();

  const [recetas, setRecetas] = useState([]);
  const [error, setError] = useState("");

  const [filtro, setFiltro] = useState("Recibido,En análisis");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [ordenFecha, setOrdenFecha] = useState(null);

  const [textoBusqueda, setTextoBusqueda] = useState("")

  const [esCentro, setEsCentro] = useState()
  const [prestadorId, setPrestadorId] = useState();
  const [prestadores, setPrestadores] = useState([])

  const getUser = ()=>{
    const stored = localStorage.getItem("auth_user");
    const parsed = JSON.parse(stored);
    return parsed
  }

  useEffect(()=>{
    const handlePrestador = async () => {
      const user= getUser()
      setEsCentro(user.esCentro)
      if(!user.esCentro){
        setPrestadorId(user.id)
        return
      } else {
        fetch(`http://localhost:3001/prestadores/medicos/${user.id}`)
        .then(r => r.json())
        .then(medicos => {
          setPrestadores(medicos)
          setPrestadorId(medicos[0]?.id) 
      })
        // const data = await medicosAsociados.json()
        // setPrestadores(data)
        // setPrestadorId(data?.[0]?.id)
      }
    }
    handlePrestador()
  }, [])

  // PAGINADO
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginasTotales, setPaginasTotales] = useState()
  const itemsPorPagina = 20;

  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, filtroBusqueda, fechaDesde, fechaHasta, ordenFecha]);
  
  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const id = parseInt(prestadorId)
        if(!isNaN(id)){
          const res = await fetch(`http://localhost:3001/recetas/prestador/${id}/${filtro}?pagina=${paginaActual}&tamaño=${itemsPorPagina}&busqueda=${filtroBusqueda}`);
          if (!res.ok) {
            const msg = await res.json().catch(() => ({}));
            throw new Error(msg?.message || "No se pudieron cargar las recetas");
          }
          const data = await res.json();
          setRecetas(data.recetas || []);
          setPaginasTotales(Math.ceil(data.count / itemsPorPagina))
        }
      } catch (err) {
        setRecetas([])
        //setError(err.message || "Fallo al cargar");
      } 
    };
    fetchRecetas();
  }, [prestadorId, filtro, paginaActual, filtroBusqueda]);

  // Resetear paginado si cambian filtros

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        <h4 className="text-dark">{error}</h4>
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
  const ordenEstados = [
    "Recibido",
    "En análisis",
    "Observado",
    "Aprobado",
    "Rechazado",
  ];

  let filtradas = recetas

  if (fechaDesde)
    filtradas = filtradas.filter(
      (r) => new Date(r.fecha) >= new Date(fechaDesde)
    );
  if (fechaHasta)
    filtradas = filtradas.filter(
      (r) => new Date(r.fecha) <= new Date(fechaHasta)
    );

  if (ordenFecha === "desc") {
    filtradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  } else if (ordenFecha === "asc") {
    filtradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  } else {
    filtradas.sort((a, b) => {
      const aO = ordenEstados.indexOf(a.estado);
      const bO = ordenEstados.indexOf(b.estado);
      if (aO !== bO) return aO - bO;
      return new Date(b.fecha) - new Date(a.fecha);
    });
  }

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

  const toggleOrdenFecha = () => {
    setOrdenFecha((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
  };

  return (
    <div className="mt-4">
      <h2 className="text-white fw-bold py-2 px-5 mx-auto rounded-pill"
          style={{ background:"#242424", display:"block", width:"90%", textAlign:"center", lineHeight:"50px" }}>
        SOLICITUDES - RECETAS
      </h2>
      

      {esCentro && <div className="row justify-content-center align-items-center mt-3"> 
          <div className="col-3 justify-content-center align-items-center">
            <span>Datos del prestador:</span>
          </div>
          <div className="col-5">
            <select className="col-9 form-select" onChange={(e) => setPrestadorId(e.target.value) }>
              {
                prestadores.map((prestador, i) => {
                return <option value={prestador.id} key={i} >{prestador.nombre}</option>
              })
              }
            </select>
          </div>
        </div>}

        <hr
        className="border-dark border-5 rounded-pill mt-4 mx-auto"
        style={{ width: "90%" }}
        />

      <div
        className="d-flex justify-content-between flex-wrap"
        style={{ width: "90%", margin: "5px auto", alignItems: "center" }}
      >
        <div className="d-flex flex-wrap gap-1">
          {estados.map(e => (
            <button key={e.label} onClick={() => setFiltro(e.label)}
              style={{
                backgroundColor: e.color, color:"white", border:"none",
                borderRadius:"25px", padding:"5px 10px", fontWeight:"bold",
                boxShadow: filtro === e.label ? "0 0 0 3px #242424 inset" : "none",
              }}>
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
              title="Mostrar Recibido,En análisis (Recibido / En análisis)"
            >
              <img src={reinicio} alt="Todos" style={{ width: 20, height: 20 }} />
            </button>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Buscar asunto o afiliado..."
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
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
          <button 
          onClick={()=>setFiltroBusqueda(textoBusqueda)}
          style={{
              borderRadius: "25px",
              border: "2px solid #242424",
              padding: "5px 10px",
              outline: "none",
              width: "auto",
              backgroundColor: "#242424",
              color: "white",
              marginLeft: "10px"
            }}
          >
            Buscar
          </button>
        </div>
      </div>

      <div
        className="d-flex gap-2 mt-3"
        style={{ width: "90%", margin: "5px auto", alignItems: "center" }}
      >
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
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#555" }}>
                  No se encuentran solicitudes con este filtro.
                </td>
              </tr>
            )}

            {/* FIX: se usa currentItems, no filtradas */}
            {filtradas.map((r) => (
              <tr
                key={r.id}
                style={{
                  cursor:
                    r.estado === "Recibido" || r.estado === "En análisis"
                      ? "pointer"
                      : "default",
                  opacity:
                    r.estado === "Recibido" || r.estado === "En análisis" ? 1 : 0.6,
                  borderBottom: "1px solid #ddd",
                }}
                onClick={() => navigate(`/solicitudes/recetas/${r.id}`)}
              >
                <td style={{ padding: "10px 15px" }}>
                  {r.solicitud || `#${r.id}`}
                </td>
                <td style={{ padding: "10px 15px" }}>{r.asunto}</td>
                <td style={{ padding: "10px 15px" }}>
                  {r.Afiliado
                    ? `${r.Afiliado.nombre} ${r.Afiliado.apellido}`
                    : "-"}
                </td>
                <td style={{ padding: "10px 15px" }}>
                  <span
                    className="px-2 py-1 rounded-pill"
                    style={{
                      fontWeight: "bold",
                      fontSize: ".9rem",
                      ...badgeStyle(r.estado),
                    }}
                  >
                    {r.estado}
                  </span>
                </td>
                <td style={{ padding: "10px 15px" }}>
                  {r.fecha
                    ? new Date(r.fecha).toLocaleDateString("es-AR")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINADO */}
      {paginasTotales > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            margin: "20px 0",
          }}
        >
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
              cursor: paginaActual === 1 ? "not-allowed" : "pointer",
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
                  fontWeight: "bold",
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
              background: paginaActual === paginaActual ? "#ccc" : "#242424",
              color: "white",
              cursor:
                paginaActual === paginaActual ? "not-allowed" : "pointer",
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
