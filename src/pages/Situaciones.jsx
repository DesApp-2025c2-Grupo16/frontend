// src/pages/Situaciones.jsx
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";

const clasificaciones = ["Afiliado", "Hijo/a", "Esposo/a", "Otros"];

const mock = [
  { id: 1, clasificacion: "Afiliado", nombre: "Juan P.", situacion: "Rehabilitación postquirúrgica", desde: "2025-09-01", hasta: "" },
  { id: 2, clasificacion: "Hijo/a", nombre: "Ana P.", situacion: "Tratamiento kinesiología", desde: "2025-08-15", hasta: "2025-10-15" },
];

export default function Situaciones() {
  const { state } = useLocation(); // si venís de Afiliados, podés leer state?.nro
  const [rows, setRows] = useState(mock);
  const [filtro, setFiltro] = useState("");

  const [editing, setEditing] = useState(null); // id que se edita o "new" para fila nueva
  const [temp, setTemp] = useState({});

  const filtradas = useMemo(() => {
    if (!filtro.trim()) return rows;
    const q = filtro.toLowerCase();
    return rows.filter(r =>
      r.nombre.toLowerCase().includes(q) ||
      r.situacion.toLowerCase().includes(q) ||
      r.clasificacion.toLowerCase().includes(q)
    );
  }, [rows, filtro]);

  const startNew = () => {
    setEditing("new");
    setTemp({ id: Date.now(), clasificacion: "Afiliado", nombre: "", situacion: "", desde: "", hasta: "" });
  };
  const startEdit = (r) => { setEditing(r.id); setTemp({ ...r }); };
  const cancel = () => { setEditing(null); setTemp({}); };

  const save = () => {
    if (editing === "new") {
      setRows(prev => [temp, ...prev]);
    } else {
      setRows(prev => prev.map(r => r.id === editing ? temp : r));
    }
    cancel();
  };

  const bajaIndefinido = (id) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, hasta: "" } : r));
  };

  return ( 
   <div className="row g-3">
      <div className="col-12 d-flex align-items-center gap-2">
        <BackButton to="/afiliados" title="Volver a Afiliados" />
        <h2 className="mb-0">Situaciones terapéuticas</h2>
      </div>
      {state?.nro && <div className="col-12 text-muted">Afiliado seleccionado: {state.nro}</div>}

      <div className="col-12">
        <div className="card p-3">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <input
              className="form-control"
              placeholder="Buscar por clasificación, nombre o situación"
              value={filtro}
              onChange={(e)=>setFiltro(e.target.value)}
              style={{ maxWidth: 420 }}
            />
            <button className="btn btn-success" onClick={startNew}>Agregar situación</button>
          </div>

          {/* fila de alta/edición */}
          {editing && (
            <div className="border rounded p-3 mb-3">
              <div className="row g-2">
                <div className="col-12 col-md-2">
                  <label className="form-label">Clasificación</label>
                  <select className="form-select" value={temp.clasificacion}
                          onChange={(e)=>setTemp({...temp, clasificacion: e.target.value})}>
                    {clasificaciones.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" value={temp.nombre}
                         onChange={(e)=>setTemp({...temp, nombre: e.target.value})}/>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Situación</label>
                  <input className="form-control" value={temp.situacion}
                         onChange={(e)=>setTemp({...temp, situacion: e.target.value})}/>
                </div>
                <div className="col-6 col-md-1">
                  <label className="form-label">Desde</label>
                  <input type="date" className="form-control" value={temp.desde}
                         onChange={(e)=>setTemp({...temp, desde: e.target.value})}/>
                </div>
                <div className="col-6 col-md-1">
                  <label className="form-label">Hasta</label>
                  <input type="date" className="form-control" value={temp.hasta}
                         onChange={(e)=>setTemp({...temp, hasta: e.target.value})}/>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-primary" onClick={save}>Guardar</button>
                <button className="btn btn-outline-light" onClick={cancel}>Cancelar</button>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-dark align-middle mb-0">
              <thead>
                <tr>
                  <th>Clasificación</th>
                  <th>Nombre</th>
                  <th>Situación</th>
                  <th>Desde</th>
                  <th>Hasta</th>
                  <th style={{width:160}}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map(r => (
                  <tr key={r.id}>
                    <td>{r.clasificacion}</td>
                    <td>{r.nombre}</td>
                    <td>{r.situacion}</td>
                    <td>{r.desde || "-"}</td>
                    <td>{r.hasta || <span className="text-muted">Indefinido</span>}</td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-light" onClick={()=>startEdit(r)}>Editar</button>
                      <button className="btn btn-sm btn-outline-warning" title="Baja/Indefinido" onClick={()=>bajaIndefinido(r.id)}>
                        Baja/Indefinido
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtradas.length && (
                  <tr><td colSpan="6" className="text-center text-muted">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
