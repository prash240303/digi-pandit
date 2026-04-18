import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, getHours } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { COLOR } from "@/constants/colors";
import OmBookIcon from "@/components/icons/om-book";
import { useNavigation, useRouter } from "expo-router";
import FadeSlideIn from "@/components/ui/fade-in-slide";
import { useAuth } from "@/contexts/auth-context";
import {
  FAVORITES,
  FEATURE_CARDS,
  TODAY_OBSERVANCE,
  ZODIAC_META,
} from "@/constants/user-mock-data";
import { getPanchangam, Observer } from "@ishubhamx/panchangam-js";

type DayPeriod = "Morning" | "Afternoon" | "Evening";

const GREETING_CONFIG: Record<DayPeriod, { icon: string; salutation: string }> =
  {
    Morning: { icon: "sunny-outline", salutation: "morning" },
    Afternoon: { icon: "partly-sunny", salutation: "afternoon" },
    Evening: { icon: "moon", salutation: "evening" },
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
          className="uppercase font-inter-medium text-ink-light tracking-widest"
        >
          Good {salutation}
        </Text>
        <Text variant="h3" className="font-playfair-medium text-ink">
          {displayName}
        </Text>
      </View>

      <TouchableOpacity>
        <View className="w-10 h-10 rounded-full items-center bg-white border-terracotta/40 border justify-center overflow-hidden">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          ) : (
            <Text variant="small" className="font-bold text-terracotta">
              {initial}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── HeroBanner ───────────────────────────────────────────────────────────────
function HeroBanner({ observance }: { observance: typeof TODAY_OBSERVANCE }) {
  const label = observance.isToday ? "Today" : `In ${observance.daysAway} days`;

  const selectedDate = new Date();
  const observer = new Observer(23.1, 75.46, 494);
  const panchangam = getPanchangam(selectedDate, observer);
  const tithi = panchangam.tithis?.[0]?.name || "Not available";

  const router = useRouter();

  return (
    <TouchableOpacity 
      activeOpacity={0.88} 
      onPress={() => router.push("/calendar")}
    >
      <View
        className="rounded-3xl overflow-hidden shadow-md shadow-primary"
        style={{ backgroundColor: observance.color, minHeight: 160 }}
      >
        <View
          className="absolute"
          style={{
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: "#FFFFFF",
            opacity: 0.06,
          }}
        />
        <View
          className="absolute"
          style={{
            bottom: -40,
            left: -20,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: "#FFFFFF",
            opacity: 0.04,
          }}
        />
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
          <View
            className="self-start rounded-full px-3 py-1"
            style={{ backgroundColor: "#FFFFFF22" }}
          >
            <Text
              variant="small"
              className="font-semibold text-neutral-200 tracking-wide"
            >
              {label.toUpperCase()}
            </Text>
          </View>
          <View className="h-3" />
          <View className="flex-row items-center gap-3">
            <Ionicons name={observance.iconName} size={28} color="#FFFFFFCC" />
            <Text
              variant="h3"
              className="text-left text-white font-playfair-medium"
            >
              {/* {observance.name} */}
              {tithi}
            </Text>
          </View>
          <Text variant="muted" className="mt-1.5 text-neutral-300 leading-5">
            {observance.description}
          </Text>
          <View className="flex-row items-center gap-1 mt-3">
            <Text variant="small" className="font-semibold text-white">
              Learn more
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              size={13}
              color="#FFFFFFBB"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── ZodiacCard ───────────────────────────────────────────────────────────────
function ZodiacCard({ zodiacSign }: { zodiacSign: string | null | undefined }) {
  // icon + prediction come from local lookup — sign comes from Supabase
  const meta = zodiacSign ? ZODIAC_META[zodiacSign] : null;

  if (!zodiacSign || !meta) {
    return (
      <TouchableOpacity activeOpacity={0.9}>
        <View className="rounded-2xl border-[1.5px] border-dashed border-cream-dark bg-white px-4 py-3.5">
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: COLOR.gold + "15" }}
            >
              <Text variant="large" className="text-gold">
                ✦
              </Text>
            </View>
            <View className="flex-1">
              <Text variant="small" className="font-semibold text-ink">
                Discover your zodiac predictions
              </Text>
              <Text variant="muted" className="mt-0.5 text-ink-light">
                Set your date of birth to get personalized insights
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              className="text-ink-light"
              size={18}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.9}>
      <View className="rounded-2xl px-4 py-3.5 border border-cream-dark bg-white">
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-full items-center bg-gold/10 border border-gold justify-center">
            <Text variant="large">{meta.icon}</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text variant="small" className="font-bold text-ink">
                {zodiacSign}
              </Text>
              <Text variant="muted" className="text-ink-light">
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
            className="text-ink-light"
          />
        </View>
        <TouchableOpacity className="mt-2 ml-14">
          <Text variant="small" className="font-semibold text-terracotta">
            Read full prediction →
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── FavoritesRow & FeatureGrid unchanged ─────────────────────────────────────
function FavoritesRow({ items }: { items: typeof FAVORITES }) {
  const isEmpty = items.length === 0;
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-playfair-medium text-primary">
          My Favorites
        </Text>
        {!isEmpty && (
          <TouchableOpacity>
            <Text variant="small" className="font-semibold text-terracotta">
              See all
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {isEmpty ? (
        <View className="rounded-xl items-center bg-card-bg border border-cream-dark border-dashed justify-center py-4">
          <Ionicons name="heart-outline" className="text-ink-light" size={22} />
          <Text variant="muted" className="mt-1 text-ink-light">
            Start saving your favorites here
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              className="mr-2.5"
            >
              <View className="flex-row items-center bg-white border border-cream-dark rounded-xl pl-1 pr-2 py-1 gap-2">
                <View
                  className="w-8 h-8 rounded-md items-center justify-center"
                  style={{
                    backgroundColor:
                      item.type === "mantra"
                        ? COLOR.gold + "15"
                        : COLOR.sage + "15",
                    borderColor:
                      item.type === "mantra"
                        ? COLOR.gold + "15"
                        : COLOR.sage + "15",
                    borderWidth: 1,
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
                </View>
                <Text
                  variant="small"
                  className="leading-relaxed text-ink flex-1"
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
      <Text className="text-xl font-playfair-medium text-primary">Explore</Text>
      <View className="flex-row flex-wrap gap-2.5">
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => navigation.navigate(card.route as never)}
            activeOpacity={0.88}
            style={{ width: "48.5%" }}
          >
            <View className="rounded-2xl bg-white border border-cream-dark min-h-28 justify-between p-4">
              <View className="flex-row items-start justify-between">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{
                    backgroundColor: card.color + "14",
                    borderColor: card.color + 20,
                    borderWidth: 1,
                  }}
                >
                  <Ionicons
                    name={card.icon as any}
                    size={20}
                    color={card.color}
                  />
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={16}
                  className="text-ink-light"
                />
              </View>
              <View className="gap-1">
                <Text
                  variant="small"
                  className="font-bold text-ink"
                  style={{ color: COLOR.ink }}
                >
                  {card.label}
                </Text>
                <Text
                  variant="muted"
                  className="leading-4 text-ink-light"
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
