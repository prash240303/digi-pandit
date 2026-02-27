import React from "react";
import { View } from "react-native";
import { Text } from "./ui/text";
import { AiContentGenerator01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { format } from "date-fns";
const PRIMARY = "#DE6A4D";

function Panchangalgetails({ panchangam }: any) {
  // Helper to safely format time
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "p"); // e.g., 12:00 PM
    } catch (error) {
      console.error("Invalid date provided", error);
      return "N/A";
    }
  };

  const getCurrentTithi = (panchangam: any) => {
    if (!panchangam?.tithi) return null;
    return {
      tithi: panchangam.tithi,
      endtime: formatTime(panchangam.tithiEndTime),
    };
  };

  const getCurrentNakshatra = (panchangam: any) => {
    if (!panchangam?.nakshatras || panchangam.nakshatras.length === 0)
      return null;
    const nakshatra = panchangam.nakshatras[1];
    return {
      name: nakshatra?.name || "N/A",
      endtime: formatTime(panchangam.nakshatraEndTime),
    };
  };

  const getCurrentYoga = (panchangam: any) => {
    if (!panchangam?.yogas || panchangam.yogas.length === 0) return null;
    return {
      name: panchangam.yogas[1]?.name || "N/A",
      endtime: formatTime(panchangam.yogaEndTime),
    };
  };

  const getCurrentKarana = (panchangam: any) => {
    const karans = panchangam?.karanas;
    if (!panchangam?.karanas || panchangam.karanas.length === 0) return null;
    return {
      name: panchangam.karanas[karans.length - 1]?.name || "N/A",
      endtime: formatTime(panchangam.karanaEndTime),
    };
  };

  // Pre-calculate to keep JSX clean
  const tithiData = getCurrentTithi(panchangam);
  const nakshatraData = getCurrentNakshatra(panchangam);
  const yogaData = getCurrentYoga(panchangam);
  const karanaData = getCurrentKarana(panchangam);

  return (
    <View className="flex flex-col font-inter gap-4">
      <View className="flex flex-row items-center w-full gap-2 mb-1">
        <HugeiconsIcon
          color={PRIMARY}
          size={32}
          icon={AiContentGenerator01Icon}
        />
        <Text className="text-primary text-2xl font-merriweather-semibold">
          Core Panchang
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {/* Tithi Card */}
        <View className="flex-1 min-w-[45%] bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          <Text className="text-neutral-500 text-xs uppercase font-semibold tracking-wider">
            Tithi
          </Text>
          <Text className="text-orange-600 text-lg font-bold font-merriweather-semibold mt-1">
            {tithiData?.tithi || "N/A"}
          </Text>
          <Text className="text-neutral-400 text-xs mt-1">
            Ends: {tithiData?.endtime || "N/A"}
          </Text>
        </View>

        {/* Nakshatra Card */}
        <View className="flex-1 min-w-[45%] bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          <Text className="text-neutral-500 text-xs uppercase font-semibold tracking-wider">
            Nakshatra
          </Text>
          <Text className="text-orange-600 font-merriweather-semibold text-lg mt-1">
            {nakshatraData?.name || "N/A"}
          </Text>
          <Text className="text-neutral-400 text-xs mt-1">
            Ends: {nakshatraData?.endtime || "N/A"}
          </Text>
        </View>

        {/* Karana Card */}
        <View className="flex-1 min-w-[45%] bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          <Text className="text-neutral-500 text-xs uppercase font-semibold tracking-wider">
            Karana
          </Text>
          <Text className="text-orange-600 text-lg font-merriweather-semibold mt-1">
            {karanaData?.name || "N/A"}
          </Text>
          <Text className="text-neutral-400 text-xs mt-1">
            Ends: {karanaData?.endtime || "N/A"}
          </Text>
        </View>

        {/* Yoga Card */}
        <View className="flex-1 min-w-[45%] bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          <Text className="text-neutral-500 text-xs uppercase font-semibold tracking-wider">
            Yoga
          </Text>
          <Text className="text-orange-600 text-lg font-merriweather-semibold mt-1">
            {yogaData?.name || "N/A"}
          </Text>
          <Text className="text-neutral-400 text-xs mt-1">
            Ends: {yogaData?.endtime || "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default Panchangalgetails;
