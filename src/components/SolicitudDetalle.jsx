import { useState } from "react";

export default function SolicitudDetalle({ solicitud, onClose, onUpdate, statusClass }) {
  const [motivo, setMotivo] = useState("");
  const [alerta, setAlerta] = useState(null);

  const handleUpdate = (estado) => {
    onUpdate(solicitud.id, estado, motivo);
    setAlerta(`Solicitud #${solicitud.id} actualizada a ${estado}`);
    setMotivo(""); // limpia textarea

    // Ocultar alerta después de 3s
    setTimeout(() => setAlerta(null), 3000);
  };

  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h5>Solicitud #{solicitud.id} – {solicitud.afiliado}</h5>
        <span className={`status ${statusClass(solicitud.estado)}`}>
          {solicitud.estado}
        </span>
      </div>

      {/* Alerta de feedback */}
      {alerta && (
        <div className="alert alert-info py-2 px-3 mt-3 mb-2" role="alert">
          {alerta}
        </div>
      )}

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-success" onClick={() => handleUpdate("Aprobado")}>
          Aprobar
        </button>

        <button className="btn btn-warning text-dark" onClick={() => handleUpdate("Observado")}>
          Observar
        </button>

        <button className="btn btn-danger" onClick={() => handleUpdate("Rechazado")}>
          Rechazar
        </button>
      </div>

      <textarea
        className="form-control mt-3"
        rows="3"
        placeholder="Escriba el motivo..."
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />

      <div className="mt-3 text-end">
        <button className="btn btn-outline-light btn-sm" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}