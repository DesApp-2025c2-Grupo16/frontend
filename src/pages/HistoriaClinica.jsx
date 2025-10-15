import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BackButton from "../components/BackButton.jsx";
import Nota from "../components/Nota.jsx";

export default function HistoriaClinica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const res = await fetch(`http://localhost:3001/afiliados/${id}`);
        if (!res.ok) throw new Error("Paciente no encontrado");
        const data = await res.json();

        // Si es un miembro del grupo familiar, buscarlo dentro del grupo
        if (id.includes("-")) {
          const titularId = id.split("-")[0];
          const resTitular = await fetch(`http://localhost:3001/afiliados/${titularId}`);
          if (!resTitular.ok) throw new Error("Titular no encontrado");
          const titularData = await resTitular.json();

          const miembro = (titularData.grupoFamiliar || []).find(f => f.nroAfiliado === id);
          if (!miembro) throw new Error("Miembro del grupo familiar no encontrado");

          // asignamos historiaClinica del miembro
          setPaciente(miembro);
        } else {
          // Si es el titular
          setPaciente(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, [id]);

  if (loading) return <p>Cargando...</p>;

  if (error) return (
    <div className="text-center mt-5">
      <h2>Error: {error}</h2>
      <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
        Volver atrás
      </button>
    </div>
  );

  return (
    <div className="mt-4">
      <div className="d-flex align-items-center justify-content-start gap-3 mb-3" style={{ width: "100%", padding: "0 20px" }}>
        <BackButton
          to={`/afiliados/${paciente.nroAfiliado.includes('-') ? paciente.nroAfiliado.split('-')[0] : paciente.nroAfiliado}/grupo-familiar`}
          title="Volver al Grupo Familiar"
          style={{
            height: "50px",
            lineHeight: "50px",
            minWidth: "120px",
            borderRadius: "50px",
            fontWeight: "bold",
          }}
        />
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
          HISTORIA CLÍNICA
        </h2>
      </div>

      <hr className="border-dark border-5 rounded-pill mt-4 mx-auto" style={{ width: "90%" }} />

      <div className="px-3">
        <h1 className="text-dark fw-bold">
          Paciente: {paciente.nombre}
        </h1>
        <p><strong>Situación:</strong> {paciente.situacionTerapeutica?.descripcion || "—"}</p>
      </div>

      <div className="px-3">
        {paciente.historiaClinica?.length > 0 ? (
          paciente.historiaClinica.map((nota, i) => <Nota key={i} nota={nota} />)
        ) : (
          <p>No hay notas disponibles.</p>
        )}
      </div>
    </div>
  );
}
