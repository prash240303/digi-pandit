import {
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, { Circle, Line, G } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32;

// ─── Brand token values (used only in SVG which can't use className) ──────────
const colors = {
  terracottaDefault: "#C2562D",
  terracottaLight: "#D97A4F",
  cardBg: "#FFFAF3",
};

export default function SunriseSunsetCard({
  duration = "10h 47m 4s",
  sunriseTime = "07:10",
  sunrisePeriod = "AM",
  sunsetTime = "05:57",
  sunsetPeriod = "PM",
}) {
  return (
    // screen — cream-dark background
    <View className="flex-1 items-center justify-center px-4">
      {/* ── Card ──────────────────────────────────────────────────── */}
      <View
        className="rounded-3xl bg-white border border-cream-dark px-6 pt-6 pb-5 shadow-md shadow-cream-dark"
        style={{ width: CARD_WIDTH }}
      >
        {/* ── Top Row: label + TODAY pill ───────────────────────────── */}
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-terracotta text-sm font-inter-medium tracking-[2px] uppercase">
            DAY DURATION
          </Text>

          {/* TODAY pill */}
          <View className="bg-cream border border-terracotta-light/20 rounded-full px-4 py-1.5">
            <Text className="text-primary text-sm font-inter-semibold tracking-[1.5px]">
              TODAY
            </Text>
          </View>
        </View>

        {/* ── Duration value ────────────────────────────────────────── */}
        <Text className="text-ink text-[38px] font-merriweather-bold tracking-tight mt-1 mb-6">
          {duration}
        </Text>

        {/* ── Horizontal divider ────────────────────────────────────── */}
        <View className="h-px bg-cream-dark mb-5" />

        {/* ── Bottom Row: sunrise / divider / sunset ────────────────── */}
        <View className="flex-row items-center">
          {/* Sunrise */}
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5 mb-1.5">
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={14}
                color="#a3a3a3"
              />
              <Text className="text-ink-light text-[11px] text-lg font-inter-medium tracking-[1.5px] uppercase">
                SUNRISE
              </Text>
            </View>
            <View className="flex-row items-end gap-1">
              <Text className="text-ink text-3xl font-merriweather-medium tracking-tight leading-[34px]">
                {sunriseTime}
              </Text>
              <Text className="text-ink-light text-base font-semibold mb-0.5">
                {sunrisePeriod}
              </Text>
            </View>
          </View>

          {/* Vertical divider */}
          <View className="w-px h-14 bg-cream-dark mx-4" />

          {/* Sunset */}
          <View className="flex-1 items-end">
            <View className="flex-row items-center justify-end gap-1.5 mb-1.5">
              <Text className="text-ink-light text-[11px] text-lg font-inter-medium tracking-[1.5px] uppercase">
                SUNSET
              </Text>
              <HugeiconsIcon
                icon={ArrowDownRight01Icon}
                size={14}
                color="#a3a3a3"
              />
            </View>
            <View className="flex-row items-end justify-end gap-1">
              <Text className="text-ink text-3xl  font-merriweather-medium tracking-tight leading-[34px]">
                {sunsetTime}
              </Text>
              <Text className="text-ink-light text-base font-semibold mb-0.5">
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
