import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import Nota from "../components/Nota.jsx";

const INIT = [
  { id: 1, clas: "Afiliado", nombre: "Juan P.", situacion: "Discapacidad", notas: ["02/09/2025 - Control traumatólogo"] },
  { id: 2, clas: "Hijo/a", nombre: "Martina P.", situacion: "Embarazo (4 meses)", notas: [] },
  { id: 3, clas: "Esposo/a", nombre: "Paula S.", situacion: "Migraña", notas: [] },
];

const juan = { nombre: "Juan", apellido: "Perez", situaciones: ["Discapacidad"] };

const notasInit = [
  { id: 1, fecha: "01/06/2024", idPrestador: 1, turno: "Control traumatologico", texto: "Lorem ipsum dolor sit amet..." },
  { id: 2, fecha: "21/09/2024", idPrestador: 1, turno: "Control traumatologico", texto: "Lorem ipsum dolor sit amet..." },
  { id: 3, fecha: "11/12/2024", idPrestador: 1, turno: "Control traumatologico", texto: "Lorem ipsum dolor sit amet..." },
  { id: 4, fecha: "14/03/2025", idPrestador: 1, turno: "Control traumatologico", texto: "Lorem ipsum dolor sit amet..." },
  { id: 5, fecha: "05/06/2025", idPrestador: 1, turno: "Control traumatologico", texto: "Lorem ipsum dolor sit amet..." },
  { id: 6, fecha: "16/09/2025", idPrestador: 1, turno: "Control Traumatologico", texto: "Lorem ipsum dolor sit amet..." },
];

export default function HistoriaClinica() {
  const [paciente, setPaciente] = useState(juan);
  const [notas, setNotas] = useState(notasInit);
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      {/* Barra pill con botón de volver y título centrado */}
      <div className="d-flex align-items-center justify-content-start gap-3 mb-3" style={{ width: "100%", padding: "0 20px" }}>
        <BackButton 
          to="/afiliados" 
          title="Volver a Afiliados" 
          style={{
            height: "50px", 
            lineHeight: "50px", 
            minWidth: "120px", 
            borderRadius: "50px", 
            fontWeight: "bold"
          }} 
        />
        <h2
        className="text-white fw-bold py-2 px-5 mx-auto rounded-pill"
        style={{
          background: "#242424",
          display: "block",
          width: "90%",       // Ocupa casi todo el ancho
          textAlign: "center", // Texto centrado
          margin: "0 auto",   // Centrado horizontal
          lineHeight: "50px", // Altura consistente
        }}
        >
        HISTORIA CLÍNICA
        </h2>
      </div>

      {/* Barra divisora tipo pill */}
      <hr
        className="border-dark border-5 rounded-pill mt-4 mx-auto"
        style={{ width: "90%" }}
      />

      {/* Nombre del paciente */}
      <div className="mb- px-3">
        <h1 className="text-dark fw-bold">
          Paciente: {paciente.nombre} {paciente.apellido}
        </h1>
      </div>

      {/* Notas */}
      <div className="px-3">
        {notas.map(nota => (
          <Nota key={nota.id} nota={nota} />
        ))}
      </div>
    </div>
  );
}

