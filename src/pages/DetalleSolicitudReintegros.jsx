import { useParams, useNavigate } from "react-router-dom";
import { useSolicitudes } from "../components/SolicitudesContext.jsx";
import { useState } from "react";

export default function DetalleSolicitudReintegros() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { solicitudes, actualizarEstado } = useSolicitudes();

  const solicitud = solicitudes.find(s => s.id === parseInt(id) && s.tipo === "reintegro");

  const [showModal, setShowModal] = useState(false);
  const [accionConfirmar, setAccionConfirmar] = useState("");
  const [comentario, setComentario] = useState("");

  if (!solicitud) {
    return (
      <div className="p-4 text-center">
        <h4 style={{ color: "#000" }}>Solicitud no encontrada</h4>
        <button className="btn btn-dark mt-3" onClick={() => navigate("/solicitudes")}>
          Volver a la bandeja
        </button>
      </div>
    );
  }

  const handleUpdate = (estado, comentarioOpcional) => {
    actualizarEstado(solicitud.id, estado, comentarioOpcional || "");
    navigate("/solicitudes");
  };

  const abrirModal = (accion) => {
    setAccionConfirmar(accion);
    setComentario("");
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setAccionConfirmar("");
    setComentario("");
  };

  const aceptarAccion = () => {
    handleUpdate(accionConfirmar, comentario);
    cerrarModal();
  };

  const colorBoton = (accion) => {
    return "btn-primary";
  };

  const requiereComentario = (accion) => accion === "Observado" || accion === "Rechazado";

  return (
    <div className="mt-4">
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
        DETALLE DE SOLICITUD ID: {solicitud.id}
      </h2>

      <hr className="border-dark border-5 rounded-pill mt-4 mx-auto" style={{ width: "90%" }} />

      <div
        className="container"
        style={{
          backgroundColor: "white",
          border: "20px solid #242424",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h5 style={{ color: "#000" }}>Datos de Paciente</h5>
        <p><strong>Afiliado:</strong> {solicitud.afiliado}</p>
        <p><strong>Fecha de la prestación:</strong> {solicitud.fechaPrestacion}</p>
        <p><strong>Integrante:</strong> {solicitud.integrante}</p>
        <p><strong>Médico:</strong> {solicitud.medico}</p>
        <p><strong>Especialidad:</strong> {solicitud.especialidad}</p>
        <p><strong>Lugar:</strong> {solicitud.lugar}</p>

        <hr />

        <h5 style={{ color: "#000" }}>Datos de Factura</h5>
        <p><strong>Fecha:</strong> {solicitud.factura.fecha}</p>
        <p><strong>CUIT:</strong> {solicitud.factura.cuit}</p>
        <p><strong>Valor Total:</strong> ${solicitud.factura.total}</p>
        <p><strong>Persona Facturada:</strong> {solicitud.factura.persona}</p>

        <hr />

        <h5 style={{ color: "#000" }}>Forma de Pago</h5>
        <p><strong>Tipo:</strong> {solicitud.formaPago.tipo}</p>
        {solicitud.formaPago.cbu && <p><strong>CBU:</strong> {solicitud.formaPago.cbu}</p>}
        <hr />

        <h5 style={{ color: "#000" }}>Observaciones</h5>
        <p>{solicitud.observaciones}</p>

        <div className="mt-4 d-flex justify-content-around">
          <button className="btn btn-success" onClick={() => abrirModal("Aprobado")}>Aprobar</button>
          <button className="btn btn-warning" onClick={() => abrirModal("Observado")}>Observar</button>
          <button className="btn btn-danger" onClick={() => abrirModal("Rechazado")}>Rechazar</button>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-dark" onClick={() => navigate("/solicitudes")}>
            Volver a la bandeja
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ borderBottom: "none", justifyContent: "center" }}
              >
                <h5 className="modal-title" style={{ color: "#000" }}>Confirmación</h5>
              </div>

              <div className="modal-body text-center">
                {requiereComentario(accionConfirmar) ? (
                  <>
                    <p>Escribe el comentario para dejar en <strong>{accionConfirmar.toLowerCase()}</strong> esta solicitud:</p>
                    <textarea
                      className="form-control bg-white "
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows={4}
                      style={{ backgroundColor: "white !important", color: "black", resize: "none" }}
                    />
                  </>
                ) : (
                  <p>¿Estás seguro de dejar en <strong>{accionConfirmar.toLowerCase()}</strong> esta solicitud?</p>
                )}
              </div>

              <div
                className="modal-footer"
                style={{ borderTop: "none", justifyContent: "center" }}
              >
                <button className="btn btn-secondary mx-2" onClick={cerrarModal}>Cancelar</button>
                <button className={`btn ${colorBoton(accionConfirmar)} mx-2`} onClick={aceptarAccion}>Aceptar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
