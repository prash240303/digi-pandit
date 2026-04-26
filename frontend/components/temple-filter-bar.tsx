import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import { Deity, DEITIES, RADIUS_OPTIONS } from "@/constants/temples-mock";

type Props = {
  deity: Deity | "All";
  onDeityChange: (d: Deity | "All") => void;
  radiusKm: 1 | 3 | 5 | 10;
  onRadiusChange: (r: 1 | 3 | 5 | 10) => void;
};

function Pill({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full border mr-2 ${
        active ? "bg-primary border-none" : "bg-white border-stone-200"
      }`}
    >
      {icon}
      <Text
        className={`text-xs font-semibold ${
          active ? "text-white" : "text-stone-700"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function TempleFilterBar({
  deity,
  onDeityChange,
  radiusKm,
  onRadiusChange,
}: Props) {
  return (
    <View className="gap-2 px-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 12 }}
      >
        {DEITIES.map((d) => (
          <Pill
            key={d}
            label={d}
            active={deity === d}
            onPress={() => onDeityChange(d)}
          />
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 12 }}
      >
        {RADIUS_OPTIONS.map((r) => (
          <Pill
            key={r}
            label={`${r} km`}
            active={radiusKm === r}
            onPress={() => onRadiusChange(r)}
            icon={
              <MapPin
                size={12}
                color={radiusKm === r ? "#fff" : "#57534e"}
              />
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
