import { Stack } from "expo-router";

export default function RitualsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Rituals", headerShown: false }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Ritual Detail", headerShown: false }}
      />
    </Stack>
  );
}