import React, { useState, useEffect, useRef } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.floor(minutes % 60);
  return `${pad(h)}:${pad(m)}`;
}

function SunriseSunset({
  sunriseHour = 7,
  sunriseMinute = 41,
  sunsetHour = 16,
  sunsetMinute = 20,
}) {
  /* ===================== TIME SETUP ===================== */

  const sunriseMin = sunriseHour * 60 + sunriseMinute;
  const sunsetMin = sunsetHour * 60 + sunsetMinute;

  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const DURATION = 12000;

  useEffect(() => {
    startTimeRef.current = null;
    setProgress(0);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const p = Math.min(elapsed / DURATION, 1);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sunriseMin, sunsetMin]);

  /* ===================== PHASE LOGIC ===================== */

  const phase1End = 0.33;
  const phase2End = 0.66;

  const phase1Done = progress >= phase1End;
  const phase2Done = progress >= phase2End;

  let currentPhase;
  let phaseProgress;

  if (progress <= phase1End) {
    currentPhase = 1;
    phaseProgress = progress / phase1End;
  } else if (progress <= phase2End) {
    currentPhase = 2;
    phaseProgress = (progress - phase1End) / (phase2End - phase1End);
  } else {
    currentPhase = 3;
    phaseProgress = (progress - phase2End) / (1 - phase2End);
  }

  const leftPolyRef = useRef("");
  const dayPolyRef = useRef("");

  /* ===================== SVG DIMENSIONS ===================== */

  const W = 900;
  const H = 350;
  const horizonY = H * 0.52;

  const arcLeft = W * 0.15;
  const arcRight = W * 0.85;
  const arcWidth = arcRight - arcLeft;
  const amplitude = H * 0.28;

  /* ===================== SINE MAPPING ===================== */

  function sinePoint(angleDeg) {
    const angleRad = (angleDeg * Math.PI) / 180;
    const t = (angleDeg + 90) / 360;
    const x = arcLeft + t * arcWidth;
    const y = horizonY - Math.sin(angleRad) * amplitude;
    return { x, y };
  }

  /* ===================== SUN / MOON POSITION ===================== */

  const sunAngle = 0 + phaseProgress * 180;
  const sunPos = sinePoint(sunAngle);

  let moonAngle;
  if (currentPhase === 1) {
    moonAngle = -90 + phaseProgress * 90;
  } else if (currentPhase === 3) {
    moonAngle = 180 + phaseProgress * 90;
  } else {
    moonAngle = 0;
  }
  const moonPos = sinePoint(moonAngle);

  const STEPS = 100;

  /* ===================== DAY POLYGON ===================== */

  const dayFillPts = [];
  const dayStart = 0;
  const dayEnd = 180;
  const daySteps = Math.floor((STEPS * (dayEnd - dayStart)) / 360);

  for (let i = 0; i <= daySteps; i++) {
    const angle = dayStart + (i / daySteps) * (dayEnd - dayStart);
    const pt = sinePoint(angle);
    dayFillPts.push(`${pt.x},${pt.y}`);
  }

  const endPt = sinePoint(dayEnd);
  const startPt = sinePoint(dayStart);
  dayFillPts.push(`${endPt.x},${horizonY}`);
  dayFillPts.push(`${startPt.x},${horizonY}`);
  const dayPolygon = dayFillPts.join(" ");

  /* ===================== LEFT NIGHT POLYGON ===================== */

  const leftNightPts = [];
  const leftStart = -90;
  const leftEnd = 0;
  const leftSteps = Math.floor((STEPS * (leftEnd - leftStart)) / 360);

  for (let i = 0; i <= leftSteps; i++) {
    const angle = leftStart + (i / leftSteps) * (leftEnd - leftStart);
    const pt = sinePoint(angle);
    leftNightPts.push(`${pt.x},${pt.y}`);
  }

  const leftEndPt = sinePoint(leftEnd);
  const leftStartPt = sinePoint(leftStart);
  leftNightPts.push(`${leftEndPt.x},${horizonY}`);
  leftNightPts.push(`${leftStartPt.x},${horizonY}`);
  const leftNightPolygon = leftNightPts.join(" ");

  /* ===================== RIGHT NIGHT POLYGON ===================== */

  const rightNightPts = [];
  const rightStart = 180;
  const rightEnd = 270;
  const rightSteps = Math.floor((STEPS * (rightEnd - rightStart)) / 360);

  for (let i = 0; i <= rightSteps; i++) {
    const angle = rightStart + (i / rightSteps) * (rightEnd - rightStart);
    const pt = sinePoint(angle);
    rightNightPts.push(`${pt.x},${pt.y}`);
  }

  const rightEndPt = sinePoint(rightEnd);
  const rightStartPt = sinePoint(rightStart);
  rightNightPts.push(`${rightEndPt.x},${horizonY}`);
  rightNightPts.push(`${rightStartPt.x},${horizonY}`);
  const rightNightPolygon = rightNightPts.join(" ");

  /* ===================== PROGRESS POLYGONS ===================== */

  const leftNightProgressPts = [];
  if (currentPhase === 1) {
    const leftProgressStart = -90;
    const leftProgressAngle = moonAngle;
    const leftProgressSteps = Math.floor(
      (STEPS * Math.abs(leftProgressAngle - leftProgressStart)) / 360,
    );

    for (let i = 0; i <= leftProgressSteps; i++) {
      const angle =
        leftProgressStart +
        (i / leftProgressSteps) * (leftProgressAngle - leftProgressStart);
      const pt = sinePoint(angle);
      leftNightProgressPts.push(`${pt.x},${pt.y}`);
    }

    const leftProgressStartPt = sinePoint(leftProgressStart);
    leftNightProgressPts.push(`${moonPos.x},${horizonY}`);
    leftNightProgressPts.push(`${leftProgressStartPt.x},${horizonY}`);
  }
  const leftNightProgressPolygon = leftNightProgressPts.join(" ");

  const dayProgressPts = [];
  if (currentPhase === 2) {
    const progressAngle = sunAngle;
    const progressStart = 0;
    const progressSteps = Math.floor(
      (STEPS * Math.abs(progressAngle - progressStart)) / 360,
    );

    for (let i = 0; i <= progressSteps; i++) {
      const angle =
        progressStart + (i / progressSteps) * (progressAngle - progressStart);
      const pt = sinePoint(angle);
      dayProgressPts.push(`${pt.x},${pt.y}`);
    }

    const progressStartPt = sinePoint(progressStart);
    dayProgressPts.push(`${sunPos.x},${horizonY}`);
    dayProgressPts.push(`${progressStartPt.x},${horizonY}`);
  }
  const dayProgressPolygon = dayProgressPts.join(" ");

  const rightNightProgressPts = [];
  if (currentPhase === 3) {
    const rightProgressStart = 180;
    const rightProgressAngle = moonAngle;
    const rightProgressSteps = Math.floor(
      (STEPS * Math.abs(rightProgressAngle - rightProgressStart)) / 360,
    );

    for (let i = 0; i <= rightProgressSteps; i++) {
      const angle =
        rightProgressStart +
        (i / rightProgressSteps) * (rightProgressAngle - rightProgressStart);
      const pt = sinePoint(angle);
      rightNightProgressPts.push(`${pt.x},${pt.y}`);
    }

    const rightProgressStartPt = sinePoint(rightProgressStart);
    rightNightProgressPts.push(`${moonPos.x},${horizonY}`);
    rightNightProgressPts.push(`${rightProgressStartPt.x},${horizonY}`);
  }
  const rightNightProgressPolygon = rightNightProgressPts.join(" ");

  /* ===================== WAVE PATH ===================== */

  const fullWavePts = [];
  for (let i = 0; i <= STEPS; i++) {
    const angle = -90 + (i / STEPS) * 360;
    const pt = sinePoint(angle);
    fullWavePts.push(`${pt.x},${pt.y}`);
  }
  const fullWavePath = `M ${fullWavePts.map((pt) => pt).join(" L ")}`;

  /* ===================== TIME DISPLAY ===================== */

  const totalDay = sunsetMin - sunriseMin;
  const totalNightBeforeSunrise = sunriseMin;
  const totalNightAfterSunset = 1440 - sunsetMin;

  let currentDisplayMin = sunriseMin;

  if (currentPhase === 1) {
    currentDisplayMin = phaseProgress * totalNightBeforeSunrise;
  } else if (currentPhase === 2) {
    currentDisplayMin = sunriseMin + phaseProgress * totalDay;
  } else if (currentPhase === 3) {
    currentDisplayMin = sunsetMin + phaseProgress * totalNightAfterSunset;
  }

  currentDisplayMin = normalizeMinutes(currentDisplayMin);
  const displayTime = minutesToTime(currentDisplayMin);

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

  if (leftNightProgressPolygon) leftPolyRef.current = leftNightProgressPolygon;
  if (dayProgressPolygon) dayPolyRef.current = dayProgressPolygon;

  /* ===================== HELPERS ===================== */

  function normalizeMinutes(mins) {
    let m = Math.round(mins);
    while (m < 0) m += 1440;
    while (m >= 1440) m -= 1440;
    return m;
  }

  function minutesToTime(minutes) {
    const total = Math.floor(minutes) % 1440;
    let h24 = Math.floor(total / 60);
    const m = Math.floor(total % 60);
    const ampm = h24 >= 12 ? "PM" : "AM";
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return `${pad(h12)}:${pad(m)} ${ampm}`;
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50 p-8 rounded-lg">
      <div className="flex justify-between items-start mb-6 px-12">
        {/* Sunrise */}
        <div className="text-left">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
            Sunrise
          </div>
          <div className="text-xl font-extralight text-gray-700">
            {pad(sunriseHour)}:{pad(sunriseMinute)}
          </div>
        </div>

        {/* Sunset */}
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
        <defs>
          <linearGradient id="arcFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="nightFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id="sunGlow">
            <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#fde68a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="moonGlow">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Left night fill (-90° to 0°) - base outline */}
        <polygon points={leftNightPolygon} fill="#f3f4f6" fillOpacity="0.2" />

        {/* Right night fill (180° to 270°) - base outline */}
        <polygon points={rightNightPolygon} fill="#f3f4f6" fillOpacity="0.2" />

        {/* Day arc base (0° to 180°) - base outline */}
        <polygon points={dayPolygon} fill="#f3f4f6" fillOpacity="0.2" />

        {/* Left night progress fill (animated in phase 1) */}
        {(currentPhase === 1 || phase1Done) && leftPolyRef.current && (
          <polygon points={leftPolyRef.current} fill="url(#nightFill)" />
        )}

        {/* Day arc progress fill (animated in phase 2) */}
        {(currentPhase === 2 || phase2Done) && dayPolyRef.current && (
          <polygon points={dayPolyRef.current} fill="url(#arcFill)" />
        )}

        {/* Right night progress fill (animated in phase 3) */}
        {currentPhase === 3 && rightNightProgressPolygon && (
          <polygon points={rightNightProgressPolygon} fill="url(#nightFill)" />
        )}

        {/* Full sine wave outline */}
        <path d={fullWavePath} fill="none" stroke="#d1d5db" strokeWidth="2" />

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
          letterSpacing="1"
        >
          HORIZON
        </text>

        {/* Sunrise marker at 0° */}
        <circle
          cx={sinePoint(0).x}
          cy={horizonY}
          r="5"
          fill="#ffffff"
          stroke="#9ca3af"
          strokeWidth="2"
        />

        {/* Sunset marker at 180° */}
        <circle
          cx={sinePoint(180).x}
          cy={horizonY}
          r="5"
          fill="#ffffff"
          stroke="#9ca3af"
          strokeWidth="2"
        />

        {/* Vertical dashed lines from markers */}
        <line
          x1={sinePoint(0).x}
          y1={0}
          x2={sinePoint(0).x}
          y2={horizonY - 5}
          stroke="#d1d5db"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.5"
        />
        <line
          x1={sinePoint(180).x}
          y1={0}
          x2={sinePoint(180).x}
          y2={horizonY - 5}
          stroke="#d1d5db"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.5"
        />

        {/* Moon (phases 1 and 3) */}
        {(currentPhase === 1 || currentPhase === 3) && (
          <g>
            {/* Moon glow */}
            <circle
              cx={moonPos.x}
              cy={moonPos.y}
              r={24}
              fill="url(#moonGlow)"
              opacity="0.7"
            />

            {/* Current time indicator (phase 2 only) */}
            {(currentPhase === 1 || currentPhase === 3) &&
              phaseProgress > 0 &&
              phaseProgress < 1 && (
                <g>
                  <text
                    x={moonPos.x}
                    y={moonPos.y + 45}
                    textAnchor="middle"
                    fill="#00000"
                    fontSize="18"
                    fontWeight="600"
                  >
                    {displayTime}
                  </text>
                </g>
              )}

            {/* Moon body */}
            <circle cx={moonPos.x} cy={moonPos.y} r="12" fill="#f0f9ff" />

            {/* Moon craters */}
            <circle
              cx={moonPos.x - 3}
              cy={moonPos.y - 2}
              r="2.5"
              fill="#cbd5e1"
              opacity="0.4"
            />
            <circle
              cx={moonPos.x + 4}
              cy={moonPos.y + 3}
              r="1.8"
              fill="#cbd5e1"
              opacity="0.4"
            />
            <circle
              cx={moonPos.x + 2}
              cy={moonPos.y - 4}
              r="1.2"
              fill="#cbd5e1"
              opacity="0.3"
            />
          </g>
        )}

        {/* Sun (phase 2) */}
        {currentPhase === 2 && (
          <g>
            {/* Glow */}
            <circle
              cx={sunPos.x}
              cy={sunPos.y}
              r={28}
              fill="url(#sunGlow)"
              opacity="0.8"
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
          </g>
        )}

        {/* Current time indicator (phase 2 only) */}
        {currentPhase === 2 && phaseProgress > 0 && phaseProgress < 1 && (
          <g>
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
        )}
      </svg>

      {/* Daylight duration */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-400">
          {dayHours}h {dayMins}m daylight
        </span>
      </div>
    </div>
  );
}

export default SunriseSunset;
