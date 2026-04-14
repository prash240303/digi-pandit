import React from "react";
import { View } from "react-native";
import { Text } from "./ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  SparklesIcon,
  AlertCircleIcon,
  CalendarIcon,
} from "@hugeicons/core-free-icons";
const PRIMARY = "#DE6A4D";

interface Festival {
  category?: string;
  date: string | Date;
  description?: string;
  masa?: string;
  name: string;
  paksha?: string;
  tithi?: number;
}

interface FestivalCardProps {
  festivals: Festival[];
}

const FestivalCard = ({ festivals }: FestivalCardProps) => {
  if (!festivals || festivals.length === 0) return null;

  const isPradosham = (name: string) =>
    name.toLowerCase().includes("pradosham");

  return (
    <View className="w-full">
      <View className="flex-row items-center gap-2 mb-3">
        <HugeiconsIcon size={32} color={PRIMARY} icon={CalendarIcon} />
        <Text className="text-2xl font-playfair-medium text-primary">
          Festivals
        </Text>
      </View>
      <View className="gap-y-3">
        {festivals.map((festival, i) => {
          const isPositive = isPradosham(festival.name);
          const positiveColor = "#EEFAF6";
          const negativeColor = "#FFF4F2";
          const positiveIcon = "#39B99E";
          const negativeIcon = "#FF4B4B";

          return (
            <View
              key={i}
              className="bg-white p-6 rounded-2xl border border-neutral-200"
            >
              <View className="flex-row items-start mb-4">
                <View
                  className="p-4 rounded-lg mr-4 border"
                  style={{
                    backgroundColor: isPositive ? positiveColor : negativeColor,
                    borderColor: isPositive ? positiveColor : negativeColor,
                  }}
                >
                  <HugeiconsIcon
                    icon={isPositive ? SparklesIcon : AlertCircleIcon}
                    size={24}
                    color={isPositive ? positiveIcon : negativeIcon}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-neutral-950 text-2xl font-playfair-medium mb-1">
                    {festival.name}
                  </Text>

                  {festival.description && (
                    <Text className="text-neutral-500 text-[15px] leading-5">
                      {festival.description}
                    </Text>
                  )}
                </View>
              </View>

              <View className="flex-row flex-wrap gap-2 mt-2">
                {festival.masa && (
                  <View className="bg-neutral-100 px-4 py-2 rounded-full">
                    <Text className="text-neutral-700 text-sm ">
                      {festival.masa} Masa
                    </Text>
                  </View>
                )}
                {festival.paksha && (
                  <View className="bg-neutral-100 px-4 py-2 rounded-full">
                    <Text className="text-neutral-700 text-sm ">
                      {festival.paksha} Paksha
                    </Text>
                  </View>
                )}
                {festival.tithi !== undefined && (
                  <View className="bg-[#FFF4F2] px-4 py-2 rounded-full">
                    <Text className="text-red-500 text-sm ">
                      Tithi {festival.tithi}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default FestivalCard;
