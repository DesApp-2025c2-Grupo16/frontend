// src/pages/HistoriaClinica.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";

const INIT = [
  { id: 1, clas: "Afiliado", nombre: "Juan P.",    situacion: "Discapacidad", notas: ["02/09/2025 - Control traumatólogo"] },
  { id: 2, clas: "Hijo/a",   nombre: "Martina P.", situacion: "Embarazo (4 meses)", notas: [] },
  { id: 3, clas: "Esposo/a", nombre: "Paula S.",   situacion: "Migraña", notas: [] },
];

export default function HistoriaClinica(){
  const { state } = useLocation(); // ej: { nro }
  const [items, setItems] = useState(INIT);
  const [sel, setSel] = useState(null);
  const [texto, setTexto] = useState("");
  const [msg, setMsg] = useState(null);

  const addNote = () => {
    if (!sel || !texto.trim()) return;
    setItems(prev =>
      prev.map(r => r.id === sel.id ? { ...r, notas: [texto.trim(), ...(r.notas || [])] } : r)
    );
    setSel(prev => prev ? { ...prev, notas: [texto.trim(), ...(prev.notas || [])] } : prev);
    setTexto("");
    setMsg(`Nota añadida a ${sel.nombre}`);
    setTimeout(()=> setMsg(null), 2500);
  };

  const last = (r) => (r.notas && r.notas[0]) || "—";

  return (
    <div className="row g-3">
      {/* Header con volver */}
      <div className="col-12 d-flex align-items-center gap-2">
        <BackButton to="/afiliados" title="Volver a Afiliados" />
        <h2 className="mb-0">Historia Clínica</h2>
      </div>
      {state?.nro && (
        <div className="col-12 text-muted">Afiliado: {state.nro}</div>
      )}

      {/* Lista */}
      <div className="col-12">
        <div className="card">
          <div className="table-responsive">
            <table className="table table-dark align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>Clasificación</th>
                  <th>Nombre</th>
                  <th>Situación</th>
                  <th>Última nota</th>
                </tr>
              </thead>
              <tbody>
                {items.map(r => (
                  <tr
                    key={r.id}
                    onClick={() => setSel(r)}
                    style={{cursor:"pointer"}}
                    className={sel?.id === r.id ? "table-active" : ""}
                  >
                    <td>{r.clas}</td>
                    <td>{r.nombre}</td>
                    <td>{r.situacion}</td>
                    <td>{last(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Editor de nota */}
      <div className="col-12">
        <div className="card p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted">
              {sel ? `Añadir nota a ${sel.nombre}` : "Seleccioná una fila para añadir nota"}
            </div>
            {msg && <div className="alert alert-info py-1 px-2 mb-0">{msg}</div>}
          </div>

          <textarea
            className="form-control mt-2"
            rows={3}
            placeholder={sel ? `Nota para ${sel.nombre}…` : "Seleccioná una fila arriba…"}
            value={texto}
            onChange={e=>setTexto(e.target.value)}
            disabled={!sel}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "Enter") addNote();
            }}
          />

          <div className="mt-2 d-flex gap-2">
            <button
              className="btn btn-brand"
              onClick={addNote}
              disabled={!sel || !texto.trim()}
              title="Guardar (Ctrl+Enter)"
            >
              Guardar nota
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => setTexto("")}
              disabled={!texto}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
