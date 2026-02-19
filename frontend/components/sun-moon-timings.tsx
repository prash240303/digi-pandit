import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Line,
  G,
} from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32; // 16px margin each side

export default function SunriseSunsetCard({
  duration = "11h 42m 14s",
  sunriseTime = "06:24",
  sunrisePeriod = "AM",
  sunsetTime = "05:46",
  sunsetPeriod = "PM",
}) {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.card}>
        {/* SVG Background */}
        <Svg
          width="100%"
          height="100%"
          style={StyleSheet.absoluteFill}
          preserveAspectRatio="xMidYMid slice"
        >
          <Defs>
            <LinearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#F15C1A" />
              <Stop offset="1" stopColor="#FBB92A" />
            </LinearGradient>
          </Defs>

          {/* Gradient Background */}
          <Rect width="100%" height="100%" fill="url(#cardGrad)" rx="28" />
        </Svg>

        {/* Card Content */}
        <View style={styles.content}>

          {/* Top Row: Duration + Today Pill */}
          <View style={styles.topRow}>
            <View style={styles.durationBlock}>
              <Text style={styles.durationLabel}>DAY DURATION</Text>
              <Text
                style={styles.durationValue}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {duration}
              </Text>
            </View>
            <View style={styles.todayPill}>
              <Text style={styles.todayText}>TODAY</Text>
            </View>
          </View>

          {/* Horizontal Rule */}
          <View style={styles.horizontalRule} />

          {/* Bottom Row: Sunrise / Divider / Sunset */}
          <View style={styles.bottomRow}>
            {/* Sunrise */}
            <View style={styles.sunBlock}>
              <View style={styles.sunLabelRow}>
                <SmallSunIcon />
                <Text style={styles.sunLabel}>Sunrise</Text>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeValue}>{sunriseTime}</Text>
                <Text style={styles.timePeriod}>{sunrisePeriod}</Text>
              </View>
            </View>

            {/* Vertical Divider */}
            <View style={styles.verticalDivider} />

            {/* Sunset */}
            <View style={[styles.sunBlock, styles.sunBlockRight]}>
              <View style={[styles.sunLabelRow, styles.sunLabelRowRight]}>
                <Text style={styles.sunLabel}>Sunset</Text>
                <SmallSunIcon />
              </View>
              <View style={[styles.timeRow, styles.timeRowRight]}>
                <Text style={styles.timeValue}>{sunsetTime}</Text>
                <Text style={styles.timePeriod}>{sunsetPeriod}</Text>
              </View>
            </View>
          </View>

        </View>
      </View>
    </View>
  );
}

function SmallSunIcon() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="12" cy="12" r="5" fill="white" />
      <Line x1="12" y1="1" x2="12" y2="3" />
      <Line x1="12" y1="21" x2="12" y2="23" />
      <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <Line x1="1" y1="12" x2="3" y2="12" />
      <Line x1="21" y1="12" x2="23" y2="12" />
      <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 28,
    overflow: "hidden",
    // Shadow (iOS)
    shadowColor: "#F15C1A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    // Elevation (Android)
    elevation: 14,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
  },

  // ── Top Row ──────────────────────────────────────────
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  durationBlock: {
    flex: 1,
    marginRight: 12,
  },
  durationLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  durationValue: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  todayPill: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  todayText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  // ── Horizontal Rule ───────────────────────────────────
  horizontalRule: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginBottom: 18,
  },

  // ── Bottom Row ────────────────────────────────────────
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sunBlock: {
    flex: 1,
  },
  sunBlockRight: {
    alignItems: "flex-end",
  },
  sunLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  sunLabelRowRight: {
    justifyContent: "flex-end",
  },
  sunLabel: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    fontWeight: "500",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  timeRowRight: {
    justifyContent: "flex-end",
  },
  timeValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  timePeriod: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },

  // ── Vertical Divider ──────────────────────────────────
  verticalDivider: {
    width: 1,
    height: 52,
    backgroundColor: "rgba(255,255,255,0.28)",
    marginHorizontal: 16,
  },
});