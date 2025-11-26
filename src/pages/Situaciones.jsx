import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export default function Situaciones() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [afiliado, setAfiliado] = useState(null);
  const [situaciones, setSituaciones] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [soloActivas, setSoloActivas] = useState(false);

  // PAGINADO
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginasTotales, setPaginasTotales] = useState()
  const itemsPorPagina = 20;

  const [nuevaSituacion, setNuevaSituacion] = useState({
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [situacionEditar, setSituacionEditar] = useState(null);

  // Cargar afiliado y situaciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAfi = await fetch(`http://localhost:3001/afiliados/${id}`);
        if (!resAfi.ok) throw new Error("Afiliado no encontrado");
        const dataAfi = await resAfi.json();
        setAfiliado(dataAfi);

        const resSit = await fetch(`http://localhost:3001/situaciones/${id}?pagina=${paginaActual}&tamaño=${itemsPorPagina}`);
        if (resSit.status === 404) {
          // No hay situaciones registradas para este afiliado
          setSituaciones([]);
        } else if (!resSit.ok) {
          // Otro error real (500, etc.)
          throw new Error("No se pudieron cargar las situaciones");
        } else {
          const dataSit = await resSit.json();
          const situaciones  = dataSit.situaciones
          setSituaciones(Array.isArray(situaciones) ? situaciones : []);
          setPaginasTotales(Math.ceil(dataSit.count / itemsPorPagina))
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } 
    };
    fetchData();
  }, [id, paginaActual]);

  const filtradas = situaciones
    // Primero ordenamos por estado y fecha
    .sort((a, b) => {
      const hoy = new Date();

      const finA = a.fechaFin ? new Date(a.fechaFin) : null;
      const finB = b.fechaFin ? new Date(b.fechaFin) : null;

      const activaA = !finA || finA >= hoy;
      const activaB = !finB || finB >= hoy;

      // Primero van las activas (true > false)
      if (activaA !== activaB) {
        return activaA ? -1 : 1;
      }

      // Si ambos son del mismo tipo, ordenamos por fechaInicio (más reciente primero)
      return new Date(b.fechaInicio) - new Date(a.fechaInicio);
    })
    // Luego aplicamos los filtros como antes
    .filter((s) => {
      const texto = filtro.toLowerCase();
      const coincideDescripcion = s.descripcion?.toLowerCase().includes(texto);

      if (!soloActivas) return coincideDescripcion;

      const hoy = new Date();
      const fin = s.fechaFin ? new Date(s.fechaFin) : null;
      const esActiva = !fin || fin >= hoy;
      return coincideDescripcion && esActiva;
    });


  // Crear nueva situación
  const handleCrearSituacion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/situaciones/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: nuevaSituacion.descripcion,
          fechaInicio: nuevaSituacion.fechaInicio,
          fechaFin: nuevaSituacion.fechaFin || null,
        }),
      });
      if (!res.ok) throw new Error("Error al crear la situación");
      const data = await res.json();
      setSituaciones([...situaciones, data]);
      setShowModal(false);
      setNuevaSituacion({ descripcion: "", fechaInicio: "", fechaFin: "" });
    } catch (err) {
      console.error(err);
      alert("No se pudo crear la situación");
    }
  };
  // Formatear fecha a dd-mm-aaaa
  const formatearFecha = (fecha) => {
    if (!fecha) return "—";
    const d = new Date(fecha);
    const dia = String(d.getDate() + 1).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const anio = d.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };
  // Editar situación
  const abrirEditar = (sit) => {
    setSituacionEditar(sit);
    setShowEditar(true);
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
      const inicio = new Date(situacionEditar.fechaInicio);
      const fin = situacionEditar.fechaFin ? new Date(situacionEditar.fechaFin) : null;

      if (fin && fin < inicio) {
        alert("La fecha fin no puede ser anterior a la fecha de inicio.");
        return;
      }
    try {
      const res = await fetch(
        `http://localhost:3001/situaciones/${situacionEditar.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fechaFin: situacionEditar.fechaFin,
          }),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar la situación");
      const data = await res.json();

      setSituaciones(
        situaciones.map((s) => (s.id === data.id ? data : s))
      );
      setShowEditar(false);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar la situación");
    }
  };

  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <h3>Error: {error}</h3>
        <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
          Volver atrás
        </button>
      </div>
    );

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
        SITUACIONES TERAPÉUTICAS
      </h2>

      <hr
        className="border-dark border-5 rounded-pill mt-4 mx-auto"
        style={{ width: "90%" }}
      />

      {/* Datos del paciente */}
      <div
        className="mx-auto mt-4 p-4 rounded shadow-lg"
        style={{
          width: "85%",
          background: "#ffffff",
          color: "#222",
          borderLeft: "6px solid #1e1e1e",
          textAlign: "left",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0" style={{ color: "#1e1e1e" }}>
            {afiliado.nombre} {afiliado.apellido}
          </h3>
          <span
            className="badge bg-dark fs-6"
            style={{ borderRadius: "8px", padding: "6px 12px" }}
          >
            {afiliado.parentesco || "Titular"}
          </span>
        </div>

        <p>
          <strong>N° Afiliado:</strong>{" "}
          {afiliado.numeroGrupoFamiliar}-{afiliado.numeroIntegrante}
        </p>
      </div>

      {/* Listado */}
      <div
        className="mt-4 mx-auto p-4 rounded"
        style={{
          width: "90%",
          background: "#1e1e1e",
          color: "white",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap" style={{ gap: "10px" }}>
          <input
            type="text"
            placeholder="Buscar por descripción"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{
              borderRadius: "8px",
              border: "none",
              padding: "5px 10px",
              width: "40%",
              color: "black",
            }}
          />
          {/* Checkbox de activas */}
          <div className="form-check text-light">
            <input
              className="form-check-input"
              type="checkbox"
              id="soloActivas"
              checked={soloActivas}
              onChange={(e) => setSoloActivas(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="soloActivas">
              Mostrar solo activas
            </label>
          </div>

          <button
            className="btn btn-sm fw-semibold text-white"
            style={{
              backgroundColor: "#007b83",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
            }}
            onClick={() => setShowModal(true)}
          >
            + Agregar situación
          </button>

          <h6 className="mb-0 text-light">
            Situaciones registradas:{" "}
            <span className="fw-bold">{filtradas.length}</span>
          </h6>
        </div>

        <div className="table-responsive">
          <table
            className="table align-middle mb-0 text-center"
            style={{
              background: "white",
              color: "black",
              tableLayout: "fixed",
              width: "100%",
            }}
          >
            <thead style={{ background: "#242424", color: "white" }}>
              <tr>
                <th style={{ width: "30%" }}>Descripción</th>
                <th style={{ width: "20%" }}>Desde</th>
                <th style={{ width: "20%" }}>Hasta</th>
                <th style={{ width: "15%" }}>Estado</th>
                <th style={{ width: "15%" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length > 0 ? (
                filtradas.map((s) => (
                  <tr key={s.id}>
                    <td>{s.descripcion}</td>
                    <td>{formatearFecha(s.fechaInicio)}</td>
                    <td>{s.fechaFin ? formatearFecha(s.fechaFin) : "Indefinido"}</td>
                    <td>
                      {(() => {
                        if (!s.fechaFin) return "Activa";
                        const hoy = new Date();
                        const fin = new Date(s.fechaFin);
                        return fin < hoy ? "Finalizada" : "Activa";
                      })()}
                    </td>
                    <td>
                      {(() => {
                        const hoy = new Date();
                        const fin = s.fechaFin ? new Date(s.fechaFin) : null;
                        const esActiva = !fin || fin >= hoy;

                        return (
                          <button
                            className={`btn btn-sm ${
                              esActiva ? "btn-outline-dark" : "btn-outline-secondary"
                            }`}
                            style={{ width: "70px", opacity: esActiva ? 1 : 0.6 }}
                            onClick={() => esActiva && abrirEditar(s)}
                            disabled={!esActiva}
                            title={esActiva ? "Editar situación" : "Solo disponible para situaciones activas"}
                          >
                            Editar
                          </button>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">
                    No hay situaciones terapéuticas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nueva situación terapéutica</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCrearSituacion}>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                value={nuevaSituacion.descripcion}
                onChange={(e) =>
                  setNuevaSituacion({
                    ...nuevaSituacion,
                    descripcion: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha inicio</Form.Label>
              <Form.Control
                type="date"
                value={nuevaSituacion.fechaInicio}
                onChange={(e) =>
                  setNuevaSituacion({
                    ...nuevaSituacion,
                    fechaInicio: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha fin (opcional)</Form.Label>
              <Form.Control
                type="date"
                value={nuevaSituacion.fechaFin}
                onChange={(e) =>
                  setNuevaSituacion({
                    ...nuevaSituacion,
                    fechaFin: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button variant="dark" type="submit" className="w-100">
              Guardar situación
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Editar */}
      <Modal show={showEditar} onHide={() => setShowEditar(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar situación terapéutica</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {situacionEditar && (
            <Form onSubmit={handleGuardarEdicion}>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  value={situacionEditar.descripcion}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha inicio</Form.Label>
                <Form.Control
                  type="date"
                  value={situacionEditar.fechaInicio?.slice(0, 10) || ""}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha fin</Form.Label>
                <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                  <Form.Control
                    type="date"
                    value={situacionEditar.fechaFin?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setSituacionEditar({
                        ...situacionEditar,
                        fechaFin: e.target.value,
                      })
                    }
                    style={{ flex: "1" }}
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() =>
                      setSituacionEditar({
                        ...situacionEditar,
                        fechaFin: null,
                      })
                    }
                  >
                    Indefinido
                  </Button>
                </div>
              </Form.Group>
              <Button variant="dark" type="submit" className="w-100">
                Guardar cambios
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      
      {paginasTotales > 1 && (
        <div style={{ display:"flex", justifyContent:"center", gap:"10px", margin:"20px 0" }}>

          {/* Botón anterior */}
          <button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
            style={{
              padding:"5px 12px",
              borderRadius:"10px",
              border:"2px solid #242424",
              background: paginaActual === 1 ? "#ccc" : "#242424",
              color:"white",
              cursor: paginaActual === 1 ? "not-allowed" : "pointer"
            }}
          >
            ‹
          </button>

          {/* Números */}
          {[...Array(paginasTotales).keys()].map(i => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setPaginaActual(page)}
                style={{
                  padding:"5px 12px",
                  borderRadius:"10px",
                  border:"2px solid #242424",
                  background: paginaActual === page ? "#242424" : "white",
                  color: paginaActual === page ? "white" : "#242424",
                  cursor:"pointer",
                  fontWeight:"bold"
                }}
              >
                {page}
              </button>
            );
          })}

          {/* Botón siguiente */}
          <button
            disabled={paginaActual === paginasTotales}
            onClick={() => setPaginaActual(paginaActual + 1)}
            style={{
              padding:"5px 12px",
              borderRadius:"10px",
              border:"2px solid #242424",
              background: paginaActual === paginasTotales ? "#ccc" : "#242424",
              color:"white",
              cursor: paginaActual === paginasTotales ? "not-allowed" : "pointer"
            }}
          >
            ›
          </button>

        </div>
      )}

      {/* Botón volver */}
      <div className="my-4">
        <button
          className="btn btn-dark px-4 py-2 rounded-pill fw-bold"
          onClick={() => navigate('/afiliados', {state: { grupoNumero: afiliado.numeroGrupoFamiliar, filtroAnterior: "" },})}
        >
          Volver al grupo familiar
        </button>
      </div>
    </div>
  );
}
