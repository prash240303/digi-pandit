import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AlphabetHindiIcon,
  Calendar01FreeIcons,
  HandPrayerFreeIcons,
  Home11FreeIcons,
  MapsLocation02FreeIcons,
} from "@hugeicons/core-free-icons";
import { THEME } from "@/lib/theme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Home11FreeIcons} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Calendar01FreeIcons} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mantras"
        options={{
          title: "Mantras",
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={AlphabetHindiIcon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rituals"
        options={{
          title: "Rituals",
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={HandPrayerFreeIcons} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="temples"
        options={{
          title: "Temples",
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={MapsLocation02FreeIcons} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}