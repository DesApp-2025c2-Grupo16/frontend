import { useState } from "react";
import SolicitudDetalle from "../components/SolicitudDetalle.jsx";

const FAKE_SOLICITUDES = [
  { id: 1, afiliado: "Juan P.", estado: "En análisis", motivo: "" },
  { id: 2, afiliado: "Ana G.", estado: "Recibido", motivo: "" },
  { id: 3, afiliado: "Luis R.", estado: "Recibido", motivo: "" },
];

const statusClass = (estado) => {
  const map = {
    "recibido": "recibido",
    "en analisis": "analisis",
    "observado": "observado",
    "aprobado": "aprobado",
    "rechazado": "rechazado",
  };
  const key = estado
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/\s+/g, " "); // normaliza espacios
  return map[key] || "recibido";
};

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState(FAKE_SOLICITUDES);
  const [sel, setSel] = useState(null);

  const actualizar = (id, nuevoEstado, motivo = "") => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, estado: nuevoEstado, motivo } : s
      )
    );
    // refresca también el detalle si está abierto
    setSel((prev) =>
      prev && prev.id === id ? { ...prev, estado: nuevoEstado, motivo } : prev
    );
  };

  return (
    <div className="row g-3">
      <div className="col-12"><h2>Solicitudes</h2></div>

      <div className="col-12 col-md-6">
        <div className="card">
          <div className="card-header">Listado</div>
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Afiliado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s) => (
                <tr key={s.id} onClick={() => setSel(s)} style={{ cursor: "pointer" }}>
                  <td>{s.id}</td>
                  <td>{s.afiliado}</td>
                  <td>
                    <span className={`status ${statusClass(s.estado)}`}>{s.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-12 col-md-6">
        {sel && (
          <SolicitudDetalle
            solicitud={sel}
            onClose={() => setSel(null)}
            onUpdate={actualizar}
            statusClass={statusClass}
          />
        )}
      </div>
    </div>
  );
}