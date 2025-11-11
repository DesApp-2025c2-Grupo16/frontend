import { useState, useEffect, useCallback } from "react";
import CalendarMonth from "../components/CalendarMonth.jsx";

/* 🔹 Toast visual */
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

export default function Turnos() {
  const prestadorId = 1;
  const [turnosPorFecha, setTurnosPorFecha] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });

  // 🔹 Control del mes actual (para pasarle al calendario)
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  /* 🔹 Cargar turnos del mes visible */
  const fetchTurnosDelMes = useCallback(async (anio, mes) => {
    try {
      setLoading(true);
      const ultimoDia = new Date(anio, mes, 0).getDate();
      const resultados = {};

      for (let dia = 1; dia <= ultimoDia; dia++) {
        const fechaISO = `${anio}-${String(mes).padStart(2, "0")}-${String(
          dia
        ).padStart(2, "0")}`;
        try {
          const res = await fetch(
            `http://localhost:3001/turnos/${prestadorId}/fecha/${fechaISO}`
          );
          if (!res.ok) {
            resultados[fechaISO] = 0;
            continue;
          }
          const data = await res.json();
          resultados[fechaISO] = Array.isArray(data) ? data.length : 0;
        } catch {
          resultados[fechaISO] = 0;
        }
      }

      setTurnosPorFecha(resultados);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
      setToast({
        message: "No se pudieron cargar los turnos de este mes.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /* 🔹 Carga inicial */
  useEffect(() => {
    fetchTurnosDelMes(anio, mes);
  }, [anio, mes, fetchTurnosDelMes]);

  /* 🔹 Cuando el calendario cambia de mes */
  const handleChangeMes = (nuevoAnio, nuevoMes) => {
    setAnio(nuevoAnio);
    setMes(nuevoMes);
  };

  return (
    <div className="mt-4 position-relative">
      {/* 🔸 Encabezado con diseño original */}
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

      {/* 🔸 Calendario o carga */}
      {loading ? (
        <div className="text-center mt-5 text-white">Cargando turnos...</div>
      ) : (
        <div className="col-12">
          <CalendarMonth
            key={`${anio}-${mes}`}
            turnos={turnosPorFecha}
            onChangeMes={handleChangeMes}
            anio={anio}
            mes={mes}
          />
        </div>
      )}

      {/* 🔸 Toast de mensajes */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
