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
    <View className="flex flex-col gap-2 py-4 ">
      <View className="flex flex-row w-full gap-2">
        <HugeiconsIcon color={"#d97706"} className="w-6 h-6" icon={AiContentGenerator01Icon} />
        <Text className="text-amber-700 text-xl font-semibold">
          {" "}
          Core Panchang
        </Text>
      </View>
      <View className="grid gap-2 grid-cols-2">
        <View className=" rounded-lg  px-3 py-2 flex flex-col items-start justify-center bg-white ">
          <Text className="text-gray-400 text-xs uppercase font-medium">
            Tithi
          </Text>
          <Text className="text-amber-600 text-xl font-semibold mt-1">
            {getCurrentTithi(panchangam)?.tithi || "N/A"}
          </Text>
          <Text className="text-neutral-500 text-sm mt-1">
            Ends : //time here
          </Text>
        </View>

        <View className="rounded-lg  px-3 py-2 flex flex-col items-start justify-center bg-white ">
          <Text className="text-gray-400 text-xs uppercase font-medium">
            Nakshatra
          </Text>
          <Text className="text-amber-600 text-xl font-semibold mt-1">
            {getCurrentNakshatra(panchangam)}
          </Text>
          <Text className="text-neutral-500 text-sm  mt-1">
            Ends : //time here
          </Text>
        </View>

        <View className=" rounded-lg  px-3 py-2 flex flex-col items-start justify-center bg-white ">
          <Text className="text-gray-400 text-xs uppercase font-medium">
            Karana
          </Text>
          <Text className="text-amber-600 text-xl font-semibold mt-1">
            {getCurrentKarana(panchangam)}
          </Text>
          <Text className="text-neutral-500 text-sm mt-1">
            Ends : //time here
          </Text>
        </View>

        <View className="rounded-lg px-3 py-2 flex flex-col items-start justify-center bg-white ">
          <Text className="text-gray-400 text-xs uppercase font-medium">
            Yoga
          </Text>
          <Text className="text-amber-600 text-xl font-semibold mt-1">
            {getCurrentYoga(panchangam)}
          </Text>
          <Text className="text-neutral-500 text-sm mt-1">
            Ends : //time here
          </Text>
        </View>
      </View>
    </View>
  );
}

export default Panchangalgetails;
