import {
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
  Moon01Icon,
  Sun01Icon,
  Sun02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, { Circle, Line, G } from "react-native-svg";
import { CornerMandala } from "./ui/mandala";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32;

// ─── Brand token values (used only in SVG which can't use className) ──────────
const colors = {
  terracottaDefault: "#C2562D",
  terracottaLight: "#D97A4F",
  cardBg: "#FFFAF3",
};

export default function SunriseSunsetCard({
  duration = "10h 47m",
  sunriseTime = "07:10",
  sunrisePeriod = "AM",
  sunsetTime = "05:57",
  sunsetPeriod = "PM",
}) {
  return (
    // screen — line-soft background
    <View className="flex-1 items-center justify-center px-4">
      {/* ── Card ──────────────────────────────────────────────────── */}
      <View
        className="rounded-3xl relative overflow-hidden bg-white border border-line px-6 py-4"
        style={{ width: CARD_WIDTH }}
      >
        <CornerMandala
          positionProp={{ top: -60, right: -40 }}
          c="rgba(150,50,30,0.05)"
          size={160}
        />
        {/* ── Top Row: label + TODAY pill ───────────────────────────── */}
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-primary text-sm font-inter-medium leading-tight tracking-tighter">
            DAY DURATION
          </Text>

          {/* TODAY pill */}
          <View className="bg-primary-soft rounded-full px-4 py-1.5">
            <Text className="text-primary text-sm font-inter-semibold tracking-[1.5px]">
              TODAY
            </Text>
          </View>
        </View>

        {/* ── Duration value ────────────────────────────────────────── */}
        <Text className="text-ink text-5xl font-fraunces tracking-tight mt-1 mb-6">
          {duration}
        </Text>

        {/* ── Horizontal divider ────────────────────────────────────── */}
        <View className="h-px bg-line-soft mb-5" />

        {/* ── Bottom Row: sunrise / divider / sunset ────────────────── */}
        <View className="flex-row gap-5 items-center">
          {/* Sunrise */}
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5 mb-1.5">
              <HugeiconsIcon icon={Sun02Icon} size={14} color="#a3a3a3" />
              <Text className="text-ink-muted text-sm font-inter-medium tracking-[1.5px] uppercase">
                SUNRISE
              </Text>
            </View>
            <View className="flex-row items-end gap-1">
              <Text className="text-ink text-3xl font-fraunces tracking-tight leading-[34px]">
                {sunriseTime}
              </Text>
              <Text className="text-ink-muted text-base font-fraunces mb-0.5">
                {sunrisePeriod}
              </Text>
            </View>
          </View>

          {/* Sunset */}
          <View className="flex-1 items-start">
            <View className="flex-row items-center justify-start gap-1.5 mb-1.5">
              <HugeiconsIcon icon={Moon01Icon} size={14} color="#a3a3a3" />
              <Text className="text-ink-muted text-sm font-inter-medium tracking-[1.5px] uppercase">
                SUNSET
              </Text>
            </View>
            <View className="flex-row items-end justify-end gap-1">
              <Text className="text-ink text-3xl font-fraunces tracking-tight leading-[34px]">
                {sunsetTime}
              </Text>
              <Text className="text-ink-muted text-base font-fraunces mb-0.5">
                {sunsetPeriod}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Full Sun (Sunrise) ───────────────────────────────────────────────────────
function SunriseIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <G>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <Line
              key={i}
              x1={10 + 6.5 * Math.cos(rad)}
              y1={10 + 6.5 * Math.sin(rad)}
              x2={10 + 9.2 * Math.cos(rad)}
              y2={10 + 9.2 * Math.sin(rad)}
              stroke={colors.terracottaLight}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          );
        })}
        <Circle cx="10" cy="10" r="4.5" fill={colors.terracottaLight} />
      </G>
    </Svg>
  );
}

// ─── Half Sun (Sunset) ────────────────────────────────────────────────────────
function SunsetIcon() {
  return (
    <Svg width={22} height={16} viewBox="0 0 22 16">
      <G>
        {[-150, -90, -30].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <Line
              key={i}
              x1={11 + 6 * Math.cos(rad)}
              y1={11 + 6 * Math.sin(rad)}
              x2={11 + 9 * Math.cos(rad)}
              y2={11 + 9 * Math.sin(rad)}
              stroke={colors.terracottaDefault}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          );
        })}
        <Line
          x1="1"
          y1="11"
          x2="21"
          y2="11"
          stroke={colors.terracottaDefault}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <Circle cx="11" cy="11" r="5" fill={colors.terracottaDefault} />
        {/* Clip lower half with card background */}
        <Line
          x1="0"
          y1="11"
          x2="22"
          y2="11"
          stroke={colors.cardBg}
          strokeWidth="11"
        />
        {/* Redraw horizon on top */}
        <Line
          x1="1"
          y1="11"
          x2="21"
          y2="11"
          stroke={colors.terracottaDefault}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}
