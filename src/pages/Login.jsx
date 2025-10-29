import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import background from "../assets/Prestadores.png"; // opcional, fondo con líneas suaves

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem("auth_user", JSON.stringify({ username }));
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "#1e1e1e",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ maxWidth: "1100px" }}
      >
        {/* Columna izquierda con logo y texto */}
        <div className="flex-grow-1 text-center text-white pe-5">
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "140px",
              width: "140px",
              objectFit: "contain",
              borderRadius: "50%",
              backgroundColor: "#fff1",
              padding: "10px",
            }}
          />
          <h2 className="fw-bold mt-3 mb-0" style={{ fontSize: "2rem" }}>
            Medicina
          </h2>
          <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
            Integral
          </h2>
        </div>

        {/* Columna derecha con formulario */}
        <div
          className="bg-white rounded p-4 shadow"
          style={{
            width: "350px",
            textAlign: "center",
          }}
        >
          <h5 className="fw-bold text-dark mb-4 text-uppercase">Iniciar sesión</h5>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label text-dark fw-semibold">
                Nombre de usuario
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="ej. j.prestes"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 mt-3"
              style={{
                backgroundColor: "#222",
                color: "white",
                fontWeight: "bold",
                letterSpacing: "0.5px",
                borderRadius: "0",
              }}
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
