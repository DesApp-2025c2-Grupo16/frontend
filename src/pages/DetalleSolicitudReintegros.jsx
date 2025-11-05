import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function DetalleSolicitudReintegros() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [accionConfirmar, setAccionConfirmar] = useState("");
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    const fetchReintegros = async () => {
      try {
        const response = await fetch("http://localhost:3001/reintegros/1");
        const data = await response.json();
        const reintegro = data.find((r) => r.id === parseInt(id));
        setSolicitud(reintegro || null);
      } catch (error) {
        console.error("Error al obtener los reintegros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReintegros();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Cargando solicitud...</div>;
  }

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

      const response = await fetch(`http://localhost:3001/reintegros/${solicitud.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al actualizar el estado");
      }

      const actualizado = await response.json();
      console.log("Reintegro actualizado:", actualizado);

      alert(`Solicitud marcada como ${estado}`);
      cerrarModal();
      navigate("/solicitudes");
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
        DETALLE DE SOLICITUD: {solicitud.Afiliado?.nombre} {solicitud.Afiliado?.apellido}
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
        <p>
          <strong>Afiliado:</strong> {solicitud.Afiliado?.nombre} {solicitud.Afiliado?.apellido}
        </p>
        <p>
          <strong>Fecha de la prestación:</strong>{" "}
          {new Date(solicitud.fecha).toLocaleDateString()}
        </p>
        <p>
          <strong>Especialidad:</strong> {solicitud.especialidad}
        </p>
        <p>
          <strong>Lugar:</strong> {solicitud.lugar}
        </p>

        <hr />

        <h5 style={{ color: "#000" }}>Datos de Factura</h5>
        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(solicitud.fechaFactura).toLocaleDateString()}
        </p>
        <p>
          <strong>CUIT:</strong> {solicitud.cuitFacturado}
        </p>
        <p>
          <strong>Valor Total:</strong> ${solicitud.valorFacturado}
        </p>
        <p>
          <strong>Persona Facturada:</strong> {solicitud.personaFacturada}
        </p>

        <hr />

        <h5 style={{ color: "#000" }}>Forma de Pago</h5>
        <p>
          <strong>Tipo:</strong> {solicitud.formaDePago}
        </p>
        {solicitud.cbu && (
          <p>
            <strong>CBU:</strong> {solicitud.cbu}
          </p>
        )}

        <hr />

        <h5 style={{ color: "#000" }}>Observaciones</h5>
        <p>{solicitud.observacion || "Sin observaciones"}</p>

        <div className="mt-4 d-flex justify-content-around">
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

        <div className="text-center mt-4">
          <button 
            className="btn btn-dark" 
            onClick={async () => {
              // Si la solicitud está en estado "Recibido", la pasamos a "En análisis"
              if (solicitud.estado === "Recibido") {
                try {
                  await fetch(`http://localhost:3001/reintegros/${solicitud.id}`, {
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
              navigate("/solicitudes/reintegros");
            }}
          >
              Volver a la bandeja
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ borderBottom: "none", justifyContent: "center" }}
              >
                <h5 className="modal-title" style={{ color: "#000" }}>
                  Confirmación
                </h5>
              </div>

              <div className="modal-body text-center">
                {requiereComentario(accionConfirmar) ? (
                  <>
                    <p>
                      Escribe el comentario para dejar en{" "}
                      <strong>{accionConfirmar.toLowerCase()}</strong> esta solicitud:
                    </p>
                    <textarea
                      className="form-control bg-white"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows={4}
                      style={{ resize: "none", color: "black" }}
                    />
                  </>
                ) : (
                  <p>
                    ¿Estás seguro de dejar en{" "}
                    <strong>{accionConfirmar.toLowerCase()}</strong> esta solicitud?
                  </p>
                )}
              </div>

              <div
                className="modal-footer"
                style={{ borderTop: "none", justifyContent: "center" }}
              >
                <button className="btn btn-secondary mx-2" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button
                  className={`btn ${
                    accionConfirmar === "Aprobado"
                      ? "btn-success"
                      : accionConfirmar === "Observado"
                      ? "btn-warning"
                      : "btn-danger"
                  } mx-2`}
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
