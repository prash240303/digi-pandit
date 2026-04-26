// /rituals/[id].tsx
import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { COLOR } from "@/constants/colors";
import FadeSlideIn from "@/components/ui/fade-in-slide";
import {
  GuideDetail,
  Block,
  ParagraphBlock,
  HeadingBlock,
  TipBlock,
  ChecklistBlock,
  ImageBlock,
  StepBlock,
  fetchRitualById,
} from "@/lib/rituals-api";

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ─── Block renderers ──────────────────────────────────────────────────────────

function ParagraphCard({ block }: { block: ParagraphBlock }) {
  return (
    <Text className="text-ink leading-6 text-[15px]">{block.text}</Text>
  );
}

function HeadingCard({ block }: { block: HeadingBlock }) {
  return (
    <Text
      variant={block.level === 3 ? "h3" : "h2"}
      className="font-fraunces text-ink mt-1"
    >
      {block.text}
    </Text>
  );
}

function TipCard({ block }: { block: TipBlock }) {
  return (
    <View className="flex-row items-center gap-2 rounded-xl bg-primary-soft px-3 py-2.5">
      <View className="w-7 h-7 rounded-full items-center justify-center flex-shrink-0">
        <Ionicons
          name={(block.icon as any) ?? "bulb-outline"}
          size={14}
          color={COLOR.primary}
        />
      </View>
      <Text variant="muted" className="flex-1 leading-4 text-primary font-inter-medium">
        {block.text}
      </Text>
    </View>
  );
}

function ChecklistCard({ block }: { block: ChecklistBlock }) {
  return (
    <View className="gap-2">
      {block.title && (
        <Text variant="small" className="font-bold text-ink mb-1">
          {block.title}
        </Text>
      )}
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

function ImageCard({ block }: { block: ImageBlock }) {
  if (!block.uri) return null;
  return (
    <View className="rounded-2xl overflow-hidden border border-line-soft">
      <Image
        source={{ uri: block.uri }}
        className="w-full"
        style={{ height: 176 }}
        resizeMode="cover"
      />
      {block.caption && (
        <View className="px-3 py-2" style={{ backgroundColor: COLOR.cream }}>
          <Text variant="muted" className="text-ink-light text-center leading-4">
            {block.caption}
          </Text>
        </View>
      )}
    </View>
  );
}

function StepCard({ block }: { block: StepBlock }) {
  return (
    <View className="bg-white rounded-2xl border border-line-soft p-4">
      <View className="flex-row items-start">
        <View className="w-8 h-8 rounded-full items-center bg-primary justify-center mr-3 mt-0.5 flex-shrink-0">
          <Text variant="small" className="text-white font-bold">
            {block.number}
          </Text>
        </View>
        <View className="flex-1">
          <Text variant="h3" className="font-fraunces text-ink leading-snug">
            {block.title}
          </Text>
          <Text variant="muted" className="mt-1.5 text-ink-light leading-5">
            {block.description}
          </Text>
        </View>
      </View>
    </View>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":  return <ParagraphCard block={block} />;
    case "heading":    return <HeadingCard block={block} />;
    case "tip":        return <TipCard block={block} />;
    case "checklist":  return <ChecklistCard block={block} />;
    case "image":      return <ImageCard block={block} />;
    case "step":       return <StepCard block={block} />;
    default:           return null;
  }
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
      <Text variant="h3" className="font-fraunces text-ink text-center">
        Guide not found
      </Text>
      <Text variant="muted" className="text-ink-muted text-center leading-5">
        This guide may have been moved or removed.
      </Text>
      <TouchableOpacity
        onPress={onBack}
        className="mt-2 rounded-full px-6 py-2.5 bg-primary"
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
    fetchRitualById(id ?? "").then((data) => {
      if (!cancelled) {
        setGuide(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [id]);

  const handleShare = async () => {
    if (!guide) return;
    await Share.share({ message: `${guide.title} — Read on Digi Pandit` });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLOR.cream }}>
      {/* Floating top bar */}
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
                color={bookmarked ? COLOR.primary : COLOR.ink}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <>
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
          {/* Hero */}
          <Image
            source={{ uri: guide.heroImage }}
            className="w-full"
            style={{ height: 240 }}
            resizeMode="cover"
          />

          <View style={{ paddingHorizontal: 18, paddingTop: 20, gap: 16 }}>
            {/* Category + read time */}
            <FadeSlideIn delay={60}>
              <View className="flex-row items-center gap-2">
                <View className="self-start rounded-full px-2.5 py-1 bg-primary-soft">
                  <Text
                    variant="small"
                    className="font-inter-medium tracking-widest text-primary uppercase"
                  >
                    {guide.category}
                  </Text>
                </View>
                <Text variant="muted" className="text-ink-light">/</Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="time-outline" size={12} color={COLOR.inkLight} />
                  <Text variant="muted" className="text-ink-light">
                    {guide.readTime}
                  </Text>
                </View>
              </View>
            </FadeSlideIn>

            {/* Title */}
            <FadeSlideIn delay={100}>
              <Text variant="h2" className="font-fraunces text-ink leading-tight">
                {guide.title}
              </Text>
            </FadeSlideIn>

            {/* Author */}
            <FadeSlideIn delay={140}>
              <View className="flex-row items-center gap-3">
                {guide.author.avatarUri ? (
                  <Image
                    source={{ uri: guide.author.avatarUri }}
                    className="w-9 h-9 rounded-full border border-line-soft"
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className="w-9 h-9 rounded-full items-center justify-center border border-line-soft"
                    style={{ backgroundColor: COLOR.primary + "18" }}
                  >
                    <Ionicons name="person-outline" size={16} color={COLOR.primary} />
                  </View>
                )}
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
            {!!guide.pullQuote && (
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
                    className="font-fraunces leading-6 text-primary italic"
                  >
                    {guide.pullQuote}
                  </Text>
                </View>
              </FadeSlideIn>
            )}

            {/* Article content — flat block array */}
            {guide.content.map((block, i) => (
              <FadeSlideIn key={i} delay={220 + i * 40}>
                <BlockRenderer block={block} />
              </FadeSlideIn>
            ))}

            {/* Likes / Comments */}
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
                    color={liked ? COLOR.primary : COLOR.inkLight}
                  />
                  <Text
                    variant="small"
                    className={liked ? "text-primary font-bold" : "text-ink-light"}
                  >
                    {formatCount(guide.likes + (liked ? 1 : 0))}
                  </Text>
                </TouchableOpacity>

                <View className="w-px h-4 bg-line-soft" />

                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="chatbubble-outline" size={17} color={COLOR.inkLight} />
                  <Text variant="small" className="text-ink-light">
                    {guide.comments}
                  </Text>
                </View>

                <View className="flex-1" />

                <TouchableOpacity onPress={handleShare}>
                  <Ionicons name="share-social-outline" size={18} color={COLOR.inkLight} />
                </TouchableOpacity>
              </View>
            </FadeSlideIn>

            {/* Next guide CTA */}
            {!!guide.nextGuide.id && (
              <FadeSlideIn delay={500}>
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => router.push(`/rituals/${guide.nextGuide.id}` as any)}
                >
                  <View className="flex-row items-center justify-between bg-white rounded-2xl border border-line-soft px-4 py-3.5">
                    <View className="flex-1 pr-3">
                      <Text variant="muted" className="text-ink-light mb-0.5">
                        Next
                      </Text>
                      <Text variant="small" className="font-bold text-ink" numberOfLines={1}>
                        {guide.nextGuide.title}
                      </Text>
                    </View>
                    <View className="w-9 h-9 rounded-full items-center bg-primary justify-center">
                      <Ionicons name="chevron-forward-outline" size={18} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
              </FadeSlideIn>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
