import CalendarMonth from "../components/CalendarMonth.jsx";

export default function Turnos(){
  return (
    <div className="row g-3">
      <div className="col-12"><h2>Turnos</h2></div>
      <div className="col-12">
        <CalendarMonth />
      </div>
    </div>
  );
}
