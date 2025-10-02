// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Afiliados from "./pages/Afiliados.jsx";
import Turnos from "./pages/Turnos.jsx";
import HistoriaClinica from "./pages/HistoriaClinica.jsx";
import Situaciones from "./pages/Situaciones.jsx"; // NUEVO
import SolicitudesReintegros from "./pages/Solicitudes.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import SolicitudesAutorizaciones from "./pages/SolicitudesAutorizaciones.jsx";
import SolicitudesRecetas from "./pages/SolicitudesRecetas.jsx";
import BusquedaAfiliado from "./pages/BusquedaAfiliado";

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

          {/* Afiliados + subrutas */}
          <Route path="/afiliados" element={<Afiliados />} />
          <Route path="/afiliados/turnos" element={<Turnos />} />
          <Route path="/afiliados/historia" element={<HistoriaClinica />} />
          <Route path="/afiliados/situaciones" element={<Situaciones />} />

          {/* Solicitudes */}
          <Route path="/solicitudes" element={<Navigate to="/solicitudes/reintegros" replace />} />
          <Route path="/solicitudes/reintegros" element={<SolicitudesReintegros />} />
          <Route path="/solicitudes/autorizaciones" element={<SolicitudesAutorizaciones />} />
          <Route path="/solicitudes/recetas" element={<SolicitudesRecetas />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
