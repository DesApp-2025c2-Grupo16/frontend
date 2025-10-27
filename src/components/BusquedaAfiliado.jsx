import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BusquedaAfiliado() {
  const [q, setQ] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const buscar = async (e) => {
    e.preventDefault();
    setError("");
    setResultado(null);

    const nroAfiliado = q.trim();
    if (!nroAfiliado) return;

    try {
      const res = await fetch(`http://localhost:3001/afiliados/${nroAfiliado}`);
      if (!res.ok) throw new Error("Afiliado no encontrado");
      const data = await res.json();

      setResultado({
        clasificacion: "Afiliado",
        nroAfiliado: data.nroAfiliado,
        nombre: data.nombre,
        dni: data.dni,
        situacion: data.situacionTerapeutica.descripcion,
      });
    } catch (err) {
      console.error(err);
      setError("Afiliado no encontrado");
    }
  };

  return (
    <div className="mt-4 text-center">
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
        BÚSQUEDA DE AFILIADO
      </h2>

      <hr
        className="border-dark border-5 rounded-pill mt-4 mx-auto"
        style={{ width: "90%" }}
      />

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
          placeholder="Nro. Afiliado"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            borderRadius: "50px",
            marginRight: "10px",
            background: "#242424",
            color: "white",
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

      {error && <p className="text-danger mt-3">{error}</p>}

      {resultado && (
        <div className="mt-5 d-flex flex-column align-items-center">
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              width: "90%",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
              border: "20px solid #242424",
              margin: "auto",
              backgroundColor: "white",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                borderSpacing: 0,
                tableLayout: "fixed",
              }}
            >
              <thead style={{ backgroundColor: "#242424", color: "white" }}>
                <tr>
                  <th style={{ padding: "12px 15px", textAlign: "center" }}>Clasificación</th>
                  <th style={{ padding: "12px 15px", textAlign: "center" }}>Nro Afiliado</th>
                  <th style={{ padding: "12px 15px", textAlign: "center" }}>Nombre</th>
                  <th style={{ padding: "12px 15px", textAlign: "center" }}>DNI</th>
                  <th style={{ padding: "12px 15px", textAlign: "center" }}>Situación</th>
                </tr>
              </thead>
              <tbody
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onClick={() => navigate("/afiliados/situaciones", { state: { nroAfiliado: resultado.nroAfiliado } })}
              >
                <tr>
                  <td style={{ padding: "10px 15px" }}>{resultado.clasificacion}</td>
                  <td style={{ padding: "10px 15px" }}>{resultado.nroAfiliado}</td>
                  <td style={{ padding: "10px 15px" }}>{resultado.nombre}</td>
                  <td style={{ padding: "10px 15px" }}>{resultado.dni}</td>
                  <td style={{ padding: "10px 15px" }}>{resultado.situacion}</td>
                </tr>
              </tbody>
            </table>
          </div>

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
              onClick={() => navigate("/afiliados/turnos", { state: { nro: resultado.nroAfiliado } }) }
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
              onClick={() => navigate(`/afiliados/${resultado.nroAfiliado}/grupo-familiar`)}
            >
              Historia Clínica
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
