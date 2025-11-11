import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TurnosDelDia({ username = "Prestador" }) {
  const { fecha } = useParams();
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prestadorId = 1;

  useEffect(() => {
    const fetchTurnosDelDia = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/turnos/${prestadorId}/fecha/${fecha}`
        );
        if (!res.ok) throw new Error("No se pudieron cargar los turnos del día.");
        const data = await res.json();

        // Traer los datos del afiliado
        const turnosConAfiliado = await Promise.all(
          data.map(async (t) => {
            try {
              const afRes = await fetch(
                `http://localhost:3001/afiliados/${t.AfiliadoId}`
              );
              if (!afRes.ok) throw new Error();
              const afData = await afRes.json();
              return { ...t, afiliado: afData };
            } catch {
              return { ...t, afiliado: null };
            }
          })
        );

        setTurnos(turnosConAfiliado);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTurnosDelDia();
  }, [fecha]);

  /* 🔹 Formatear fecha (día completo) */
  const formatearFecha = (fechaCompleta) => {
    if (!fechaCompleta) return "";
    const f = new Date(fechaCompleta);
    return f.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /* 🔹 Obtener hora exacta desde el string (sin convertir a local) */
  const extraerHora = (fechaCompleta) => {
    if (!fechaCompleta) return "--:--";
    const match = fechaCompleta.match(/T(\d{2}:\d{2})/);
    return match ? match[1] : "--:--";
  };

  if (loading)
    return (
      <div className="text-center mt-5 text-secondary">
        <h4>Cargando turnos del día...</h4>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <h3>Error: {error}</h3>
        <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
          Volver atrás
        </button>
      </div>
    );

  const fechaTitulo = new Date(`${fecha}T12:00:00`).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mt-4 text-center" style={{ fontFamily: "sans-serif" }}>
      {/* Encabezado */}
      <h2
        className="fw-bold py-3 mx-auto rounded-pill"
        style={{
          background: "#1e1e1e",
          color: "white",
          width: "90%",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        TURNOS DEL {fechaTitulo}
      </h2>

      <hr className="border-dark border-5 rounded-pill mt-4" />

      {/* Contenedor principal */}
      <div
        className="mt-4 mx-auto p-4 rounded"
        style={{
          width: "100%",
          background: "#f7f7f7",
          textAlign: "left",
          color: "#1e1e1e",
        }}
      >
        {turnos.length === 0 ? (
          <p className="text-muted text-center mb-0">
            No hay turnos registrados para este día.
          </p>
        ) : (
          <div className="px-2">
            <h4 className="fw-bold mb-4 text-uppercase" style={{ color: "#1e1e1e" }}>
              LISTADO DE TURNOS
            </h4>

            {turnos.map((t) => (
              <div
                key={t.id}
                className="mb-3 p-3 rounded shadow-sm"
                style={{
                  background: "white",
                  border: "2px solid #ddd",
                  borderRadius: "15px",
                }}
              >
                {/* Descripción + hora en pastilla */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold text-dark mb-0">
                    {t.descripcion || "Turno sin descripción"}
                  </h5>
                  <span
                    className="badge bg-dark text-white px-3 py-2 rounded-pill"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {extraerHora(t.fecha)}
                  </span>
                </div>

                <p className="mb-1">
                  <strong>Especialidad:</strong> {t.especialidad || "No indicada"}
                </p>
                <p className="mb-1">
                  <strong>Afiliado:</strong>{" "}
                  {t.afiliado
                    ? `${t.afiliado.nombre} ${t.afiliado.apellido}`
                    : `#${t.AfiliadoId}`}
                </p>
                <p className="mb-0">
                  <strong>Prestador:</strong> {username}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón volver */}
      <div className="my-4">
        <button
          className="btn btn-dark px-4 py-2 rounded-pill fw-bold"
          onClick={() => navigate("/turnos")}
        >
          Volver al calendario
        </button>
      </div>
    </div>
  );
}
