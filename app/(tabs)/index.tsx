import { useState, useEffect, useRef } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getHours } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import { Text as GText } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { COLOR } from "@/constants/colors";
import OmBookIcon from "@/components/icons/om-book";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";

// ─── Types ────────────────────────────────────────────────────
type DayPeriod = "Morning" | "Afternoon" | "Evening";

const GREETING_CONFIG: Record<DayPeriod, { icon: string; salutation: string }> =
  {
    Morning: { icon: "sunny-outline", salutation: "morning" },
    Afternoon: { icon: "partly-sunny", salutation: "afternoon" },
    Evening: { icon: "moon", salutation: "evening" },
  };

// ─── Mock Data ────────────────────────────────────────────────
const USER_NAME: string | null = "Meera"; // set to null to test no-name state
const USER_ZODIAC_SET = true; // toggle to test unset state
const USER_ZODIAC = {
  sign: "Scorpio",
  icon: "♏",
  prediction:
    "A period of deep introspection brings clarity to a lingering decision.",
};

const TODAY_OBSERVANCE = {
  name: "Ekadashi",
  description:
    "Fasting day observed on the 11th lunar day — a practice of spiritual discipline and detox.",
  isToday: true,
  daysAway: 0,
  color: COLOR.terracotta,
  iconName: "leaf-outline" as const,
};

const FAVORITES = [
  { id: "1", label: "Hanuman Chalisa", type: "mantra", icon: "book-outline" },
  {
    id: "2",
    label: "Tirupati Balaji",
    type: "temple",
    icon: "location-outline",
  },
  { id: "3", label: "Gayatri Mantra", type: "mantra", icon: "book-outline" },
  {
    id: "4",
    label: "Shirdi Sai Baba",
    type: "temple",
    icon: "location-outline",
  },
  { id: "5", label: "Om Jai Jagdish", type: "mantra", icon: "book-outline" },
];

const FEATURE_CARDS = [
  {
    id: "calendar",
    label: "Calendar",
    icon: "calendar-outline",
    badge: "2 festivals this week",
    route: "calendar",
    color: COLOR.terracotta,
  },
  {
    id: "mantras",
    label: "Mantras",
    icon: "book-outline",
    badge: "Top pick: Hanuman Chalisa",
    route: "mantras",
    color: COLOR.gold,
  },
  {
    id: "rituals",
    label: "Rituals",
    icon: "flame-outline",
    badge: "Diwali puja guide ready",
    route: "rituals",
    color: COLOR.sage,
  },
  {
    id: "temples",
    label: "Temples",
    icon: "location-outline",
    badge: "3 temples nearby",
    route: "temples",
    color: COLOR.inkMuted,
  },
];

// ─── Utility: Animate-in wrapper ──────────────────────────────
function FadeSlideIn({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────
function TopBar({
  salutation,
  name,
  icon,
}: {
  salutation: string;
  name: string | null;
  icon: string;
}) {
  const displayGreeting = name ? `${salutation}, ${name}` : "Namaste";

  return (
    <HStack className="items-center justify-between">
      {/* Left: greeting */}
      <VStack className="gap-0">
        <GText
          size="xs"
          style={{
            color: COLOR.inkLight,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontWeight: "600",
          }}
        >
          Good {salutation}
        </GText>
        <Heading
          size="lg"
          style={{
            color: COLOR.ink,
            fontFamily: Platform.select({
              ios: "Georgia",
              android: "serif",
              web: "Georgia, serif",
            }),
          }}
        >
          {displayGreeting.includes(",")
            ? displayGreeting.split(", ")[1]
            : displayGreeting}
        </Heading>
      </VStack>

      {/* Right: avatar circle */}
      <TouchableOpacity>
        <Box
          className="rounded-full items-center justify-center"
          style={{
            width: 40,
            height: 40,
            backgroundColor: COLOR.terracotta + "18",
            borderWidth: 2,
            borderColor: COLOR.terracotta + "40",
          }}
        >
          <GText
            size="sm"
            style={{ color: COLOR.terracotta, fontWeight: "700" }}
          >
            {name ? name.charAt(0).toUpperCase() : "M"}
          </GText>
        </Box>
      </TouchableOpacity>
    </HStack>
  );
}

// ─── Hero Banner ──────────────────────────────────────────────
function HeroBanner({ observance }: { observance: typeof TODAY_OBSERVANCE }) {
  const label = observance.isToday ? "Today" : `In ${observance.daysAway} days`;

  return (
    <TouchableOpacity activeOpacity={0.88}>
      <Box
        className="rounded-3xl overflow-hidden"
        style={{
          backgroundColor: observance.color,
          minHeight: 160,
        }}
      >
        <Box
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: "#FFFFFF",
            opacity: 0.06,
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: -40,
            left: -20,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: "#FFFFFF",
            opacity: 0.04,
          }}
        />
        <Box
          style={{
            position: "absolute",
            top: 20,
            right: 40,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "#FFFFFF",
            opacity: 0.08,
          }}
        />

        <Box className="p-5" style={{ position: "relative", zIndex: 1 }}>
          <Box
            className="rounded-full self-start"
            style={{
              backgroundColor: "#FFFFFF22",
              paddingHorizontal: 12,
              paddingVertical: 4,
            }}
          >
            <GText
              size="xs"
              style={{
                color: "#FFFFFFCC",
                fontWeight: "600",
                letterSpacing: 0.8,
              }}
            >
              {label.toUpperCase()}
            </GText>
          </Box>

          {/* Spacer */}
          <Box style={{ height: 12 }} />

          {/* Icon + Title row */}
          <HStack className="items-center gap-3">
            <Ionicons name={observance.iconName} size={28} color="#FFFFFFCC" />
            <Heading
              size="xl"
              style={{
                color: COLOR.white,
                fontFamily: Platform.select({
                  ios: "Georgia",
                  android: "serif",
                  web: "Georgia, serif",
                }),
                letterSpacing: -0.5,
              }}
            >
              {observance.name}
            </Heading>
          </HStack>

          {/* Description */}
          <GText
            size="sm"
            style={{ color: "#FFFFFFAA", marginTop: 6, lineHeight: 20 }}
          >
            {observance.description}
          </GText>

          {/* Tap hint */}
          <HStack className="items-center gap-1 mt-3">
            <GText size="xs" style={{ color: "#FFFFFFBB", fontWeight: "600" }}>
              Learn more
            </GText>
            <Ionicons
              name="chevron-forward-outline"
              size={13}
              color="#FFFFFFBB"
            />
          </HStack>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}

// ─── Zodiac Card ──────────────────────────────────────────────
function ZodiacCard({
  isSet,
  zodiac,
}: {
  isSet: boolean;
  zodiac: typeof USER_ZODIAC;
}) {
  if (!isSet) {
    // Gentle prompt state
    return (
      <TouchableOpacity activeOpacity={0.9}>
        <Box
          className="rounded-2xl"
          style={{
            backgroundColor: COLOR.cardBg,
            borderWidth: 1.5,
            borderColor: COLOR.creamDark,
            borderStyle: "dashed",
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
        >
          <HStack className="items-center gap-3">
            <Box
              className="rounded-full items-center justify-center"
              style={{
                width: 38,
                height: 38,
                backgroundColor: COLOR.gold + "15",
              }}
            >
              <GText size="lg" style={{ color: COLOR.gold }}>
                ✦
              </GText>
            </Box>
            <VStack className="gap-0 flex-1">
              <GText size="sm" style={{ color: COLOR.ink, fontWeight: "600" }}>
                Discover your zodiac predictions
              </GText>
              <GText size="xs" style={{ color: COLOR.inkLight, marginTop: 2 }}>
                Set your date of birth to get personalized insights
              </GText>
            </VStack>
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              color={COLOR.inkLight}
            />
          </HStack>
        </Box>
      </TouchableOpacity>
    );
  }

  // Set state — compact summary
  return (
    <TouchableOpacity activeOpacity={0.9}>
      <Box
        className="rounded-2xl"
        style={{
          backgroundColor: COLOR.cardBg,
          borderWidth: 1,
          borderColor: COLOR.creamDark,
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <HStack className="items-center gap-3">
          {/* Zodiac glyph */}
          <Box
            className="rounded-full items-center justify-center"
            style={{
              width: 42,
              height: 42,
              backgroundColor: COLOR.gold + "12",
              borderWidth: 1.5,
              borderColor: COLOR.gold + "30",
            }}
          >
            <GText size="xl" style={{ color: COLOR.gold }}>
              {zodiac.icon}
            </GText>
          </Box>

          {/* Text */}
          <VStack className="gap-0 flex-1">
            <HStack className="items-center gap-2">
              <GText size="sm" style={{ color: COLOR.ink, fontWeight: "700" }}>
                {zodiac.sign}
              </GText>
              <GText size="xs" style={{ color: COLOR.inkLight }}>
                — Monthly
              </GText>
            </HStack>
            <GText
              size="xs"
              style={{ color: COLOR.inkMuted, marginTop: 2, lineHeight: 16 }}
            >
              {zodiac.prediction}
            </GText>
          </VStack>

          {/* Read more arrow */}
          <Ionicons
            name="chevron-forward-outline"
            size={18}
            color={COLOR.inkLight}
          />
        </HStack>

        {/* Read full link */}
        <TouchableOpacity style={{ marginTop: 8, marginLeft: 60 }}>
          <GText
            size="xs"
            style={{ color: COLOR.terracotta, fontWeight: "600" }}
          >
            Read full prediction →
          </GText>
        </TouchableOpacity>
      </Box>
    </TouchableOpacity>
  );
}

// ─── Favorites Row ────────────────────────────────────────────
function FavoritesRow({ items }: { items: typeof FAVORITES }) {
  const isEmpty = items.length === 0;

  return (
    <VStack className="gap-2">
      {/* Section label */}
      <HStack className="items-center justify-between">
        <GText
          size="sm"
          style={{ color: COLOR.ink, fontWeight: "700", letterSpacing: 0.4 }}
        >
          My Favorites
        </GText>
        {!isEmpty && (
          <TouchableOpacity>
            <GText
              size="xs"
              style={{ color: COLOR.terracotta, fontWeight: "600" }}
            >
              See all
            </GText>
          </TouchableOpacity>
        )}
      </HStack>

      {isEmpty ? (
        // Empty prompt
        <Box
          className="rounded-xl items-center justify-center"
          style={{
            backgroundColor: COLOR.cardBg,
            borderWidth: 1.5,
            borderColor: COLOR.creamDark,
            borderStyle: "dashed",
            paddingVertical: 16,
          }}
        >
          <Ionicons name="heart-outline" size={22} color={COLOR.inkLight} />
          <GText size="xs" style={{ color: COLOR.inkLight, marginTop: 4 }}>
            Start saving your favorites here
          </GText>
        </Box>
      ) : (
        // Horizontal scroll chips
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: "row" }}
        >
          {items.map((item, i) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={{ marginRight: 10 }}
            >
              <Box
                className="rounded-xl items-center"
                style={{
                  backgroundColor: COLOR.cardBg,
                  borderWidth: 1,
                  borderColor: COLOR.creamDark,
                  paddingHorizontal: 4,
                  paddingVertical: 4,
                  minWidth: 120,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Box
                  className="rounded-lg items-center justify-center"
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor:
                      item.type === "mantra"
                        ? COLOR.gold + "15"
                        : COLOR.sage + "15",
                  }}
                >
                  {item.icon === "book-outline" ? (
                    <OmBookIcon
                      color={item.type === "mantra" ? COLOR.gold : COLOR.sage}
                    />
                  ) : (
                    <Ionicons
                      name={item.icon as any}
                      size={15}
                      color={item.type === "mantra" ? COLOR.gold : COLOR.sage}
                    />
                  )}
                </Box>
                <GText
                  size="xs"
                  style={{ color: COLOR.ink, fontWeight: "600", flex: 1 }}
                  numberOfLines={1}
                >
                  {item.label}
                </GText>
              </Box>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </VStack>
  );
}

// ─── Feature Grid (2×2) ───────────────────────────────────────
function FeatureGrid({ cards }: { cards: typeof FEATURE_CARDS }) {
  const navigation = useNavigation();
  return (
    <VStack className="gap-2">
      <GText
        size="sm"
        style={{ color: COLOR.ink, fontWeight: "700", letterSpacing: 0.4 }}
      >
        Explore
      </GText>
      <Box style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
             onPress={() => navigation.navigate(card.route as never)}
            activeOpacity={0.88}
            style={{ width: "48.5%" }}
          >
            <Box
              className="rounded-2xl"
              style={{
                backgroundColor: COLOR.cardBg,
                borderWidth: 1,
                borderColor: COLOR.creamDark,
                padding: 16,
                minHeight: 130,
                justifyContent: "space-between",
              }}
            >
              {/* Icon row */}
              <HStack className="items-start justify-between">
                <Box
                  className="rounded-xl items-center justify-center"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: card.color + "14",
                  }}
                >
                  <Ionicons
                    name={card.icon as any}
                    size={20}
                    color={card.color}
                  />
                </Box>
                {/* Subtle arrow */}
                <Ionicons
                  name="chevron-forward-outline"
                  size={16}
                  color={COLOR.inkLight}
                />
              </HStack>

              {/* Label + badge */}
              <VStack className="gap-1">
                <GText
                  size="sm"
                  style={{ color: COLOR.ink, fontWeight: "700" }}
                >
                  {card.label}
                </GText>
                <GText
                  size="xs"
                  style={{ color: COLOR.inkLight, lineHeight: 15 }}
                  numberOfLines={1}
                >
                  {card.badge}
                </GText>
              </VStack>
            </Box>
          </TouchableOpacity>
        ))}
      </Box>
    </VStack>
  );
}

// ─── Home Screen ──────────────────────────────────────────────
export default function HomeScreen() {
  const [dayTime, setDayTime] = useState<DayPeriod>("Morning");

  useEffect(() => {
    const hours = getHours(new Date());
    if (hours < 12) setDayTime("Morning");
    else if (hours < 18) setDayTime("Afternoon");
    else setDayTime("Evening");
  }, []);

  const { salutation, icon } = GREETING_CONFIG[dayTime];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLOR.cream }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 32,
          gap: 20,
        }}
      >
        {/* 1. Top Bar */}
        <FadeSlideIn delay={0}>
          <TopBar salutation={salutation} name={USER_NAME} icon={icon} />
        </FadeSlideIn>

        {/* 2. Hero Banner */}
        <FadeSlideIn delay={80}>
          <HeroBanner observance={TODAY_OBSERVANCE} />
        </FadeSlideIn>

        {/* 3. Zodiac Card */}
        <FadeSlideIn delay={160}>
          <ZodiacCard isSet={USER_ZODIAC_SET} zodiac={USER_ZODIAC} />
        </FadeSlideIn>

        {/* 4. Favorites Row */}
        <FadeSlideIn delay={240}>
          <FavoritesRow items={FAVORITES} />
        </FadeSlideIn>

        {/* 5. Feature Grid */}
        <FadeSlideIn delay={320}>
          <FeatureGrid cards={FEATURE_CARDS} />
        </FadeSlideIn>
      </ScrollView>
    </SafeAreaView>
  );
}
