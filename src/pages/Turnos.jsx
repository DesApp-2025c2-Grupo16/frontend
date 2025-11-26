import { useState, useEffect, useCallback } from "react";
import CalendarMonth from "../components/CalendarMonth.jsx";

/* Toast visual */
function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  const bgClass = type === "error" ? "text-bg-danger" : "text-bg-success";

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 2000 }}
    >
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
  const [turnosPorFecha, setTurnosPorFecha] = useState({});
  const [turnosCompletos, setTurnosCompletos] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const medicosAsociados = await fetch(`http://localhost:3001/prestadores/medicos/${user.id}`)
        const data = await medicosAsociados.json()
        setPrestadores(data)
        setPrestadorId(prestadores[0].id)
      }
    }
    handlePrestador()
  }, [user.esCentro, user.id])

  const [q, setQ] = useState(""); // 🔍 Buscador

  // Control del mes actual
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  /* ============================
     Cargar turnos del mes visible
     ============================ */
  const fetchTurnosDelMes = useCallback(async (anio, mes) => {
    try {
      setLoading(true);

      const ultimoDia = new Date(anio, mes, 0).getDate();
      const resultadosConteo = {};
      const resultadosTurnos = [];

      const id = parseInt(prestadorId)
      if(!isNaN(id)){
        for (let dia = 1; dia <= ultimoDia; dia++) {
          const fechaISO = `${anio}-${String(mes).padStart(2, "0")}-${String(
            dia
          ).padStart(2, "0")}`;
  
          try {
            const res = await fetch(
              `http://localhost:3001/turnos/${id}/fecha/${fechaISO}`
            );
  
            if (!res.ok) {
              resultadosConteo[fechaISO] = 0;
              continue;
            }
  
            const data = await res.json();
  
            // data = array de turnos
            resultadosConteo[fechaISO] = Array.isArray(data) ? data.length : 0;
  
            if (Array.isArray(data)) {
              data.forEach((t) =>
                resultadosTurnos.push({
                  ...t,
                  fechaISO,
                })
              );
            }
          } catch {
            resultadosConteo[fechaISO] = 0;
          }
        }
  
        setTurnosPorFecha(resultadosConteo);
        setTurnosCompletos(resultadosTurnos);
      }

    } catch (error) {
      console.error("Error al cargar turnos:", error);
      setToast({
        message: "No se pudieron cargar los turnos de este mes.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [prestadorId]);

  /* Carga inicial */
  useEffect(() => {
    fetchTurnosDelMes(anio, mes);
  }, [anio, mes, fetchTurnosDelMes]);

  /* Cuando el calendario cambia de mes */
  const handleChangeMes = (nuevoAnio, nuevoMes) => {
    setAnio(nuevoAnio);
    setMes(nuevoMes);
  };

  /* ============================
     FILTRO DE BÚSQUEDA por afiliado
     ============================ */
  const turnosFiltrados = turnosCompletos.filter((t) => {
    if (!q) return true;

    const nombreCompleto = t.afiliado
      ? `${t.afiliado.nombre} ${t.afiliado.apellido}`.toLowerCase()
      : "";

    return nombreCompleto.includes(q.toLowerCase());
  });

  /* ============================
     Recalcular conteo por fecha cuando se filtra
     ============================ */
  const conteoFiltrado = {};

  turnosFiltrados.forEach((t) => {
    conteoFiltrado[t.fechaISO] = (conteoFiltrado[t.fechaISO] || 0) + 1;
  });

  // Si no hay búsqueda, mostrar conteo real
  const turnosParaCalendario = q ? conteoFiltrado : turnosPorFecha;

  return (
  <div className="mt-4 position-relative">

    {/* Encabezado */}
    <div className="d-flex align-items-center gap-3 mb-3 px-3 mt-4">
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
      className="border-dark border-5 rounded-pill mx-auto"
      style={{ width: "90%" }}
    />

    {/* BUSCADOR debajo del título */}
    <div
      className="d-flex justify-content-center align-items-center mb-4"
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
        placeholder="Buscar turnos del afiliado..."
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

    {/* Calendario */}
    {loading ? (
      <div className="text-center mt-5 text-white">Cargando turnos...</div>
    ) : (
      <div className="col-12">
        <CalendarMonth
          key={`${anio}-${mes}`}
          turnos={turnosParaCalendario}
          onChangeMes={handleChangeMes}
          anio={anio}
          mes={mes}
        />
      </div>
    )}

    {/* Toast */}
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast({ message: "", type: "success" })}
    />
  </div>
);

}
