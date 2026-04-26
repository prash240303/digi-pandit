// /rituals/ritual.tsx
import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { COLOR } from "@/constants/colors";
import FadeSlideIn from "@/components/ui/fade-in-slide";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TipBlock {
  type: "tip";
  text: string;
  icon?: string;
}

interface ChecklistBlock {
  type: "checklist";
  items: string[];
}

interface ImageBlock {
  type: "image";
  uri: string;
  caption?: string;
}

type ContentBlock = TipBlock | ChecklistBlock | ImageBlock;

interface Step {
  number: number;
  title: string;
  description: string;
  blocks?: ContentBlock[];
}

interface GuideDetail {
  id: string;
  heroImage: string;
  category: string;
  readTime: string;
  title: string;
  author: {
    name: string;
    avatarUri: string;
    updatedAt: string;
  };
  pullQuote: string;
  steps: Step[];
  likes: number;
  comments: number;
  nextGuide: {
    id: string;
    title: string;
  };
}

// ─── Mock Database ────────────────────────────────────────────────────────────

const GUIDES_DB: Record<string, GuideDetail> = {
  "mahashivratri-puja": {
    id: "mahashivratri-puja",
    heroImage:
      "https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?w=800&q=80",
    category: "SPIRITUAL GUIDE",
    readTime: "8 min read",
    title: "Mahashivratri Puja Guide: A Step-by-Step Spiritual Journey",
    author: {
      name: "Pandit Ramesh Sharma",
      avatarUri:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&q=80",
      updatedAt: "Updated March 2024",
    },
    pullQuote:
      '"On this auspicious night of Mahashivratri, the spiritual energy of the universe is at its peak. This guide helps you perform the sacred rituals with devotion and precision."',
    steps: [
      {
        number: 1,
        title: "Pratahkaal Snana (Morning Bath)",
        description:
          "Begin your day before sunrise with a ritual bath. Use sesame seeds in the water to purify the physical body. Wear clean, preferably white or saffron-colored unstitched clothes to maintain spiritual purity.",
        blocks: [
          {
            type: "tip",
            text: "Tip: Use Ganga jal if available for extra sanctity.",
            icon: "water-outline",
          },
        ],
      },
      {
        number: 2,
        title: "Sankalpa (Solemn Vow)",
        description:
          "Place some water and rice in your palm and take a vow to observe the fast and perform the puja with full devotion. This mental preparation aligns your consciousness with the divine energy of Lord Shiva.",
        blocks: [],
      },
      {
        number: 3,
        title: "Abhishekam (The Holy Bath)",
        description:
          "The Shiva Lingam is bathed with six sacred items in a specific order. Each represents a different aspect of purification and blessing.",
        blocks: [
          {
            type: "checklist",
            items: [
              "Milk for blessing of purity",
              "Yogurt for prosperity",
              "Honey for sweet speech",
              "Ghee for victory",
            ],
          },
        ],
      },
      {
        number: 4,
        title: "Offering of Bel Patra",
        description:
          "The leaves of the Bel tree (Wood Apple) are particularly dear to Lord Shiva. Offer them with the 'Om Namah Shivaya' mantra. The three leaflets represent the three Gunas (Sattva, Rajas, and Tamas) or the Trishula of Shiva.",
        blocks: [
          {
            type: "image",
            uri: "https://images.unsplash.com/photo-1609619386836-abf8e1dd0c67?w=600&q=80",
            caption: "Sacred Bel Patra and offerings for the Abhishekam",
          },
        ],
      },
      {
        number: 5,
        title: "Jaagran (Night Vigil)",
        description:
          "Stay awake through the night chanting mantras. The four praharas (3-hour periods) each have their own specific puja rituals dedicated to different forms of Lord Shiva.",
        blocks: [
          {
            type: "tip",
            text: "Chant 'Om Namah Shivaya' 108 times each prahara for maximum benefit.",
            icon: "musical-notes-outline",
          },
          {
            type: "checklist",
            items: [
              "First prahara (6–9 PM): Milk offerings",
              "Second prahara (9 PM–12 AM): Curd offerings",
              "Third prahara (12–3 AM): Ghee offerings",
              "Fourth prahara (3–6 AM): Honey offerings",
            ],
          },
        ],
      },
    ],
    likes: 1200,
    comments: 48,
    nextGuide: {
      id: "mahashivratri-recipes",
      title: "Mahashivratri Recipes",
    },
  },
  "ekadashi-fasting": {
    id: "ekadashi-fasting",
    heroImage:
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80",
    category: "FASTING",
    readTime: "5 min read",
    title: "Benefits of Ekadashi Fasting: Body & Soul",
    author: {
      name: "Dr. Priya Nair",
      avatarUri:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
      updatedAt: "Updated January 2024",
    },
    pullQuote:
      '"Ekadashi fasting is not just a religious observance — it is a profound practice that synchronizes the body\'s natural rhythms with the cosmic energy cycle."',
    steps: [
      {
        number: 1,
        title: "Dashami Preparation",
        description:
          "Begin preparation the day before (Dashami). Eat a light sattvic meal in the evening. Avoid non-vegetarian food, onion, and garlic for 24 hours prior.",
        blocks: [
          {
            type: "tip",
            text: "Sleep early on Dashami night to wake before sunrise on Ekadashi.",
            icon: "moon-outline",
          },
        ],
      },
      {
        number: 2,
        title: "Morning Ritual",
        description:
          "Wake before sunrise, bathe, and offer prayers to Lord Vishnu. Light a lamp with ghee and offer Tulsi leaves. Recite the Ekadashi Vrat Katha.",
        blocks: [
          {
            type: "checklist",
            items: [
              "Bathe before sunrise",
              "Light a ghee lamp",
              "Offer Tulsi leaves",
              "Recite Vishnu Sahasranamam",
            ],
          },
        ],
      },
      {
        number: 3,
        title: "The Fast",
        description:
          "Maintain a complete or partial fast based on your capacity. Nirjala (waterless) is the strictest form. Phalahar (fruit-based) is recommended for beginners.",
        blocks: [
          {
            type: "tip",
            text: "Rock salt (sendha namak) is permitted during Ekadashi fasting.",
            icon: "leaf-outline",
          },
          {
            type: "image",
            uri: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&q=80",
            caption: "Allowed foods: fruits, milk, nuts, and sendha namak",
          },
        ],
      },
    ],
    likes: 892,
    comments: 31,
    nextGuide: {
      id: "mahashivratri-puja",
      title: "Mahashivratri Puja Guide",
    },
  },
};

// ─── Mock API call ────────────────────────────────────────────────────────────

async function fetchGuideById(id: string): Promise<GuideDetail | null> {
  await new Promise((res) => setTimeout(res, 900)); // simulate network
  return GUIDES_DB[id] ?? null;
}

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ─── Block renderers ──────────────────────────────────────────────────────────

function TipCard({ block }: { block: TipBlock }) {
  return (
    <View
      className="flex-row items-center gap-2 rounded-xl px-3 py-2.5 mt-3"
      style={{ backgroundColor: COLOR.terracotta + "12" }}
    >
      <View
        className="w-7 h-7 rounded-full items-center justify-center flex-shrink-0"
        style={{ backgroundColor: COLOR.terracotta + "22" }}
      >
        <Ionicons
          name={(block.icon as any) ?? "bulb-outline"}
          size={14}
          color={COLOR.terracotta}
        />
      </View>
      <Text
        variant="muted"
        className="flex-1 leading-4 font-inter-medium"
        style={{ color: COLOR.terracotta }}
      >
        {block.text}
      </Text>
    </View>
  );
}

function ChecklistCard({ block }: { block: ChecklistBlock }) {
  return (
    <View className="mt-3 gap-2">
      {block.items.map((item, i) => (
        <View key={i} className="flex-row items-center gap-2">
          <View
            className="w-5 h-5 rounded-full items-center justify-center flex-shrink-0"
            style={{ backgroundColor: COLOR.sage + "22" }}
          >
            <Ionicons name="checkmark" size={11} color={COLOR.sage} />
          </View>
          <Text variant="muted" className="flex-1 text-ink-light leading-4">
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

function StepImageCard({ block }: { block: ImageBlock }) {
  return (
    <View className="mt-3 rounded-2xl overflow-hidden border border-line-soft">
      <Image
        source={{ uri: block.uri }}
        className="w-full"
        style={{ height: 176 }}
        resizeMode="cover"
      />
      {block.caption && (
        <View className="px-3 py-2" style={{ backgroundColor: COLOR.cream }}>
          <Text
            variant="muted"
            className="text-ink-light text-center leading-4"
          >
            {block.caption}
          </Text>
        </View>
      )}
    </View>
  );
}

function StepCard({ step }: { step: Step }) {
  return (
    <View className="bg-white rounded-2xl border border-line-soft p-4">
      <View className="flex-row items-start">
        {/* Number bubble */}
        <View
          className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-0.5 flex-shrink-0"
          style={{ backgroundColor: COLOR.terracotta }}
        >
          <Text variant="small" className="text-white font-bold">
            {step.number}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            variant="h3"
            className="font-playfair-bold text-ink leading-snug"
          >
            {step.title}
          </Text>
          <Text variant="muted" className="mt-1.5 text-ink-light leading-5">
            {step.description}
          </Text>

          {step.blocks?.map((block, i) => {
            if (block.type === "tip")
              return <TipCard key={i} block={block as TipBlock} />;
            if (block.type === "checklist")
              return <ChecklistCard key={i} block={block as ChecklistBlock} />;
            if (block.type === "image")
              return <StepImageCard key={i} block={block as ImageBlock} />;
            return null;
          })}
        </View>
      </View>
    </View>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBlock({ height }: { height: number }) {
  return (
    <View
      className="rounded-2xl"
      style={{ height, backgroundColor: "#E8E0D8", opacity: 0.55 }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <View style={{ gap: 14, paddingHorizontal: 18, paddingTop: 260 }}>
      <SkeletonBlock height={24} />
      <SkeletonBlock height={64} />
      <SkeletonBlock height={40} />
      <SkeletonBlock height={88} />
      <SkeletonBlock height={120} />
      <SkeletonBlock height={120} />
    </View>
  );
}

// ─── Not Found ────────────────────────────────────────────────────────────────

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8">
      <Ionicons name="document-outline" size={48} color={COLOR.inkLight} />
      <Text variant="h3" className="font-playfair-bold text-ink text-center">
        Guide not found
      </Text>
      <Text variant="muted" className="text-ink-light text-center leading-5">
        We couldn't find this guide. It may have been moved or removed.
      </Text>
      <TouchableOpacity
        onPress={onBack}
        className="mt-2 rounded-full px-6 py-2.5"
        style={{ backgroundColor: COLOR.terracotta }}
      >
        <Text variant="small" className="text-white font-bold">
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function GuideDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [guide, setGuide] = useState<GuideDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setGuide(null);

    fetchGuideById(id ?? "").then((data) => {
      if (!cancelled) {
        setGuide(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleShare = async () => {
    if (!guide) return;
    await Share.share({ message: `${guide.title} — Read on Rituals App` });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLOR.cream }}>
      {/* ── Floating top bar ── */}
      <View className="flex-row items-center justify-between px-4 py-2 absolute top-10 left-0 right-0 z-10">
        <TouchableOpacity onPress={() => router.back()}>
          <View className="w-9 h-9 rounded-full items-center justify-center bg-white/90 border border-line-soft">
            <Ionicons name="arrow-back-outline" size={18} color={COLOR.ink} />
          </View>
        </TouchableOpacity>

        <View className="flex-row gap-2">
          <TouchableOpacity onPress={handleShare}>
            <View className="w-9 h-9 rounded-full items-center justify-center bg-white/90 border border-line-soft">
              <Ionicons name="share-outline" size={17} color={COLOR.ink} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setBookmarked((b) => !b)}>
            <View className="w-9 h-9 rounded-full items-center justify-center bg-white/90 border border-line-soft">
              <Ionicons
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={17}
                color={bookmarked ? COLOR.terracotta : COLOR.ink}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Body ── */}
      {loading ? (
        <>
          {/* Show hero placeholder while loading */}
          <View
            className="absolute top-0 left-0 right-0"
            style={{ height: 240, backgroundColor: "#D8CFC6" }}
          />
          <LoadingSkeleton />
        </>
      ) : !guide ? (
        <NotFound onBack={() => router.back()} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Hero image */}
          <Image
            source={{ uri: guide.heroImage }}
            className="w-full"
            style={{ height: 240 }}
            resizeMode="cover"
          />

          <View style={{ paddingHorizontal: 18, paddingTop: 20, gap: 16 }}>
            {/* Category breadcrumb + read time */}
            <FadeSlideIn delay={60}>
              <View className="flex-row items-center gap-2">
                <View
                  className="self-start rounded-full px-2.5 py-1"
                  style={{ backgroundColor: COLOR.terracotta + "18" }}
                >
                  <Text
                    variant="small"
                    className="font-inter-medium tracking-widest uppercase"
                    style={{ color: COLOR.terracotta }}
                  >
                    {guide.category}
                  </Text>
                </View>
                <Text variant="muted" className="text-ink-light">
                  /
                </Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={COLOR.inkLight}
                  />
                  <Text variant="muted" className="text-ink-light">
                    {guide.readTime}
                  </Text>
                </View>
              </View>
            </FadeSlideIn>

            {/* Title */}
            <FadeSlideIn delay={100}>
              <Text
                variant="h2"
                className="font-playfair-bold text-ink leading-tight"
              >
                {guide.title}
              </Text>
            </FadeSlideIn>

            {/* Author row */}
            <FadeSlideIn delay={140}>
              <View className="flex-row items-center gap-3">
                <Image
                  source={{ uri: guide.author.avatarUri }}
                  className="w-9 h-9 rounded-full border border-line-soft"
                  resizeMode="cover"
                />
                <View>
                  <Text variant="small" className="font-bold text-ink">
                    By {guide.author.name}
                  </Text>
                  <Text variant="muted" className="text-ink-light mt-0.5">
                    {guide.author.updatedAt}
                  </Text>
                </View>
              </View>
            </FadeSlideIn>

            {/* Pull quote */}
            <FadeSlideIn delay={180}>
              <View
                className="rounded-2xl px-4 py-4 border-l-4"
                style={{
                  backgroundColor: COLOR.gold + "10",
                  borderLeftColor: COLOR.gold,
                }}
              >
                <Text
                  variant="muted"
                  className="font-fraunces leading-6 italic"
                  style={{ color: COLOR.terracotta }}
                >
                  {guide.pullQuote}
                </Text>
              </View>
            </FadeSlideIn>

            {/* Steps */}
            {guide.steps.map((step, i) => (
              <FadeSlideIn key={step.number} delay={220 + i * 60}>
                <StepCard step={step} />
              </FadeSlideIn>
            ))}

            {/* Likes / Comments bar */}
            <FadeSlideIn delay={460}>
              <View className="flex-row items-center gap-4 bg-white rounded-2xl border border-line-soft px-4 py-3">
                <TouchableOpacity
                  onPress={() => setLiked((l) => !l)}
                  className="flex-row items-center gap-1.5"
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={liked ? "thumbs-up" : "thumbs-up-outline"}
                    size={18}
                    color={liked ? COLOR.terracotta : COLOR.inkLight}
                  />
                  <Text
                    variant="small"
                    className={
                      liked ? "text-terracotta font-bold" : "text-ink-light"
                    }
                  >
                    {formatCount(guide.likes + (liked ? 1 : 0))}
                  </Text>
                </TouchableOpacity>

                <View className="w-px h-4 bg-line-soft" />

                <TouchableOpacity className="flex-row items-center gap-1.5">
                  <Ionicons
                    name="chatbubble-outline"
                    size={17}
                    color={COLOR.inkLight}
                  />
                  <Text variant="small" className="text-ink-light">
                    {guide.comments}
                  </Text>
                </TouchableOpacity>

                <View className="flex-1" />

                <TouchableOpacity onPress={handleShare}>
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color={COLOR.inkLight}
                  />
                </TouchableOpacity>
              </View>
            </FadeSlideIn>

            {/* Next guide CTA */}
            <FadeSlideIn delay={500}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() =>
                  router.push(`/rituals/${guide.nextGuide.id}` as any)
                }
              >
                <View className="flex-row items-center justify-between bg-white rounded-2xl border border-line-soft px-4 py-3.5">
                  <View className="flex-1 pr-3">
                    <Text variant="muted" className="text-ink-light mb-0.5">
                      Next
                    </Text>
                    <Text
                      variant="small"
                      className="font-bold text-ink"
                      numberOfLines={1}
                    >
                      {guide.nextGuide.title}
                    </Text>
                  </View>
                  <View
                    className="w-9 h-9 rounded-full items-center justify-center"
                    style={{ backgroundColor: COLOR.terracotta }}
                  >
                    <Ionicons
                      name="chevron-forward-outline"
                      size={18}
                      color="#fff"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </FadeSlideIn>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
