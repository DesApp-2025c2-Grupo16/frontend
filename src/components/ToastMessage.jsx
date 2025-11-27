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

  let bgColor;
  switch ((type || "").toLowerCase()) {
    case "success":
      bgColor = "green";
      break;
    case "warning":
      bgColor = "orange";      // Observado
      break;
    case "error":
      bgColor = "crimson";     // Rechazado / errores
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
        bottom: 16,
        right: 16,
        zIndex: 2000,
      }}
    >
      <div
        style={{
          minWidth: 260,
          maxWidth: 400,
          backgroundColor: bgColor,
          color: "white",
          padding: "10px 14px",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          fontWeight: 500,
        }}
      >
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color: "white",
            fontSize: 18,
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
