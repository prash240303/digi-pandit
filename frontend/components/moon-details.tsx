import React from "react";
import { View } from "react-native";
import { Text } from "./ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { Image } from "expo-image";
import moonBg from "../assets/images/mooncard-bg.png";

function MoonDetails({
  panchangam,
  moonriseTime,
  moonsetTime,
  sunriseTime,
  sunsetTime,
  dayDuration,
}: any) {
  const illumination = panchangam.chandrabalam ?? 73;

  const getMoonEmoji = (value: number) => {
    if (value >= 95) return "🌕";
    if (value >= 80) return "🌔";
    if (value >= 65) return "🌓";
    if (value >= 50) return "🌒";
    if (value >= 35) return "🌑";
    if (value >= 25) return "🌘";
    if (value >= 15) return "🌗";
    return "🌖";
  };

const getPhaseLabel = (illumination: number): string => {
  if (illumination < 2) return "New Moon";
  if (illumination < 25) return "Waxing Crescent";
  if (illumination < 50) return "First Quarter";
  if (illumination < 75) return "Waxing Gibbous";
  if (illumination < 98) return "Full Moon";
  return "Waning Crescent";
};


  return (
    <View className="w-full rounded-2xl bg-[#08080d] overflow-hidden shadow-2xl">
      {/* gradient background */}
      <Image
        source={moonBg}
        style={{
          position: "absolute",
          right: 0,
          left:0,
          width: '100%',
          height: '100%',
        }}
      />
      {/* Top Section */}
      <View className="pt-6 px-6">
        <View className="flex-row justify-between items-start">
          <View>
            <View className="bg-black/25 px-3 py-1.5 self-start rounded-full border border-neutral-600 mb-2">
              <Text className="text-neutral-300 text-xs ">
                {getPhaseLabel(illumination)}
              </Text>
            </View>
            <Text className="text-white text-7xl font-fraunces font-light tracking-tighter">
              {illumination}%
            </Text>
            <Text className="text-neutral-200 text-lg ml-1">
              Illuminated
            </Text>
          </View>

          <View className=" size-32  items-center justify-center ">
            <Text className="text-8xl">{getMoonEmoji(illumination)}</Text>
          </View>
        </View>
      </View>

      <View className="px-6 py-4">
        <View className="h-[0.5px] bg-line/50 w-full my-4" />
        {/* Moonrise / Moonset Row */}
        <View className="flex-row justify-between">
          <View>
            <View className="flex-row items-center gap-1.5 mb-1">
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={14}
                color="#a3a3a3"
              />
              <Text className="text-neutral-300 text-[10px] font-bold tracking-widest uppercase">
                Moonrise
              </Text>
            </View>
            <Text className="text-white text-xl font-fraunces">
              {moonriseTime || "10:06"}{" "}
              <Text className="text-neutral-400 text-sm">PM</Text>
            </Text>
          </View>

          <View className="items-end">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Text className="text-neutral-300 text-[10px] font-bold tracking-widest uppercase">
                Moonset
              </Text>
              <HugeiconsIcon
                icon={ArrowDownRight01Icon}
                size={14}
                color="#a3a3a3"
              />
            </View>
            <Text className="text-white text-xl font-fraunces">
              {moonsetTime || "10:10"}{" "}
              <Text className="text-neutral-400 text-sm">AM</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default MoonDetails;
