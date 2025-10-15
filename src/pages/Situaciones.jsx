import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";

const clasificaciones = ["Afiliado", "Hijo/a", "Esposo/a", "Otros"];

export default function Situaciones() {
  const { state } = useLocation();
  const [rows, setRows] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [editing, setEditing] = useState(null);
  const [temp, setTemp] = useState({});
  const [loading, setLoading] = useState(true);

  const nroAfiliado = state?.nroAfiliado; // viene desde la búsqueda del afiliado

  // Cargar afiliado y grupo familiar desde backend
  useEffect(() => {
    if (!nroAfiliado) return;

    const fetchAfiliado = async () => {
      try {
        const res = await fetch(`http://localhost:3001/afiliados/${nroAfiliado}`);
        const data = await res.json();
        // Construir rows: cada integrante del grupo familiar con sus situaciones
        const todasSituaciones = [
          {
            id: `${data.nroAfiliado}-0`,
            clasificacion: "Afiliado",
            nombre: data.nombre,
            situacion: data.situacionTerapeutica?.descripcion || "-",
            desde: data.situacionTerapeutica?.fechaInicio || "-",
            hasta: data.situacionTerapeutica?.fechaFin || "Indefinido",
          },
          ...data.grupoFamiliar.map((f, i) => ({
            id: `${data.nroAfiliado}-${i + 1}`,
            clasificacion: f.clasificacion,
            nombre: f.nombre,
            situacion: f.situacionTerapeutica?.descripcion || "-",
            desde: f.situacionTerapeutica?.fechaInicio || "-",
            hasta: f.situacionTerapeutica?.fechaFin || "Indefinido",
          }))
        ];
        setRows(todasSituaciones);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAfiliado();
  }, [nroAfiliado]);

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
    if (!temp.nombre.trim()) { alert("El campo 'Nombre' es obligatorio."); return; }
    if (!temp.situacion.trim()) { alert("El campo 'Situación' es obligatorio."); return; }

    if (editing === "new") {
      setRows(prev => [temp, ...prev]);
    } else {
      setRows(prev => prev.map(r => r.id === editing ? temp : r));
    }
    cancel();
  };
  const eliminar = (id) => { setRows(prev => prev.filter(r => r.id !== id)); };

  if (loading) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="mt-4">
      <div className="d-flex align-items-center gap-3 mb-3 px-3">
        <BackButton to="/afiliados" title="Volver a Afiliados" style={{ height:"50px", lineHeight:"50px", minWidth:"120px", borderRadius:"50px", fontWeight:"bold" }} />
        <h2 className="text-white fw-bold py-2 px-5 mx-auto rounded-pill"
            style={{ background:"#242424", display:"block", width:"90%", textAlign:"center", margin:"0 auto", lineHeight:"50px" }}>
          SITUACIÓN TERAPÉUTICA
        </h2>
      </div>

      <hr className="border-dark border-5 rounded-pill mt-4 mx-auto" style={{ width:"90%" }} />

      <div style={{ borderRadius:"20px", border:"3px solid #242424", padding:"15px", background:"#242424", color:"white", margin:"0 20px 20px 20px" }}>
        <div className="d-flex flex-wrap gap-2 mb-3">
          <input className="form-control" placeholder="Buscar por clasificación, nombre o situación" value={filtro} onChange={(e)=>setFiltro(e.target.value)} style={{ maxWidth:420, background:"white", color:"black" }} />
          <button className="btn btn-success" onClick={startNew}>Agregar situación</button>
        </div>

        {/* fila de alta/edición */}
        {editing && (
          <div className="border rounded p-3 mb-3" style={{ background:"white", color:"black" }}>
            <div className="row g-2">
              <div className="col-12 col-md-2">
                <label className="form-label">Clasificación</label>
                <select className="form-select" value={temp.clasificacion} style={{ background:"white", color:"black" }} onChange={(e)=>setTemp({...temp, clasificacion:e.target.value})}>
                  {clasificaciones.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">Nombre</label>
                <input className="form-control" value={temp.nombre} style={{ background:"white", color:"black" }} onChange={(e)=>setTemp({...temp, nombre:e.target.value})}/>
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Situación</label>
                <input className="form-control" value={temp.situacion} style={{ background:"white", color:"black" }} onChange={(e)=>setTemp({...temp, situacion:e.target.value})}/>
              </div>
              <div className="col-6 col-md-1">
                <label className="form-label">Desde</label>
                <input type="date" className="form-control" value={temp.desde} style={{ background:"white", color:"black" }} onChange={(e)=>setTemp({...temp, desde:e.target.value})}/>
              </div>
              <div className="col-6 col-md-1">
                <label className="form-label">Hasta</label>
                <input type="date" className="form-control" value={temp.hasta} style={{ background:"white", color:"black" }} onChange={(e)=>setTemp({...temp, hasta:e.target.value})}/>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-sm btn-outline-primary" onClick={save}>Guardar</button>
              <button className="btn btn-sm btn-outline-danger" onClick={cancel}>Cancelar</button>
            </div>
          </div>
        )}

        {/* tabla */}
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ background:"white", color:"black" }}>
            <thead style={{ background:"#242424", color:"white" }}>
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
                    <button className="btn btn-sm btn-outline-dark" onClick={()=>startEdit(r)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={()=>eliminar(r.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {!filtradas.length && (
                <tr><td style={{color:"black"}} colSpan="6" className="text-center text-muted">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
