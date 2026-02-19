import React from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";
import PeriodCard from "./period-card";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ClockIcon } from "@hugeicons/core-free-icons";

// Helper to extract only the time string for the UI
const formatTime = (date: any) => {
  if (!date || isNaN(new Date(date).getTime())) return null;
  return format(new Date(date), "hh:mm a");
};

function MuhurataDetails({ panchangam }: any) {
  // Extracting timings
  const rahu = {
    start: formatTime(panchangam?.rahuKalamStart),
    end: formatTime(panchangam?.rahuKalamEnd),
  };

  const yamaganda = {
    start: formatTime(panchangam?.yamagandaKalam?.start),
    end: formatTime(panchangam?.yamagandaKalam?.end),
  };

  const abhijit = {
    start: formatTime(panchangam?.abhijitMuhurta?.start),
    end: formatTime(panchangam?.abhijitMuhurta?.end),
  };

  return (
    <View className="py-4">
      {/* Section Header */}
      <View className="flex-row gap-2 items-center mb-5">
        <HugeiconsIcon icon={ClockIcon} color={"#92400e"} />
        <Text className="text-2xl font-bold text-amber-800 ">
          Muhurta & Timings
        </Text>
      </View>

      {/* Auspicious Section */}
      <View className="mb-2">
        <Text className="text-sm font-semibold text-green-600 mb-3">
          Abhijit Muhurta
        </Text>
        {abhijit.start && (
          <PeriodCard
            title="Abhijit Muhurta"
            subtitle="Ideal for new beginnings"
            start={abhijit.start}
            end={abhijit.end}
            status="AUSPICIOUS"
          />
        )}
      </View>

      {/* Inauspicious Section */}
      <View className="mt-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text font-semibold text-amber-700">
            Avoid (Ashubh)
          </Text>
          <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center" />
        </View>

        {rahu.start && (
          <PeriodCard
            title="Rahu Kaal"
            subtitle="Avoid important tasks"
            start={rahu.start}
            end={rahu.end}
            status="AVOID"
            icon="🚫"
          />
        )}

        {yamaganda.start && (
          <PeriodCard
            title="Yamaganda"
            subtitle="Lethal timing"
            start={yamaganda.start}
            end={yamaganda.end}
            status="AVOID"
            icon="⏱️"
          />
        )}
      </View>
    </View>
  );
}

export default MuhurataDetails;
