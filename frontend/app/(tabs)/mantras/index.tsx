import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Album } from "../../../mantras-data/album-data/types";
import { fetchAlbums } from "../../../mantras-data/album-data/albumSource";
import { useAudio } from "../../../contexts/Audiocontext";

const ORANGE = "#E8590C";
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

type FilterType = "All" | "Popular" | "Deity" | "Festival";
const FILTERS: FilterType[] = ["All", "Popular", "Deity", "Festival"];

const AlbumCard: React.FC<{ album: Album; onPress: () => void }> = ({
  album,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.88}
    style={{ width: CARD_WIDTH }}
    className="mb-5"
  >
    <View
      className="relative rounded-2xl overflow-hidden"
      style={{ height: CARD_WIDTH }}
    >
      <Image
        source={album.image}
        className="w-full h-full"
        resizeMode="cover"
      />
      {/* Gradient overlay */}
      <View
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
      />
      {/* Play button */}
      <View
        className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
      >
        <Ionicons
          name="play"
          size={14}
          color={ORANGE}
          style={{ marginLeft: 2 }}
        />
      </View>
    </View>
    <Text
      className="text-gray-900 font-inter-bold text-sm mt-2"
      numberOfLines={1}
    >
      {album.title}
    </Text>
    <Text className="text-gray-500 font-inter-regular text-xs mt-0.5">
      {album.tracks.length} Tracks · {album.type}
    </Text>
  </TouchableOpacity>
);

export default function MantrasIndex() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentTrack } = useAudio();

  useEffect(() => {
    let cancelled = false;
    fetchAlbums()
      .then((a) => {
        if (!cancelled) setAlbums(a);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = albums;
    if (activeFilter === "Deity")
      list = list.filter((a) => a.category === "Deity");
    else if (activeFilter === "Festival")
      list = list.filter((a) => a.category === "Festival");
    else if (activeFilter === "Popular")
      list = list.filter((a) => a.category === "Popular");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.tracks.some((t) => t.title.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [activeFilter, search, albums]);

  const featuredAlbums = albums.slice(0, 4);

  // Pair albums into rows of 2
  const rows = [];
  for (let i = 0; i < filtered.length; i += 2) {
    rows.push(filtered.slice(i, i + 2));
  }

  const goToAlbum = (album: Album) => {
    router.push({ pathname: "/mantras/album", params: { id: album.id } });
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: currentTrack ? 100 : 32 }}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-3 flex-row items-center justify-between">
          <View>
            <Text
              className="text-2xl font-playfair-bold text-gray-900"
              style={{ letterSpacing: -0.5 }}
            >
              Mantras & Aarti
            </Text>
            <Text className="text-gray-500 font-inter-regular text-sm mt-0.5">
              Sacred chants & devotional music
            </Text>
          </View>
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-white items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View className="mx-5 mb-4">
          <View
            className="flex-row items-center bg-white rounded-2xl px-4 py-3"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            <Ionicons name="search" size={16} color="#9CA3AF" />
            <TextInput
              placeholder="Search mantras, aarti or deities"
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
              className=" font-inter-regular flex-1 ml-2.5 text-gray-800 text-sm"
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          className="mb-5"
        >
          {FILTERS.map((f) => {
            const active = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                className="px-5 py-2 rounded-full"
                style={{
                  backgroundColor: active ? ORANGE : "#fff",
                  borderWidth: active ? 0 : 1,
                  borderColor: "#E5E7EB",
                  shadowColor: active ? ORANGE : "#000",
                  shadowOpacity: active ? 0.25 : 0.05,
                  shadowRadius: 8,
                  elevation: active ? 4 : 1,
                }}
              >
                <Text
                  className="font-semibold text-sm"
                  style={{ color: active ? "#fff" : "#6B7280" }}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading && (
          <View className="items-center py-10">
            <ActivityIndicator color={ORANGE} />
            <Text className="text-gray-400 mt-2 text-xs">Loading aartis…</Text>
          </View>
        )}
        {!loading && error && (
          <View className="px-5 py-4">
            <Text className="text-red-600 text-xs">
              Could not load: {error}
            </Text>
          </View>
        )}

        {/* Featured Albums — show only when no search or filter active */}
        {!search && activeFilter === "All" && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between px-5 mb-4">
              <Text className="text-lg font-inter-bold text-gray-900">
                Featured Albums
              </Text>
              <TouchableOpacity>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: ORANGE }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {/* 2-col grid for featured */}
            <View className="px-5 w-full">
              {[featuredAlbums.slice(0, 2), featuredAlbums.slice(2, 4)].map(
                (pair, ri) => (
                  <View key={ri} className="flex-row justify-between">
                    {pair.map((album) => (
                      <AlbumCard
                        key={album.id}
                        album={album}
                        onPress={() => goToAlbum(album)}
                      />
                    ))}
                  </View>
                ),
              )}
            </View>
          </View>
        )}

        {/* All / Filtered results */}
        {(search || activeFilter !== "All") && (
          <View className="px-5">
            <Text className="text-base font-inter-bold text-gray-900 mb-4">
              {filtered.length}{" "}
              {activeFilter === "All" ? "Albums" : `${activeFilter} Albums`}
            </Text>
            {rows.map((pair, ri) => (
              <View key={ri} className="flex-row justify-between">
                {pair.map((album) => (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    onPress={() => goToAlbum(album)}
                  />
                ))}
                {pair.length === 1 && <View style={{ width: CARD_WIDTH }} />}
              </View>
            ))}
          </View>
        )}

        {/* All Albums section (when not filtered/searched) */}
        {!search && activeFilter === "All" && (
          <View className="px-5">
            <Text className="text-lg font-inter-bold text-gray-900 mb-4">
              All Albums
            </Text>
            {rows.map((pair, ri) => (
              <View key={ri} className="flex-row justify-between">
                {pair.map((album) => (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    onPress={() => goToAlbum(album)}
                  />
                ))}
                {pair.length === 1 && <View style={{ width: CARD_WIDTH }} />}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
