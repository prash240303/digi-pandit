import { Stack } from "expo-router";

export default function TemplesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Temples", headerShown: false }}
      />
    </Stack>
  );
}