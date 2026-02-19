import React from "react";
import { View } from "react-native";
import { Text } from "./ui/text";
import { MoveUpRight, MoveDownLeft } from "lucide-react-native";

function MoonDetails({ panchangam, moonriseTime, moonsetTime }: any) {
  const illumination = panchangam.chandrabalam ?? 0;

  console.log("moon data", moonriseTime, moonsetTime);

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
    <View className="bg-neutral-900 w-full rounded-3xl p-6 my-4 shadow-lg">
      <View className="bg-white/10 mb-6 px-4 py-1.5 w-fit rounded-full">
        <Text className="text-white text-xs font-bold tracking-widest uppercase">
          {getPhaseLabel(illumination)}
        </Text>
      </View>

      <View className="flex-row items-center mb-8 gap-6">
        <View className="w-20 h-20 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 shadow-sm">
          <Text className="text-5xl">{getMoonEmoji(illumination)}</Text>
        </View>

        <View>
          <Text className="text-white text-5xl font-bold">{illumination}%</Text>
          <Text className="text-neutral-400 text-lg font-medium">
            Illuminated
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-white/10 w-full mb-6" />

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <MoveUpRight size={20} color="white" style={{ marginTop: 4 }} />
          <View>
            <Text className="text-neutral-400 text-sm mb-0.5">Moonrise</Text>
            <Text className="text-white text-xl font-bold">
              {moonriseTime || "--:--"}
            </Text>
          </View>
        </View>

        <View className="w-[1px] h-10 bg-white/10" />
        <View className="flex-row items-center gap-3">
          <View className="items-end">
            <Text className="text-neutral-400 text-sm mb-0.5">Moonset</Text>
            <Text className="text-white text-xl font-bold">
              {moonsetTime || "--:--"}
            </Text>
          </View>
          <MoveDownLeft size={20} color="white" style={{ marginTop: 4 }} />
        </View>
      </View>
    </View>
  );
}

export default MoonDetails;
