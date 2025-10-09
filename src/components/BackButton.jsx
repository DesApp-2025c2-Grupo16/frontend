import { useNavigate } from "react-router-dom";

export default function BackButton({ to = -1, title = "Volver" }) {
  const navigate = useNavigate();
  const onClick = () => {
    if (typeof to === "number") navigate(to);
    else navigate(to);
  };

  return (
    <button
      type="button"
      className="btn-circle"
      aria-label={title}
      title={title}
      onClick={onClick}
    >
      {/* flecha izquierda */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
