// src/pages/Messages.jsx
import { useState } from "react";

export default function Messages() {
  const [inbox, setInbox] = useState([]);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const send = () => {
    setErr(null);
    setOk(null);

    if (!to.trim()) {
      setErr("El campo 'Para' no puede estar vacío.");
      return;
    }
    if (!subject.trim()) {
      setErr("El campo 'Asunto' no puede estar vacío.");
      return;
    }

    const msg = {
      id: crypto.randomUUID(),
      to: to.trim(),
      subject: subject.trim(),
      body: body.trim(),
      at: new Date().toISOString(),
    };
    setInbox((prev) => [msg, ...prev]);
    setTo("");
    setSubject("");
    setBody("");
    setOk("Mensaje enviado correctamente.");
    setTimeout(() => setOk(null), 2500);
  };

  return (
    <div className="container-xxl" >
      {/* ======== PILL DE TÍTULO ======== */}
      <div className="row g-3">
        <div className="col-12 text-center mt-5">
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
            MENSAJERÍA
          </h2>
        </div>

        <hr
          className="border-dark border-5 rounded-pill mt-4 mx-auto"
          style={{ width: "90%" }}
        />
      </div>
      {/* ================================ */}

      {err && <div className="alert alert-warning mt-3">{err}</div>}
      {ok && <div className="alert alert-success mt-3">{ok}</div>}

      <div className="row g-3 mt-3">
        <div className="col-12">
          <div className="card p-3">
            <div className="mb-3">
              <label className="form-label">Para:</label>
              <input
                type="email"
                className="form-control"
                placeholder="usuario@dominio"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Asunto:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Asunto del mensaje"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mensaje:</label>
              <textarea
                className="form-control"
                rows={6}
                placeholder="Escribí tu mensaje..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            <button className="btn btn-brand w-100" onClick={send}>
              Enviar mensaje
            </button>
          </div>
        </div>

        <div className="col-12">
          <div className="card p-3">
            <h5 className="mb-3">Bandeja de mensajes</h5>
            {inbox.length === 0 ? (
              <div className="text-muted">No hay mensajes.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark align-middle mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: 220 }}>Para</th>
                      <th>Asunto</th>
                      <th style={{ width: 220 }}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inbox.map((m) => (
                      <tr key={m.id}>
                        <td>{m.to}</td>
                        <td>{m.subject}</td>
                        <td>
                          {new Date(m.at).toLocaleString("es-AR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
