import React from "react";
import { View } from "react-native";
import { Text } from "./ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SparklesIcon, CalendarIcon } from "@hugeicons/core-free-icons";
import { COLOR } from "@/constants/colors";

interface FestivalCardProps {
  festivals: string[];
}

const FestivalCard = ({ festivals }: FestivalCardProps) => {
  if (!festivals || festivals.length === 0) return null;

  return (
    <View className="w-full">
      {/* Section Header */}
      <View className="flex-row items-center gap-2 mb-4">
        <HugeiconsIcon size={24} color={COLOR.primary} icon={CalendarIcon} />
        <Text className="text-2xl font-fraunces font-bold text-primary">
          Festivals
        </Text>
      </View>

      {/* List of Festival Cards */}
      <View className="gap-y-3">
        {festivals.map((festivalName, i) => (
          <View
            key={i}
            className="bg-white p-3 rounded-2xl border border-neutral-300 flex-row items-center"
          >
            {/* Icon Container (Mint Green style from Abhijit Muhurta) */}
            <View className="p-3 rounded-xl mr-4 bg-green/10 border border-green/30">
              <HugeiconsIcon
                icon={SparklesIcon}
                size={20}
                color="#3f774d"
              />
            </View>

            {/* Content Section */}
            <View className="flex-1">
              <Text className="text-neutral-900 text-xl font-fraunces">
                {festivalName}
              </Text>
              <Text className="text-neutral-500 text-sm  mt-1">
                Special observance for today
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default FestivalCard;