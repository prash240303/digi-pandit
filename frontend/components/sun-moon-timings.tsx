import { Image } from "expo-image";
import React from "react";

function SunriseSunsetCards({
  sunriseHour = 7,
  sunriseMinute = 41,
  sunsetHour = 16,
  sunsetMinute = 20,
}) {
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  const sunriseTime = `${pad(sunriseHour)}:${pad(sunriseMinute)}`;
  const sunsetTime = `${pad(sunsetHour)}:${pad(sunsetMinute)}`;

  // Calculate daylight duration
  const sunriseMin = sunriseHour * 60 + sunriseMinute;
  const sunsetMin = sunsetHour * 60 + sunsetMinute;
  const totalDay = sunsetMin - sunriseMin;
  const dayHours = Math.floor(totalDay / 60);
  const dayMins = totalDay % 60;

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* Sunrise Card */}
        <div className="relative rounded-3xl shadow-2xl overflow-hidden min-h-[350px]">
          <div className="absolute inset-0">
            <Image
              source={require("../assets/images/sunset.png")}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </div>

          <div className="absolute left-4 top-4 z-10">
            <h2 className="text-2xl font-light text-white mb-1 shadow-sm">
              Today's Sunrise
            </h2>
            <div className="text-6xl font-bold text-white shadow-sm">
              {sunriseTime} <span className="text-2xl font-normal">am</span>
            </div>
          </div>

          {/* Arc visualization */}
          <div className="absolute w-full bottom-0 left-0">
            <svg
              viewBox="0 0 300 150"
              className="w-full relative border border-white h-full"
              preserveAspectRatio="xMidYMax meet"
            >
              {/* White Arch */}
              <circle
                className="top-2 left-0 absolute"
                cx="150"
                cy="200"
                r="170"
                fill="none"
                stroke="white"
                strokeWidth="11"
                strokeLinecap="round"
                style={{
                  filter: "blur(0.1px)",
                  boxShadow: "inset 0 0 7px 2px #FFEA97, 0 0 4.5px 3px #FFD283",
                }}
              />

              {/* Sun with specified effects */}
              <circle
                cx="50"
                cy="140"
                r="15"
                fill="white"
                style={{
                  filter: "blur(0.1px)",
                  boxShadow: "inset 0 0 7px 2px #FFEA97, 0 0 4.5px 3px #FFD283",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Sunset Card */}
        <div className="relative rounded-3xl p-8 shadow-2xl overflow-hidden min-h-[350px]">
          <div className="absolute inset-0">
            <Image
              source={require("../assets/images/sunset.png")}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h2 className="text-2xl font-light text-white mb-1 shadow-sm">
                Today's Sunset
              </h2>
              <div className="text-6xl font-bold text-white shadow-sm">
                {sunsetTime} <span className="text-2xl font-normal">pm</span>
              </div>
            </div>

            {/* Arc visualization */}
            <div className="relative h-48">
              <svg
                viewBox="0 0 300 150"
                className="w-full h-full"
                preserveAspectRatio="xMidYMax meet"
              >
                {/* White Arch */}
                <path
                  d="M 0 150 A 140 140 0 0 1 300 150"
                  fill="none"
                  stroke="white"
                  strokeWidth="11"
                />

                {/* Sun with specified effects */}
                <circle
                  cx="250"
                  cy="140"
                  r="15"
                  fill="white"
                  style={{
                    filter: "blur(0.1px)",
                    boxShadow:
                      "inset 0 0 7px 2px #FFEA97, 0 0 4.5px 3px #FFD283",
                  }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Info footer */}
        <div className="text-center">
          <p className="text-slate-600 text-sm">
            {dayHours}h {dayMins}m of daylight
          </p>
        </div>
      </div>
    </div>
  );
}

export default SunriseSunsetCards;
