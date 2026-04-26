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
const PRIMARY = "#DE6A4D";

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
      <View className="flex-row gap-1 items-center">
        <HugeiconsIcon icon={ClockIcon} color={"#9a2a23"} size={24} />
        <Text className="text-2xl font-fraunces font-semibold tracking-tight text-primary">
          Muhurta & Timings
        </Text>
      </View>

      {/* Auspicious Section */}
      <View className="flex flex-col gap-2">
        <View className="flex flex-row items-center  gap-1">
          <View className="h-2 w-2 rounded-full bg-green" />
          <Text className="text-xs font-inter-regular text-green uppercase tracking-wider">
            SHUBH • AUSPICIOUS
          </Text>
        </View>
        {abhijit.start ? (
          <PeriodCard
            title="Abhijit Muhurta"
            subtitle="Ideal for new beginnings"
            start={abhijit.start}
            end={abhijit.end}
            status="AUSPICIOUS"
            icon={<HugeiconsIcon icon={StarsIcon} color={"#3f774d"} />}
          />
        ) : (
          <Text className="text-neutral-400 text-sm italic">
            Not available today
          </Text>
        )}
      </View>

      {/* Inauspicious Section */}
      <View className="flex flex-col gap-2">
        <View className="flex flex-row items-center  gap-1">
          <View className="h-2 w-2 rounded-full bg-red" />
          <Text className="text-xs font-inter-regular text-red uppercase tracking-wider">
            ASHUBH • INAUSPICIOUS
          </Text>
        </View>

        <View className="flex flex-col gap-2">
          {rahu.start && (
            <PeriodCard
              title="Rahu Kaal"
              subtitle="Avoid important tasks"
              start={rahu.start}
              end={rahu.end}
              status="AVOID"
              icon={<HugeiconsIcon color={"#E30425"} icon={AlertCircleIcon} />}
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
