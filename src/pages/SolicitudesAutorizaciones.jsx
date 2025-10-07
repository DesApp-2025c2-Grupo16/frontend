// src/pages/SolicitudesAutorizaciones.jsx
import { useState } from "react";
import ReasonModal from "../components/ReasonModal.jsx";

const demo = [
  {
    id: 1,
    solicitud: "Autorización #1",
    afiliado: "Juan P.",
    estado: "En análisis",
    fecha: "02/09/2025",
    detalle: {
      fechaPrevista: "03/09/2025",
      integrante: "Juan P. (titular)",
      medico: "Dr. Alejandro Ramírez",
      especialidad: "Cirugía General",
      lugar: "Hospital San Lucas (CABA)",
      dias: "3",
      observaciones: "Cirugía programada de hernia inguinal."
    }
  },
  {
    id: 2,
    solicitud: "Autorización #2",
    afiliado: "Ana G.",
    estado: "Recibido",
    fecha: "04/09/2025",
    detalle: {
      fechaPrevista: "06/09/2025",
      integrante: "Ana G. (hija)",
      medico: "Dra. M. López",
      especialidad: "Traumatología",
      lugar: "Clínica Santa María",
      dias: "1",
      observaciones: "Artroscopía diagnóstica."
    }
  }
];

const badge = (estado) => {
  const map = { "Recibido":"secondary", "En análisis":"primary", "Observado":"warning", "Aprobado":"success", "Rechazado":"danger" };
  return map[estado] || "secondary";
};

export default function SolicitudesAutorizaciones(){
  const [lista, setLista] = useState(demo);
  const [sel, setSel] = useState(demo[0]);
  const [showObs, setShowObs] = useState(false);
  const [showRec, setShowRec] = useState(false);

  const actualizar = (id, estado, motivo = "") => {
    setLista(prev => prev.map(s => s.id === id ? { ...s, estado, motivo } : s));
    setSel(prev => prev && prev.id === id ? { ...prev, estado, motivo } : prev);
  };

  return (
    <div className="mt-4">
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
        SOLICITUDES - AUTORIZACIONES
      </h2>

      <hr
        className="border-dark border-5 rounded-pill mt-4 mx-auto"
        style={{ width: "90%" }}
      />

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
          <h6 className="text-muted mb-3">Análisis de la solicitud</h6>
          {sel && (
            <>
              <div className="small mb-1"><strong>Fecha prevista:</strong> {sel.detalle.fechaPrevista}</div>
              <div className="small mb-1"><strong>Integrante:</strong> {sel.detalle.integrante}</div>
              <div className="small mb-1"><strong>Médico:</strong> {sel.detalle.medico}</div>
              <div className="small mb-1"><strong>Especialidad:</strong> {sel.detalle.especialidad}</div>
              <div className="small mb-1"><strong>Lugar:</strong> {sel.detalle.lugar}</div>
              <div className="small mb-3"><strong>Días de internación:</strong> {sel.detalle.dias}</div>
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
