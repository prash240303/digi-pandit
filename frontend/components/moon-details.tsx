import React from "react";
import { View } from "react-native";
import { Text } from "./ui/text";
import { LinearGradient } from "expo-linear-gradient"; 
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowDownRight01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

function MoonDetails({
  panchangam,
  moonriseTime,
  moonsetTime,
  sunriseTime,
  sunsetTime,
  dayDuration,
}: any) {
  const illumination = panchangam.chandrabalam ?? 73; // Defaulting to 73 to match image

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

  const getPhaseLabel = (value: number) => {
    if (value > 50 && value < 100) return "WAXING GIBBOUS";
    if (value === 100) return "FULL MOON";
    if (value === 0) return "NEW MOON";
    return "WANING CRESCENT";
  };

  return (
    <LinearGradient
      colors={["#553B2A", "#212121"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0.5, y: 0.5 }}
      className="bg-[#212121] w-full rounded-[32px] overflow-hidden shadow-2xl"
    >
      {/* Top Gradient Section */}
      <View className="p-6 pb-2">
        <View className="flex-row justify-between items-start">
          <View>
            <View className="bg-[#333333]/60 px-3 py-1.5 self-start rounded-full border border-neutral-600 mb-4">
              <Text className="text-neutral-300 text-[10px] font-bold tracking-widest uppercase">
                {getPhaseLabel(illumination)}
              </Text>
            </View>
            <Text className="text-white text-7xl  font-merriweather-bold font-light tracking-tighter">
              {illumination}%
            </Text>
            <Text className="text-neutral-400 text-lg mt-[-8px] ml-1">
              Illuminated
            </Text>
          </View>

          {/* Emoji Placeholder matching the circular visual */}
          <View className="w-24 h-24 items-center justify-center rounded-full">
            <Text className="text-7xl">{getMoonEmoji(illumination)}</Text>
          </View>
        </View>
      </View>

      <View className="px-6 pt-4">
        <View className="h-[0.5px] bg-neutral-700 w-full mb-8" />
        {/* Moonrise / Moonset Row */}
        <View className="flex-row justify-between mb-10">
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
            <Text className="text-white text-2xl font-merriweather-medium">
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
            <Text className="text-white text-2xl  font-merriweather-medium">
              {moonsetTime || "10:10"}{" "}
              <Text className="text-neutral-400 text-sm">AM</Text>
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

export default MoonDetails;
