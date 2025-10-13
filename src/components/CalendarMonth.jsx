import { useMemo, useState } from "react";

const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export default function CalendarMonth({ turnos = [], onSelectTurno }) {
  const today = new Date();
  const [month, setMonth] = useState(toYMD(today));

  const { year, monIndex } = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    return { year: y, monIndex: m - 1 };
  }, [month]);

  // Generar 42 días (6 filas * 7 columnas) para cuadrícula uniforme
  const days = useMemo(() => {
    const first = new Date(year, monIndex, 1);
    const last = new Date(year, monIndex + 1, 0);
    const startPad = (first.getDay() + 6) % 7;
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const dayNum = i - startPad + 1;
      cells.push(dayNum >= 1 && dayNum <= last.getDate() ? dayNum : 0);
    }
    return cells;
  }, [year, monIndex]);

  const monthName = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monIndex, 1));

  const week = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const changeMonth = (delta) => {
    const d = new Date(year, monIndex + delta, 1);
    setMonth(toYMD(d));
  };

  const turnosDelMes = useMemo(() => {
    const ym = `${year}-${String(monIndex + 1).padStart(2, "0")}`;
    return turnos.filter((t) => t.fecha.startsWith(ym));
  }, [turnos, year, monIndex]);

  return (
    <div className="card p-3 bg-dark text-light border-0 rounded-4 shadow-sm">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => changeMonth(-1)}
        >
          ‹
        </button>
        <div className="fw-semibold text-uppercase">{monthName}</div>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => changeMonth(1)}
        >
          ›
        </button>
      </div>

      {/* Días de la semana */}
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

      {/* Grilla del mes */}
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
          const fechaYMD = d
            ? `${year}-${String(monIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
            : null;

          const turnosDelDia = d
            ? turnosDelMes.filter((t) => t.fecha === fechaYMD)
            : [];

          return (
            <div
              key={i}
              className="p-1 border border-secondary rounded-1"
              style={{
                backgroundColor: "#1e1e1e",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Número del día */}
              <div className="text-secondary small fw-bold mb-1 text-end pe-1">
                {d || ""}
              </div>

              {/* Contenedor de turnos */}
              <div
                className="flex-grow-1 overflow-auto d-flex flex-column gap-1"
                style={{ scrollbarWidth: "thin", paddingRight: "2px" }}
              >
                {turnosDelDia.map((t) => (
                  <div
                    key={t.id}
                    className="small rounded px-1 py-1 turno-card text-truncate"
                    style={{
                      backgroundColor: "#f8f9fa",
                      color: "#000",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#0d6efd";
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.boxShadow =
                        "0 2px 6px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.color = "#000";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    onClick={() => onSelectTurno && onSelectTurno(t)}
                  >
                    {t.paciente}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
