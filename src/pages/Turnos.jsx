import CalendarMonth from "../components/CalendarMonth.jsx";
import BackButton from "../components/BackButton.jsx";
import { useLocation } from "react-router-dom";

export default function Turnos() {
  const { state } = useLocation();

  return (
    <div className="row g-3">
      <div className="col-12 d-flex align-items-center gap-2">
        <BackButton to="/afiliados" title="Volver a Afiliados" />
        <h2 className="mb-0">Turnos</h2>
      </div>

      {state?.nro && (
        <div className="col-12 text-muted">Afiliado: {state.nro}</div>
      )}

      <div className="col-12">
        <CalendarMonth />
      </div>
    </div>
  );
}
