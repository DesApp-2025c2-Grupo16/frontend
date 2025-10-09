// src/pages/SolicitudesRecetas.jsx
import { useState } from "react";
import ReasonModal from "../components/ReasonModal.jsx";

const demo = [
  {
    id: 1,
    solicitud: "Receta #1",
    afiliado: "Juan P.",
    estado: "Recibido",
    fecha: "05/09/2025",
    detalle: {
      integrante: "Juan P.",
      medicamento: "Ibuprofeno",
      cantidad: "2",
      presentacion: "400 mg x 10 comp.",
      observaciones: "Uso por 5 días."
    }
  },
  {
    id: 2,
    solicitud: "Receta #2",
    afiliado: "Ana G.",
    estado: "En análisis",
    fecha: "07/09/2025",
    detalle: {
      integrante: "Ana G.",
      medicamento: "Amoxicilina",
      cantidad: "1",
      presentacion: "500 mg x 12 caps.",
      observaciones: "Tomar cada 8 hs."
    }
  }
];

const badge = (estado) => {
  const map = { "Recibido":"secondary", "En análisis":"primary", "Observado":"warning", "Aprobado":"success", "Rechazado":"danger" };
  return map[estado] || "secondary";
};

export default function SolicitudesRecetas(){
  const [lista, setLista] = useState(demo);
  const [sel, setSel] = useState(demo[0]);
  const [showObs, setShowObs] = useState(false);
  const [showRec, setShowRec] = useState(false);

  const actualizar = (id, estado, motivo = "") => {
    setLista(prev => prev.map(s => s.id === id ? { ...s, estado, motivo } : s));
    setSel(prev => prev && prev.id === id ? { ...prev, estado, motivo } : prev);
  };

  return (
    <div className="row g-3">
      <div className="col-12"><h2>Solicitudes – Recetas</h2></div>

      <div className="col-12 col-lg-7">
        <div className="card p-3">
          <div className="table-responsive">
            <table className="table table-dark align-middle mb-0">
              <thead>
                <tr>
                  <th>Solicitud</th>
                  <th>Afiliado</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {lista.map(r => (
                  <tr key={r.id} style={{cursor:"pointer"}} onClick={()=>setSel(r)}>
                    <td>{r.solicitud}</td>
                    <td>{r.afiliado}</td>
                    <td><span className={`badge bg-${badge(r.estado)}`}>{r.estado}</span></td>
                    <td>{r.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-5">
        <div className="card p-3">
          <h6 className="text-muted mb-3">Detalle de la receta</h6>
          {sel && (
            <>
              <div className="small mb-1"><strong>Integrante:</strong> {sel.detalle.integrante}</div>
              <div className="small mb-1"><strong>Medicamento:</strong> {sel.detalle.medicamento}</div>
              <div className="small mb-1"><strong>Cantidad:</strong> {sel.detalle.cantidad}</div>
              <div className="small mb-3"><strong>Presentación:</strong> {sel.detalle.presentacion}</div>
              <div className="small mb-3"><strong>Observaciones:</strong> {sel.detalle.observaciones}</div>

              <div className="d-flex gap-2">
                <button className="btn btn-success btn-sm" onClick={()=>actualizar(sel.id,"Aprobado")}>Aprobar</button>
                <button className="btn btn-warning btn-sm" onClick={()=>setShowObs(true)}>Observar</button>
                <button className="btn btn-danger btn-sm" onClick={()=>setShowRec(true)}>Rechazar</button>
              </div>
            </>
          )}
        </div>
      </div>

      <ReasonModal show={showObs} tipo="observar" onClose={()=>setShowObs(false)}
                   onSend={(motivo)=>actualizar(sel.id,"Observado",motivo)} />
      <ReasonModal show={showRec} tipo="rechazar" onClose={()=>setShowRec(false)}
                   onSend={(motivo)=>actualizar(sel.id,"Rechazado",motivo)} />
    </div>
  );
}
