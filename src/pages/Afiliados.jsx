// src/pages/BusquedaAfiliado.jsx
import { useState } from "react";

export default function BusquedaAfiliado() {
  const [q, setQ] = useState("");
  const [resultado, setResultado] = useState(null);

  const buscar = (e) => {
    e.preventDefault();
    if (!q.trim()) return;

    // Simulación de resultado mock
    setResultado({
      clasificacion: "Afiliado",
      nombre: "Juan P.",
      situacion: "Discapacidad",
    });
  };

  return (
    <div className="text-center mt-5">
      <h2
        className="text-white fw-bold py-2 px-4 mx-auto rounded-pill"
        style={{ background: "#242424", display: "inline-block" }}
      >
        BÚSQUEDA DE AFILIADO
      </h2>

      <hr className="border-light mt-3" />

      <form
        onSubmit={buscar}
        className="d-flex justify-content-center align-items-center mt-4"
        style={{
          border: "3px solid #242424",
          borderRadius: "50px",
          padding: "5px 10px",
          width: "500px",
          margin: "0 auto",
        }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Nro. Afiliado / Apellido / Teléfono"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            borderRadius: "50px",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          className="btn btn-dark"
          style={{ borderRadius: "50px" }}
        >
          BUSCAR
        </button>
      </form>

      {resultado && (
        <div className="mt-4 d-flex flex-column align-items-center">
          {/* Tabla de resultado */}
          <table className="table table-dark table-striped" style={{ width: "60%" }}>
            <thead>
              <tr>
                <th>Clasificación</th>
                <th>Nombre</th>
                <th>Situación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{resultado.clasificacion}</td>
                <td>{resultado.nombre}</td>
                <td>{resultado.situacion}</td>
              </tr>
            </tbody>
          </table>

          {/* Botones Turnos y Historia Clínica */}
          <div className="mt-3 d-flex gap-3">
            <button className="btn btn-outline-dark">TURNOS</button>
            <button className="btn btn-dark">HISTORIA CLÍNICA</button>
          </div>
        </div>
      )}
    </div>
  );
}
