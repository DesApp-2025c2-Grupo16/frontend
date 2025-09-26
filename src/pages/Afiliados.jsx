import { useMemo, useState } from "react";

const INIT = [
  { id: 1, clas: "Afiliado",  nombre: "Juan P.",    sit: "Discapacidad", desde: "02/09/2025", hasta: "" },
  { id: 2, clas: "Hija",      nombre: "Martina P.", sit: "Embarazo",     desde: "01/09/2025", hasta: "01/07/2026" },
];

export default function Afiliados(){
  const [items, setItems] = useState(INIT);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ clas: "Afiliado", nombre: "", sit: "", desde: "", hasta: "" });

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(it =>
      [it.clas, it.nombre, it.sit, it.desde, it.hasta].some(v => (v || "").toLowerCase().includes(t))
    );
  }, [q, items]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const add = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.sit) return;
    const id = (items.at(-1)?.id || 0) + 1;
    setItems([...items, { id, ...form }]);
    setForm({ clas: "Afiliado", nombre: "", sit: "", desde: "", hasta: "" });
  };

  const remove = (id) => setItems(items.filter(it => it.id !== id));

  return (
    <div className="row g-3">
      <div className="col-12"><h2>Afiliados / Situaciones terapéuticas</h2></div>

      {/* Filtros / Alta rápida */}
      <div className="col-12">
        <div className="card p-3">
          <form className="row g-2 align-items-end" onSubmit={add}>
            <div className="col-12 col-md-3">
              <label className="form-label">Búsqueda</label>
              <input className="form-control" placeholder="Apellido / Nro Afiliado / Situación"
                     value={q} onChange={e=>setQ(e.target.value)} />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">Clasificación</label>
              <select className="form-select" name="clas" value={form.clas} onChange={onChange}>
                <option>Afiliado</option>
                <option>Hijo/a</option>
                <option>Esposo/a</option>
                <option>Padre/Madre</option>
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Nombre</label>
              <input className="form-control" name="nombre" value={form.nombre} onChange={onChange} placeholder="Ej. Juan Pérez" required />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">Situación</label>
              <input className="form-control" name="sit" value={form.sit} onChange={onChange} placeholder="Ej. Embarazo" required />
            </div>
            <div className="col-6 col-md-1">
              <label className="form-label">Desde</label>
              <input className="form-control" name="desde" value={form.desde} onChange={onChange} placeholder="dd/mm/aaaa" />
            </div>
            <div className="col-6 col-md-1">
              <label className="form-label">Hasta</label>
              <input className="form-control" name="hasta" value={form.hasta} onChange={onChange} placeholder="dd/mm/aaaa" />
            </div>
            <div className="col-12 col-md-12">
              <button className="btn btn-brand">Agregar</button>
            </div>
          </form>
        </div>
      </div>

      {/* Tabla */}
      <div className="col-12">
        <div className="card">
          <div className="table-responsive">
            <table className="table table-dark align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>Clasificación</th>
                  <th>Nombre</th>
                  <th>Situación</th>
                  <th>Desde</th>
                  <th>Hasta</th>
                  <th style={{width: 100}}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(it => (
                  <tr key={it.id}>
                    <td>{it.clas}</td>
                    <td>{it.nombre}</td>
                    <td>{it.sit}</td>
                    <td>{it.desde || "—"}</td>
                    <td>{it.hasta || "—"}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(it.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-muted py-4">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
