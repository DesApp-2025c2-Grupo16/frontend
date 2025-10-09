// src/components/ReasonModal.jsx
import { useState, useEffect } from "react";

export default function ReasonModal({ show, onClose, onSend, tipo = "observar" }) {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    if (show) setTexto("");
  }, [show]);

  if (!show) return null;
  const titulo = tipo === "rechazar" ? "Motivo del rechazo" : "Motivo del observamiento";

  return (
    <div className="modal-backdrop fade show d-block">
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content bg-dark text-light">
            <div className="modal-header">
              <h5 className="modal-title">{titulo}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}/>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                rows={5}
                placeholder="Escriba el motivo..."
                value={texto}
                onChange={(e)=>setTexto(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-light" onClick={onClose}>Cancelar</button>
              <button className="btn btn-info" onClick={() => { onSend?.(texto); onClose(); }}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
