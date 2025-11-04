// src/pages/Solicitudes.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SolicitudesReintegros() {
  const [reintegros, setReintegros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReintegros = async () => {
      try {
        const prestadorId = 1; // cambiar por el ID real
        const response = await fetch(`http://localhost:3001/reintegros/${prestadorId}`);

        if (!response.ok) {
          // si la respuesta del servidor no es 200-299, lanzamos error
          const errData = await response.json();
          throw new Error(errData.message || "Error al cargar los reintegros");
        }

        const data = await response.json();
        setReintegros(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReintegros();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden text-dark">Cargando...</span>
        </div>
        <p className="mt-3 text-dark">Cargando solicitudes de reintegro...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        <h5 className="text-dark">{error}</h5>
        <button className="btn btn-dark mt-3" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
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
        SOLICITUDES DE REINTEGRO
      </h2>

      <hr
        className="border-dark border-5 rounded-pill mt-4 mx-auto"
        style={{ width: "90%" }}
      />

      <div
        className="table-responsive mx-auto"
        style={{ width: "90%", background: "white", borderRadius: "10px", padding: "20px" }}
      >
        <table className="table table-hover align-middle">
          <thead>
            <tr style={{ background: "#242424", color: "white" }}>
              <th scope="col">ID</th>
              <th scope="col">Asunto</th>
              <th scope="col">Fecha</th>
              <th scope="col">Especialidad</th>
              <th scope="col">Estado</th>
              <th scope="col" className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reintegros.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.asunto}</td>
                <td>{new Date(r.fecha).toLocaleDateString()}</td>
                <td>{r.especialidad}</td>
                <td>
                  <span
                    className={`badge text-bg-${
                      r.estado === "Aprobado"
                        ? "success"
                        : r.estado === "Rechazado"
                        ? "danger"
                        : r.estado === "Observado"
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {r.estado}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => navigate(`/solicitudes/reintegros/${r.id}`)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reintegros.length === 0 && (
          <div className="text-center text-muted py-4">
            No hay solicitudes de reintegro registradas.
          </div>
        )}
      </div>
    </div>
  );
}
