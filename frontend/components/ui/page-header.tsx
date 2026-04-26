import React from "react";
import { Text, View } from "react-native";

function PageHeader({ title, subtitle }) {
  return (
    <View className="px-4 pt-2 pb-1">
      <Text className="text-2xl font-fraunces font-bold tracking-tight text-stone-900">
        {title}
      </Text>
      <Text className="text-xs text-stone-500">{subtitle}</Text>
    </View>
  );
}

export default PageHeader;
