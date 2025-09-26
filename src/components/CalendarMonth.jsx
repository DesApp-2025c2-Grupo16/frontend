import { useMemo, useState } from "react";

const toYMD = (d)=> `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;

export default function CalendarMonth(){
  const today = new Date();
  const [month, setMonth] = useState(toYMD(today)); // "2025-09"

  const { year, monIndex } = useMemo(()=>{
    const [y, m] = month.split("-").map(Number);
    return { year: y, monIndex: (m-1) };
  }, [month]);

  const days = useMemo(()=>{
    const first = new Date(year, monIndex, 1);
    const last  = new Date(year, monIndex + 1, 0);
    const startPad = (first.getDay() + 6) % 7; // lunes=0
    const total = startPad + last.getDate();
    const rows = Math.ceil(total / 7);
    const arr = [];
    for (let r=0; r<rows; r++){
      const row = [];
      for (let c=0; c<7; c++){
        const idx = r*7 + c;
        const dayNum = idx - startPad + 1;
        row.push(dayNum>=1 && dayNum<=last.getDate() ? dayNum : 0);
      }
      arr.push(row);
    }
    return arr;
  }, [year, monIndex]);

  const monthName = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" })
    .format(new Date(year, monIndex, 1));
  const week = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

  const changeMonth = (delta) => {
    const d = new Date(year, monIndex + delta, 1);
    setMonth(toYMD(d));
  };

  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button className="btn btn-outline-light btn-sm" onClick={()=>changeMonth(-1)}>‹</button>
        <div className="fw-semibold text-uppercase">{monthName}</div>
        <button className="btn btn-outline-light btn-sm" onClick={()=>changeMonth(1)}>›</button>
      </div>

      <div className="table-responsive">
        <table className="table table-dark align-middle mb-0">
          <thead>
            <tr>{week.map((w)=><th key={w} className="text-center">{w}</th>)}</tr>
          </thead>
          <tbody>
            {days.map((row,i)=>(
              <tr key={i}>
                {row.map((d,j)=>(
                  <td key={j} className="text-center" style={{height:72, verticalAlign:"top"}}>
                    {d ? <div className="small">{d}</div> : <span className="text-muted">•</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
