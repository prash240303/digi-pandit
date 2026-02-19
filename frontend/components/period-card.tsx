import { ArrowDown } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
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

  // Tailwind Class Mappings
  const containerBg = isAvoid ? "bg-amber-50" : "bg-emerald-50";
  const textColor = isAvoid ? "text-amber-700" : "text-emerald-700";
  const iconColor = isAvoid ? "#c2410c" : "#047857"; // tailwind amber-700 : emerald-700

  return (
    <View className="flex-row items-center justify-between px-3 py-2 mb-3 bg-white rounded-xl shadow-sm shadow-slate-900/5">
      <View className="flex-row items-center flex-1">
        {/* Icon Container */}
        <View
          className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${containerBg}`}
        >
          {typeof icon === "string" ? (
            <Text className="text-lg">{icon}</Text>
          ) : (
            icon || <Text className="text-lg">✨</Text>
          )}
        </View>

        {/* Labels */}
        <View className="flex-1">
          <Text className="text-sm font-bold text-slate-900">{title}</Text>
          <Text className="text-xs text-slate-500">{subtitle}</Text>
        </View>
      </View>

      {/* Time Range */}
      <View className="items-center">
        <Text className={`text-xs font-bold ${textColor}`}>
          {start}
        </Text>
        
        <View className="py-0.5">
          <HugeiconsIcon
            icon={ArrowDown}
            color={iconColor}
            size={14}
          />
        </View>
        
        <Text className={`text-xs font-bold ${textColor}`}>
          {end}
        </Text>
      </View>
    </View>
  );
}