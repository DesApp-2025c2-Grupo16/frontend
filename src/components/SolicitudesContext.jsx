// src/components/SolicitudesContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const SolicitudesContext = createContext();

export const SolicitudesProvider = ({ children }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simula carga inicial de datos (reemplazable por fetch a backend)
  useEffect(() => {
    const fetchSolicitudes = async () => {
      // Aquí podrías hacer fetch('/api/solicitudes') en el futuro
      const data = [
        {
          id: 1,
          afiliado: "Juan P.",
          estado: "En análisis",
          motivo: "Consulta traumatología",
          fecha: "2 sept 2025",
          fechaPrestacion: "30 ago 2025",
          integrante: "Juan Pérez",
          medico: "Dr. González",
          especialidad: "Traumatología",
          lugar: "Hospital Central",
          factura: {
            fecha: "30 ago 2025",
            cuit: "20-12345678-9",
            total: 15000,
            persona: "Juan Pérez",
          },
          formaPago: { tipo: "Transferencia", cbu: "0123456789012345678901" },
          observaciones: "Presentó toda la documentación correctamente.",
        },
        {
          id: 2,
          afiliado: "Ana López",
          estado: "Observado",
          motivo: "Estudio de diagnóstico",
          fecha: "1 sept 2025",
          fechaPrestacion: "29 ago 2025",
          integrante: "Ana López",
          medico: "Dr. Martínez",
          especialidad: "Radiología",
          lugar: "Clínica Norte",
          factura: {
            fecha: "29 ago 2025",
            cuit: "27-98765432-1",
            total: 8500,
            persona: "Ana López",
          },
          formaPago: { tipo: "Cheque" },
          observaciones: "Falta comprobante de pago.",
        },
        
      ];

      setSolicitudes(data);
      setLoading(false);
    };

    fetchSolicitudes();
  }, []);

  const actualizarEstado = (id, nuevoEstado) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
    );
  };

  return (
    <SolicitudesContext.Provider value={{ solicitudes, actualizarEstado, loading }}>
      {children}
    </SolicitudesContext.Provider>
  );
};

export const useSolicitudes = () => useContext(SolicitudesContext);
