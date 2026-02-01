import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AlphabetHindiIcon,
  Calendar01FreeIcons,
  HandPrayerFreeIcons,
  Home11FreeIcons,
  MapsLocation02FreeIcons,
} from "@hugeicons/core-free-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
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
      />{" "}
      <Tabs.Screen
        name="rituals"
        options={{
          title: "Rituals",
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={HandPrayerFreeIcons} color={color} />
          ),
        }}
      />{" "}
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
