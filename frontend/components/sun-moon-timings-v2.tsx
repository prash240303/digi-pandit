import React, { useState, useEffect, useRef } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

function SunriseSunset({
  sunriseHour = 7,
  sunriseMinute = 41,
  sunsetHour = 16,
  sunsetMinute = 20,
}) {
  const sunriseMin = sunriseHour * 60 + sunriseMinute;
  const sunsetMin = sunsetHour * 60 + sunsetMinute;

  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const DURATION = 12000; // 12 seconds for full cycle

  // Animation loop
  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const p = (elapsed / DURATION) % 1; // Loop between 0 and 1
      setProgress(p);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ===================== SVG DIMENSIONS ===================== */
  const W = 900;
  const H = 350;
  const horizonY = H * 0.52;
  const arcLeft = W * 0.15;
  const arcRight = W * 0.85;
  const arcWidth = arcRight - arcLeft;
  const amplitude = H * 0.28;

  /* ===================== HELPER: ANGLE TO POINT ===================== */
  function sinePoint(angleDeg) {
    const angleRad = (angleDeg * Math.PI) / 180;
    const t = (angleDeg + 90) / 360;
    const x = arcLeft + t * arcWidth;
    const y = horizonY - Math.sin(angleRad) * amplitude;
    return { x, y };
  }

  /* ===================== SUN POSITION ===================== */
  // Sun moves from 0° (sunrise) to 180° (sunset) only
  const sunAngle = 0 + progress * 180;
  const sunPos = sinePoint(sunAngle);

  /* ===================== WAVE PATHS ===================== */
  const STEPS = 100;

  // Left night: -90° to 0°
  const leftNightPath = [];
  for (let i = 0; i <= 25; i++) {
    const angle = -90 + (i / 25) * 90;
    leftNightPath.push(sinePoint(angle));
  }

  // Day: 0° to 180°
  const dayPath = [];
  for (let i = 0; i <= 50; i++) {
    const angle = 0 + (i / 50) * 180;
    dayPath.push(sinePoint(angle));
  }

  // Right night: 180° to 270°
  const rightNightPath = [];
  for (let i = 0; i <= 25; i++) {
    const angle = 180 + (i / 25) * 90;
    rightNightPath.push(sinePoint(angle));
  }

  /* ===================== TIME DISPLAY ===================== */
  const totalDay = sunsetMin - sunriseMin;

  // Map progress (0 to 1) to daytime minutes (sunrise to sunset)
  const currentMinutes = Math.round(sunriseMin + progress * totalDay) % 1440;
  const hours = Math.floor(currentMinutes / 60);
  const mins = currentMinutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  const displayTime = `${pad(displayHour)}:${pad(mins)} ${ampm}`;

  const dayHours = Math.floor(totalDay / 60);
  const dayMins = totalDay % 60;

  /* ===================== SUN RAYS ===================== */
  const rayCount = 12;
  const rays = Array.from({ length: rayCount }, (_, i) => {
    const angle = (i / rayCount) * Math.PI * 2;
    return {
      x1: sunPos.x + Math.cos(angle) * 14,
      y1: sunPos.y + Math.sin(angle) * 14,
      x2: sunPos.x + Math.cos(angle) * 22,
      y2: sunPos.y + Math.sin(angle) * 22,
    };
  });

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50 p-8 rounded-lg">
      <div className="flex justify-between items-start mb-6 px-12">
        <div className="text-left">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
            Sunrise
          </div>
          <div className="text-xl font-extralight text-gray-700">
            {pad(sunriseHour)}:{pad(sunriseMinute)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
            Sunset
          </div>
          <div className="text-xl font-extralight text-gray-700">
            {pad(sunsetHour)}:{pad(sunsetMinute)}
          </div>
        </div>
      </div>

      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${W} ${H}`}
        className="block"
      >
        {/* Left night wave: -90° to 0° (BLACK) */}
        <path
          d={`M ${leftNightPath.map((p) => `${p.x},${p.y}`).join(" L ")}`}
          fill="none"
          stroke="#000000"
          strokeWidth={12}
        />

        {/* Day wave: 0° to 180° (ORANGE) */}
        <path
          d={`M ${dayPath.map((p) => `${p.x},${p.y}`).join(" L ")}`}
          fill="none"
          stroke="#f97316"
          strokeWidth={12}
        />

        {/* Right night wave: 180° to 270° (BLACK) */}
        <path
          d={`M ${rightNightPath.map((p) => `${p.x},${p.y}`).join(" L ")}`}
          fill="none"
          stroke="#000000"
          strokeWidth={12}
        />

        {/* Horizon line */}
        <line
          x1={0}
          y1={horizonY}
          x2={W}
          y2={horizonY}
          stroke="#9ca3af"
          strokeWidth="1.5"
        />

        {/* Horizon label */}
        <text
          x={W - 10}
          y={horizonY - 8}
          textAnchor="end"
          fill="#9ca3af"
          fontSize="11"
          fontWeight="500"
        >
          HORIZON
        </text>

        {/* Sunrise marker */}
        <circle
          cx={sinePoint(0).x}
          cy={horizonY}
          r="9"
          fill="#ffffff"
          stroke="#f97316"
          strokeWidth="6"
        />

        {/* Sunset marker */}
        <circle
          cx={sinePoint(180).x}
          cy={horizonY}
          r="9"
          fill="#ffffff"
          stroke="#f97316"
          strokeWidth="6"
        />

        {/* Vertical dashed lines */}
        <line
          x1={sinePoint(0).x}
          y1={0}
          x2={sinePoint(0).x}
          y2={horizonY - 5}
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.5"
        />
        <line
          x1={sinePoint(180).x}
          y1={0}
          x2={sinePoint(180).x}
          y2={horizonY - 5}
          stroke="#f97316"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.5"
        />

        {/* Sun - always visible, moves along curve */}
        <g>
          {/* Glow */}
          <circle
            cx={sunPos.x}
            cy={sunPos.y}
            r={28}
            fill="#fef3c7"
            opacity="0.6"
          />

          {/* Rays */}
          {rays.map((ray, i) => (
            <line
              key={i}
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              stroke="#fde68a"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />
          ))}

          {/* Sun body */}
          <circle cx={sunPos.x} cy={sunPos.y} r="10" fill="#fbbf24" />
          <circle cx={sunPos.x} cy={sunPos.y} r="6" fill="#fef3c7" />

          {/* Time label */}
          <text
            x={sunPos.x}
            y={sunPos.y - 45}
            textAnchor="middle"
            fill="#f97316"
            fontSize="18"
            fontWeight="600"
          >
            ☀ {displayTime}
          </text>
        </g>
      </svg>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-400">
          {dayHours}h {dayMins}m daylight
        </span>
      </div>
    </div>
  );
}

export default SunriseSunset;
