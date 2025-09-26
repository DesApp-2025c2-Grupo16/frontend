export default function StatusBadge({estado}){
  const map = {
    "Recibido":"recibido",
    "En análisis":"analisis",
    "Observado":"observado",
    "Aprobado":"aprobado",
    "Rechazado":"rechazado",
  };
  const cls = map[estado] || "recibido";
  return <span className={`status ${cls}`}>{estado}</span>;
}