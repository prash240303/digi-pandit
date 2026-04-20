import { COLOR } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  InteractionManager,
} from "react-native";
import { useEffect, useState } from "react";

import PanchangamCalendar from "@/components/panchangam-calendar";

export default function TabTwoScreen() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setMounted(true);
    });
    return () => task.cancel();
  }, []);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLOR.cream }}>
      <ScrollView className="px-1 pb-2 text-black">
        {mounted ? (
          <PanchangamCalendar />
        ) : (
          <View className="w-full items-center justify-center py-32 gap-3">
            <ActivityIndicator size="large" color="#f97316" />
            <Text className="text-amber-700 text-sm">Loading calendar…</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
