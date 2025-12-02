import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ToastMessage from "../components/ToastMessage";

export default function DetalleSolicitudReintegros() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [accionConfirmar, setAccionConfirmar] = useState("");
  const [comentario, setComentario] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [user, setUser] = useState({});
  const [prestadorId, setPrestadorId] = useState();
  const [prestadores, setPrestadores] = useState([])
  
  const getUser = ()=>{
    const stored = localStorage.getItem("auth_user");
    const parsed = JSON.parse(stored);
    return parsed
  }

  useEffect(()=>{
    const handlePrestador = async () => {
      setUser(getUser())
      if(!user.esCentro){
        setPrestadorId(user.id)
      } else {
        fetch(`http://localhost:3001/prestadores/medicos/${user.id}`)
        .then(r => r.json())
        .then(medicos => {
          setPrestadores(medicos)
          setPrestadorId(medicos[0]?.id) 
      })
        //const data = await medicosAsociados.json()
        //setPrestadores(data)
        //setPrestadorId(prestadores[0].id)
      }
    }
    handlePrestador()
  }, [user.esCentro, user.id])

  useEffect(() => {
    const fetchReintegro = async () => {
      try {
        const response = await fetch(`http://localhost:3001/reintegros/${parseInt(id)}`);
        const data = await response.json();
        setSolicitud(data || null);
      } catch (error) {
        console.error("Error al obtener los reintegros:", error);
      }
    };

    fetchReintegro();
  }, [id]);

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

      if (estado !== "Aprobado") {
        if (!comentarioOpcional || comentarioOpcional.trim() === "") {
          alert("Debes escribir una observación antes de continuar.");
          return;
        }
        body.motivoEstado = comentarioOpcional.trim();
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

      await fetch('http://localhost:3001/registrosSolicitudes/', {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "reintegro",
          estado: estado,
          fecha: new Date(),
          PrestadorId: prestadorId
        })
      })
         const estadoNorm = (estado || "").toLowerCase();
          let toastType = "success";
          if (estadoNorm === "observado") toastType = "warning";
          else if (estadoNorm === "rechazado") toastType = "error";

      setToast({
      message: `Solicitud marcada como ${estado}`,
      type: toastType,
    });
      cerrarModal();
      setTimeout(() => {
        navigate("/solicitudes/reintegros");
        }, 1200);

    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar el estado");
    }
  };

  const requiereComentario = (accion) =>
    accion === "Observado" || accion === "Rechazado";

  const handleReclamada = async () => {
    if (solicitud.estado === "Recibido") {
      try {
        await fetch(`http://localhost:3001/reintegros/${solicitud.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estado: "En análisis",
            PrestadorId: prestadorId
          }),
        });

        await fetch('http://localhost:3001/registrosSolicitudes/', {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "reintegro",
          estado: "En análisis",
          fecha: new Date(),
          PrestadorId: prestadorId
        })
      })
      } catch (error) {
        console.error("Error al actualizar estado:", error);
      }
    }
    navigate("/solicitudes/reintegros");
  }

  const solicitudFinalizada =
    solicitud.estado === "Aprobado" ||
    solicitud.estado === "Observado" ||
    solicitud.estado === "Rechazado";

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
          onClick={handleReclamada}
        >
          Volver a la bandeja
        </button>
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
                      <strong>{accionConfirmar.toLowerCase()}</strong> la solicitud:
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
      <ToastMessage
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
