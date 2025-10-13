import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import CalendarMonth from "../components/CalendarMonth.jsx";
import BackButton from "../components/BackButton.jsx";

/* =====================================================
   🔹 COMPONENTE: Toast (notificación flotante)
===================================================== */
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

/* =====================================================
   🔹 COMPONENTE: ModalTurno (detalle + textarea)
===================================================== */
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
          <p className="mb-1"><strong>Paciente:</strong> {turno.paciente}</p>
          <p className="mb-1"><strong>Profesional:</strong> {turno.profesional}</p>
          <p className="mb-1"><strong>Fecha:</strong> {turno.fecha}</p>
          <p className="mb-1"><strong>Hora:</strong> {turno.hora}</p>
          <p className="mb-1"><strong>Situación:</strong> {turno.situacion}</p>
        </div>

        <hr />

        <label className="form-label fw-bold text-dark">
          Historia médica
        </label>
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

/* =====================================================
   🔹 COMPONENTE PRINCIPAL: Turnos
===================================================== */
export default function Turnos() {
  const { state } = useLocation();
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [filtro, setFiltro] = useState("");

  // 🔹 Mock de datos
  const [turnos] = useState([
    {
      id: 1,
      fecha: "2025-10-13",
      hora: "10:00",
      paciente: "Juan Pérez",
      profesional: "Dra. Gómez",
      situacion: "Consulta clínica",
    },
    {
      id: 2,
      fecha: "2025-10-15",
      hora: "15:30",
      paciente: "Ana Rodríguez",
      profesional: "Dr. López",
      situacion: "Control post operatorio",
    },
    {
      id: 3,
      fecha: "2025-10-15",
      hora: "17:00",
      paciente: "Carlos Díaz",
      profesional: "Dra. Fernández",
      situacion: "Análisis de laboratorio",
    },
    {
      id: 4,
      fecha: "2025-10-20",
      hora: "09:00",
      paciente: "María López",
      profesional: "Dr. Alvarez",
      situacion: "Consulta dermatológica",
    },
    {
      id: 11,
      fecha: "2025-11-02",
      hora: "09:30",
      paciente: "Diego Sánchez",
      profesional: "Dr. López",
      situacion: "Chequeo preoperatorio",
    },
    {
      id: 12,
      fecha: "2025-11-04",
      hora: "12:00",
      paciente: "Camila Herrera",
      profesional: "Dra. Fernández",
      situacion: "Consulta ginecológica",
    },
    {
      id: 13,
      fecha: "2025-11-07",
      hora: "08:45",
      paciente: "Tomás Medina",
      profesional: "Dr. Pérez",
      situacion: "Evaluación traumatológica",
    },
    {
      id: 14,
      fecha: "2025-11-10",
      hora: "10:15",
      paciente: "Valeria Gómez",
      profesional: "Dra. Díaz",
      situacion: "Análisis de sangre",
    },
    {
      id: 15,
      fecha: "2025-11-13",
      hora: "15:45",
      paciente: "Rodrigo Castro",
      profesional: "Dr. Herrera",
      situacion: "Control dermatológico",
    },
    {
      id: 16,
      fecha: "2025-11-15",
      hora: "09:00",
      paciente: "Florencia Rivas",
      profesional: "Dra. Navarro",
      situacion: "Chequeo pediátrico",
    },
    {
      id: 17,
      fecha: "2025-11-18",
      hora: "14:00",
      paciente: "Ignacio Cabrera",
      profesional: "Dr. Vázquez",
      situacion: "Consulta clínica",
    },
    {
      id: 18,
      fecha: "2025-11-20",
      hora: "11:30",
      paciente: "Daniela Torres",
      profesional: "Dra. Suárez",
      situacion: "Evaluación neurológica",
    },
    {
      id: 19,
      fecha: "2025-11-24",
      hora: "10:00",
      paciente: "Mariano López",
      profesional: "Dr. Benítez",
      situacion: "Control post operatorio",
    },
    {
      id: 20,
      fecha: "2025-11-29",
      hora: "13:30",
      paciente: "Romina Alvarez",
      profesional: "Dra. Herrera",
      situacion: "Consulta dermatológica",
    }
  ]);

  /* =====================================================
     🔹 Filtrado de turnos por "situacion"
  ===================================================== */
  const turnosFiltrados = useMemo(() => {
    if (!filtro.trim()) return turnos;
    const term = filtro.trim().toLowerCase();
    return turnos.filter((t) =>
      t.situacion.toLowerCase().includes(term)
    );
  }, [turnos, filtro]);

  /* =====================================================
     🔹 Guardar historia (simulado)
  ===================================================== */
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
      message: "Historia médica guardada correctamente ✅",
      type: "success",
    });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  return (
    <div className="mt-4 position-relative">
      {/* Barra superior */}
      <div className="d-flex align-items-center gap-3 mb-3 px-3">
        <BackButton
          to="/afiliados"
          title="Volver a Afiliados"
          style={{
            height: "50px",
            lineHeight: "50px",
            minWidth: "120px",
            borderRadius: "50px",
            fontWeight: "bold",
          }}
        />
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
          TURNOS
        </h2>
      </div>

      <hr
        className="border-dark border-5 rounded-pill mt-4 mx-auto"
        style={{ width: "90%" }}
      />

      {state?.nro && (
        <div className="col-12 text-muted mb-3">Afiliado: {state.nro}</div>
      )}

      {/* 🔹 Campo de filtro */}
      <div className="col-12 mb-3 text-center">
        <input
          type="text"
          className="form-control w-50 mx-auto"
          placeholder="Filtrar por espacialidad"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ minWidth: "280px" }}
        />
      </div>

      {/* Calendario */}
      <div className="col-12">
        <CalendarMonth
          turnos={turnosFiltrados}
          onSelectTurno={(t) => setSelectedTurno(t)}
        />
      </div>

      {/* Modal */}
      {selectedTurno && (
        <ModalTurno
          turno={selectedTurno}
          onClose={() => setSelectedTurno(null)}
          onSave={handleSave}
        />
      )}

      {/* Toast (éxito o error) */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
