// Tiny stroked glyph background for card corners.
function Torana({ c = "rgba(255,255,255,0.12)", w = "100%" }) {
  return (
    <svg
      width={w}
      viewBox="0 0 360 90"
      fill="none"
      style={{
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        pointerEvents: "none",
      }}
    >
      <path
        d="M0 80 C60 50 90 30 120 30 C140 10 160 0 180 0 C200 0 220 10 240 30 C270 30 300 50 360 80"
        stroke={c}
        strokeWidth="1.2"
      />
      <path
        d="M0 90 C60 60 90 40 120 40 C140 20 160 10 180 10 C200 10 220 20 240 40 C270 40 300 60 360 90"
        stroke={c}
        strokeWidth="0.8"
        strokeDasharray="2 3"
      />
      <circle cx="180" cy="3" r="2" fill={c} />
    </svg>
  );
}

// Tiny stroked glyph background for card corners.
function CornerMandala({ c = "rgba(0,0,0,0.05)", size = 120, positionProp }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{
        position: "absolute",
        right: positionProp.right,
        top: positionProp.top,
        pointerEvents: "none",
      }}
    >
      <g stroke={c} strokeWidth="1" fill="none">
        <circle cx="60" cy="60" r="55" />
        <circle cx="60" cy="60" r="42" />
        <circle cx="60" cy="60" r="28" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          const x1 = 60 + Math.cos(a) * 28;
          const y1 = 60 + Math.sin(a) * 28;
          const x2 = 60 + Math.cos(a) * 55;
          const y2 = 60 + Math.sin(a) * 55;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
    </svg>
  );
}

export { CornerMandala, Torana };
