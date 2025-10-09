import { createContext, useContext, useState, useEffect } from "react";

const SolicitudesContext = createContext();

export const SolicitudesProvider = ({ children }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      const data = [
        // REINTEGROS
        {
          tipo: "reintegro",
          id: 1,
          afiliado: "Juan P.",
          estado: "En análisis",
          motivo: "Consulta traumatología",
          fecha: "02/09/2025",
          fechaPrestacion: "30/08/2025",
          integrante: "Juan Pérez",
          medico: "Dr. González",
          especialidad: "Traumatología",
          lugar: "Hospital Central",
          factura: { fecha: "30/08/2025", cuit: "20-12345678-9", total: 15000, persona: "Juan Pérez" },
          formaPago: { tipo: "Transferencia", cbu: "0123456789012345678901" },
          observaciones: "Presentó toda la documentación correctamente."
        },
        {
          tipo: "reintegro",
          id: 2,
          afiliado: "Ana López",
          estado: "Observado",
          motivo: "Estudio de diagnóstico",
          fecha: "01/09/2025",
          fechaPrestacion: "29/08/2025",
          integrante: "Ana López",
          medico: "Dr. Martínez",
          especialidad: "Radiología",
          lugar: "Clínica Norte",
          factura: { fecha: "29/08/2025", cuit: "27-98765432-1", total: 8500, persona: "Ana López" },
          formaPago: { tipo: "Cheque" },
          observaciones: "Falta comprobante de pago."
        },
        // AUTORIZACIONES
        {
          tipo: "autorizacion",
          id: 3,
          solicitud: "Autorización #1",
          afiliado: "Juan P.",
          estado: "En análisis",
          motivo: "-",
          fecha: "02/09/2025",
          detalle: {
            fechaPrevista: "03/09/2025",
            integrante: "Juan P. (titular)",
            medico: "Dr. Alejandro Ramírez",
            especialidad: "Cirugía General",
            lugar: "Hospital San Lucas (CABA)",
            dias: "3",
            observaciones: "Solicito autorización para cirugía programada de hernia inguinal. Cobertura según plan vigente."
          }
        },
        {
          tipo: "autorizacion",
          id: 4,
          solicitud: "Autorización #2",
          afiliado: "Ana G.",
          estado: "Recibido",
          motivo: "-",
          fecha: "04/09/2025",
          detalle: {
            fechaPrevista: "06/09/2025",
            integrante: "Ana G. (hija)",
            medico: "Dra. M. López",
            especialidad: "Traumatología",
            lugar: "Clínica Santa María",
            dias: "1",
            observaciones: "Artroscopía diagnóstica."
          }
        },
        // RECETAS
        {
          id: 5,
          tipo: "receta",
          afiliado: "Juan P.",
          estado: "Recibido",
          motivo: "-",
          solicitud: "Receta #1",
          fecha: "05/09/2025",
          detalle: {
            integrante: "Juan P.",
            medicamento: "Ibuprofeno",
            cantidad: "2",
            presentacion: "400 mg x 10 comp.",
            observaciones: "Uso por 5 días."
          }
        },
        {
          id: 6,
          tipo: "receta",
          afiliado: "Ana G.",
          estado: "En análisis",
          motivo: "-",
          solicitud: "Receta #2",
          fecha: "07/09/2025",
          detalle: {
            integrante: "Ana G.",
            medicamento: "Amoxicilina",
            cantidad: "1",
            presentacion: "500 mg x 12 caps.",
            observaciones: "Tomar cada 8 hs."
          }
        }
      ];

      setSolicitudes(data);
      setLoading(false);
    };

    fetchSolicitudes();
  }, []);

  const actualizarEstado = (id, nuevoEstado) => {
    setSolicitudes(prev =>
      prev.map(s => (s.id === id ? { ...s, estado: nuevoEstado } : s))
    );
  };

  return (
    <SolicitudesContext.Provider value={{ solicitudes, actualizarEstado, loading }}>
      {children}
    </SolicitudesContext.Provider>
  );
};

export const useSolicitudes = () => useContext(SolicitudesContext);

