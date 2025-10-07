import CalendarMonth from "../components/CalendarMonth.jsx";
import BackButton from "../components/BackButton.jsx";
import { useLocation } from "react-router-dom";

export default function Turnos() {
  const { state } = useLocation();

  return (
    <div className="mt-4">
          {/* Barra pill con botón de volver */}
          <div className="d-flex align-items-center gap-3 mb-3 px-3">
            <BackButton 
              to="/afiliados" 
              title="Volver a Afiliados" 
              style={{
                height: "50px", 
                lineHeight: "50px",
                minWidth: "120px", 
                borderRadius: "50px", 
                fontWeight: "bold"
              }} 
            />
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
            TURNOS
            </h2>
          </div>
    
          {/* Barra divisora tipo pill */}
          <hr
            className="border-dark border-5 rounded-pill mt-4 mx-auto"
            style={{ width: "90%" }}
          />

      {state?.nro && (
        <div className="col-12 text-muted">Afiliado: {state.nro}</div>
      )}

      <div className="col-12">
        <CalendarMonth />
      </div>
    </div>
  );
}
