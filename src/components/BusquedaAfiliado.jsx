import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function BusquedaAfiliado() {
  const [q, setQ] = useState("");
  const [grupoFamiliar, setGrupoFamiliar] = useState([]);
  const [situaciones, setSituaciones] = useState([]);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);

  // Modales
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  // Situaciones seleccionadas
  const [situacionAEliminar, setSituacionAEliminar] = useState(null);
  const [situacionAEditar, setSituacionAEditar] = useState(null);

  // Fechas para editar
  const [editFechas, setEditFechas] = useState({
    desde: "",
    hasta: "",
    indefinido: false,
  });

  const [temp, setTemp] = useState({
    nombre: "",
    situacion: "",
    desde: "",
    hasta: "",
  });

  // Buscar afiliado
  const buscar = async (e) => {
    e.preventDefault();
    setError("");
    setGrupoFamiliar([]);
    setSituaciones([]);
    const id = q.trim();
    if (!id) return;

    try {
      const afiliadoRes = await fetch(`http://localhost:3001/afiliados/${id}`);
      if (!afiliadoRes.ok) throw new Error("Afiliado no encontrado");
      const afiliado = await afiliadoRes.json();

      const grupoRes = await fetch(
        `http://localhost:3001/afiliados/grupo-familiar/${afiliado.numeroGrupoFamiliar}`
      );
      const grupo = await grupoRes.json();
      setGrupoFamiliar(grupo);

      const sitRes = await fetch(
        `http://localhost:3001/situaciones/grupoFamiliar/${afiliado.numeroGrupoFamiliar}`
      );
      const sit = await sitRes.json();
      setSituaciones(sit);
    } catch (err) {
      console.error(err);
      setError("Afiliado no encontrado");
    }
  };

  const obtenerSituacionesPorAfiliado = (id) =>
    situaciones.filter((s) => s.AfiliadoId === id);

  const cancelarAgregar = () => {
    setAdding(false);
    setTemp({ nombre: "", situacion: "", desde: "", hasta: "" });
  };

  // Crear situación
  const guardarSituacion = async () => {
    if (!temp.nombre || !temp.situacion || !temp.desde) {
      alert("Completá al menos nombre, situación y fecha de inicio.");
      return;
    }

    const miembroSeleccionado = grupoFamiliar.find(
      (m) => m.nombre === temp.nombre
    );
    if (!miembroSeleccionado) {
      alert("Debe seleccionar un afiliado válido.");
      return;
    }

    const nuevaSituacion = {
      descripcion: temp.situacion,
      fechaInicio: new Date(temp.desde).toISOString(),
      fechaFin: temp.hasta ? new Date(temp.hasta).toISOString() : null,
      AfiliadoId: miembroSeleccionado.id,
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/situaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaSituacion),
      });

      if (!res.ok) throw new Error("Error al crear la situación");
      const creada = await res.json();

      setSituaciones([...situaciones, creada]);
      cancelarAgregar();
    } catch (err) {
      console.error(err);
      alert("Error al guardar la situación.");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar situación
  const confirmarEliminar = (situacion) => {
    setSituacionAEliminar(situacion);
    setShowModalDelete(true);
  };

  const eliminarSituacion = async () => {
    if (!situacionAEliminar) return;
    try {
      const res = await fetch(
        `http://localhost:3001/situaciones/${situacionAEliminar.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Error al eliminar situación");
      setSituaciones(situaciones.filter((s) => s.id !== situacionAEliminar.id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la situación.");
    } finally {
      setShowModalDelete(false);
      setSituacionAEliminar(null);
    }
  };

  // Editar situación
  const abrirEditar = (situacion) => {
    setSituacionAEditar(situacion);
    setEditFechas({
      desde: situacion.fechaInicio
        ? situacion.fechaInicio.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      hasta: situacion.fechaFin ? situacion.fechaFin.slice(0, 10) : "",
      indefinido: situacion.fechaFin === null,
    });
    setShowModalEdit(true);
  };

  const guardarEdicion = async () => {
    if (!situacionAEditar) return;

    if (!editFechas.desde) {
      alert("Debe indicar una fecha de inicio.");
      return;
    }

    const actualizado = {
      fechaInicio: new Date(editFechas.desde).toISOString(),
      fechaFin: editFechas.indefinido
        ? null
        : editFechas.hasta
        ? new Date(editFechas.hasta).toISOString()
        : null,
    };

    try {
      const res = await fetch(
        `http://localhost:3001/situaciones/${situacionAEditar.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(actualizado),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar situación");
      const data = await res.json();

      setSituaciones(situaciones.map((s) => (s.id === data.id ? data : s)));
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la situación.");
    } finally {
      setShowModalEdit(false);
      setSituacionAEditar(null);
    }
  };

  // Filtrado
  const grupoFiltrado = grupoFamiliar.filter((miembro) => {
    const situacionesAfiliado = obtenerSituacionesPorAfiliado(miembro.id);
    const texto = filtro.toLowerCase();
    const coincideSituacion = situacionesAfiliado.some(
      (s) => s.descripcion && s.descripcion.toLowerCase().includes(texto)
    );
    return (
      miembro.parentesco.toLowerCase().includes(texto) ||
      miembro.nombre.toLowerCase().includes(texto) ||
      coincideSituacion
    );
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
        <button type="submit" className="btn btn-dark" style={{ borderRadius: "50px" }}>
          BUSCAR
        </button>
      </form>

      {error && <p className="text-danger mt-3">{error}</p>}

      {/* TABLA */}
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              placeholder="Buscar por nombre o situación"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "none",
                padding: "5px 10px",
                width: "60%",
              }}
            />
            <button
              className="btn btn-success"
              style={{ borderRadius: "8px", fontWeight: "bold" }}
              onClick={() => setAdding(true)}
            >
              Agregar situación
            </button>
          </div>

          {/* FORMULARIO ALTA */}
          {adding && (
            <div className="border rounded p-3 mb-3" style={{ background: "white", color: "black" }}>
              <div className="row g-2 align-items-center">
                <div className="col-12 col-md-3">
                  <label className="form-label">Nombre</label>
                  <select
                    className="form-select"
                    value={temp.nombre}
                    onChange={(e) => setTemp({ ...temp, nombre: e.target.value })}
                  >
                    <option value="">Seleccionar...</option>
                    {grupoFamiliar.map((miembro) => (
                      <option key={miembro.id} value={miembro.nombre}>
                        {miembro.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-5">
                  <label className="form-label">Situación</label>
                  <input
                    className="form-control"
                    value={temp.situacion}
                    onChange={(e) => setTemp({ ...temp, situacion: e.target.value })}
                  />
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label">Desde</label>
                  <input
                    type="date"
                    className="form-control"
                    value={temp.desde}
                    onChange={(e) => setTemp({ ...temp, desde: e.target.value })}
                  />
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label">Hasta</label>
                  <input
                    type="date"
                    className="form-control"
                    value={temp.hasta}
                    onChange={(e) => setTemp({ ...temp, hasta: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={guardarSituacion}
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={cancelarAgregar}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* LISTADO */}
          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ background: "white", color: "black" }}>
              <thead style={{ background: "#242424", color: "white" }}>
                <tr>
                  <th>Clasificación</th>
                  <th>Nombre</th>
                  <th>Situación</th>
                  <th>Desde</th>
                  <th>Hasta</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {grupoFiltrado.map((miembro) => {
                  const situacionesAfiliado = obtenerSituacionesPorAfiliado(miembro.id);

                  if (situacionesAfiliado.length === 0) {
                    return (
                      <tr key={`miembro-${miembro.id}`}>
                        <td>{miembro.parentesco}</td>
                        <td>{miembro.nombre}</td>
                        <td colSpan="3" className="text-center text-muted">
                          Sin situaciones registradas
                        </td>
                        <td style={{ width: "280px" }}>
                          <div
                            className="d-flex justify-content-between align-items-center"
                            style={{ gap: "8px", whiteSpace: "nowrap" }}
                          >
                            <button
                              className="btn btn-sm fw-semibold text-white"
                              style={{
                                backgroundColor: "#f0ad4e",
                                border: "none",
                                width: "115px",
                              }}
                              onClick={() =>
                                console.log(`Abrir historia clínica de ${miembro.nombre}`)
                              }
                            >
                              Historia Clínica
                            </button>
                            <button className="btn btn-sm btn-outline-dark" style={{ width: "70px" }} disabled>
                              Editar
                            </button>
                            <button className="btn btn-sm btn-outline-danger" style={{ width: "80px" }} disabled>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return situacionesAfiliado.map((sit) => (
                    <tr key={sit.id}>
                      <td>{miembro.parentesco}</td>
                      <td>{miembro.nombre}</td>
                      <td>{sit.descripcion}</td>
                      <td>{sit.fechaInicio?.slice(0, 10)}</td>
                      <td>{sit.fechaFin ? sit.fechaFin.slice(0, 10) : "Indefinido"}</td>
                      <td style={{ width: "280px" }}>
                        <div
                          className="d-flex justify-content-between align-items-center"
                          style={{ gap: "8px", whiteSpace: "nowrap" }}
                        >
                          <button
                            className="btn btn-sm fw-semibold text-white"
                            style={{
                              backgroundColor: "#f0ad4e",
                              border: "none",
                              width: "115px",
                            }}
                            onClick={() =>
                              console.log(`Abrir historia clínica de ${miembro.nombre}`)
                            }
                          >
                            Historia Clínica
                          </button>
                          <button
                            className="btn btn-sm btn-outline-dark"
                            style={{ width: "70px" }}
                            onClick={() => abrirEditar(sit)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            style={{ width: "80px" }}
                            onClick={() => confirmarEliminar(sit)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      <Modal show={showModalDelete} onHide={() => setShowModalDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Deseás eliminar esta situación?
          <br />
          <strong>{situacionAEliminar?.descripcion}</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarSituacion}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL EDITAR */}
      <Modal show={showModalEdit} onHide={() => setShowModalEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar fechas de la situación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-bold">{situacionAEditar?.descripcion}</p>

          <label className="form-label">Desde</label>
          <input
            type="date"
            className="form-control mb-3"
            value={editFechas.desde}
            onChange={(e) => setEditFechas({ ...editFechas, desde: e.target.value })}
          />

          <label className="form-label">Hasta</label>
          <input
            type="date"
            className="form-control mb-2"
            disabled={editFechas.indefinido}
            value={editFechas.hasta}
            onChange={(e) => setEditFechas({ ...editFechas, hasta: e.target.value })}
          />

          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={editFechas.indefinido}
              onChange={(e) =>
                setEditFechas({ ...editFechas, indefinido: e.target.checked, hasta: "" })
              }
            />
            <label className="form-check-label">Fecha fin indefinida</label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalEdit(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarEdicion}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
