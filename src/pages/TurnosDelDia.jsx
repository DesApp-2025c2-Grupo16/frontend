import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TurnosDelDia({ username = "Prestador" }) {
  const { fecha } = useParams();
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [descripcion, setDescripcion] = useState("");

  const prestadorId = 1;

  useEffect(() => {
    const fetchTurnosDelDia = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/turnos/${prestadorId}/fecha/${fecha}`
        );
        if (!res.ok) throw new Error("No se pudieron cargar los turnos del día.");
        const data = await res.json();

        const turnosConAfiliado = await Promise.all(
          data.map(async (t) => {
            try {
              const afRes = await fetch(
                `http://localhost:3001/afiliados/${t.AfiliadoId}`
              );
              if (!afRes.ok) throw new Error();
              const afData = await afRes.json();
              return { ...t, afiliado: afData };
            } catch {
              return { ...t, afiliado: null };
            }
          })
        );

        setTurnos(turnosConAfiliado);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTurnosDelDia();
  }, [fecha]);

  const extraerHora = (fechaCompleta) => {
    if (!fechaCompleta) return "--:--";
    const match = fechaCompleta.match(/T(\d{2}:\d{2})/);
    return match ? match[1] : "--:--";
  };

  const fechaTitulo = new Date(`${fecha}T12:00:00`).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
      alert("La descripción no puede estar vacía");
      return;
    }

    const nuevaNota = {
      descripcion,
      motivo: turnoSeleccionado.motivo || "Sin motivo registrado",
      doctor: turnoSeleccionado.profesional || "Profesional no indicado",
      fecha: turnoSeleccionado.fecha,
    };

    try {
      console.log("Enviando:", nuevaNota);

      const res = await fetch(`http://localhost:3001/notas/${turnoSeleccionado.turnoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaNota),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("ERROR DEL BACK:", errData);
        alert("No se pudo guardar la nota");
        return;
      }

      alert("✅ Nota guardada");
      setDescripcion("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error guardando nota:", error);
    }
  };

  
  if (loading)
    return (
      <div className="text-center mt-5 text-secondary">
        <h4>Cargando turnos del día...</h4>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <h3>Error: {error}</h3>
        <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
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

      <hr className="border-dark border-5 rounded-pill mt-4" />

      <div
        className="mt-4 mx-auto p-4 rounded"
        style={{
          width: "100%",
          textAlign: "left",
          color: "#1e1e1e",
        }}
      >
        {turnos.length === 0 ? (
          <p className="text-muted text-center mb-0">
            No hay turnos registrados para este día.
          </p>
        ) : (
          <div className="px-2">
            <h4 className="fw-bold mb-4 text-uppercase" style={{ color: "#1e1e1e" }}>
              LISTADO DE TURNOS
            </h4>

            {turnos.map((t) => (
              <div
                key={t.id}
                className="mb-3 p-3 rounded shadow-sm"
                style={{
                  background: "white",
                  border: "2px solid #ddd",
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
                  <strong>Motivo:</strong> {t.descripcion || "No indicada"}
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

                <div className="mt-3">
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => abrirModal(t)}
                  >
                    Registrar consulta
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="my-4">
        <button
          className="btn btn-dark px-4 py-2 rounded-pill fw-bold"
          onClick={() => navigate("/turnos")}
        >
          Volver al calendario
        </button>
      </div>

      {/* ✅ MODAL CON DATOS ALINEADOS A LA IZQUIERDA */}
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

            <p className="mb-1"><strong>Paciente:</strong> {turnoSeleccionado.paciente}</p>
            <p className="mb-1"><strong>Profesional:</strong> {turnoSeleccionado.profesional}</p>
            <p className="mb-1"><strong>Fecha:</strong> {turnoSeleccionado.fecha}</p>
            <p className="mb-1"><strong>Hora:</strong> {turnoSeleccionado.hora}</p>
            <p className="mb-1"><strong>Especialidad:</strong> {turnoSeleccionado.especialidad}</p>
            <p className="mb-1"><strong>Motivo:</strong> {turnoSeleccionado.motivo}</p>

            <hr />

            <label className="form-label fw-bold text-dark">Descripción</label>
            <textarea
              className="form-control mb-3"
              rows="4"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Escriba aquí las observaciones del médico..."
            />

            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={() => setModalVisible(false)}>
                Cerrar
              </button>

              <button className="btn btn-primary" onClick={handleGuardarRegistro}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}