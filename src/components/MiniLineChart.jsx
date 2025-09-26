export default function MiniLineChart({ data = [], height = 260, padding = 24 }) {
  const width = 900; // se escalará vía CSS
  const w = width - padding * 2;
  const h = height - padding * 2;

  const values = data.length ? data : [8,12,14,9,7,11,13,15,12,17,19,16];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);

  const stepX = w / Math.max(1, values.length - 1);
  const toX = (i) => padding + i * stepX;
  const toY = (v) => padding + h - ((v - min) / span) * h;

  const path = values.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");

  return (
    <div className="ratio ratio-21x9 rounded-3" style={{ background: "linear-gradient(180deg,#151b24,#0f141d)" }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="w-100 h-100">
        <g opacity="0.25" stroke="currentColor">
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} />
          <line x1={width - padding} y1={padding} x2={width - padding} y2={height - padding} />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
        </g>

        <path
          d={`${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="rgba(0,181,216,0.15)"
        />
        <path d={path} fill="none" stroke="rgb(0,181,216)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {values.map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill="white" opacity="0.85" />
        ))}
      </svg>
    </div>
  );
}
