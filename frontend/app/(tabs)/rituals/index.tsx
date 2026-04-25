// /rituals/index.tsx
import { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { COLOR } from "@/constants/colors";
import FadeSlideIn from "@/components/ui/fade-in-slide";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "All" | "Festivals" | "Daily Rituals" | "Fasting" | "Puja";

interface Article {
  id: string;
  ritualId: string; // maps to ritualDetailScreen route param
  category: string;
  title: string;
  readTime: string;
  locked: boolean;
  imageUri: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: Tab[] = ["All", "Festivals", "Daily Rituals", "Fasting", "Puja"];

const FEATURED_ritual_ID = "mahashivratri-puja";

const ARTICLES: Article[] = [
  {
    id: "1",
    ritualId: "ekadashi-fasting",
    category: "Fasting",
    title: "Benefits of Ekadashi Fasting: Body & Soul",
    readTime: "5 min read",
    locked: true,
    imageUri:
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=200&q=80",
  },
  {
    id: "2",
    ritualId: "surya-namaskar-mantra",
    category: "Daily Rituals",
    title: "The Power of Morning Surya Namaskar Mantra",
    readTime: "8 min read",
    locked: false,
    imageUri:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
  },
  {
    id: "3",
    ritualId: "holi-science-rituals",
    category: "Festivals",
    title: "Holi: Scientific Reasons Behind the Rituals",
    readTime: "6 min read",
    locked: true,
    imageUri:
      "https://unsplash.com/photos/happy-people-crowd-partying-under-colorful-powder-cloud-hi6Cri0Z38A",
  },
  {
    id: "4",
    ritualId: "home-altar-setup",
    category: "Puja rituals",
    title: "Setting Up Your First Home Altar (Pooja Room)",
    readTime: "12 min read",
    locked: false,
    imageUri:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80",
  },
];

// ─── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between">
      <TouchableOpacity onPress={() => router.back()}>
        <View className="w-10 h-10 rounded-full items-center justify-center bg-white border border-line-soft">
          <Ionicons name="arrow-back-outline" size={18} color={COLOR.ink} />
        </View>
      </TouchableOpacity>

      <Text variant="h3" className="font-playfair-bold text-ink">
        Rituals &amp; Festivals
      </Text>

      <TouchableOpacity>
        <View className="w-10 h-10 rounded-full items-center justify-center bg-white border border-line-soft">
          <Ionicons name="search-outline" size={18} color={COLOR.ink} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── Tab Pill ─────────────────────────────────────────────────────────────────

interface TabPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function TabPill({ label, active, onPress }: TabPillProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} className="mr-2">
      <View
        className={`rounded-full px-4 py-2 border ${
          active
            ? "bg-terracotta border-terracotta"
            : "bg-white border-line-soft"
        }`}
      >
        <Text
          variant="small"
          className={`font-inter-medium tracking-wide ${
            active ? "text-white" : "text-terracotta"
          }`}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Featured Banner ──────────────────────────────────────────────────────────

function FeaturedBanner() {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push(`/rituals/${FEATURED_ritual_ID}` as any)}
    >
      <View
        className="rounded-3xl overflow-hidden"
        style={{ backgroundColor: COLOR.terracotta, minHeight: 200 }}
      >
        {/* Decorative circles */}
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

        {/* Background image */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1619738884859-177b8f0c4f22?w=700&q=80",
          }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
          style={{ opacity: 0.22 }}
        />

        <View className="p-5 z-10">
          {/* Label pill */}
          <View
            className="self-start rounded-full px-3 py-1"
            style={{ backgroundColor: "#FFFFFF22" }}
          >
            <Text
              variant="small"
              className="font-inter-medium tracking-widest uppercase"
              style={{ color: "#FFFFFFCC" }}
            >
              Featured ritual
            </Text>
          </View>

          <View className="h-3" />

          {/* Icon + title */}
          <View className="flex-row items-center gap-3">
            <Ionicons name="moon-outline" size={26} color="#FFFFFFCC" />
            <Text variant="h3" className="text-white font-playfair-bold flex-1">
              Mahashivratri ritual
            </Text>
          </View>

          {/* Description */}
          <Text
            variant="muted"
            className="mt-1.5 leading-5"
            style={{ color: "#FFFFFFAA" }}
          >
            Discover the profound spiritual significance and sacred rituals of
            the Great Night of Shiva.
          </Text>

          {/* Tap hint */}
          <View className="flex-row items-center gap-1 mt-3">
            <Text
              variant="small"
              className="font-semibold"
              style={{ color: "#FFFFFFBB" }}
            >
              Read full ritual
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

// ─── Article Card ─────────────────────────────────────────────────────────────

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
}

function ArticleCard({ article, onPress }: ArticleCardProps) {
  const isDailyOrPuja =
    article.category === "Daily Rituals" || article.category === "Puja rituals";

  const accentColor = isDailyOrPuja ? COLOR.gold : COLOR.terracotta;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row bg-white rounded-2xl border border-line-soft overflow-hidden active:opacity-75"
      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
    >
      <View className="w-24 h-32">
        <Image
          source={{ uri: article.imageUri }}
          style={{ height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <View className="flex-1 px-3 py-2 justify-between">
        {/* Category + lock */}
        <View className="flex-row items-center justify-between">
          <Text
            variant="default"
            className="text-lg font-playfair-medium"
            style={{ color: accentColor }}
          >
            {article.category}
          </Text>

          {article.locked && (
            <View
              className="w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: COLOR.gold + "18" }}
            >
              <Ionicons name="lock-closed" size={11} color={COLOR.gold} />
            </View>
          )}
        </View>

        {/* Title */}
        <Text
          variant="default"
          className="font-inter-regular text-sm text-ink mt-1 leading-5"
          numberOfLines={2}
        >
          {article.title}
        </Text>

        {/* Read time */}
        <View className="flex-row items-center gap-1 mt-1">
          <Ionicons name="time-outline" size={12} color={COLOR.inkLight} />
          <Text variant="muted" className="text-ink-light">
            {article.readTime}
          </Text>
        </View>
      </View>

      {/* Chevron */}
      <View className="items-center justify-center pr-3">
        <Ionicons
          name="chevron-forward-outline"
          size={16}
          color={COLOR.inkLight}
        />
      </View>
    </Pressable>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
}

function SectionHeader({ title, onViewAll }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text variant="small" className="font-bold tracking-wide text-ink">
        {title}
      </Text>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Text variant="small" className="font-semibold text-terracotta">
            See all
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function RitualsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const router = useRouter();

  const filteredArticles =
    activeTab === "All"
      ? ARTICLES
      : ARTICLES.filter((a) =>
          a.category.toLowerCase().includes(activeTab.toLowerCase()),
        );

  const handleArticlePress = (article: Article) => {
    router.push(`/rituals/${article.ritualId}` as any);
  };

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
        {/* Header */}
        <FadeSlideIn delay={60}>
          <TopBar />
        </FadeSlideIn>

        {/* Category tabs */}
        <FadeSlideIn delay={100}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 2 }}
          >
            {TABS.map((tab) => (
              <TabPill
                key={tab}
                label={tab}
                active={activeTab === tab}
                onPress={() => setActiveTab(tab)}
              />
            ))}
          </ScrollView>
        </FadeSlideIn>

        {/* Featured banner → navigates to mahashivratri-puja detail */}
        <FadeSlideIn delay={160}>
          <FeaturedBanner />
        </FadeSlideIn>

        {/* Recommended articles */}
        <FadeSlideIn delay={240}>
          <View>
            <SectionHeader title="Recommended for You" onViewAll={() => {}} />
            <View className="gap-3">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onPress={() => handleArticlePress(article)}
                />
              ))}

              {filteredArticles.length === 0 && (
                <View className="items-center justify-center py-10 gap-2">
                  <Ionicons
                    name="file-tray-outline"
                    size={36}
                    color={COLOR.inkLight}
                  />
                  <Text variant="muted" className="text-ink-light text-center">
                    No rituals found for "{activeTab}"
                  </Text>
                </View>
              )}
            </View>
          </View>
        </FadeSlideIn>
      </ScrollView>
    </SafeAreaView>
  );
}
