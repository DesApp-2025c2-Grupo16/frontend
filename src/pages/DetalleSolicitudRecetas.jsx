import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function DetalleSolicitudRecetas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [accionConfirmar, setAccionConfirmar] = useState("");
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const prestadorId = 1; // TODO: traer del contexto/auth
        const res = await fetch(`http://localhost:3001/recetas/${prestadorId}`);
        const data = await res.json();
        const item = data.find(r => r.id === parseInt(id));
        setSolicitud(item || null);
      } catch (err) {
        console.error("Error al obtener recetas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecetas();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Cargando solicitud...</div>;

  if (!solicitud) {
    return (
      <div className="p-4 text-center">
        <h4 style={{ color: "#000" }}>Solicitud no encontrada</h4>
        <button className="btn btn-dark mt-3" onClick={() => navigate("/solicitudes/recetas")}>
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

  const requiereComentario = (accion) => accion === "Observado" || accion === "Rechazado";

  const aceptarAccion = async (estado, comentarioOpcional) => {
    try {
      const body = { estado };

      if (requiereComentario(estado)) {
        if (!comentarioOpcional || comentarioOpcional.trim() === "") {
          alert("Debes escribir una observación antes de continuar.");
          return;
        }
        body.motivoEstado = comentarioOpcional.trim();
      }

      const res = await fetch(`http://localhost:3001/recetas/${solicitud.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Error al actualizar el estado");
      }

      alert(`Solicitud marcada como ${estado}`);
      cerrarModal();
      navigate("/solicitudes/recetas");
    } catch (err) {
      console.error(err);
      alert("Hubo un error al actualizar el estado");
    }
  };

  const solicitudFinalizada =
    solicitud.estado === "Aprobado" ||
    solicitud.estado === "Observado" ||
    solicitud.estado === "Rechazado";

  return (
    <div className="mt-4">
      {/* Título pill */}
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

      {/* Contenedor */}
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
        <h5 style={{ color: "#000" }}>Datos de la receta</h5>
        <p><strong>Afiliado:</strong> {solicitud.Afiliado?.nombre} {solicitud.Afiliado?.apellido}</p>
        <p><strong>Medicamento:</strong> {solicitud.medicamento}</p>
        <p><strong>Cantidad:</strong> {solicitud.cantidad}</p>
        <p><strong>Presentación:</strong> {solicitud.presentacion}</p>
        <p><strong>Fecha de emisión:</strong> {new Date(solicitud.fecha).toLocaleDateString()}</p>

        <hr />

        <h5 style={{ color: "#000" }}>Observaciones</h5>
        <p>{solicitud.observacion || "Sin observaciones"}</p>

        {/* Solo se muestran botones si no está finalizada */}
        {!solicitudFinalizada && (
          <div className="mt-5 d-flex justify-content-around">
            <button className="btn btn-success" onClick={() => abrirModal("Aprobado")}>
              Aprobar
            </button>
            <button className="btn btn-warning" onClick={() => abrirModal("Observado")}>
              Observar
            </button>
            <button className="btn btn-danger" onClick={() => abrirModal("Rechazado")}>
              Rechazar
            </button>
          </div>
        )}

        <div className="text-center mt-4">
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button
          className="btn btn-dark"
          onClick={async () => {
            if (solicitud.estado === "Recibido") {
              try {
                await fetch(`http://localhost:3001/reintegros/${solicitud.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    estado: "En análisis",
                  }),
                });
              } catch (error) {
                console.error("Error al actualizar estado:", error);
              }
            }
            navigate("/solicitudes/reintegros");
          }}
        >
          Volver a la bandeja
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: "none", justifyContent: "center" }}>
                <h5 className="modal-title" style={{ color: "#000" }}>Confirmación</h5>
              </div>

              <div className="modal-body text-center">
                {requiereComentario(accionConfirmar) ? (
                  <>
                    <p>
                      Escribí un comentario para{" "}
                      <strong>{accionConfirmar.toLowerCase()}</strong> esta solicitud:
                    </p>
                    <textarea
                      className="form-control bg-white text-dark"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows={4}
                      style={{ resize: "none" }}
                    />
                  </>
                ) : (
                  <p>
                    ¿Estás seguro de <strong>{accionConfirmar.toLowerCase()}</strong> esta solicitud?
                  </p>
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
