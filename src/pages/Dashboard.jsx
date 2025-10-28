import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

export default function Dashboard() {
  const tipos = ["REINTEGROS", "AUTORIZACIONES", "RECETAS"];
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => setCurrentPage((prev) => (prev + 1) % tipos.length);
  const handlePrev = () =>
    setCurrentPage((prev) => (prev - 1 + tipos.length) % tipos.length);

  const dias = [
    "14/09/25",
    "15/09/25",
    "16/09/25",
    "17/09/25",
    "18/09/25",
    "19/09/25",
    "20/09/25",
  ];

  const mockData = {
    REINTEGROS: dias.map((dia, i) => ({
      dia,
      Recibido: [8, 6, 10, 8, 5, 7, 6][i],
      Análisis: [5, 4, 6, 5, 7, 5, 4][i],
      Observado: [2, 3, 1, 2, 2, 3, 2][i],
      Aprobado: [4, 5, 3, 4, 5, 5, 6][i],
      Rechazado: [1, 1, 0, 2, 1, 1, 0][i],
    })),
    AUTORIZACIONES: dias.map((dia, i) => ({
      dia,
      Recibido: [12, 9, 8, 7, 6, 5, 6][i],
      Análisis: [6, 5, 5, 4, 6, 5, 6][i],
      Observado: [3, 2, 3, 2, 3, 3, 2][i],
      Aprobado: [5, 6, 7, 8, 7, 6, 8][i],
      Rechazado: [2, 1, 2, 1, 2, 1, 2][i],
    })),
    RECETAS: dias.map((dia, i) => ({
      dia,
      Recibido: [4, 5, 5, 6, 5, 4, 5][i],
      Análisis: [3, 3, 4, 3, 4, 3, 3][i],
      Observado: [1, 1, 2, 2, 1, 1, 1][i],
      Aprobado: [6, 7, 8, 7, 8, 7, 8][i],
      Rechazado: [0, 1, 1, 0, 1, 1, 0][i],
    })),
  };

  const data = mockData[tipos[currentPage]];

  const totalResueltas = data.reduce(
    (acc, d) => acc + d.Aprobado + d.Rechazado,
    0
  );
  const totalPendientes = data.reduce(
    (acc, d) => acc + d.Recibido + d.Análisis + d.Observado,
    0
  );
  const total = totalResueltas + totalPendientes;

  const COLORS = {
    Recibido: "#9E9E9E",
    Análisis: "#2196F3",
    Observado: "#FF9800",
    Aprobado: "#4CAF50",
    Rechazado: "#F44336",
  };

  const donutData = [
    { name: "Resueltas", value: totalResueltas, color: "#4CAF50" },
    { name: "Pendientes", value: totalPendientes, color: "#FFEB3B" },
  ];

  // Tooltip del gráfico circular
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div
          style={{
            background: "#242424",
            color: "white",
            padding: "6px 10px",
            borderRadius: "10px",
            fontWeight: "bold",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          {name}: {value}
        </div>
      );
    }
    return null;
  };

  // Sector activo con texto dentro (pero sin inflar)
  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill="#333"
          fontWeight="bold"
          fontSize={14}
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="#555"
          fontSize={12}
        >
          {value} ({(percent * 100).toFixed(1)}%)
        </text>
      </g>
    );
  };

  // índice del sector hovereado
  const [activeIndex, setActiveIndex] = useState(null);

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
        DASHBOARD
      </h2>

      <hr className="border-dark border-5 rounded-pill mt-4" />

      <div
        style={{
          background: "#242424",
          color: "white",
          fontWeight: "bold",
          fontSize: "30px",
          borderRadius: "20px 20px 0 0",
          margin: "60px auto 0 auto",
          width: "95%",
          maxWidth: "1200px",
          textAlign: "center",
          padding: "10px 0",
          letterSpacing: "1px",
          boxShadow: "0 5px 6px rgba(0,0,0,0.4)",
        }}
      >
        {tipos[currentPage]}
      </div>

      <div
        style={{
          border: "20px solid #242424",
          borderTop: "none",
          borderRadius: "0 0 25px 25px",
          margin: "0 auto 40px auto",
          width: "95%",
          maxWidth: "1200px",
          background: "white",
          padding: "30px 20px 40px 20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <div className="row mt-4 px-2">
          {/* === IZQUIERDA: LÍNEAS === */}
          <div className="col-12 col-lg-7 mb-4">
            <div style={{ padding: "10px" }}>
              <div className="d-flex justify-content-center gap-4 mb-5 flex-wrap">
                {[
                  { label: "Recibido", color: COLORS.Recibido },
                  { label: "Análisis", color: COLORS.Análisis },
                  { label: "Observado", color: COLORS.Observado },
                  { label: "Aprobado", color: COLORS.Aprobado },
                  { label: "Rechazado", color: COLORS.Rechazado },
                ].map((item) => (
                  <div key={item.label} className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: item.color,
                      }}
                    ></span>
                    <span style={{ fontWeight: "bold" }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  width: "100%",
                  height: "360px",
                  background: "#fff",
                  borderRadius: "15px",
                  padding: "10px",
                }}
              >
                <ResponsiveContainer>
                  <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis
                      label={{
                        value: "CANTIDAD",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="Recibido" stroke={COLORS.Recibido} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="Análisis" stroke={COLORS.Análisis} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="Observado" stroke={COLORS.Observado} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="Aprobado" stroke={COLORS.Aprobado} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="Rechazado" stroke={COLORS.Rechazado} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="d-flex justify-content-center mt-3 gap-4">
                <button className="btn btn-dark rounded-circle" onClick={handlePrev}>
                  ←
                </button>
                <button className="btn btn-dark rounded-circle" onClick={handleNext}>
                  →
                </button>
              </div>
            </div>
          </div>

          {/* === DERECHA: DONUT === */}
          <div className="col-12 col-lg-5">
            <div style={{ padding: "10px" }}>
              {/* Leyendas sin porcentajes */}
              <div className="d-flex justify-content-center gap-4 mb-3">
                {donutData.map((d) => (
                  <div key={d.name} className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: d.color,
                      }}
                    ></span>
                    <span style={{ fontWeight: "bold" }}>{d.name}</span>
                  </div>
                ))}
              </div>

              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={donutData}
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {donutData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                          activeIndex === index
                          ? darkenColor(entry.color)
                          : entry.color
                        }
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        style={{
                        transition: "fill 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                      />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 d-flex justify-content-center">
                <span
                  className="fw-bold text-white px-4 py-2 rounded-pill"
                  style={{
                    background: "#242424",
                    display: "inline-block",
                  }}
                >
                  TOTALES: {total}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function darkenColor(hex) {
  const amount = 0.1; // antes 0.2 → cambio más suave
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, Math.floor((num >> 16) * (1 - amount))));
  const g = Math.max(0, Math.min(255, Math.floor(((num >> 8) & 0x00ff) * (1 - amount))));
  const b = Math.max(0, Math.min(255, Math.floor((num & 0x0000ff) * (1 - amount))));
  return `rgb(${r}, ${g}, ${b})`;
}

