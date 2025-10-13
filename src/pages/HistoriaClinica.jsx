import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import BackButton from "../components/BackButton.jsx";
import Nota from "../components/Nota.jsx";

const PACIENTES = {
  juan: {
    nombre: "Juan",
    apellido: "Perez",
    situaciones: ["Discapacidad"],
    notas: [
      { id: 1, fecha: "02/09/2025", turno: "Control traumatológico", texto: "Revisión de movilidad articular." },
      { id: 2, fecha: "16/09/2025", turno: "Fisioterapia", texto: "Mejora en el rango de movimiento." },
    ],
  },
  martina: {
    nombre: "Martina",
    apellido: "Perez",
    situaciones: ["Embarazo (4 meses)"],
    notas: [
      { id: 1, fecha: "01/09/2025", turno: "Control obstétrico", texto: "Ecografía de control sin complicaciones." },
    ],
  },
};

export default function HistoriaClinica() {
  const { id } = useParams(); // toma el id dinamico
  const navigate = useNavigate();

  const paciente = PACIENTES[id]; // seleccionamos el paciente

  if (!paciente) {
    return (
      <div className="text-center mt-5">
        <h2>No se encontró la historia clínica</h2>
        <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="d-flex align-items-center justify-content-start gap-3 mb-3" style={{ width: "100%", padding: "0 20px" }}>
        <BackButton
          to="/afiliados/historia" 
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
          Paciente: {paciente.nombre} {paciente.apellido}
        </h1>
        {paciente.situaciones.map((s, i) => (
          <p key={i}><strong>Situación:</strong> {s}</p>
        ))}
      </div>

      <div className="px-3">
        {paciente.notas.map((nota) => (
          <Nota key={nota.id} nota={nota} />
        ))}
      </div>
    </div>
  );
}

