import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, formatDate, getHours } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import resolveConfig from "tailwindcss/resolveConfig";
import { Text } from "@/components/ui/text";
import OmBookIcon from "@/components/icons/om-book";
import { useNavigation, useRouter } from "expo-router";
import FadeSlideIn from "@/components/ui/fade-in-slide";
import { useAuth } from "@/contexts/auth-context";
import {
  FAVORITES,
  TODAY_OBSERVANCE,
  ZODIAC_META,
} from "@/constants/user-mock-data";
import { getPanchangam, Observer } from "@ishubhamx/panchangam-js";

const FEATURE_CARDS = [
  {
    id: "calendar",
    label: "Calendar",
    icon: "calendar-outline",
    badge: "2 festivals this week",
    route: "calendar",
    iconClass: "text-primary",
    className: "bg-primary/10 border border-primary/10",
  },
  {
    id: "mantras",
    label: "Mantras",
    icon: "book-outline",
    badge: "Top pick: Hanuman Chalisa",
    route: "mantras",
    iconClass: "text-green",
    className: "bg-green/10 border border-green/10",
  },
  {
    id: "rituals",
    label: "Rituals",
    icon: "flame-outline",
    badge: "Diwali puja guide ready",
    iconClass: "text-gold",
    route: "rituals",
    className: "bg-gold/10 border border-gold/10",
  },
  {
    id: "temples",
    label: "Temples",
    icon: "location-outline",
    badge: "3 temples nearby",
    iconClass: "text-blue-500",
    route: "temples",
    className: "bg-blue-100 border border-blue-200",
  },
];

type DayPeriod = "Morning" | "Afternoon" | "Evening";

const GREETING_CONFIG: Record<DayPeriod, { icon: string; salutation: string }> =
  {
    Morning: { icon: "sunny-outline", salutation: "प्रातः" },
    Afternoon: { icon: "partly-sunny", salutation: "दोपहर" },
    Evening: { icon: "moon", salutation: "सायंकाल" },
  };

// ─── TopBar ───────────────────────────────────────────────────────────────────
function TopBar({
  salutation,
  name,
  avatarUrl,
}: {
  salutation: string;
  name: string | null;
  avatarUrl?: string | null;
  icon: string;
}) {
  const displayName = name ?? "Namaste";
  const initial = name ? name.charAt(0).toUpperCase() : "M";

  return (
    <View className="flex-row items-center justify-between">
      <View>
        <Text
          variant="small"
          className="uppercase font-inter-medium text-ink-faint tracking-widest"
        >
          शुभ {salutation}
        </Text>
        <Text variant="h3" className="font-fraunces text-ink capitalize">
          {displayName}
        </Text>
      </View>

      <TouchableOpacity>
        <View className="w-10 h-10 rounded-full items-center bg-white border-primary border justify-center overflow-hidden">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          ) : (
            <Text variant="small" className="font-bold text-primary">
              {initial}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Tiny stroked glyph background for card corners.
function Torana({ c = "rgba(255,255,255,0.12)", w = "100%" }) {
  return (
    <svg
      width={w}
      viewBox="0 0 360 90"
      fill="none"
      style={{
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        pointerEvents: "none",
      }}
    >
      <path
        d="M0 80 C60 50 90 30 120 30 C140 10 160 0 180 0 C200 0 220 10 240 30 C270 30 300 50 360 80"
        stroke={c}
        strokeWidth="1.2"
      />
      <path
        d="M0 90 C60 60 90 40 120 40 C140 20 160 10 180 10 C200 10 220 20 240 40 C270 40 300 60 360 90"
        stroke={c}
        strokeWidth="0.8"
        strokeDasharray="2 3"
      />
      <circle cx="180" cy="3" r="2" fill={c} />
    </svg>
  );
}

// Tiny stroked glyph background for card corners.
function CornerMandala({ c = "rgba(0,0,0,0.05)", size = 120 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{
        position: "absolute",
        right: -30,
        top: -30,
        pointerEvents: "none",
      }}
    >
      <g stroke={c} strokeWidth="1" fill="none">
        <circle cx="60" cy="60" r="55" />
        <circle cx="60" cy="60" r="42" />
        <circle cx="60" cy="60" r="28" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          const x1 = 60 + Math.cos(a) * 28;
          const y1 = 60 + Math.sin(a) * 28;
          const x2 = 60 + Math.cos(a) * 55;
          const y2 = 60 + Math.sin(a) * 55;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
    </svg>
  );
}

const Blinker = ({ isFest = false }) => {
  return (
    <View
      className={`w-2 h-2 rounded-full ${isFest ? "bg-gold" : "bg-yellow-300"} animate-pulse`}
    />
  );
};

// ─── HeroBanner ───────────────────────────────────────────────────────────────
function HeroBanner({ observance }: { observance: typeof TODAY_OBSERVANCE }) {
  const label = observance.isToday
    ? "आज • Today"
    : `In ${observance.daysAway} days`;

  const selectedDate = new Date();
  const observer = new Observer(23.1, 75.46, 494);
  const panchangam = getPanchangam(selectedDate, observer);
  console.log("panch data", panchangam);
  const tithi = panchangam.tithis?.[0]?.name || "Not available";

  const sunrise = panchangam.sunrise ? new Date(panchangam.sunrise) : null;
  const sunset = panchangam.sunset ? new Date(panchangam.sunset) : null;

  // Calculate Duration and Formatted Timings for Card
  let formattedDuration = "N/A";
  if (
    sunrise &&
    sunset &&
    !isNaN(sunrise.getTime()) &&
    !isNaN(sunset.getTime())
  ) {
    const diffMs = sunset.getTime() - sunrise.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const dayHours = Math.floor(totalSeconds / 3600);
    const dayMinutes = Math.floor((totalSeconds % 3600) / 60);
    const daySeconds = totalSeconds % 60;
    formattedDuration = `${dayHours}h ${dayMinutes}m ${daySeconds}s`;
  }

  // Format times using date-fns
  const sunriseTime =
    sunrise && !isNaN(sunrise.getTime()) ? format(sunrise, "hh:mm") : "--:--";
  const sunrisePeriod =
    sunrise && !isNaN(sunrise.getTime()) ? format(sunrise, "a") : "";
  const sunsetTime =
    sunset && !isNaN(sunset.getTime()) ? format(sunset, "hh:mm") : "--:--";
  const sunsetPeriod =
    sunset && !isNaN(sunset.getTime()) ? format(sunset, "a") : "";

  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push("/calendar")}
    >
      <View
        className="rounded-3xl overflow-hidden bg-gradient-primary"
        style={{ minHeight: 160 }}
      >
        <CornerMandala c="rgba(255,240,200,0.09)" size={200} />
        <Torana c="rgba(255,240,200,0.22)" />
        <View
          className="absolute"
          style={{
            top: 20,
            right: 40,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "#FFFFFF",
            opacity: 0.08,
          }}
        />

        <View className="p-5 z-10">
          <View className="flex flex-row items-center gap-3">
            <View
              className="self-start rounded-full px-3 py-1 flex-row items-center gap-2"
              style={{ backgroundColor: "#FFFFFF22" }}
            >
              <Blinker />
              <Text variant="small" className="text-neutral-200 text-xs">
                {label?.toUpperCase()}
              </Text>
            </View>
            <View className="flex flex-row gap-1">
              <Text variant="small" className="text-white text-xs">
                {format(new Date(), "dd MMM") || "Not available"} •
              </Text>
              <Text variant="small" className="text-white text-xs">
                {panchangam.masa.name + " " + panchangam.paksha ||
                  "Not available"}
              </Text>
            </View>
          </View>

          <View className="h-3" />
          <View className="flex-row items-center gap-3">
            <Ionicons name={observance.iconName} size={28} color="#FFFFFFCC" />
            <Text
              variant="h3"
              className="text-left text-white font-playfair-medium"
            >
              {tithi}
            </Text>
          </View>
          <Text variant="muted" className="mt-1.5 text-neutral-300 leading-5">
            {observance.description}
          </Text>
          <View className="flex-row bg-white/5 p-2 rounded-lg items-center w-full justify-between mt-3">
            <View className="flex border-r border-line/30 pr-4 flex-col gap-1 items-start">
              <Text variant="small" className="text-white text-sm">
                Sunrise
              </Text>
              <Text variant="small" className="text-white text-sm">
                {/* {panchangam.sunrise} */}
                {sunriseTime + " " + sunrisePeriod}
              </Text>
            </View>

            <View className="flex border-r border-line/30 pr-4 flex-col gap-1 items-start">
              <Text variant="small" className="text-white text-sm">
                Abhijit
              </Text>
              <Text variant="small" className="text-white text-sm">
                {format(new Date(panchangam.abhijitMuhurta.start), "hh:mm a")}
              </Text>
            </View>

            <View className="flex flex-col gap-1 items-start">
              <Text variant="small" className="text-white text-sm">
                Sunset
              </Text>
              <Text variant="small" className="text-white text-sm">
                {/* {panchangam.sunrise} */}
                {sunsetTime + " " + sunsetPeriod}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── ZodiacCard ───────────────────────────────────────────────────────────────
function ZodiacCard({ zodiacSign }: { zodiacSign: string | null | undefined }) {
  const meta = zodiacSign ? ZODIAC_META[zodiacSign] : null;

  if (!zodiacSign || !meta) {
    return (
      <TouchableOpacity activeOpacity={0.9}>
        <View className="rounded-2xl border-[1.5px] border-dashed border-line-soft bg-white px-4 py-3.5">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full items-center justify-center bg-gold/10">
              <Text variant="large" className="text-gold">
                ✦
              </Text>
            </View>
            <View className="flex-1">
              <Text variant="small" className="font-semibold text-ink">
                Discover your zodiac predictions
              </Text>
              <Text variant="muted" className="mt-0.5 text-ink-faint">
                Set your date of birth to get personalized insights
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              className="text-ink-faint"
              size={18}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.9}>
      <View className="rounded-2xl p-2.5 border border-line-soft bg-white">
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-lg items-center justify-center bg-gold/10 border border-gold/40">
            <Text variant="large">{meta.icon}</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text variant="small" className="font-bold text-ink">
                {zodiacSign}
              </Text>
              <Text variant="muted" className="text-ink-faint">
                — Monthly
              </Text>
            </View>
            <Text variant="muted" className="mt-0.5 leading-4 text-ink-muted">
              {meta.prediction}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={18}
            className="text-ink-faint"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── FavoritesRow ─────────────────────────────────────────────────────────────
function FavoritesRow({ items }: { items: typeof FAVORITES }) {
  const isEmpty = items.length === 0;
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-fraunces font-bold text-primary">
          My favorites
        </Text>
        {!isEmpty && (
          <TouchableOpacity>
            <Text variant="small" className="font-medium text-primary">
              See all
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {isEmpty ? (
        <View className="rounded-xl items-center bg-surface-tint border border-line-soft border-dashed justify-center py-4">
          <Ionicons name="heart-outline" className="text-ink-faint" size={22} />
          <Text variant="muted" className="mt-1 text-ink-faint">
            Start saving your favorites here
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item) => {
            const isMantra = item.type === "mantra";
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                className="mr-2.5"
              >
                <View className="flex-row items-center bg-white border border-line-soft rounded-xl pl-1 pr-2 py-1 gap-2">
                  <View
                    className={`w-8 h-8 rounded-md items-center justify-center border ${
                      isMantra
                        ? "bg-gold/10 border-gold/30"
                        : "bg-primary/10 border-primary/30"
                    }`}
                  >
                    {item.icon === "book-outline" ? (
                      <OmBookIcon color="#D4AF37" />
                    ) : (
                      <Ionicons
                        name={item.icon as any}
                        size={15}
                        className={isMantra ? "text-gold" : "text-primary"}
                      />
                    )}
                  </View>
                  <Text
                    variant="small"
                    className="leading-relaxed font-inter-medium text-ink flex-1"
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

// ─── FeatureGrid ──────────────────────────────────────────────────────────────
function FeatureGrid({ cards }: { cards: typeof FEATURE_CARDS }) {
  const navigation = useNavigation();
  return (
    <View className="gap-2">
      <Text className="text-xl font-fraunces font-bold text-primary">
        Explore
      </Text>
      <View className="flex-row flex-wrap gap-2.5">
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => navigation.navigate(card.route as never)}
            activeOpacity={0.88}
            style={{ width: "48.5%" }}
          >
            <View className="rounded-2xl bg-white border border-line-soft min-h-28 justify-between p-4">
              <View className="flex-row items-start justify-between">
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center ${card.className}`}
                >
                  <Ionicons
                    name={card.icon as any}
                    size={20}
                    className={card.iconClass}
                  />
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={16}
                  className="text-ink-faint"
                />
              </View>
              <View className="gap-1">
                <Text variant="small" className="font-bold text-ink">
                  {card.label}
                </Text>
                <Text
                  variant="muted"
                  className="leading-4 text-ink-faint"
                  numberOfLines={1}
                >
                  {card.badge}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [dayTime, setDayTime] = useState<DayPeriod>("Morning");
  const { profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const hours = getHours(new Date());
    if (hours < 12) setDayTime("Morning");
    else if (hours < 18) setDayTime("Afternoon");
    else setDayTime("Evening");
  }, []);

  const { salutation, icon } = GREETING_CONFIG[dayTime];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 32,
          gap: 20,
        }}
      >
        <FadeSlideIn delay={80}>
          <TopBar
            salutation={salutation}
            icon={icon}
            name={profile?.full_name ?? null}
            avatarUrl={profile?.avatar_url}
          />
        </FadeSlideIn>

        <FadeSlideIn delay={80}>
          <HeroBanner observance={TODAY_OBSERVANCE} />
        </FadeSlideIn>

        <FadeSlideIn delay={160}>
          <ZodiacCard zodiacSign={profile?.zodiac_sign} />
        </FadeSlideIn>

        <FadeSlideIn delay={240}>
          <FavoritesRow items={FAVORITES} />
        </FadeSlideIn>

        <FadeSlideIn delay={320}>
          <FeatureGrid cards={FEATURE_CARDS} />
        </FadeSlideIn>
      </ScrollView>
    </SafeAreaView>
  );
}
