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
import { CornerMandala, Torana } from "@/components/ui/mandala";

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
      <Text className="font-fraunces font-bold text-2xl text-ink">
        Rituals &amp; Festivals
      </Text>
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
          active ? "bg-primary border-none" : "bg-white border-line-soft"
        }`}
      >
        <Text
          variant="small"
          className={`font-inter-medium tracking-wide ${
            active ? "text-white" : "text-ink"
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
      <View className="rounded-3xl bg-gradient-primary overflow-hidden">
        <CornerMandala
          positionProp={{ right: -30, top: -30 }}
          c="rgba(255,240,200,0.09)"
          size={200}
        />
        <Torana c="rgba(255,240,200,0.22)" />

        <View className="p-5 z-10">
          {/* Label pill */}
          <View className="self-start rounded-full px-3 py-1 bg-black/20">
            <Text variant="small" className="font-inter-medium text-white/90">
              Featured ritual
            </Text>
          </View>

          <View className="h-3" />

          {/* Icon + title */}
          <View className="flex-col flex items-start gap-1">
            <Text className="text-white text-sm font-fraunces flex-1">
              महाशिवरात्रि
            </Text>
            <Text variant="h3" className="text-white font-fraunces">
              Mahashivratri
            </Text>
          </View>

          {/* Description */}
          <Text variant="muted" className="mt-1.5 text-white/80 leading-5">
            Discover the profound spiritual significance and sacred rituals of
            the Great Night of Shiva.
          </Text>

          {/* Tap hint */}
          <View className="flex-row items-center gap-1 mt-3">
            <Text variant="small" className="font-semibold text-white">
              Read full ritual
            </Text>
            <Ionicons name="chevron-forward-outline" size={13} color="#fff" />
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
      className="flex-row relative bg-white p-2 items-start justify-center rounded-2xl border border-line-soft overflow-hidden active:opacity-75"
      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
    >
      <View className="w-24 h-24 rounded-lg overflow-hidden">
        <Image
          source={{ uri: article.imageUri }}
          style={{ height: "100%", width: "100%" }}
          resizeMode="cover"
        />
      </View>

      <View className="flex-1 px-3 h-full justify-between">
        <View>
          {/* Category badge */}
          <View
            className="px-2 py-0.5 w-fit rounded-full"
            style={{ backgroundColor: accentColor + "20" }} 
          >
            <Text
              className="text-xs font-medium font-inter text-ink"
              style={{ color: accentColor }}
            >
              {article.category}
            </Text>
          </View>

          {/* Title */}
          <Text
            className="font-fraunces text-base text-ink mt-1 leading-5"
            numberOfLines={2}
          >
            {article.title}
          </Text>
        </View>

        {/* Read time */}
        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={14} color={COLOR.inkLight} />
          <Text className="text-ink-light font-light text-xs">
            {article.readTime}
          </Text>
        </View>
      </View>

      {article.locked && (
        <View className="w-6 h-6 rounded-full absolute top-1 right-1 items-center justify-center">
          <Ionicons name="lock-closed" size={11} color={COLOR.gold} />
        </View>
      )}
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
      <Text
        variant="small"
        className="font-medium font-fraunces text-lg tracking-tight text-ink"
      >
        {title}
      </Text>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Text variant="small" className="font-semibold text-primary">
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
