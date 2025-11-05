import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import reinicio from "../assets/reinicio.png";

export default function DetalleSolicitudAutorizacion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [accionConfirmar, setAccionConfirmar] = useState("");
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    const fetchAutorizacion = async () => {
      try {
        const prestadorId = 1; // cambiar por el prestador logueado
        const response = await fetch(`http://localhost:3001/autorizaciones/${prestadorId}`);
        const data = await response.json();
        const autorizacion = data.find(a => a.id === parseInt(id));
        setSolicitud(autorizacion || null);
      } catch (error) {
        console.error("Error al obtener la autorización:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAutorizacion();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Cargando solicitud...</div>;

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

  const aceptarAccion = async (estado, comentarioOpcional) => {
    try {
      const body = { estado };
      if (estado === "Aprobado") {
        body.observacion = "Aprobado sin observaciones";
      } else {
        if (!comentarioOpcional || comentarioOpcional.trim() === "") {
          alert("Debes escribir una observación antes de continuar.");
          return;
        }
        body.observacion = comentarioOpcional.trim();
      }

      const response = await fetch(`http://localhost:3001/autorizaciones/${solicitud.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al actualizar el estado");
      }

      const actualizado = await response.json();
      console.log("Autorización actualizada:", actualizado);
      alert(`Solicitud marcada como ${estado}`);
      cerrarModal();
      navigate("/solicitudes/autorizaciones");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar el estado");
    }
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
        DETALLE DE SOLICITUD Nro: {solicitud.id}
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
        <p><strong>Fecha de la prestación:</strong> {new Date(solicitud.fecha).toLocaleDateString()}</p>
        <p><strong>Afiliado:</strong> {solicitud.Afiliado?.nombre} {solicitud.Afiliado?.apellido}</p>
        <p><strong>Médico:</strong> - </p>
        <p><strong>Especialidad:</strong> {solicitud.especialidad}</p>
        <p><strong>Asunto:</strong> {solicitud.asunto}</p>
        <p><strong>Lugar:</strong> {solicitud.lugar}</p>
        <p><strong>Días de Internación:</strong> {solicitud.diasDeInternacion}</p>

        <hr />

        <h5 style={{ color: "#000" }}>Observaciones</h5>
        <p>{solicitud.observacion || "Sin observaciones"}</p>

        <div className="mt-4 d-flex justify-content-around">
          <button className="btn btn-success" onClick={() => abrirModal("Aprobado")}>Aprobar</button>
          <button className="btn btn-warning" onClick={() => abrirModal("Observado")}>Observar</button>
          <button className="btn btn-danger" onClick={() => abrirModal("Rechazado")}>Rechazar</button>
        </div>

        <div className="text-center mt-4">
          <button 
            className="btn btn-dark" 
            onClick={async () => {
              // Si la solicitud está en estado "Recibido", la pasamos a "En análisis"
              if (solicitud.estado === "Recibido") {
                try {
                  await fetch(`http://localhost:3001/autorizaciones/${solicitud.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                      estado: "En análisis",
                      observacion: "En análisis sin observaciones",
                    }),
                  });
                } catch (error) {
                  console.error("Error al actualizar estado:", error);
                }
              }
              navigate("/solicitudes/autorizaciones");
            }}
            >
            Volver a la bandeja
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: "none", justifyContent: "center" }}>
                <h5 className="modal-title text-dark">Confirmación</h5>
              </div>

              <div className="modal-body text-center">
                {requiereComentario(accionConfirmar) ? (
                  <>
                    <p>Escribe un comentario para <strong>{accionConfirmar.toLowerCase()}</strong> esta solicitud:</p>
                    <textarea
                      className="form-control bg-white text-dark"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows={4}
                      style={{ resize: "none" }}
                    />
                  </>
                ) : (
                  <p>¿Estás seguro de <strong>{accionConfirmar.toLowerCase()}</strong> esta solicitud?</p>
                )}
              </div>

              <div className="modal-footer" style={{ borderTop: "none", justifyContent: "center" }}>
                <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                <button
                  className={`btn ${
                    accionConfirmar === "Aprobado"
                      ? "btn-success"
                      : accionConfirmar === "Observado"
                      ? "btn-warning"
                      : "btn-danger"
                  }`}
                  onClick={() => aceptarAccion(accionConfirmar, comentario)}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
