import { useParams, useNavigate } from "react-router-dom";
import { useSolicitudes } from "../components/SolicitudesContext.jsx";

export default function DetalleSolicitudAutorizacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { solicitudes, actualizarEstado } = useSolicitudes();
  
  const solicitud = solicitudes.find(s => s.id === parseInt(id) && s.tipo === "autorizacion");

  if (!solicitud) {
    return (
      <div className="p-4 text-center">
        <h4 style={{ color: "#000" }}>Solicitud no encontrada</h4>
        <button className="btn btn-dark mt-3" onClick={() => navigate("/solicitudes/autorizaciones")}>
          Volver a la bandeja
        </button>
      </div>
    );
  }

  const handleUpdate = (estado) => {
    actualizarEstado(solicitud.id, estado);
    navigate("/solicitudes/autorizaciones");
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
        DETALLE DE SOLICITUD ID: {solicitud.id}
      </h2>

      <hr className="border-dark border-5 rounded-pill mt-4 mx-auto" style={{ width: "90%" }} />

      <div className="container" style={{ backgroundColor: "white", border: "20px solid #242424", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
        <h5 style={{ color: "#000" }}>Datos de Paciente</h5>
        <p><strong>Afiliado:</strong> {solicitud.afiliado}</p>
        <p><strong>Fecha prevista:</strong> {solicitud.detalle.fechaPrevista}</p>
        <p><strong>Integrante:</strong> {solicitud.detalle.integrante}</p>
        <p><strong>Médico:</strong> {solicitud.detalle.medico}</p>
        <p><strong>Especialidad:</strong> {solicitud.detalle.especialidad}</p>
        <p><strong>Lugar:</strong> {solicitud.detalle.lugar}</p>
        <p><strong>Días de internación:</strong> {solicitud.detalle.dias}</p>

        <hr />

        <h5 style={{ color: "#000" }}>Observaciones</h5>
        <p>{solicitud.detalle.observaciones}</p>

        <div className="mt-4 d-flex justify-content-around">
          <button className="btn btn-success" onClick={() => handleUpdate("Aprobado")}>Aprobar</button>
          <button className="btn btn-warning" onClick={() => handleUpdate("Observado")}>Observar</button>
          <button className="btn btn-danger" onClick={() => handleUpdate("Rechazado")}>Rechazar</button>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-dark" onClick={() => navigate("/solicitudes/autorizaciones")}>
            Volver a la bandeja
          </button>
        </div>
      </div>
    </div>
  );
}
