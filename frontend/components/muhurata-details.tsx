import React from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";
import PeriodCard from "./period-card";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AlertCircleIcon,
  ClockIcon,
  StarsIcon,
} from "@hugeicons/core-free-icons";

const formatTime = (date: any) => {
  if (!date || isNaN(new Date(date).getTime())) return null;
  return format(new Date(date), "hh:mm a");
};

function MuhurataDetails({ panchangam }: any) {
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
    <View className="flex  flex-col gap-4">
      {/* Section Header */}
      <View className="flex-row gap-2 items-center mb-1">
        <HugeiconsIcon icon={ClockIcon} color="#D97757" size={32} />
        <Text className="text-2xl font-merriweather-semibold text-neutral-800">
          Muhurta & Timings
        </Text>
      </View>

      {/* Auspicious Section */}
      <View className="">
        <Text className="text-xs font-inter-regular text-emerald-600 uppercase tracking-wider mb-3">
          Abhijit Muhurta
        </Text>
        {abhijit.start ? (
          <PeriodCard
            title="Abhijit Muhurta"
            subtitle="Ideal for new beginnings"
            start={abhijit.start}
            end={abhijit.end}
            status="AUSPICIOUS"
            icon={<HugeiconsIcon icon={StarsIcon} color={"#0D9488"} />}
          />
        ) : (
          <Text className="text-neutral-400 text-sm italic">
            Not available today
          </Text>
        )}
      </View>

      {/* Inauspicious Section */}
      <View className="">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs font-inter-regular text-red-600 uppercase tracking-wider">
            Avoid (Ashubh)
          </Text>
          {/* <View className="w-6 h-6 rounded-full bg-amber-50 items-center justify-center border border-amber-100" /> */}
        </View>

        <View className="flex flex-col gap-2">
          {rahu.start && (
            <PeriodCard
              title="Rahu Kaal"
              subtitle="Avoid important tasks"
              start={rahu.start}
              end={rahu.end}
              status="AVOID"
              icon={<HugeiconsIcon color={"#DC2626"} icon={AlertCircleIcon} />}
            />
          )}

          {yamaganda.start && (
            <PeriodCard
              title="Yamaganda"
              subtitle="Lethal timing"
              start={yamaganda.start}
              end={yamaganda.end}
              status="AVOID"
              icon={<HugeiconsIcon color={"#DC2626"} icon={AlertCircleIcon} />}
            />
          )}
        </View>
      </View>
    </View>
  );
}

export default MuhurataDetails;
