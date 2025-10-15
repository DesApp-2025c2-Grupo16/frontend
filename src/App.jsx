// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Afiliados from "./pages/Afiliados.jsx";
import Turnos from "./pages/Turnos.jsx";
import GrupoFamiliarHistoriaClinica from "./pages/GrupoFamiliarHistoriaClinica.jsx";
import HistoriaClinica from "./pages/HistoriaClinica.jsx";
import Situaciones from "./pages/Situaciones.jsx";
import SolicitudesReintegros from "./pages/Solicitudes.jsx";
import DetalleSolicitudReintegros from "./pages/DetalleSolicitudReintegros.jsx";
import SolicitudesAutorizaciones from "./pages/SolicitudesAutorizaciones.jsx";
import DetalleSolicitudAutorizacion from "./pages/DetalleSolicitudAutorizacion.jsx";
import SolicitudesRecetas from "./pages/SolicitudesRecetas.jsx";
import DetalleSolicitudRecetas from "./pages/DetalleSolicitudRecetas.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { SolicitudesProvider } from "./components/SolicitudesContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <SolicitudesProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Solicitudes */}
            <Route path="/solicitudes" element={<Navigate to="/solicitudes/reintegros" replace />} />
            <Route path="/solicitudes/reintegros" element={<SolicitudesReintegros />} />
            <Route path="/solicitudes/reintegros/:id" element={<DetalleSolicitudReintegros />} />

            <Route path="/solicitudes/autorizaciones" element={<SolicitudesAutorizaciones />} />
            <Route path="/solicitudes/autorizaciones/:id" element={<DetalleSolicitudAutorizacion />} /> 

            <Route path="/solicitudes/recetas" element={<SolicitudesRecetas />} />
            <Route path="/solicitudes/recetas/:id" element={<DetalleSolicitudRecetas />} /> 

            {/* Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Afiliados */}
            <Route path="/afiliados" element={<Afiliados />} />
            <Route path="/afiliados/turnos" element={<Turnos />} />
            <Route path="/afiliados/:id/grupo-familiar" element={<GrupoFamiliarHistoriaClinica />} />
            <Route path="/afiliados/historia/:id" element={<HistoriaClinica />} />
            <Route path="/afiliados/situaciones" element={<Situaciones />} />

          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </SolicitudesProvider>
    </AuthProvider>
  );
}
