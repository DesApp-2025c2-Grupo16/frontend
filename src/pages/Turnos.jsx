import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import CalendarMonth from "../components/CalendarMonth.jsx";

/* Toast */
function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  const bgClass = type === "error" ? "text-bg-danger" : "text-bg-success";

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 2000 }}>
      <div
        className={`toast show align-items-center ${bgClass} border-0 shadow`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body fw-semibold">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}

/* ModalTurno */
function ModalTurno({ turno, onClose, onSave }) {
  const [historia, setHistoria] = useState("");
  if (!turno) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
    >
      <div
        className="bg-white p-4 rounded shadow-lg"
        style={{
          width: "420px",
          maxWidth: "90%",
          color: "#212529",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        <h5 className="fw-bold mb-3 text-dark text-center border-bottom pb-2">
          Detalles del Turno
        </h5>
        <div className="mb-3">
          <p className="mb-1">
            <strong>Fecha:</strong> {turno.fecha}
          </p>
          <p className="mb-1">
            <strong>Hora:</strong> {turno.hora || "—"}
          </p>
          <p className="mb-1">
            <strong>Especialidad:</strong> {turno.especialidad}
          </p>
          <p className="mb-1">
            <strong>Situación:</strong> {turno.descripcion}
          </p>
        </div>
        <hr />
        <label className="form-label fw-bold text-dark">Historia médica</label>
        <textarea
          className="form-control mb-3"
          rows="4"
          value={historia}
          onChange={(e) => setHistoria(e.target.value)}
          placeholder="Escriba aquí las observaciones del médico..."
        ></textarea>
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Cerrar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onSave(historia);
              setHistoria("");
              onClose();
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* Componente principal */
export default function Turnos() {
  const { state } = useLocation();
  const prestadorId = 1; // cambiar por el ID real
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    if (!prestadorId) {
      setTurnos([]);
      setLoading(false);
      return;
    }

    const fetchTurnos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/turnos/${prestadorId}`);
        if (!res.ok) throw new Error("Error al obtener turnos");
        const data = await res.json();

        // transformar datos si es necesario
        const turnosFormateados = (data || []).map((t) => ({
          id: t.id,
          fecha: t.fecha.split("T")[0], // solo la fecha
          hora: t.hora || "—",
          especialidad: t.especialidad,
          descripcion: t.descripcion,
        }));

        setTurnos(turnosFormateados);
      } catch (error) {
        console.error("Error cargando turnos:", error);
        setTurnos([]); // si hay error o vacío, mostramos calendario sin turnos
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, [prestadorId]);

  const turnosFiltrados = useMemo(() => {
    if (!filtro.trim()) return turnos;
    const term = filtro.trim().toLowerCase();
    return turnos.filter((t) =>
      t.especialidad.toLowerCase().includes(term)
    );
  }, [turnos, filtro]);

  const handleSave = (texto) => {
    if (texto.trim() === "") {
      setToast({
        message: "Debe ingresar una observación antes de guardar.",
        type: "error",
      });
      setTimeout(() => setToast({ message: "", type: "success" }), 3000);
      return;
    }
    setToast({
      message: "Historia médica guardada correctamente",
      type: "success",
    });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  if (loading)
    return <div className="text-center mt-5 text-white">Cargando turnos...</div>;

  return (
    <div className="mt-4 position-relative">
      <div className="d-flex align-items-center gap-3 mb-3 px-3">
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
          TURNOS DEL PRESTADOR
        </h2>
      </div>

      <hr
        className="border-dark border-5 rounded-pill mt-4 mx-auto"
        style={{ width: "90%" }}
      />

      {/* {prestadorId && (
        <div className="col-12 text-muted mb-3">
          ID del prestador: {prestadorId}
        </div>
      )}  */}

      <div className="col-12 mb-3 text-center">
        <input
          type="text"
          className="form-control w-50 mx-auto rounded-pill"
          placeholder="Filtrar por especialidad"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ minWidth: "280px" }}
        />
      </div>

      <div className="col-12">
        <CalendarMonth
          turnos={turnosFiltrados}
          onSelectTurno={(t) => setSelectedTurno(t)}
        />
      </div>

      {selectedTurno && (
        <ModalTurno
          turno={selectedTurno}
          onClose={() => setSelectedTurno(null)}
          onSave={handleSave}
        />
      )}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
