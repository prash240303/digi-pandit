import { Stack } from "expo-router";
import { FloatingPlayer } from "../../../components/Floatingplayer";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MantrasLayout() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="album" />
      </Stack>
      <FloatingPlayer />
    </SafeAreaView>
  );
}
