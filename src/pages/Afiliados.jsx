// src/pages/BusquedaAfiliado.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BusquedaAfiliado() {
  const [q, setQ] = useState("");
  const [resultado, setResultado] = useState(null);
  const navigate = useNavigate();

  const buscar = (e) => {
    e.preventDefault();
    const query = q.trim().toLowerCase();
    const nombreMock = "juan p."; // Afiliado único

    if (query && nombreMock.includes(query)) {
      setResultado({
        clasificacion: "Afiliado",
        nombre: "Juan P.",
        situacion: "Discapacidad",
      });
    } else {
      setResultado(null); // No mostrar nada si no hay coincidencia
    }
  };

  return (
    <div className="text-center mt-5">
      <h2
        className="text-white fw-bold py-2 px-4 mx-auto rounded-pill"
        style={{ background: "#242424", display: "inline-block" }}
      >
        BÚSQUEDA DE AFILIADO
      </h2>

      <hr className="border-dark border-5 rounded-pill" />

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
            background: "#242424",
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
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              width: "400px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                backgroundColor: "#242424",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <span>Clasificación</span>
              <span>Nombre</span>
              <span>Situación</span>
            </div>

            <div
              style={{
                backgroundColor: "white",
                color: "black",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 20px",
              }}
            >
              <span>{resultado.clasificacion}</span>
              <span
                style={{ 
                  cursor: "pointer", 
                  color: "blue", 
                  textDecoration: "underline" 
                }}
                onClick={() => navigate("/afiliados/situaciones")}
              >
                {resultado.nombre}
              </span>
              <span>{resultado.situacion}</span>
            </div>
          </div>

          <div className="mt-4 d-flex gap-3">
            <button
              style={{
                border: "2px solid black",
                borderRadius: "12px",
                padding: "10px 25px",
                fontWeight: "bold",
                textTransform: "uppercase",
                textDecoration: "underline",
                backgroundColor: "white",
                boxShadow: "3px 3px 0px rgba(0,0,0,0.4)",
              }}
              onClick={() => navigate("/afiliados/turnos")}
            >
              Turnos
            </button>
            <button
              style={{
                border: "2px solid black",
                borderRadius: "12px",
                padding: "10px 25px",
                fontWeight: "bold",
                textTransform: "uppercase",
                textDecoration: "underline",
                backgroundColor: "white",
                boxShadow: "3px 3px 0px rgba(0,0,0,0.4)",
              }}
              onClick={() => navigate("/afiliados/historia")}
            >
              Historia Clínica
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
