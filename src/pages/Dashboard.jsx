import { useEffect, useState } from "react";
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
  const [registros, setRegistros] = useState([]);
  

  const getCurrentWeekInterval = ()=>{
    const hoy = new Date()
    hoy.setHours(0)
    hoy.setMinutes(0)
    hoy.setSeconds(0)
    hoy.setMilliseconds(0)
    const numeroDeDia = hoy.getDay()
    const diferenciaAlLunes = numeroDeDia === 0 ? -6 : 1-numeroDeDia
    const lunes = new Date(hoy)
    lunes.setDate(lunes.getDate() + diferenciaAlLunes)
    const domingo = new Date(lunes)
    domingo.setDate(lunes.getDate() + 6)
    return {lunes, domingo}
  }

  const [currentWeekInterval, setCurrentWeekInterval] = useState(getCurrentWeekInterval())

  const changeCurrentWeek = (diff) => {
    const lunes  = new Date(currentWeekInterval.lunes)
    const domingo  = new Date(currentWeekInterval.domingo)
    lunes.setDate(lunes.getDate() + 7 * diff)
    domingo.setDate(domingo.getDate() + 7 * diff)
    setCurrentWeekInterval({lunes, domingo})
  }

  const nextWeek = () => {changeCurrentWeek(1)};
  const previousWeek = () => {changeCurrentWeek(-1)};

  const getFromLS = (item)=>{
    const stored = localStorage.getItem(item);
    const parsed = JSON.parse(stored);
    return parsed
  }

  const [prestadorId, setPrestadorId] = useState( parseInt(localStorage.getItem("prestadorId")) );
  const [prestadores, setPrestadores] = useState( getFromLS("prestadores") )
  const [esCentro, setEsCentro] = useState(() => {
    const user = getFromLS("auth_user");
    return user?.esCentro ?? false;
  });
  
  useEffect(()=>{
    const fetchData = async () =>{
      try {
        const id = parseInt(prestadorId)
        //console.log(id)
        if(!isNaN(id)){
          const resRegistros = await fetch(`http://localhost:3001/registrosSolicitudes/${id}?minFecha=${currentWeekInterval.lunes}&maxFecha=${currentWeekInterval.domingo}`)
          if(resRegistros.status === 404){
            setRegistros([])
          } else {
            const dataRegistros = await resRegistros.json()
            setRegistros(dataRegistros)
          }
        }
      } catch (error) {
        console.error(error)
      }
    } 
    fetchData()
  }, [currentWeekInterval, prestadorId])

  const handleNext = () => setCurrentPage((prev) => (prev + 1) % tipos.length);
  const handlePrev = () => setCurrentPage((prev) => (prev - 1 + tipos.length) % tipos.length);

  const generarListaDias = ()=>{
    const lista = []
    const copiaLunes = new Date(currentWeekInterval.lunes)
    for(let i = 0; i<7; i++){
      lista[i] = copiaLunes.toLocaleDateString()
      copiaLunes.setDate(copiaLunes.getDate()+1)
    }
    return lista
  }

  const dias = generarListaDias()

  const generarLista = (tipo, estado)=>{
    const lista = [0,0,0,0,0,0,0]
    const mapa = [6,0,1,2,3,4,5]
    registros.map((registro)=>{
      if(registro.tipo === tipo && registro.estado === estado){
        const fecha = new Date(registro.fecha)
        //console.log(fecha)
        const dia = mapa[fecha.getDay()]
        //console.log(dia)
        lista[dia] +=1
      }
    })
    return lista
  }

  const mockData = {
    REINTEGROS: dias.map((dia, i) => ({
      dia,
      Recibido:   generarLista('reintegro','Recibido')[i],
      Analizado:   generarLista('reintegro','En análisis')[i],
      Observado:  generarLista('reintegro','Observado')[i],
      Aprobado:   generarLista('reintegro','Aprobado')[i],
      Rechazado:  generarLista('reintegro','Rechazado')[i],
    })),
    AUTORIZACIONES: dias.map((dia, i) => ({
      dia,
      Recibido:   generarLista('autorizacion','Recibido')[i],
      Analizado:   generarLista('autorizacion','En análisis')[i],
      Observado:  generarLista('autorizacion','Observado')[i],
      Aprobado:   generarLista('autorizacion','Aprobado')[i],
      Rechazado:  generarLista('autorizacion','Rechazado')[i],
    })),
    RECETAS: dias.map((dia, i) => ({
      dia,
      Recibido:   generarLista('receta','Recibido')[i],
      Analizado:   generarLista('receta','En análisis')[i],
      Observado:  generarLista('receta','Observado')[i],
      Aprobado:   generarLista('receta','Aprobado')[i],
      Rechazado:  generarLista('receta','Rechazado')[i],
    })),
  };

  const data = mockData[tipos[currentPage]];
  const totalResueltas = data.reduce(
    (acc, d) => acc + d.Aprobado + d.Rechazado,
    0
  );
  const totalPendientes = data.reduce(
    (acc, d) => acc + d.Recibido + d.Observado,
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
    <div className="mt-1">
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
        {/*Selector de medico si es centro */}
        {esCentro && <div className="row justify-content-center align-items-center mt-3"> 
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
        </div>}

      <hr
      className="border-dark border-5 rounded-pill mx-auto"
      style={{ width: "90%" }}
      />

      <div
        className="row"
        style={{
          background: "#242424",
          borderRadius: "20px 20px 0 0",
          margin: "24px auto 0 auto",
          width: "95%",
          maxWidth: "1200px",
          padding: "10px 0",  
          boxShadow: "0 5px 6px rgba(0,0,0,0.4)",
        }}
      >
        {/* Cambiar tipo de solicitudes izquierda*/}
        <div className="col d-flex justify-content-center align-items-center">
          <button className="btn btn-light rounded-circle" onClick={handlePrev}>←</button> 
        </div>

        {/* tipo de solicitud actual */}
        <div className="col d-flex justify-content-center align-items-center">
          <span style={{fontWeight: "bold", color: "white", fontSize: "30px"}} > {tipos[currentPage]} </span>
        </div>

        {/* Cambiar tipo de solicitudes derecha*/}
        <div className="col d-flex justify-content-center align-items-center">
          <button className="btn btn-light rounded-circle" onClick={handleNext}>→</button>
        </div>
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

        <div className="row px-2">
          {/* === IZQUIERDA: LÍNEAS === */}
          <div className="col-12 col-lg-7 mb-4">
            <div style={{ padding: "10px" }}>
              
              {/* Selector de semana */}
              <div className="d-flex justify-content-center align-items-center gap-4">
                <button className="btn btn-dark rounded-circle" onClick={previousWeek}>
                  ←
                </button>
                <span className="rounded-pill  text-bg-dark fw-bold py-2 px-5 ">
                  {currentWeekInterval.lunes.toLocaleDateString()} - {currentWeekInterval.domingo.toLocaleDateString()}
                  </span>
                <button className="btn btn-dark rounded-circle" onClick={nextWeek}>
                  →
                </button>
              </div>

              {/* Grafico */}
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
                    <Line type="monotone" dataKey="Analizado" stroke={COLORS.Análisis} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="Observado" stroke={COLORS.Observado} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="Aprobado" stroke={COLORS.Aprobado} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="Rechazado" stroke={COLORS.Rechazado} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="d-flex justify-content-center gap-4 mb-5 flex-wrap">
                {[
                  { label: "Recibido", color: COLORS.Recibido },
                  { label: "Analizado", color: COLORS.Análisis },
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

