import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Solicitudes from "./pages/Solicitudes.jsx";
import Afiliados from "./pages/Afiliados.jsx";
import Turnos from "./pages/Turnos.jsx";
import HistoriaClinica from "./pages/HistoriaClinica.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/*redirección KISS */}
          <Route path="/solicitudes" element={<Navigate to="/solicitudes/reintegros" replace />} />
          <Route path="/solicitudes/:tipo" element={<Solicitudes />} />
          <Route path="/afiliados" element={<Afiliados />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/historia" element={<HistoriaClinica />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
