import MiniLineChart from "../components/MiniLineChart.jsx";

export default function Dashboard(){
  // Números demo (podés cambiarlos a mano)
  const pendientes = 5 + 3; // Recibido + En análisis
  const resueltas = 4 + 2;  // Aprobado + Rechazado
  const observadas = 3;

  // Serie de 14 días (demo simple KISS)
  const seed = [pendientes, observadas + 1, resueltas + 2, pendientes + 2, observadas];
  const data = Array.from({ length: 14 }, (_, i) => seed[i % seed.length] + (i % 3));

  return (
    <div className="row g-3">
      <div className="col-12 text-center mt-5">
        <h2
        className="text-white fw-bold py-2 px-5 mx-auto rounded-pill"
        style={{
          background: "#242424",
          display: "block",
          width: "90%",       // Ocupa casi todo el ancho
          textAlign: "center", // Texto centrado
          margin: "0 auto",   // Centrado horizontal
          lineHeight: "50px", // Altura consistente
        }}
        >
        DASHBOARD
        </h2>
      </div>

      <hr
      className="border-dark border-5 rounded-pill mt-4 mx-auto"
      style={{ width: "90%" }}
      />
      
      <div className="col-12 col-md-4">
        <div className="metric p-3">
          <div className="label">Pendientes (Recibido + En análisis)</div>
          <div className="value display-6 fw-bold">{pendientes}</div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="metric p-3">
          <div className="label">Resueltas (Aprobado + Rechazado)</div>
          <div className="value display-6 fw-bold">{resueltas}</div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="metric p-3">
          <div className="label">Observadas</div>
          <div className="value display-6 fw-bold">{observadas}</div>
        </div>
      </div>

      <div className="col-12">
        <div className="card p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="text-muted">Evolución por día (demo)</div>
            <div className="small text-muted">Últimos 14 días</div>
          </div>
          <MiniLineChart data={data} />
        </div>
      </div>
    </div>
  );
}