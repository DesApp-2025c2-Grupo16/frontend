import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CalendarMonth({ turnos = {}, onChangeMes, anio, mes }) {
  const navigate = useNavigate();

  // usamos año y mes recibidos del padre
  const [year, setYear] = useState(anio);
  const [month, setMonth] = useState(mes - 1); // base 0

  useEffect(() => {
    setYear(anio);
    setMonth(mes - 1);
  }, [anio, mes]);

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = (first.getDay() + 6) % 7;

  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = i - startPad + 1;
    days.push(d >= 1 && d <= last.getDate() ? d : 0);
  }

  const nombreMes = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));

  const changeMonth = (delta) => {
    const nueva = new Date(year, month + delta, 1);
    setYear(nueva.getFullYear());
    setMonth(nueva.getMonth());
    if (onChangeMes)
      onChangeMes(nueva.getFullYear(), nueva.getMonth() + 1);
    console.log(
      "Mes cambiado a:",
      nueva.toLocaleString("es-AR", { month: "long", year: "numeric" })
    );
  };

  const week = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div
      key={`${year}-${month}`}
      className="card p-3 bg-dark text-light border-0 rounded-4 shadow-sm"
    >
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => changeMonth(-1)}
        >
          ‹
        </button>
        <div className="fw-semibold text-uppercase">{nombreMes}</div>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => changeMonth(1)}
        >
          ›
        </button>
      </div>

      {/* Semana */}
      <div
        className="d-grid text-center fw-bold border-bottom pb-2 mb-2"
        style={{
          gridTemplateColumns: "repeat(7, 1fr)",
          color: "#ccc",
        }}
      >
        {week.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* Días */}
      <div
        className="d-grid"
        style={{
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: "repeat(6, 1fr)",
          gap: "2px",
          minHeight: "600px",
        }}
      >
        {days.map((d, i) => {
          const fechaYMD =
            d > 0
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(
                  d
                ).padStart(2, "0")}`
              : null;
          const cantidadTurnos = fechaYMD ? turnos[fechaYMD] || 0 : 0;

          return (
            <div
              key={i}
              className="p-1 border border-secondary rounded-1 position-relative"
              style={{
                backgroundColor: "#1e1e1e",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                minHeight: "80px",
              }}
            >
              <div
                className="text-secondary small fw-bold position-absolute top-0 end-0 pe-1 pt-1"
                style={{ fontSize: "0.8rem" }}
              >
                {d || ""}
              </div>

              {cantidadTurnos > 0 && (
                <button
                  className="btn btn-sm btn-primary fw-bold px-3 py-1"
                  style={{ fontSize: "0.9rem", borderRadius: "10px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/turnosDelDia/${fechaYMD}`);
                  }}
                >
                  {cantidadTurnos}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
