import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Nota from "../components/Nota.jsx";

export default function HistoriaClinica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [afiliado, setAfiliado] = useState(null);
  const [filteredNotas, setFilteredNotas] = useState([]);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");

  // PAGINADO
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginasTotales, setPaginasTotales] = useState()
  const itemsPorPagina = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAfi = await fetch(`http://localhost:3001/afiliados/${id}`);
        if (!resAfi.ok) throw new Error("Afiliado no encontrado");
        const dataAfi = await resAfi.json();
        setAfiliado(dataAfi);

        let resNotas = {};
        if(q === ""){
          resNotas = await fetch(`http://localhost:3001/notas/${id}?pagina=${paginaActual}&tamaño=${itemsPorPagina}`);
        } else {
          resNotas = await fetch(`http://localhost:3001/notas/${id}/${q}?pagina=${paginaActual}&tamaño=${itemsPorPagina}`);
        }
        if(resNotas.status === 404){
          return
        }
        //if (!resNotas.ok)
          //throw new Error("No se pudieron cargar las notas clínicas");
        const data = await resNotas.json();
        const dataNotas = data.notas;
        setPaginasTotales(Math.ceil(data.count / itemsPorPagina));
        const notasOrdenadas = [...dataNotas].sort((a, b) => {
          return new Date(b.fecha) - new Date(a.fecha);
        });
        setFilteredNotas(notasOrdenadas);

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchData();
  }, [id, q, paginaActual]);

  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <h3>Error: {error}</h3>
        <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
          Volver atrás
        </button>
      </div>
    );

  if (!afiliado) {
    return (
      <div className="text-center mt-5">
        <h4>Cargando datos del afiliado...</h4>
      </div>
    );
  }

  return (
    <div className="mt-4 text-center" style={{ fontFamily: "sans-serif" }}>
      <h2
        className="fw-bold py-3 mx-auto rounded-pill"
        style={{
          background: "#1e1e1e",
          color: "white",
          width: "90%",
          textAlign: "center",
        }}
      >
        HISTORIA CLÍNICA
      </h2>

      <hr className="border-dark border-5 rounded-pill mt-4" />

      {/* Buscador por doctor */}
      <div
        className="d-flex justify-content-center align-items-center mt-4"
        style={{
          border: "3px solid #1e1e1e",
          borderRadius: "50px",
          padding: "5px 10px",
          width: "500px",
          margin: "0 auto",
          background: "#242424",
        }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por doctor..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            borderRadius: "50px",
            marginRight: "10px",
            background: "#242424",
            color: "white",
          }}
        />
      </div>

      {/* {filteredNotas.length === 0 && (
        <p className="text-muted mt-3">No se encontraron notas de ese doctor.</p>
      )} */}

      {/* Datos del paciente */}
      <div
        className="mt-4 mx-auto p-4 rounded"
        style={{
          width: "100%",
          textAlign: "left",
          color: "#1e1e1e",
        }}
      >
        <div className="px-2">
          <h4 className="fw-bold mb-4 text-uppercase" style={{ color: "#1e1e1e" }}>
            PACIENTE:{" "}
            <span className="text-dark">
              {afiliado.nombre} {afiliado.apellido}
            </span>
          </h4>

          {/* Notas Clínicas */}
          {filteredNotas.length > 0 ? (
            filteredNotas.map((nota, i) => <Nota key={i} nota={nota} />)
          ) : (
            <p className="text-muted text-center mb-0">
              No hay notas clínicas registradas.
            </p>
          )}
        </div>
      </div>

      {/* Botón volver */}
      <div className="my-4">
        <button
          className="btn btn-dark px-4 py-2 rounded-pill fw-bold"
          onClick={() =>
            navigate('/afiliados', {
              state: {
                grupoNumero: afiliado.numeroGrupoFamiliar,
                filtroAnterior: "",
              },
            })
          }
        >
          Volver al grupo familiar
        </button>
      </div>
      {paginasTotales > 1 && (
        <div style={{ display:"flex", justifyContent:"center", gap:"10px", margin:"20px 0" }}>

          {/* Botón anterior */}
          <button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
            style={{
              padding:"5px 12px",
              borderRadius:"10px",
              border:"2px solid #242424",
              background: paginaActual === 1 ? "#ccc" : "#242424",
              color:"white",
              cursor: paginaActual === 1 ? "not-allowed" : "pointer"
            }}
          >
            ‹
          </button>

          {/* Números */}
          {[...Array(paginasTotales).keys()].map(i => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setPaginaActual(page)}
                style={{
                  padding:"5px 12px",
                  borderRadius:"10px",
                  border:"2px solid #242424",
                  background: paginaActual === page ? "#242424" : "white",
                  color: paginaActual === page ? "white" : "#242424",
                  cursor:"pointer",
                  fontWeight:"bold"
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
              padding:"5px 12px",
              borderRadius:"10px",
              border:"2px solid #242424",
              background: paginaActual === paginasTotales ? "#ccc" : "#242424",
              color:"white",
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
