import { View, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { LinearGradient } from "react-native-svg";

export default function PeriodCard({
  title,
  start,
  end,
  status, // "AUSPICIOUS" | "AVOID"
  icon,
}) {
  const isGood = status === "AUSPICIOUS";

  return (
    <View className="mb-4 overflow-hidden rounded-2xl">
      <LinearGradient>
        {/* Header Row */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl">{icon}</Text>
            <Text className="text-lg font-semibold text-neutral-900">
              {title}
            </Text>
          </View>

          <View
            className={`px-3 py-1 rounded-full ${
              isGood ? "bg-green-200" : "bg-red-200"
            }`}
          >
            <Text
              className={`text-xs font-semibold tracking-wide ${
                isGood ? "text-green-700" : "text-red-700"
              }`}
            >
              {status}
            </Text>
          </View>
        </View>

        {/* Time Row */}
        <View className="flex-row items-center gap-2">
          <Text className="text-base text-neutral-700">{start}</Text>
          <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
          <Text className="text-base text-neutral-700">{end}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
