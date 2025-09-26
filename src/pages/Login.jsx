import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();
  const [user, setUser] = useState("");

  const submit = (e) => {
    e.preventDefault();
    login(user); // guarda sesión
    const go = loc.state?.from || "/dashboard";
    nav(go, { replace: true });
  };

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card p-4">
        <h1 className="h4 mb-3 text-center">Iniciar sesión</h1>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Nombre de usuario</label>
            <input
              className="form-control"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="ej. jprestes"
              required
            />
          </div>
          <button className="btn btn-brand w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
}
