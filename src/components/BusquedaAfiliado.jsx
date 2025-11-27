import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

export default function BusquedaAfiliado() {
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState(String(location.state?.grupoNumero || ""));
  const [grupoFamiliar, setGrupoFamiliar] = useState([]);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState(location.state?.filtroAnterior || "");

  // Buscar grupo familiar
  const buscar = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setGrupoFamiliar([]);

    const grupoNumero = q.trim();
    if (!grupoNumero) return;

    try {
      const grupoRes = await fetch(
        `http://localhost:3001/afiliados/grupo-familiar/${grupoNumero}`
      );
      if (!grupoRes.ok) throw new Error("Grupo familiar no encontrado");
      const grupo = await grupoRes.json();
      setGrupoFamiliar(grupo);

    } catch (err) {
      console.error(err);
      setError("No se encontró el grupo familiar");
    }
  };

  useEffect(() => {
    if (location.state?.grupoNumero) {
      buscar();
    }
  }, []);

  // Filtro
  const grupoFiltrado = grupoFamiliar.filter((miembro) => {
    const texto = filtro.toLowerCase();
    const nroAfiliado = `${miembro.numeroIntegrante}`;
    const coincideNombre = miembro.nombre?.toLowerCase().includes(texto);
    const coincideApellido = miembro.apellido?.toLowerCase().includes(texto);
    const coincideNumero = nroAfiliado.toLowerCase().includes(texto);
    return coincideNombre || coincideApellido || coincideNumero;
  });

  return (
    <div className="mt-4 text-center" style={{ fontFamily: "sans-serif" }}>
      <h2
        className="fw-bold py-3 mx-auto rounded-pill"
        style={{
          background: "#1e1e1e",
          color: "white",
          width: "90%",
          textAlign: "center",
        }}
      >
        BÚSQUEDA DE AFILIADO
      </h2>

      <hr
      className="border-dark border-5 rounded-pill mx-auto"
      style={{ width: "90%" }}
      />

      {/* BUSCADOR */}
      <form
        onSubmit={buscar}
        className="d-flex justify-content-center align-items-center mt-4"
        style={{
          border: "3px solid #1e1e1e",
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
          placeholder="N° Grupo Familiar"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            borderRadius: "50px",
            marginRight: "10px",
            background: "#242424",
            color: "white",
          }}
        />
        <button type="submit" className="btn btn-dark" style={{ borderRadius: "50px" }}>
          BUSCAR
        </button>
      </form>

      {error && <p className="text-danger mt-3">{error}</p>}

      {/* TABLA DE RESULTADOS */}
      {grupoFamiliar.length > 0 && (
        <div
          className="mt-5 mx-auto p-4"
          style={{
            background: "#1e1e1e",
            color: "white",
            borderRadius: "15px",
            width: "90%",
          }}
        >
          {/* Campo de filtro y encabezado */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o N° afiliado"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "none",
                padding: "5px 10px",
                width: "60%",
              }}
            />
            <h6 className="mb-0 text-light">
              Grupo Familiar N°{" "}
              <span className="fw-bold">
                {grupoFamiliar[0]?.numeroGrupoFamiliar}
              </span>{" "}
              — {grupoFiltrado.length} integrante(s)
            </h6>
          </div>

          {/* LISTADO */}
          <div className="table-responsive">
            <table
              className="table align-middle mb-0 text-center"
              style={{ background: "white", color: "black", tableLayout: "fixed", width: "100%" }}
            >
              <thead style={{ background: "#242424", color: "white" }}>
                <tr>
                  <th style={{ width: "12%" }}>N° Afiliado</th>
                  <th style={{ width: "18%" }}>Clasificación</th>
                  <th style={{ width: "17%" }}>Nombre</th>
                  <th style={{ width: "17%" }}>Apellido</th>
                  <th style={{ width: "36%" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {grupoFiltrado.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      No hay integrantes para mostrar
                    </td>
                  </tr>
                ) : (
                  grupoFiltrado.map((miembro) => (
                    <tr key={miembro.id}>
                      <td>
                        {miembro.numeroGrupoFamiliar}-{miembro.numeroIntegrante}
                      </td>
                      <td>{miembro.parentesco}</td>
                      <td>{miembro.nombre}</td>
                      <td>{miembro.apellido}</td>
                      <td>
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ gap: "10px", whiteSpace: "nowrap" }}
                        >
                          {/* Historia Clínica */}
                          <button
                            className="btn btn-sm fw-semibold"
                            style={{
                              backgroundColor: "#f5a623",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "5px 10px",
                              minWidth: "120px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                            }}
                            onClick={() => navigate(`/historia-clinica/${miembro.id}`)}
                          >
                            Historia Clínica
                          </button>

                          {/* Situaciones Terapéuticas */}
                          <button
                            className="btn btn-sm fw-semibold"
                            style={{
                              backgroundColor: "#007b83",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "5px 10px",
                              minWidth: "150px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                            }}
                            onClick={() => navigate(`/situaciones/${miembro.id}`, {state: { grupoNumero: q, filtro }})}
                          >
                            Situaciones terapéuticas
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}