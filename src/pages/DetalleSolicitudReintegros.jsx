// src/pages/DetalleSolicitudReintegros.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useSolicitudes } from "../components/SolicitudesContext.jsx";

export default function DetalleSolicitudReintegros() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { solicitudes, actualizarEstado } = useSolicitudes();
  const solicitud = solicitudes.find((s) => s.id === parseInt(id));

  if (!solicitud) {
    return (
      <div className="p-4 text-center">
        <h4>Solicitud no encontrada</h4>
        <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  const handleUpdate = (estado) => {
    actualizarEstado(solicitud.id, estado);
    navigate(-1); // vuelve a la lista
  };

  return (
    <div className="mt-4">
        <h2 className="text-white fw-bold py-2 px-5 mx-auto rounded-pill"
            style={{
                background: "#242424",
                width: "90%",
                textAlign: "center",
            }}
        >
        DETALLE DE SOLICITUD ID: {solicitud.id}
      </h2>

      <hr className="border-dark border-5 rounded-pill mt-4 mx-auto" style={{ width: "90%" }} />

      <div className="container card p-4 shadow">
        <p><strong>Afiliado:</strong> {solicitud.afiliado}</p>
        <p><strong>Fecha de la prestación:</strong> {solicitud.fechaPrestacion}</p>
        <p><strong>Integrante:</strong> {solicitud.integrante}</p>
        <p><strong>Médico:</strong> {solicitud.medico}</p>
        <p><strong>Especialidad:</strong> {solicitud.especialidad}</p>
        <p><strong>Lugar:</strong> {solicitud.lugar}</p>

        <hr />

        <h5>Datos de Factura</h5>
        <p><strong>Fecha:</strong> {solicitud.factura.fecha}</p>
        <p><strong>CUIT:</strong> {solicitud.factura.cuit}</p>
        <p><strong>Valor Total:</strong> ${solicitud.factura.total}</p>
        <p><strong>Persona Facturada:</strong> {solicitud.factura.persona}</p>

        <hr />

        <h5>Forma de Pago</h5>
        <p><strong>Tipo:</strong> {solicitud.formaPago.tipo}</p>
        {solicitud.formaPago.cbu && <p><strong>CBU:</strong> {solicitud.formaPago.cbu}</p>}

        <hr />

        <p><strong>Observaciones:</strong> {solicitud.observaciones}</p>

        <div className="mt-4 d-flex justify-content-around">
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

        <div className="text-center mt-4">
          <button className="btn btn-dark" onClick={() => navigate(-1)}>
            Volver a la bandeja
          </button>
        </div>
      </div>
    </div>
  );
}

