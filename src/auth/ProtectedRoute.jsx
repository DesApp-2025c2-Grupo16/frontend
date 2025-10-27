import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const raw = localStorage.getItem("auth_user");
  const logged = !!raw; // si hay sesión guardada
  if (!logged) return <Navigate to="/login" replace />;
  return children;
}
