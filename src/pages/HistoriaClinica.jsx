import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Nota from "../components/Nota.jsx";

export default function HistoriaClinica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [afiliado, setAfiliado] = useState(null);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Buscar afiliado
        const resAfi = await fetch(`http://localhost:3001/afiliados/${id}`);
        if (!resAfi.ok) throw new Error("Afiliado no encontrado");
        const dataAfi = await resAfi.json();
        setAfiliado(dataAfi);

        // 🔹 Buscar notas clínicas del afiliado
        const resNotas = await fetch(`http://localhost:3001/notas/${id}`);
        if (!resNotas.ok) throw new Error("No se pudieron cargar las notas clínicas");
        const dataNotas = await resNotas.json();
        setNotas(dataNotas);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5 text-secondary">
        <h4>Cargando historia clínica...</h4>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <h3>Error: {error}</h3>
        <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
          Volver atrás
        </button>
      </div>
    );

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

      {/* Datos del paciente */}
      <div
        className="mt-4 mx-auto p-4 rounded"
        style={{
          width: "100%",
          background: "#f7f7f7",
          textAlign: "left",
          color: "#1e1e1e",
        }}
      >
        <div className="px-2">
          <h4
            className="fw-bold mb-4 text-uppercase"
            style={{ color: "#1e1e1e" }}
          >
            PACIENTE: <span className="text-dark">{afiliado.nombre} {afiliado.apellido}</span>
          </h4>

          {/* Notas Clínicas */}
          {notas.length > 0 ? (
            notas.map((nota, i) => <Nota key={i} nota={nota} />)
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
          onClick={() => navigate(`/afiliados`)}
        >
          Volver a afiliados
        </button>
      </div>
    </div>
  );
}
