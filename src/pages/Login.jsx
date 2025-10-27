import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const u = user.trim();
    if (!u) {
      setErr("Ingresá un nombre de usuario.");
      return;
    }
    // guardamos sesión simple
    localStorage.setItem("auth_user", JSON.stringify({ username: u }));
    // navegamos al dashboard
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4" style={{ width: 520 }}>
        <h3 className="mb-3">Iniciar sesión</h3>
        {err && <div className="alert alert-warning py-2">{err}</div>}

        <form onSubmit={onSubmit}>
          <label className="form-label">Nombre de usuario</label>
          <input
            className="form-control mb-3"
            placeholder="ej. j.prestes"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <button type="submit" className="btn btn-brand w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
