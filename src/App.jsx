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
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { SolicitudesProvider } from "./components/SolicitudesContext.jsx";
import Messages from "./pages/Messages.jsx";


export default function App() {
  return (
    <SolicitudesProvider>
      <Routes>
        {/* público */}
        <Route path="/login" element={<Login />} />

        {/* privado */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Redirección por defecto */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />

          {/* Solicitudes */}
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

          {/* Afiliados */}
          <Route path="/afiliados" element={<Afiliados />} />
          <Route path="/afiliados/turnos" element={<Turnos />} />
          <Route path="/turnos" element={<Turnos />} />
            
          {/*  Mensajería */}
          <Route path="/mensajes" element={<Messages />} />

          {/* Historia Clinica */}
          <Route path="/historia-clinica/:id" element={<HistoriaClinica />} />

          {/* Situacion terapeutica */}
          <Route path="/situaciones/:id" element={<Situaciones />} />
        </Route>

            {/* */}
            <Route path="/turnos" element={<Turnos />} />

          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </SolicitudesProvider>
    </AuthProvider>
  );
}
