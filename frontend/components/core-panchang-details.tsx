import React from "react";
import { View } from "react-native";
import { Text } from "./ui/text";
import { AiContentGenerator01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

function Panchangalgetails({ panchangam }: any) {
  const getCurrentTithi = (
    panchangam: any,
  ): { tithi: string; vara: string } | null => {
    if (!panchangam?.tithis || panchangam.tithis.length === 0) {
      return null;
    }
    return {
      tithi: panchangam.tithi,
      vara: panchangam.vara,
    };
  };

  const getCurrentNakshatra = (panchangam: any) => {
    if (!panchangam.nakshatras || panchangam.nakshatras.length === 0)
      return "N/A";
    return panchangam?.nakshatras[1]?.name;
  };

  const getCurrentYoga = (panchangam: any) => {
    if (!panchangam.yogas) return "N/A";
    return panchangam?.yogas[1]?.name;
  };

  const getCurrentKarana = (panchangam: any) => {
    const karanas = panchangam?.karanas;
    if (!Array.isArray(karanas) || karanas.length === 0) return "N/A";
    return karanas[karanas.length - 1].name;
  };

  return (
    <View className="flex flex-col font-inter gap-4">
      <View className="flex flex-row items-center w-full gap-2 mb-1">
        <HugeiconsIcon
          color="#b45309"
          size={32}
          icon={AiContentGenerator01Icon}
        />
        <Text className="text-neutral-700 text-2xl font-merriweather-bold">
          Core Panchang
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-3">
        <View className="flex-1 min-w-[45%] bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          <Text className="text-neutral-500 text-xs uppercase font-semibold tracking-wider">
            Tithi
          </Text>
          <Text className="text-orange-600 text-lg font-bold font-merriweather-semibold mt-1">
            {getCurrentTithi(panchangam)?.tithi || "N/A"}
          </Text>
          <Text className="text-neutral-400 text-xs mt-1">Ends : --:--</Text>
        </View>

        <View className="flex-1 min-w-[45%] bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          <Text className="text-neutral-500 text-xs uppercase font-semibold tracking-wider">
            Nakshatra
          </Text>
          <Text className="text-orange-600 font-merriweather-semibold text-lg mt-1">
            {getCurrentNakshatra(panchangam)}
          </Text>
          <Text className="text-neutral-400 text-xs mt-1">Ends : --:--</Text>
        </View>

        <View className="flex-1 min-w-[45%] bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          <Text className="text-neutral-500 text-xs uppercase font-semibold tracking-wider">
            Karana
          </Text>
          <Text className="text-orange-600 text-lg font-merriweather-semibold mt-1">
            {getCurrentKarana(panchangam)}
          </Text>
          <Text className="text-neutral-400 text-xs mt-1">Ends : --:--</Text>
        </View>

        <View className="flex-1 min-w-[45%] bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          <Text className="text-neutral-500 text-xs uppercase font-semibold tracking-wider">
            Yoga
          </Text>
          <Text className="text-orange-600 text-lg font-merriweather-semibold mt-1">
            {getCurrentYoga(panchangam)}
          </Text>
          <Text className="text-neutral-400 text-xs mt-1">Ends : --:--</Text>
        </View>
      </View>
    </View>
  );
}

export default Panchangalgetails;
