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
    <div className="mt-4 text-center">
      {/* Barra pill larga y centrada */}
      <h2
        className="text-white fw-bold py-2 px-5 mx-auto rounded-pill"
        style={{
          background: "#242424",
          display: "block",
          width: "90%",       // Ocupa casi todo el ancho
          textAlign: "center", // Texto centrado
          margin: "0 auto",   // Centrado horizontal
          lineHeight: "50px", // Altura consistente
        }}
      >
        BÚSQUEDA DE AFILIADO
      </h2>

      <hr
        className="border-dark border-5 rounded-pill mt-4 mx-auto"
        style={{ width: "90%" }}
      />

      {/* Formulario de búsqueda */}
      <form
        onSubmit={buscar}
        className="d-flex justify-content-center align-items-center mt-4"
        style={{
          border: "3px solid #242424",
          borderRadius: "50px",
          padding: "5px 10px",
          width: "500px",
          margin: "0 auto",
          background: "#242424",
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
        <div className="mt-5 d-flex flex-column align-items-center">
          {/* TABLA MEJORADA */}
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              width: "1300px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
              border: "20px solid #242424",
            }}
          >
            <div
              style={{
                backgroundColor: "#242424",
                color: "white",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                fontWeight: "bold",
                padding: "10px 5px",
                textAlign: "center",
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
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: "10px 25px",
                textAlign: "center",
              }}
            >
              <span>{resultado.clasificacion}</span>

              <span
                style={{
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/afiliados/situaciones")}
              >
                {resultado.nombre}
              </span>

              <span>{resultado.situacion}</span>
            </div>
          </div>

          {/* Botones inferiores */}
          <div className="mt-5 d-flex gap-3">
            <button
              style={{
                border: "2px solid black",
                borderRadius: "12px",
                padding: "10px 25px",
                fontWeight: "bold",
                textTransform: "uppercase",
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
