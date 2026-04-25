import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import type { Panchangam } from "@ishubhamx/panchangam-js";

// English tithi name → Hindi label
const TITHI_HINDI: Record<string, string> = {
  Pratipada:   "प्रतिपदा तिथि",
  Dvitiya:     "द्वितीया तिथि",
  Dwitiya:     "द्वितीया तिथि",
  Tritiya:     "तृतीया तिथि",
  Chaturthi:   "चतुर्थी तिथि",
  Panchami:    "पंचमी तिथि",
  Shashthi:    "षष्ठी तिथि",
  Saptami:     "सप्तमी तिथि",
  Ashtami:     "अष्टमी तिथि",
  Navami:      "नवमी तिथि",
  Dashami:     "दशमी तिथि",
  Ekadashi:    "एकादशी तिथि",
  Dwadashi:    "द्वादशी तिथि",
  Trayodashi:  "त्रयोदशी तिथि",
  Chaturdashi: "चतुर्दशी तिथि",
  Purnima:     "पूर्णिमा तिथि",
  Poornima:    "पूर्णिमा तिथि",
  Amavasya:    "अमावस्या तिथि",
};

const TITHI_DESC: Record<string, string> = {
  Ekadashi:    "A fasting day on the 11th lunar phase — spiritual discipline and inner detox.",
  Purnima:     "The full moon night — a time of abundance, gratitude and heightened energy.",
  Poornima:    "The full moon night — a time of abundance, gratitude and heightened energy.",
  Amavasya:    "The new moon day — a time for ancestral offerings and inner reflection.",
  Ashtami:     "The 8th lunar day — sacred to Goddess Durga and Lord Shiva.",
  Chaturthi:   "Sacred to Lord Ganesha — remove obstacles, begin with intention.",
  Navami:      "The 9th lunar day — auspicious for worship and new endeavors.",
  Panchami:    "The 5th lunar day — auspicious for learning and Naga worship.",
  Tritiya:     "The 3rd lunar day — auspicious for new beginnings and Akshaya Tritiya.",
  Dashami:     "The 10th lunar day — honoring the Dasha-avatar and seeking victory.",
  Saptami:     "The 7th lunar day — dedicated to the Sun God and universal energy.",
  Dwadashi:    "The 12th lunar day — sacred to Lord Vishnu; ideal for devotional practice.",
};

const getMoonEmoji = (v: number) => {
  if (v >= 95) return "🌕";
  if (v >= 80) return "🌔";
  if (v >= 65) return "🌓";
  if (v >= 50) return "🌒";
  if (v >= 35) return "🌑";
  if (v >= 25) return "🌘";
  if (v >= 15) return "🌗";
  return "🌖";
};

const safeFormat = (d: Date | null | undefined, f: string): string | null => {
  if (!d) return null;
  const dt = new Date(d as any);
  return isNaN(dt.getTime()) ? null : format(dt, f);
};

export default function HomeHeroBanner({ panchangam }: { panchangam: Panchangam }) {
  const router = useRouter();

  const tithiName = panchangam.tithis?.[0]?.name ?? "—";
  const tithiHindi = TITHI_HINDI[tithiName] ?? `${tithiName} तिथि`;
  const tithiDesc =
    TITHI_DESC[tithiName] ??
    "An auspicious day in the Hindu lunar calendar — ideal for prayer and devotion.";

  const masa = panchangam.masa?.name ?? "";
  const paksha = panchangam.paksha ?? "";
  const datePart = format(new Date(), "d MMMM");
  const masaLabel = [masa, paksha].filter(Boolean).join(" ");
  const dateLabel = masaLabel ? `${datePart} · ${masaLabel}` : datePart;

  const illumination = panchangam.chandrabalam ?? 50;

  const sunriseTime   = safeFormat(panchangam.sunrise,                    "hh:mm") ?? "--:--";
  const sunrisePeriod = safeFormat(panchangam.sunrise,                    "a")?.toUpperCase() ?? "";
  const sunsetTime    = safeFormat(panchangam.sunset,                     "hh:mm") ?? "--:--";
  const sunsetPeriod  = safeFormat(panchangam.sunset,                     "a")?.toUpperCase() ?? "";
  const abhijitTime   = safeFormat(panchangam.abhijitMuhurta?.start,      "hh:mm") ?? "--:--";
  const abhijitPeriod = safeFormat(panchangam.abhijitMuhurta?.start,      "a")?.toUpperCase() ?? "";

  const strip = [
    { label: "SUNRISE", time: sunriseTime,  period: sunrisePeriod },
    { label: "ABHIJIT", time: abhijitTime,  period: abhijitPeriod },
    { label: "SUNSET",  time: sunsetTime,   period: sunsetPeriod  },
  ];

  return (
    <TouchableOpacity activeOpacity={0.92} onPress={() => router.push("/calendar")}>
      <LinearGradient
        colors={["#C2562D", "#6B1F10"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.card}
      >
        {/* Decorative orbs */}
        <View style={styles.orbTopRight} />
        <View style={styles.orbBottomLeft} />

        <View style={styles.body}>
          {/* Today badge + date row */}
          <View style={styles.badgeRow}>
            <View style={styles.todayPill}>
              <View style={styles.goldDot} />
              <Text style={styles.todayText}>TODAY</Text>
            </View>
            <Text style={styles.dateLabel}>{dateLabel}</Text>
          </View>

          {/* Tithi info + moon emoji */}
          <View style={styles.tithiRow}>
            <View style={styles.tithiInfo}>
              <Text style={styles.tithiHindi}>{tithiHindi}</Text>
              <Text style={styles.tithiName}>{tithiName}</Text>
              <Text style={styles.tithiDesc}>{tithiDesc}</Text>
            </View>
            <Text style={styles.moonEmoji}>{getMoonEmoji(illumination)}</Text>
          </View>
        </View>

        {/* Sunrise · Abhijit · Sunset strip */}
        <View style={styles.strip}>
          {strip.map((x, i) => (
            <View
              key={x.label}
              style={[styles.stripCell, i > 0 && styles.stripCellBorder]}
            >
              <Text style={styles.stripLabel}>{x.label}</Text>
              <View style={styles.stripTimeRow}>
                <Text style={styles.stripTime}>{x.time}</Text>
                {x.period ? <Text style={styles.stripPeriod}> {x.period}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const STRIP_BG     = "rgba(80,18,8,0.65)";
const STRIP_BORDER = "rgba(255,255,255,0.14)";

const styles = StyleSheet.create({
  card: { borderRadius: 22, overflow: "hidden" },

  orbTopRight: {
    position: "absolute", top: -40, right: -40,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,240,200,0.07)",
  },
  orbBottomLeft: {
    position: "absolute", bottom: -30, left: -20,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  body:     { padding: 18, paddingBottom: 14 },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },

  todayPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 999, backgroundColor: "rgba(0,0,0,0.25)",
  },
  goldDot:    { width: 5, height: 5, borderRadius: 999, backgroundColor: "#D4A843" },
  todayText:  { fontSize: 10, fontWeight: "600", letterSpacing: 1.5, color: "#fff" },
  dateLabel:  { fontSize: 11.5, color: "rgba(255,255,255,0.78)", fontWeight: "500" },

  tithiRow:   { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  tithiInfo:  { flex: 1, paddingRight: 10 },
  tithiHindi: { fontSize: 13, color: "rgba(255,255,255,0.9)", marginBottom: 3 },
  tithiName:  { fontSize: 36, fontWeight: "500", color: "#fff", letterSpacing: -0.5, lineHeight: 40 },
  tithiDesc:  { fontSize: 12.5, color: "rgba(255,255,255,0.75)", marginTop: 7, lineHeight: 18 },
  moonEmoji:  { fontSize: 44 },

  strip:           { flexDirection: "row", borderTopWidth: 1, borderTopColor: STRIP_BORDER },
  stripCell:       { flex: 1, backgroundColor: STRIP_BG, paddingVertical: 10, paddingHorizontal: 11 },
  stripCellBorder: { borderLeftWidth: 1, borderLeftColor: STRIP_BORDER },
  stripLabel:      { fontSize: 9, letterSpacing: 1.2, color: "rgba(255,255,255,0.6)", fontWeight: "600", marginBottom: 3 },
  stripTimeRow:    { flexDirection: "row", alignItems: "baseline" },
  stripTime:       { fontSize: 18, fontWeight: "500", color: "#fff", letterSpacing: -0.3 },
  stripPeriod:     { fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: "500" },
});
