import { Stack } from "expo-router";
import { View } from "react-native";
import { AudioProvider } from "../../../contexts/Audiocontext";
import { FloatingPlayer } from "../../../components/Floatingplayer";
import { SafeAreaView } from "react-native-safe-area-context";

{
  /*
        FloatingPlayer sits OUTSIDE the Stack so it persists across
        index → album navigation without unmounting.
        It is absolutely positioned at the bottom (see FloatingPlayer.tsx).
      */
}

export default function MantrasLayout() {
  return (
    <AudioProvider>
      <SafeAreaView className="flex-1 bg-neutral-50">
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        >
          {/* /mantras  */}
          <Stack.Screen name="index" />

          {/* /mantras/album?id=1  */}
          <Stack.Screen name="album" />

          {/* /mantras/player  — slides up from bottom like a sheet */}
          <Stack.Screen
            name="player"
            options={{
              animation: "slide_from_bottom",
              gestureEnabled: true,
              gestureDirection: "vertical",
            }}
          />
        </Stack>

        {/* Render after Stack so it draws on top */}
        <FloatingPlayer />
      </SafeAreaView>
    </AudioProvider>
  );
}
