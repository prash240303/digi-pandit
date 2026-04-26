"use client";
import {
  Moon02Icon,
  SolarSystem01Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { View, Text } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
const PRIMARY = "#DE6A4D";

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

// Helper to keep code clean
const IconProps = {
  width: 40,
  height: 40,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const SunIcon = ({ color }: { color: string }) => {
  return (
    <View>
      <HugeiconsIcon icon={Sun03Icon} size={32} color={color} />
    </View>
  );
};

export const MoonIcon = ({ color }: { color: string }) => {
  return (
    <View>
      <HugeiconsIcon icon={Moon02Icon} size={32} color={color} />
    </View>
  );
};

// --- Fixed Planetary Icons ---

export const MarsIcon = ({ color }: { color: string }) => (
  <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <Path
      d="M4.99958 19.1429C4.99958 14.8035 8.51736 11.2857 12.8567 11.2857C17.1961 11.2857 20.7139 14.8035 20.7139 19.1429C20.7139 23.4822 17.1961 27 12.8567 27C8.51736 27 4.99958 23.4822 4.99958 19.1429Z"
      stroke={color}
      strokeWidth="1.83337"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M27 11.286V9.19076C27 7.21536 27 6.22767 26.3863 5.61397C25.7726 5.00028 24.7849 5.00028 22.8095 5.00028H20.7143M25.9524 6.0479L19.1429 12.8574"
      stroke={color}
      strokeWidth="1.83337"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MercuryIcon = ({ color }: { color: string }) => (
  <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <Circle
      cx="16.2363"
      cy="14.7363"
      r="5.48633"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M20.6667 4C20.6667 4.63472 20.5416 5.26323 20.2988 5.84964C20.0559 6.43604 19.6998 6.96887 19.251 7.41768C18.8022 7.8665 18.2694 8.22252 17.683 8.46542C17.0966 8.70832 16.4681 8.83333 15.8333 8.83333C15.1986 8.83333 14.5701 8.70832 13.9837 8.46542C13.3973 8.22252 12.8645 7.8665 12.4157 7.41768C11.9668 6.96887 11.6108 6.43604 11.3679 5.84964C11.125 5.26323 11 4.63472 11 4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M15.9407 20.5V23.9308M15.9407 27.3615V23.9308M15.9407 23.9308H18.8813M15.9407 23.9308H13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

export const JupiterIcon = ({ color }: { color: string }) => (
  <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <Path
      d="M22.4872 4V22M22.4872 28V22M22.4872 22H27H7.71588C7.49628 22 7.43449 21.6905 7.63576 21.6026C11.375 19.971 14.6769 17.8461 15.718 16C16.8461 14 17.9742 10 15.718 7C13.4619 4 7.17475 3.78821 5.56429 7C4.84853 8.42746 4.77614 9.60282 5.56429 11C6.1216 11.988 7.82068 13 7.82068 13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

export const VenusIcon = ({ color }: { color: string }) => (
  <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <Path
      d="M16 18.7C19.866 18.7 23 15.4093 23 11.35C23 7.29071 19.866 4 16 4C12.134 4 9 7.29071 9 11.35C9 15.4093 12.134 18.7 16 18.7ZM16 18.7V28.5M12.5 24.825H19.5"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const RahuIcon = ({ color }: { color: string }) => (
  <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <Path
      d="M21.2787 19.1423C19.6819 19.6728 18.5278 21.2039 18.5278 23.0101C18.5278 25.2562 20.3124 27.0769 22.5139 27.0769C24.7154 27.0769 26.5 25.2562 26.5 23.0101C26.5 20.7641 24.7154 18.9433 22.5139 18.9433C22.0828 18.9433 21.6676 19.0131 21.2787 19.1423ZM21.2787 19.1423C25.4701 10.1167 21.5323 5 16.1385 5C10.5557 5 5.72483 10.7216 12.2639 19.6723M13.9722 23.0101C13.9722 25.2562 12.1876 27.0769 9.98611 27.0769C7.78464 27.0769 6 25.2562 6 23.0101C6 20.7641 7.78464 18.9433 9.98611 18.9433C12.1876 18.9433 13.9722 20.7641 13.9722 23.0101Z"
      stroke={color}
      strokeWidth="1.57692"
      strokeLinecap="round"
    />
  </Svg>
);

export const KetuIcon = ({ color }: { color: string }) => (
  <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <Path
      d="M10.476 12.3221C12.1507 11.7658 13.3611 10.1599 13.3611 8.26563C13.3611 5.91004 11.4894 4.00045 9.18056 4.00045C6.8717 4.00045 5 5.91004 5 8.26563C5 10.6212 6.8717 12.5308 9.18056 12.5308C9.63271 12.5308 10.0681 12.4576 10.476 12.3221ZM10.476 12.3221C6.08009 21.788 10.21 27.1543 15.8669 27.1543C21.7221 27.1543 26.7886 21.1536 19.9306 11.7663M18.1389 8.26563C18.1389 5.91004 20.0106 4.00045 22.3194 4.00045C24.6283 4.00045 26.5 5.91004 26.5 8.26563C26.5 10.6212 24.6283 12.5308 22.3194 12.5308C20.0106 12.5308 18.1389 10.6212 18.1389 8.26563Z"
      stroke={color}
      strokeWidth="1.65385"
      strokeLinecap="round"
    />
  </Svg>
);

const PLANET_METADATA = [
  {
    key: "sun",
    name: "Sun",
    sanskrit: "Surya",
    icon: SunIcon,
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
    hex: "#C2410C",
  },
  {
    key: "moon",
    name: "Moon",
    sanskrit: "Chandra",
    icon: MoonIcon,
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    hex: "#7E22CE",
  },
  {
    key: "mars",
    name: "Mars",
    sanskrit: "Mangal",
    icon: MarsIcon,
    bgColor: "bg-rose-100",
    borderColor: "border-rose-200",
    textColor: "text-rose-700",
    hex: "#BE123C",
  },
  {
    key: "mercury",
    name: "Mercury",
    sanskrit: "Budha",
    icon: MercuryIcon,
    bgColor: "bg-sky-100",
    borderColor: "border-sky-200",
    textColor: "text-sky-700",
    hex: "#0369A1",
  },
  {
    key: "jupiter",
    name: "Jupiter",
    sanskrit: "Guru",
    icon: JupiterIcon,
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    hex: "#4338CA",
  },
  {
    key: "venus",
    name: "Venus",
    sanskrit: "Shukra",
    icon: VenusIcon,
    bgColor: "bg-pink-100",
    borderColor: "border-pink-200",
    textColor: "text-pink-700",
    hex: "#BE185D",
  },
  {
    key: "rahu",
    name: "Rahu",
    sanskrit: "Rāhu",
    icon: RahuIcon,
    bgColor: "bg-red/20",
    borderColor: "border-red/40",
    textColor: "text-red",
    hex: "#334155",
  },
  {
    key: "ketu",
    name: "Ketu",
    sanskrit: "Kētu",
    icon: KetuIcon,
    bgColor: "bg-red/20",
    borderColor: "border-red/40",
    textColor: "text-red",
    hex: "#3F3F46",
  },
] as const;

export function PlanetaryPositions({ data }: { data?: PanchangamData }) {
  if (!data) return null;

  return (
    <View className="flex flex-col gap-4">
      {/* Header Section */}
      <View className="flex-row items-center gap-2 mb-1">
        {/* Note: Icon component color prop still takes hex, or you can use className if supported */}
        <HugeiconsIcon size={24} color={"#9a2a23"} icon={SolarSystem01Icon} />
        <Text className="text-2xl font-fraunces font-bold text-primary">
          Graha Sthiti
        </Text>
      </View>

      {/* Grid of Planet Cards */}
      <View className="flex-row flex-wrap gap-3">
        {PLANET_METADATA.map((planet) => {
          const planetData = data.planetaryPositions[planet.key];
          const IconComp = planet.icon;
          return (
            <View
              key={planet.key}
              className={`flex-1 min-w-[45%] rounded-xl p-3 border bg-white ${planet.borderColor}`}
            >
              <View className="mb-3">
                <IconComp color={planet.hex} />
              </View>

              <View className="mb-3">
                <Text
                  className={`text-base font-merriweather-semibold text-neutral-700`}
                >
                  {planet.name}
                </Text>
                <Text className="text-xs text-neutral-500 italic font-inter-light">
                  {planet.sanskrit}
                </Text>
              </View>

              <View className="flex border-t pt-2 border-line flex-row w-full justify-between items-center">
                <Text
                  className={`text-base font-inter-regular ${planet.textColor}`}
                >
                  {planetData.rashiName}
                </Text>
                <Text
                  className={`text-sm font-ibm-mono-light font-bold text-neutral-600`}
                >
                  {planetData.degree.toFixed(2)}°
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
