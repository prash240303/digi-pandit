import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getHours } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { COLOR } from "@/constants/colors";
import OmBookIcon from "@/components/icons/om-book";
import { useNavigation } from "expo-router";
import FadeSlideIn from "@/components/ui/fade-in-slide";
import {
  FAVORITES,
  FEATURE_CARDS,
  USER_NAME,
  USER_ZODIAC,
  USER_ZODIAC_SET,
  TODAY_OBSERVANCE,
} from "@/constants/user-mock-data";

type DayPeriod = "Morning" | "Afternoon" | "Evening";

const GREETING_CONFIG: Record<DayPeriod, { icon: string; salutation: string }> = {
  Morning: { icon: "sunny-outline", salutation: "morning" },
  Afternoon: { icon: "partly-sunny", salutation: "afternoon" },
  Evening: { icon: "moon", salutation: "evening" },
};

function TopBar({
  salutation,
  name,
}: {
  salutation: string;
  name: string | null;
  icon: string;
}) {
  const displayName = name ?? "Namaste";

  return (
    <View className="flex-row items-center justify-between">
      <View>
        <Text
          variant="small"
          className="uppercase tracking-widest"
          style={{ color: COLOR.inkLight }}
        >
          Good {salutation}
        </Text>
        <Text
          variant="h3"
          style={{
            color: COLOR.ink,
            fontFamily: Platform.select({
              ios: "Georgia",
              android: "serif",
              web: "Georgia, serif",
            }),
          }}
        >
          {displayName}
        </Text>
      </View>

      <TouchableOpacity>
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{
            backgroundColor: COLOR.terracotta + "18",
            borderWidth: 2,
            borderColor: COLOR.terracotta + "40",
          }}
        >
          <Text variant="small" className="font-bold" style={{ color: COLOR.terracotta }}>
            {name ? name.charAt(0).toUpperCase() : "M"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function HeroBanner({ observance }: { observance: typeof TODAY_OBSERVANCE }) {
  const label = observance.isToday ? "Today" : `In ${observance.daysAway} days`;

  return (
    <TouchableOpacity activeOpacity={0.88}>
      <View
        className="rounded-3xl overflow-hidden"
        style={{ backgroundColor: observance.color, minHeight: 160 }}
      >
        {/* Decorative circles */}
        <View
          className="absolute"
          style={{
            top: -30, right: -30, width: 140, height: 140,
            borderRadius: 70, backgroundColor: "#FFFFFF", opacity: 0.06,
          }}
        />
        <View
          className="absolute"
          style={{
            bottom: -40, left: -20, width: 160, height: 160,
            borderRadius: 80, backgroundColor: "#FFFFFF", opacity: 0.04,
          }}
        />
        <View
          className="absolute"
          style={{
            top: 20, right: 40, width: 60, height: 60,
            borderRadius: 30, backgroundColor: "#FFFFFF", opacity: 0.08,
          }}
        />

        <View className="p-5 z-10">
          {/* Label pill */}
          <View
            className="self-start rounded-full px-3 py-1"
            style={{ backgroundColor: "#FFFFFF22" }}
          >
            <Text
              variant="small"
              className="font-semibold tracking-wide"
              style={{ color: "#FFFFFFCC" }}
            >
              {label.toUpperCase()}
            </Text>
          </View>

          <View className="h-3" />

          {/* Icon + Title */}
          <View className="flex-row items-center gap-3">
            <Ionicons name={observance.iconName} size={28} color="#FFFFFFCC" />
            <Text
              variant="h3"
              className="text-left"
              style={{
                color: COLOR.white,
                letterSpacing: -0.5,
                fontFamily: Platform.select({
                  ios: "Georgia",
                  android: "serif",
                  web: "Georgia, serif",
                }),
              }}
            >
              {observance.name}
            </Text>
          </View>

          {/* Description */}
          <Text variant="muted" className="mt-1.5 leading-5" style={{ color: "#FFFFFFAA" }}>
            {observance.description}
          </Text>

          {/* Tap hint */}
          <View className="flex-row items-center gap-1 mt-3">
            <Text variant="small" className="font-semibold" style={{ color: "#FFFFFFBB" }}>
              Learn more
            </Text>
            <Ionicons name="chevron-forward-outline" size={13} color="#FFFFFFBB" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ZodiacCard({
  isSet,
  zodiac,
}: {
  isSet: boolean;
  zodiac: typeof USER_ZODIAC;
}) {
  if (!isSet) {
    return (
      <TouchableOpacity activeOpacity={0.9}>
        <View
          className="rounded-2xl px-4 py-3.5"
          style={{
            backgroundColor: COLOR.cardBg,
            borderWidth: 1.5,
            borderColor: COLOR.creamDark,
            borderStyle: "dashed",
          }}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: COLOR.gold + "15" }}
            >
              <Text variant="large" style={{ color: COLOR.gold }}>✦</Text>
            </View>
            <View className="flex-1">
              <Text variant="small" className="font-semibold" style={{ color: COLOR.ink }}>
                Discover your zodiac predictions
              </Text>
              <Text variant="muted" className="mt-0.5" style={{ color: COLOR.inkLight }}>
                Set your date of birth to get personalized insights
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={18} color={COLOR.inkLight} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.9}>
      <View
        className="rounded-2xl px-4 py-3.5"
        style={{
          backgroundColor: COLOR.cardBg,
          borderWidth: 1,
          borderColor: COLOR.creamDark,
        }}
      >
        <View className="flex-row items-center gap-3">
          {/* Zodiac glyph */}
          <View
            className="w-11 h-11 rounded-full items-center justify-center"
            style={{
              backgroundColor: COLOR.gold + "12",
              borderWidth: 1.5,
              borderColor: COLOR.gold + "30",
            }}
          >
            <Text variant="large" style={{ color: COLOR.gold }}>{zodiac.icon}</Text>
          </View>

          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text variant="small" className="font-bold" style={{ color: COLOR.ink }}>
                {zodiac.sign}
              </Text>
              <Text variant="muted" style={{ color: COLOR.inkLight }}>— Monthly</Text>
            </View>
            <Text variant="muted" className="mt-0.5 leading-4" style={{ color: COLOR.inkMuted }}>
              {zodiac.prediction}
            </Text>
          </View>

          <Ionicons name="chevron-forward-outline" size={18} color={COLOR.inkLight} />
        </View>

        <TouchableOpacity className="mt-2 ml-14">
          <Text variant="small" className="font-semibold" style={{ color: COLOR.terracotta }}>
            Read full prediction →
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function FavoritesRow({ items }: { items: typeof FAVORITES }) {
  const isEmpty = items.length === 0;

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text variant="small" className="font-bold tracking-wide" style={{ color: COLOR.ink }}>
          My Favorites
        </Text>
        {!isEmpty && (
          <TouchableOpacity>
            <Text variant="small" className="font-semibold" style={{ color: COLOR.terracotta }}>
              See all
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isEmpty ? (
        <View
          className="rounded-xl items-center justify-center py-4"
          style={{
            backgroundColor: COLOR.cardBg,
            borderWidth: 1.5,
            borderColor: COLOR.creamDark,
            borderStyle: "dashed",
          }}
        >
          <Ionicons name="heart-outline" size={22} color={COLOR.inkLight} />
          <Text variant="muted" className="mt-1" style={{ color: COLOR.inkLight }}>
            Start saving your favorites here
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item) => (
            <TouchableOpacity key={item.id} activeOpacity={0.85} className="mr-2.5">
              <View
                className="flex-row items-center rounded-xl px-1 py-1 gap-2"
                style={{
                  backgroundColor: COLOR.cardBg,
                  borderWidth: 1,
                  borderColor: COLOR.creamDark,
                  minWidth: 120,
                }}
              >
                <View
                  className="w-8 h-8 rounded-lg items-center justify-center"
                  style={{
                    backgroundColor:
                      item.type === "mantra" ? COLOR.gold + "15" : COLOR.sage + "15",
                  }}
                >
                  {item.icon === "book-outline" ? (
                    <OmBookIcon color={item.type === "mantra" ? COLOR.gold : COLOR.sage} />
                  ) : (
                    <Ionicons
                      name={item.icon as any}
                      size={15}
                      color={item.type === "mantra" ? COLOR.gold : COLOR.sage}
                    />
                  )}
                </View>
                <Text
                  variant="small"
                  className="font-semibold flex-1"
                  style={{ color: COLOR.ink }}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function FeatureGrid({ cards }: { cards: typeof FEATURE_CARDS }) {
  const navigation = useNavigation();

  return (
    <View className="gap-2">
      <Text variant="small" className="font-bold tracking-wide" style={{ color: COLOR.ink }}>
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
            <View
              className="rounded-2xl p-4"
              style={{
                backgroundColor: COLOR.cardBg,
                borderWidth: 1,
                borderColor: COLOR.creamDark,
                minHeight: 130,
                justifyContent: "space-between",
              }}
            >
              <View className="flex-row items-start justify-between">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: card.color + "14" }}
                >
                  <Ionicons name={card.icon as any} size={20} color={card.color} />
                </View>
                <Ionicons name="chevron-forward-outline" size={16} color={COLOR.inkLight} />
              </View>

              <View className="gap-1">
                <Text variant="small" className="font-bold" style={{ color: COLOR.ink }}>
                  {card.label}
                </Text>
                <Text
                  variant="muted"
                  className="leading-4"
                  style={{ color: COLOR.inkLight }}
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
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 32,
          gap: 20,
        }}
      >
        <FadeSlideIn delay={80}>
          <TopBar salutation={salutation} name={USER_NAME} icon={icon} />
        </FadeSlideIn>

        <FadeSlideIn delay={80}>
          <HeroBanner observance={TODAY_OBSERVANCE} />
        </FadeSlideIn>

        <FadeSlideIn delay={160}>
          <ZodiacCard isSet={USER_ZODIAC_SET} zodiac={USER_ZODIAC} />
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