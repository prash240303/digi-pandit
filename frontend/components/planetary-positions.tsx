"use client";
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { JupiterFreeIcons } from "@hugeicons/core-free-icons";

interface PlanetaryData {
  degree: number;
  rashiName: string;
}

interface PanchangamData {
  planetaryPositions: {
    sun: PlanetaryData;
    moon: PlanetaryData;
    mars: PlanetaryData;
    mercury: PlanetaryData;
    jupiter: PlanetaryData;
    venus: PlanetaryData;
    rahu: PlanetaryData;
    ketu: PlanetaryData;
  };
}

// Custom SVG Icons inspired by astronomical symbols
const SunIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Defs>
      <LinearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFD93D" stopOpacity="1" />
        <Stop offset="100%" stopColor="#FF9A3D" stopOpacity="1" />
      </LinearGradient>
    </Defs>
    <Circle cx="24" cy="24" r="10" fill="url(#sunGrad)" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 24 + Math.cos(rad) * 14;
      const y1 = 24 + Math.sin(rad) * 14;
      const x2 = 24 + Math.cos(rad) * 19;
      const y2 = 24 + Math.sin(rad) * 19;
      return (
        <Path
          key={i}
          d={`M ${x1} ${y1} L ${x2} ${y2}`}
          stroke="url(#sunGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    })}
  </Svg>
);

export const MoonIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Path
      d="M28 12C23.5817 12 20 15.5817 20 20C20 24.4183 23.5817 28 28 28C28.7956 28 29.5587 27.8834 30.2761 27.6685C28.2794 29.6174 25.5294 30.8 22.5 30.8C17.0294 30.8 12.5 26.2706 12.5 20.8C12.5 15.3294 17.0294 10.8 22.5 10.8C24.2891 10.8 25.9578 11.2873 27.3985 12.1315C27.7326 12.0447 28.0805 12 28.4375 12H28Z"
      fill="#D4B5E8"
      opacity="1"
    />
  </Svg>
);

export const MarsIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Circle
      cx="20"
      cy="28"
      r="8"
      stroke="#FF7B9C"
      strokeWidth="2.5"
      fill="none"
    />
    <Path
      d="M26 22L34 14M34 14H28M34 14V20"
      stroke="#FF7B9C"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MercuryIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    {/* Centered Circle */}
    <Circle
      cx="24"
      cy="23"
      r="6"
      stroke="#A8DADC"
      strokeWidth="2.5"
      fill="none"
    />

    {/* Top Crescent / Horns */}
    <Path
      d="M18.5 19.5 C18.5 12 29.5 12 29.5 19.5"
      stroke="#A8DADC"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Bottom Cross */}
    <Path
      d="M24 29 V39 M19 34 H29"
      stroke="#A8DADC"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const JupiterIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    {/* The sweeping "2" shape */}
    <Path
      d="M17 20 C17 12 29 12 29 20 C29 26 17 32 17 32 H35"
      stroke="#B4A7D6"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* The intersecting vertical stroke */}
    <Path
      d="M29 14 V40"
      stroke="#B4A7D6"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
);

export const VenusIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Circle
      cx="24"
      cy="18"
      r="8"
      stroke="#FFB4D1"
      strokeWidth="2.5"
      fill="none"
    />
    <Path
      d="M24 26V38M18 32H30"
      stroke="#FFB4D1"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const RahuIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Path
      d="M16 30V24C16 18 20 16 24 16C28 16 32 18 32 24V30"
      stroke="#9D8CA1"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Circle
      cx="13"
      cy="30"
      r="3"
      stroke="#9D8CA1"
      strokeWidth="2.5"
      fill="none"
    />
    <Circle
      cx="35"
      cy="30"
      r="3"
      stroke="#9D8CA1"
      strokeWidth="2.5"
      fill="none"
    />
  </Svg>
);

export const KetuIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <Path
      d="M16 18V24C16 30 20 32 24 32C28 32 32 30 32 24V18"
      stroke="#C9ADA7"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Circle
      cx="13"
      cy="18"
      r="3"
      stroke="#C9ADA7"
      strokeWidth="2.5"
      fill="none"
    />
    <Circle
      cx="35"
      cy="18"
      r="3"
      stroke="#C9ADA7"
      strokeWidth="2.5"
      fill="none"
    />
  </Svg>
);

interface Planet {
  key: keyof PanchangamData["planetaryPositions"];
  name: string;
  sanskrit: string;
  icon: React.ComponentType;
  gradient: [string, string];
  textColor: string;
}

const PLANET_METADATA: Planet[] = [
  {
    key: "sun",
    name: "Sun",
    sanskrit: "Surya",
    icon: SunIcon,
    gradient: ["#FFF4E6", "#FFE5CC"],
    textColor: "#D97706",
  },
  {
    key: "moon",
    name: "Moon",
    sanskrit: "Chandra",
    icon: MoonIcon,
    gradient: ["#F3E8FF", "#E9D5FF"],
    textColor: "#7C3AED",
  },
  {
    key: "mars",
    name: "Mars",
    sanskrit: "Mangal",
    icon: MarsIcon,
    gradient: ["#FFE4E6", "#FECDD3"],
    textColor: "#E11D48",
  },
  {
    key: "mercury",
    name: "Mercury",
    sanskrit: "Budha",
    icon: MercuryIcon,
    gradient: ["#E0F2FE", "#BAE6FD"],
    textColor: "#0284C7",
  },
  {
    key: "jupiter",
    name: "Jupiter",
    sanskrit: "Guru",
    icon: JupiterIcon,
    gradient: ["#EDE9FE", "#DDD6FE"],
    textColor: "#7C3AED",
  },
  {
    key: "venus",
    name: "Venus",
    sanskrit: "Shukra",
    icon: VenusIcon,
    gradient: ["#FCE7F3", "#FBCFE8"],
    textColor: "#DB2777",
  },
  {
    key: "rahu",
    name: "Rahu",
    sanskrit: "Rāhu",
    icon: RahuIcon,
    gradient: ["#F5F3FF", "#EDE9FE"],
    textColor: "#6B21A8",
  },
  {
    key: "ketu",
    name: "Ketu",
    sanskrit: "Kētu",
    icon: KetuIcon,
    gradient: ["#FAF5FF", "#F3E8FF"],
    textColor: "#86198F",
  },
];

const MOCK_PANCHANGAM: PanchangamData = {
  planetaryPositions: {
    sun: { degree: 24.52, rashiName: "Sagittarius" },
    moon: { degree: 12.34, rashiName: "Capricorn" },
    mars: { degree: 18.76, rashiName: "Libra" },
    mercury: { degree: 9.21, rashiName: "Cancer" },
    jupiter: { degree: 28.43, rashiName: "Pisces" },
    venus: { degree: 15.98, rashiName: "Leo" },
    rahu: { degree: 5.12, rashiName: "Gemini" },
    ketu: { degree: 25.64, rashiName: "Sagittarius" },
  },
};

interface PlanetaryPositionsProps {
  data?: PanchangamData;
}

export function PlanetaryPositions({
  data = MOCK_PANCHANGAM,
}: PlanetaryPositionsProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>Graha Sthiti</Text>
          <Text style={styles.title}>Your Planetary Chart</Text>
        </View>

        {/* Featured Planet Card */}
        <View style={[styles.featuredCard, { backgroundColor: "#2D1B4E" }]}>
          <View style={styles.featuredContent}>
            <View style={styles.featuredIcon}>
              <SunIcon />
            </View>
            <View style={styles.featuredInfo}>
              <Text style={styles.featuredLabel}>Soul Planet</Text>
              <Text style={styles.featuredName}>
                Sun in {data.planetaryPositions.sun.rashiName}
              </Text>
              <Text style={styles.featuredDegree}>
                {data.planetaryPositions.sun.degree.toFixed(2)}°
              </Text>
            </View>
          </View>
          <View style={styles.constellation}>
            {[...Array(12)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.star,
                  {
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    opacity: Math.random() * 0.6 + 0.4,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Grid of Planet Cards */}
        <View style={styles.grid}>
          {PLANET_METADATA.slice(1).map((planet, index) => {
            const planetData = data.planetaryPositions[planet.key];
            const IconComponent = planet.icon;

            return (
              <View
                key={planet.key}
                style={[
                  styles.card,
                  {
                    backgroundColor: planet.gradient[0],
                    borderColor: planet.gradient[1],
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconWrapper}>
                    <IconComponent />
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text
                    style={[styles.planetName, { color: planet.textColor }]}
                  >
                    {planet.name}
                  </Text>
                  <Text style={styles.sanskritName}>{planet.sanskrit}</Text>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Rashi</Text>
                    <Text
                      style={[styles.dataValue, { color: planet.textColor }]}
                    >
                      {planetData.rashiName}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Degree</Text>
                    <Text
                      style={[styles.dataValue, { color: planet.textColor }]}
                    >
                      {planetData.degree.toFixed(2)}°
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  featuredCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    minHeight: 180,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#2D1B4E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  featuredContent: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  featuredIcon: {
    marginRight: 20,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D4AF37",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  featuredName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  featuredDegree: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E0E7FF",
  },
  constellation: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#FFFFFF",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  card: {
    width: "47%",
    marginHorizontal: "1.5%",
    marginBottom: 16,
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  iconWrapper: {
    width: 48,
    height: 48,
  },
  romanNumeral: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  romanText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardBody: {
    marginBottom: 14,
  },
  planetName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  sanskritName: {
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
  },
  cardFooter: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 12,
    padding: 12,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    marginVertical: 6,
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 40,
  },
});
