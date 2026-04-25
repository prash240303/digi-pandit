import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeAartiNudge({ sunsetTime = "6:43 PM" }: { sunsetTime?: string }) {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1e1060", "#0d1a3a"]}
      start={{ x: 0.05, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.card}
    >
      {/* Decorative orb */}
      <View style={styles.orb} />

      <View style={styles.content}>
        <Text style={styles.kicker}>संध्या · {sunsetTime}</Text>
        <Text style={styles.title}>Time for evening aarti</Text>
        <Text style={styles.desc}>Light a diya. Play Om Jai Jagdish Hare.</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/mantras")}
          style={styles.button}
        >
          <Ionicons name="play" size={12} color="#3a1a00" />
          <Text style={styles.buttonText}>Begin aarti</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card:   { borderRadius: 16, overflow: "hidden" },
  orb:    {
    position: "absolute", top: -35, right: -35,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: "rgba(255,240,200,0.07)",
  },
  content:    { padding: 18 },
  kicker:     {
    fontSize: 10.5, letterSpacing: 1.5, textTransform: "uppercase",
    color: "rgba(255,255,255,0.75)", marginBottom: 5, fontWeight: "600",
  },
  title:      { fontSize: 20, fontWeight: "500", color: "#fff", letterSpacing: -0.3, marginBottom: 5 },
  desc:       { fontSize: 12.5, color: "rgba(255,255,255,0.78)", marginBottom: 14, lineHeight: 18 },
  button:     {
    alignSelf: "flex-start",
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#D4A843",
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 999,
  },
  buttonText: { fontWeight: "600", fontSize: 12.5, color: "#3a1a00" },
});
