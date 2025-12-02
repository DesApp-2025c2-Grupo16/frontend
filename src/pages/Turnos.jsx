import { useState, useEffect, useCallback } from "react";
import CalendarMonth from "../components/CalendarMonth.jsx";
import ToastMessage from "../components/ToastMessage";

export default function Turnos() {
  const [turnosPorFecha, setTurnosPorFecha] = useState({});
  const [turnosCompletos, setTurnosCompletos] = useState([]);
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

  const [q, setQ] = useState(""); // Buscador

  // Control del mes actual
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  /* ============================
     Cargar turnos del mes visible
     ============================ */
  const fetchTurnosDelMes = useCallback(
    async (anio, mes) => {
      try {
        const ultimoDia = new Date(anio, mes, 0).getDate();
        const resultadosConteo = {};
        const resultadosTurnos = [];

        const id = parseInt(prestadorId);
        if (!isNaN(id)) {
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

              const resData = await res.json();
              const data = resData.turnos;

              resultadosConteo[fechaISO] = Array.isArray(data)
                ? data.length
                : 0;

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
      }
    },
    [prestadorId]
  );

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

      {esCentro && (
        <div className="row justify-content-center align-items-center">
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
      )}

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

      <div className="col-12">
        <CalendarMonth
          key={`${anio}-${mes}`}
          turnos={turnosParaCalendario}
          onChangeMes={handleChangeMes}
          anio={anio}
          mes={mes}
        />
      </div>

      {/* Toast global de Turnos */}
      <ToastMessage
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
