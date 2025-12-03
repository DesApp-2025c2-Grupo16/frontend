import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ToastMessage from "../components/ToastMessage";

export default function TurnosDelDia() {
  const { fecha } = useParams();
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  
  const [toast, setToast] = useState({ message: "", type: "success" });

  
  const getFromLS = (item)=>{
    const stored = localStorage.getItem(item);
    const parsed = JSON.parse(stored);
    return parsed;
  };

  const [prestadorId, setPrestadorId] = useState( parseInt(localStorage.getItem("prestadorId")) );
  const [prestadores, setPrestadores] = useState( getFromLS("prestadores") )
  const [esCentro, setEsCentro] = useState(() => {
    const user = getFromLS("auth_user");
    return user?.esCentro ?? false;
  });
  const user = getFromLS("auth_user");
  const username = esCentro ? 
    prestadores?.find(p => p.id === prestadorId)?.nombre ?? "Sin prestador"
    : user?.nombre ?? "Sin nombre";

  const [q, setQ] = useState("");

  // PAGINADO
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginasTotales, setPaginasTotales] = useState();
  const itemsPorPagina = 20;

  useEffect(() => {
    const fetchTurnosDelDia = async () => {
      try {
        const id = parseInt(prestadorId);
        if (!isNaN(prestadorId)) {
          const res = await fetch(
            `http://localhost:3001/turnos/${id}/fecha/${fecha}?pagina=${paginaActual}&tamaño=${itemsPorPagina}`
          );
          if (!res.ok)
            throw new Error("No se pudieron cargar los turnos del día.");

          const data = await res.json();
          const turnos = data.turnos;
          setPaginasTotales(Math.ceil(data.count / itemsPorPagina));

          setTurnos(
            turnos.sort(
              (a, b) => new Date(a.fecha) - new Date(b.fecha)
            )
          );
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchTurnosDelDia();
  }, [fecha, prestadorId, paginaActual]);

  const extraerHora = (fechaCompleta) => {
    if (!fechaCompleta) return "--:--";
    const match = fechaCompleta.match(/T(\d{2}:\d{2})/);
    return match ? match[1] : "--:--";
  };

  const fechaTitulo = new Date(`${fecha}T12:00:00`).toLocaleDateString(
    "es-AR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const abrirModal = (turno) => {
    setTurnoSeleccionado({
      turnoId: turno.id,
      paciente: turno.afiliado
        ? `${turno.afiliado.nombre} ${turno.afiliado.apellido}`
        : `#${turno.AfiliadoId}`,
      profesional: username,
      fecha: turno.fecha.split("T")[0],
      hora: extraerHora(turno.fecha),
      especialidad: turno.especialidad || "General",
      motivo: turno.descripcion || "No especificado",
      afiliadoId: turno.AfiliadoId,
    });

    setDescripcion("");
    setModalVisible(true);
  };

  const handleGuardarRegistro = async () => {
    if (!turnoSeleccionado || !descripcion.trim()) {
      setToast({
        message: "La descripción no puede estar vacía",
        type: "error",
      });
      return;
    }

    const nuevaNota = {
      descripcion,
      motivo: turnoSeleccionado.motivo || "Sin motivo registrado",
      doctor: turnoSeleccionado.profesional || "Profesional no indicado",
      fecha: turnoSeleccionado.fecha,
    };

    try {
      const res = await fetch(
        `http://localhost:3001/notas/${turnoSeleccionado.turnoId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaNota),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("ERROR DEL BACK:", errData);
        setToast({
          message: "No se pudo guardar la nota",
          type: "error",
        });
        return;
      }

      await fetch(
        `http://localhost:3001/turnos/${turnoSeleccionado.turnoId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: "Atendido" }),
        }
      );

      setTurnos((prev) =>
        prev.map((t) =>
          t.id === turnoSeleccionado.turnoId
            ? { ...t, estado: "Atendido" }
            : t
        )
      );

      setToast({
        message: "Consulta registrada",
        type: "success",
      });

      setDescripcion("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error guardando nota:", error);
      setToast({
        message: "Ocurrió un error al guardar la consulta",
        type: "error",
      });
    }
  };

  // FILTRO DE BÚSQUEDA
  const turnosFiltrados = turnos.filter((t) => {
    const nombre = t.afiliado
      ? `${t.afiliado.nombre} ${t.afiliado.apellido}`.toLowerCase()
      : "";
    return nombre.includes(q.toLowerCase());
  });

  // Resetear paginado cuando cambia la búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [q]);

  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <h3>Error: {error}</h3>
        <button
          className="btn btn-dark mt-3"
          onClick={() => navigate(-1)}
        >
          Volver atrás
        </button>
      </div>
    );

  return (
    <div className="mt-4 text-center" style={{ fontFamily: "sans-serif" }}>
      <h2
        className="fw-bold py-3 mx-auto rounded-pill"
        style={{
          background: "#1e1e1e",
          color: "white",
          width: "90%",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        TURNOS DEL {fechaTitulo}
      </h2>

      {esCentro && <div className="row justify-content-center align-items-center mt-3"> 
          <div className="col-3 justify-content-center align-items-center">
            <span>Datos del prestador:</span>
          </div>
          <div className="col-5">
            <select 
              className="col-9 form-select" 
              value={prestadorId} 
              onChange={(e) => {
                setPrestadorId(e.target.value)
                localStorage.setItem("prestadorId", e.target.value)
              }}
            >
              {
                prestadores.map((prestador, i) => {
                return <option value={prestador.id} key={i}>{prestador.nombre}</option>
                })
              }
            </select>
          </div>
        </div>
      }

      <hr
      className="border-dark border-5 rounded-pill mx-auto"
      style={{ width: "90%" }}
      />

      {/* BUSCADOR */}
      <div
        className="d-flex justify-content-center align-items-center mt-4"
        style={{
          border: "3px solid #1e1e1e",
          borderRadius: "50px",
          padding: "5px 10px",
          width: "500px",
          margin: "0 auto",
          background: "#242424",
        }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por afiliado..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            borderRadius: "50px",
            marginRight: "10px",
            background: "#242424",
            color: "white",
          }}
        />
      </div>

      {turnosFiltrados.length === 0 && (
        <p className="text-muted mt-3 text-center">
          No se encontraron turnos de ese afiliado.
        </p>
      )}

      <div
        className="mt-4 mx-auto p-4 rounded"
        style={{
          width: "100%",
          textAlign: "left",
          color: "#1e1e1e",
        }}
      >
        {turnosFiltrados.length === 0 ? (
          <p className="text-muted text-center mb-0">
            No hay turnos registrados para este día.
          </p>
        ) : (
          <div className="px-2">
            <h4
              className="fw-bold mb-4 text-uppercase"
              style={{ color: "#1e1e1e" }}
            >
              LISTADO DE TURNOS
            </h4>

            {turnosFiltrados.map((t) => (
              <div
                key={t.id}
                className="mb-3 p-3 rounded shadow-sm position-relative"
                style={{
                  background:
                    t.estado === "Atendido" ? "#d4f8d4" : "white",
                  border:
                    t.estado === "Atendido"
                      ? "2px solid #9ddf9d"
                      : "2px solid #ddd",
                  borderRadius: "15px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold text-dark mb-0">
                    {t.descripcion || "Turno sin descripción"}
                  </h5>
                  <span
                    className="badge bg-dark text-white px-3 py-2 rounded-pill"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {extraerHora(t.fecha)}
                  </span>
                </div>

                <p className="mb-1">
                  <strong>Motivo:</strong>{" "}
                  {t.descripcion || "No indicada"}
                </p>
                <p className="mb-1">
                  <strong>Afiliado:</strong>{" "}
                  {t.afiliado
                    ? `${t.afiliado.nombre} ${t.afiliado.apellido}`
                    : `#${t.AfiliadoId}`}
                </p>
                <p className="mb-0">
                  <strong>Prestador:</strong> {username}
                </p>

                <div className="mt-3 d-flex gap-2">
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => abrirModal(t)}
                    disabled={t.estado === "Atendido"}
                    style={{
                      opacity:
                        t.estado === "Atendido" ? 0.5 : 1,
                      pointerEvents:
                        t.estado === "Atendido"
                          ? "none"
                          : "auto",
                    }}
                  >
                    {t.estado === "Atendido"
                      ? "Consulta registrada"
                      : "Registrar consulta"}
                  </button>

                  <button
                    className="btn btn-sm fw-semibold"
                    style={{
                      backgroundColor: "#f5a623",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      minWidth: "120px",
                      boxShadow:
                        "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                    onClick={() =>
                      navigate(`/historia-clinica/${t.AfiliadoId}`)
                    }
                  >
                    Historia Clínica
                  </button>
                </div>

                {t.estado === "Atendido" && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "15px",
                      fontWeight: "bold",
                      color: "#0a4d0a",
                      fontSize: "0.95rem",
                      opacity: 0.9,
                    }}
                  >
                    Atendido
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === PAGINADO === */}
      {q === "" && paginasTotales > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            margin: "20px 0",
          }}
        >
          <button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
            style={{
              padding: "5px 12px",
              borderRadius: "10px",
              border: "2px solid #242424",
              background:
                paginaActual === 1 ? "#ccc" : "#242424",
              color: "white",
              cursor:
                paginaActual === 1
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            ‹
          </button>

          {[...Array(paginasTotales).keys()].map((i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setPaginaActual(page)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "10px",
                  border: "2px solid #242424",
                  background:
                    paginaActual === page
                      ? "#242424"
                      : "white",
                  color:
                    paginaActual === page
                      ? "white"
                      : "#242424",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={paginaActual === paginasTotales}
            onClick={() => setPaginaActual(paginaActual + 1)}
            style={{
              padding: "5px 12px",
              borderRadius: "10px",
              border: "2px solid #242424",
              background:
                paginaActual === paginasTotales
                  ? "#ccc"
                  : "#242424",
              color: "white",
              cursor:
                paginaActual === paginasTotales
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            ›
          </button>
        </div>
      )}

      <div className="my-4">
        <button
          className="btn btn-dark px-4 py-2 rounded-pill fw-bold"
          onClick={() => navigate("/turnos")}
        >
          Volver al calendario
        </button>
      </div>

      {/* Modal de historia clínica */}
      {modalVisible && turnoSeleccionado && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded shadow-lg text-start"
            style={{ width: "420px", maxWidth: "90%", color: "#212529" }}
          >
            <h5 className="fw-bold mb-3 text-dark text-center border-bottom pb-2">
              Registrar Historia Clínica
            </h5>

            <p className="mb-1">
              <strong>Paciente:</strong>{" "}
              {turnoSeleccionado.paciente}
            </p>
            <p className="mb-1">
              <strong>Profesional:</strong>{" "}
              {turnoSeleccionado.profesional}
            </p>
            <p className="mb-1">
              <strong>Fecha:</strong>{" "}
              {turnoSeleccionado.fecha}
            </p>
            <p className="mb-1">
              <strong>Hora:</strong>{" "}
              {turnoSeleccionado.hora}
            </p>
            <p className="mb-1">
              <strong>Especialidad:</strong>{" "}
              {turnoSeleccionado.especialidad}
            </p>
            <p className="mb-1">
              <strong>Motivo:</strong>{" "}
              {turnoSeleccionado.motivo}
            </p>

            <hr />

            <label className="form-label fw-bold text-dark">
              Descripción
            </label>
            <textarea
              className="form-control mb-3"
              rows="4"
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              placeholder="Escriba aquí las observaciones del médico..."
            />

            <div className="d-flex justify-content-end">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setModalVisible(false)}
              >
                Cerrar
              </button>

              <button
                className="btn btn-primary"
                onClick={handleGuardarRegistro}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast global de TurnosDelDia */}
      <ToastMessage
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}

