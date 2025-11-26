import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";

export default function GrupoFamiliarHistoriaClinica() {
  const navigate = useNavigate();
  const { id } = useParams(); // Captura el nroAfiliado desde la URL
  const [grupoFamiliar, setGrupoFamiliar] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrupoFamiliar = async () => {
      try {
        const res = await fetch(`http://localhost:3001/afiliados/${id}/grupo-familiar`);
        if (!res.ok) throw new Error("Error al cargar el grupo familiar");
        const data = await res.json();
        setGrupoFamiliar(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchGrupoFamiliar();
  }, [id]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-4">
      {/* ENCABEZADO */}
      <div
        className="d-flex align-items-center justify-content-start gap-3 mb-3"
        style={{ width: "100%", padding: "0 20px" }}
      >
        <BackButton
          to="/afiliados"
          title="Volver a Afiliados"
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
          GRUPO FAMILIAR - HISTORIA CLÍNICA
        </h2>
      </div>

      <hr
        className="border-dark border-5 rounded-pill mt-4 mx-auto"
        style={{ width: "90%" }}
      />

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
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <thead style={{ backgroundColor: "#242424", color: "white" }}>
            <tr>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>
                Clasificación
              </th>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>
                Nombre
              </th>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>
                Situación
              </th>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>
                Último Turno
              </th>
            </tr>
          </thead>

          <tbody>
            {grupoFamiliar.map((p) => (
              <tr
                key={p.nroAfiliado}
                style={{ borderBottom: "1px solid #ddd", cursor: "pointer" }}
                onClick={() => navigate(`/afiliados/historia/${p.nroAfiliado}`)}
              >
                <td style={{ padding: "10px 15px" }}>{p.clasificacion}</td>
                <td style={{ padding: "10px 15px" }}>{p.nombre}</td>
                <td style={{ padding: "10px 15px" }}>{p.situacion}</td>
                <td style={{ padding: "10px 15px" }}>{p.ultimoTurno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
