"use client";
import { SolarSystem01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { View, Text, ScrollView } from "react-native";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

interface PlanetaryData {
  degree: number;
  rashiName: string;
}

interface PanchangamData {
  planetaryPositions: {
    sun: PlanetaryData;
    moon: PlanetaryData;
    mars: PlanetaryData;
    mercury: PlanetaryData;
    jupiter: PlanetaryData;
    venus: PlanetaryData;
    rahu: PlanetaryData;
    ketu: PlanetaryData;
  };
}

// Icons remain SVG-based as Tailwind doesn't replace path logic

// / Custom SVG Icons inspired by astronomical symbols
const SunIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48">
    <Defs>
      <LinearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFD93D" />
        <Stop offset="100%" stopColor="#FF9A3D" />
      </LinearGradient>
    </Defs>
    <Circle cx="24" cy="24" r="10" fill="url(#sunGrad)" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 24 + Math.cos(rad) * 14;
      const y1 = 24 + Math.sin(rad) * 14;
      const x2 = 24 + Math.cos(rad) * 19;
      const y2 = 24 + Math.sin(rad) * 19;
      return (
        <Path
          key={i}
          d={`M ${x1} ${y1} L ${x2} ${y2}`}
          stroke="url(#sunGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    })}
  </Svg>
);
export const MoonIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Path
      d="M28 12C23.5817 12 20 15.5817 20 20C20 24.4183 23.5817 28 28 28C28.7956 28 29.5587 27.8834 30.2761 27.6685C28.2794 29.6174 25.5294 30.8 22.5 30.8C17.0294 30.8 12.5 26.2706 12.5 20.8C12.5 15.3294 17.0294 10.8 22.5 10.8C24.2891 10.8 25.9578 11.2873 27.3985 12.1315C27.7326 12.0447 28.0805 12 28.4375 12H28Z"
      fill="#D4B5E8"
      opacity="1"
    />
  </Svg>
);

export const MarsIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Circle
      cx="20"
      cy="28"
      r="8"
      stroke="#FF7B9C"
      strokeWidth="2.5"
      fill="none"
    />
    <Path
      d="M26 22L34 14M34 14H28M34 14V20"
      stroke="#FF7B9C"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MercuryIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    {/* Centered Circle */}
    <Circle
      cx="24"
      cy="23"
      r="6"
      stroke="#A8DADC"
      strokeWidth="2.5"
      fill="none"
    />

    {/* Top Crescent / Horns */}
    <Path
      d="M18.5 19.5 C18.5 12 29.5 12 29.5 19.5"
      stroke="#A8DADC"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Bottom Cross */}
    <Path
      d="M24 29 V39 M19 34 H29"
      stroke="#A8DADC"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const JupiterIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    {/* The sweeping "2" shape */}
    <Path
      d="M17 20 C17 12 29 12 29 20 C29 26 17 32 17 32 H35"
      stroke="#B4A7D6"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* The intersecting vertical stroke */}
    <Path
      d="M29 14 V40"
      stroke="#B4A7D6"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
);

export const VenusIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Circle
      cx="24"
      cy="18"
      r="8"
      stroke="#FFB4D1"
      strokeWidth="2.5"
      fill="none"
    />
    <Path
      d="M24 26V38M18 32H30"
      stroke="#FFB4D1"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const RahuIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Path
      d="M16 30V24C16 18 20 16 24 16C28 16 32 18 32 24V30"
      stroke="#9D8CA1"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Circle
      cx="13"
      cy="30"
      r="3"
      stroke="#9D8CA1"
      strokeWidth="2.5"
      fill="none"
    />
    <Circle
      cx="35"
      cy="30"
      r="3"
      stroke="#9D8CA1"
      strokeWidth="2.5"
      fill="none"
    />
  </Svg>
);

export const KetuIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Path
      d="M16 18V24C16 30 20 32 24 32C28 32 32 30 32 24V18"
      stroke="#C9ADA7"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Circle
      cx="13"
      cy="18"
      r="3"
      stroke="#C9ADA7"
      strokeWidth="2.5"
      fill="none"
    />
    <Circle
      cx="35"
      cy="18"
      r="3"
      stroke="#C9ADA7"
      strokeWidth="2.5"
      fill="none"
    />
  </Svg>
);

// --- Metadata with Tailwind Classes ---
const PLANET_METADATA = [
  {
    key: "sun",
    name: "Sun",
    sanskrit: "Surya",
    icon: SunIcon,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
    textColor: "text-orange-700",
    accentColor: "text-amber-500",
  },
  {
    key: "moon",
    name: "Moon",
    sanskrit: "Chandra",
    icon: MoonIcon,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
    textColor: "text-purple-700",
  },
  {
    key: "mars",
    name: "Mars",
    sanskrit: "Mangal",
    icon: MarsIcon,
    bgColor: "bg-rose-50",
    borderColor: "border-rose-100",
    textColor: "text-rose-700",
  },
  {
    key: "mercury",
    name: "Mercury",
    sanskrit: "Budha",
    icon: MercuryIcon,
    bgColor: "bg-sky-50",
    borderColor: "border-sky-100",
    textColor: "text-sky-700",
  },
  {
    key: "jupiter",
    name: "Jupiter",
    sanskrit: "Guru",
    icon: JupiterIcon,
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-100",
    textColor: "text-indigo-700",
  },
  {
    key: "venus",
    name: "Venus",
    sanskrit: "Shukra",
    icon: VenusIcon,
    bgColor: "bg-pink-50",
    borderColor: "border-pink-100",
    textColor: "text-pink-700",
  },
  {
    key: "rahu",
    name: "Rahu",
    sanskrit: "Rāhu",
    icon: RahuIcon,
    bgColor: "bg-slate-100",
    borderColor: "border-slate-200",
    textColor: "text-slate-700",
  },
  {
    key: "ketu",
    name: "Ketu",
    sanskrit: "Kētu",
    icon: KetuIcon,
    bgColor: "bg-zinc-100",
    borderColor: "border-zinc-200",
    textColor: "text-zinc-700",
  },
] as const;

export function PlanetaryPositions({ data }: { data?: PanchangamData }) {
  if (!data) return null;

  const sunData = data.planetaryPositions.sun;

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
    >
      <View className="py-5">
        {/* Header Section */}
        <View className="mb-6 flex-row items-center gap-2">
          {/* Note: Icon component color prop still takes hex, or you can use className if supported */}
          <HugeiconsIcon size={24} color="#b45309" icon={SolarSystem01Icon} />
          <Text className="text-lg font-bold text-amber-800">Graha Sthiti</Text>
        </View>

        {/* Featured Planet Card (Sun) */}
        <View className="bg-neutral-800 rounded-3xl p-6 mb-8 relative overflow-hidden shadow-md">
          <View className="flex-row items-center z-10">
            <View className="mr-5">
              <SunIcon />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-1">
                Atmakaraka (Soul)
              </Text>
              <Text className="text-xl font-bold text-white mb-1">
                Sun in {sunData.rashiName}
              </Text>
              <Text className="text-base font-medium text-slate-300">
                {sunData.degree.toFixed(2)}°
              </Text>
            </View>
          </View>
        </View>

        {/* Grid of Planet Cards */}
        <View className="grid grid-cols-2 gap-2">
          {PLANET_METADATA.slice(1).map((planet) => {
            const planetData = data.planetaryPositions[planet.key];
            const IconComponent = planet.icon;

            return (
              <View
                key={planet.key}
                className={`w-full rounded-xl p-2 border-2 shadow-sm ${planet.bgColor} ${planet.borderColor}`}
              >
                <View className="mb-3">
                  <IconComponent />
                </View>

                <View className="mb-4">
                  <Text className={`text-base font-bold ${planet.textColor}`}>
                    {planet.name}
                  </Text>
                  <Text className="text-xs text-slate-500 italic font-medium">
                    {planet.sanskrit}
                  </Text>
                </View>

                <View className="bg-white/80 rounded-lg p-3">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-xs text-slate-400">Rashi</Text>
                    <Text className={`text-xs font-bold ${planet.textColor}`}>
                      {planetData.rashiName}
                    </Text>
                  </View>

                  <View className="h-[1px] bg-slate-200 my-1" />

                  <View className="flex-row justify-between items-center mt-1">
                    <Text className="text-xs text-slate-400">Deg</Text>
                    <Text className={`text-xs font-bold ${planet.textColor}`}>
                      {planetData.degree.toFixed(2)}°
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View className="h-10" />
      </View>
    </ScrollView>
  );
}
