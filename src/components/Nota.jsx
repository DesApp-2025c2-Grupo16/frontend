import { useState } from "react";

export default function Nota({ nota }) {
  const [mostrar, setMostrar] = useState(false);

  const toggleMostrar = () => setMostrar(!mostrar);

  return (
    <div className="mb-4 p-3 border rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <p className="mb-1"><strong>Fecha:</strong> {new Date(nota.fecha).toLocaleDateString()}</p>
          <p className="mb-1"><strong>Causa:</strong> {nota.motivo || nota.descripcion}</p>
          <p className="mb-1"><strong>Doctor:</strong> {nota.doctor || "—"}</p>
        </div>
        <button className="btn btn-sm btn-primary" onClick={toggleMostrar}>
          {mostrar ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {mostrar && (
        <div className="mt-2 p-2 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
          <p><strong>Descripción:</strong> {nota.descripcion || nota.texto}</p>
        </div>
      )}
    </div>
  );
}
