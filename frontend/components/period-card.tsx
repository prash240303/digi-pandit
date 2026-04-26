import React from "react";
import { View, Text } from "react-native";

interface PeriodCardProps {
  title: string;
  subtitle: string;
  start: string;
  end: string;
  status: "AUSPICIOUS" | "AVOID";
  icon?: string | React.ReactNode;
}

export default function PeriodCard({
  title,
  subtitle,
  start,
  end,
  status,
  icon,
}: PeriodCardProps) {
  const isAvoid = status === "AVOID";

  const containerBg = isAvoid ? "bg-red/10" : "bg-green/10";
  const textColor = isAvoid ? "text-red" : "text-green";

  return (
    <View className="flex-row items-center justify-between p-3 border border-neutral-200/70 bg-white rounded-xl">
      <View className="flex-row items-center flex-1">
        {/* Icon Container */}
        <View
          className={`w-12 h-12 rounded-lg items-center justify-center mr-3 ${containerBg}`}
        >
          {icon}
        </View>

        {/* Labels */}
        <View className="flex-1">
          <Text className="text-sm font-merriweather-regular text-slate-900">
            {title}
          </Text>
          <Text className="text-xs font-inter-light text-slate-500">
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Time Range */}
      <View className="items-end">
        <Text className={`text-xs font-fraunces ${textColor}`}>
          {start}
        </Text>

        <Text className="text-xs text-neutral-600 font-fraunces-light">to</Text>

        <Text className={`text-xs font-fraunces ${textColor}`}>
          {end}
        </Text>
      </View>
    </View>
  );
}
