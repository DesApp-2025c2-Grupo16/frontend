import { useEffect } from "react";

export default function ToastMessage({
  message,
  type = "success",   // "success" | "error" | "info" | "warning"
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(id);
  }, [message, duration, onClose]);

  if (!message) return null;

  // Configuración base de tamaño
  const BASE_WIDTH = 380;    // ancho de referencia
  const TARGET_WIDTH = 480;  // ajustá este valor para agrandar/achicar todo
  const SCALE = TARGET_WIDTH / BASE_WIDTH;

  // Limitar un poco la escala
  const clampedScale = Math.max(0.8, Math.min(1.4, SCALE));

  // Tamaños derivados
  const minWidth = TARGET_WIDTH;
  const maxWidth = TARGET_WIDTH + 120 * clampedScale;
  const paddingY = 10 * clampedScale;
  const paddingX = 16 * clampedScale;
  const borderRadius = 10 * clampedScale;
  const fontSize = 14 * clampedScale;
  const closeSize = 18 * clampedScale;

  let bgColor;
  switch ((type || "").toLowerCase()) {
    case "success":
      bgColor = "green";
      break;
    case "warning":
      bgColor = "orange";
      break;
    case "error":
      bgColor = "crimson";
      break;
    case "info":
      bgColor = "royalblue";
      break;
    default:
      bgColor = "green";
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 2000,
      }}
    >
      <div
        style={{
          minWidth,
          maxWidth,
          backgroundColor: bgColor,
          color: "white",
          padding: `${paddingY}px ${paddingX}px`,
          borderRadius,
          boxShadow: "0 4px 10px rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 12 * clampedScale,
          fontWeight: 500,
          fontSize,
        }}
      >
        <span
          style={{
            lineHeight: 1.4,
            flex: 1,            // ocupa todo el ancho disponible
            textAlign: "center" // texto centrado
          }}
        >
          {message}
        </span>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color: "white",
            fontSize: closeSize,
            cursor: "pointer",
            lineHeight: 1,
          }}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
}
