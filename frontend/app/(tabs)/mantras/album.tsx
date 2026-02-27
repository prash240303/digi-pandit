import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAlbumById, Track } from "./data/albumData";
import { useAudio } from "../../../contexts/Audiocontext";

const ORANGE = "#E8590C";
const { width } = Dimensions.get("window");
const HERO_HEIGHT = width * 0.55;

type FilterTab = "All Mantras" | "Popular" | "Stotrams";
const TABS: FilterTab[] = ["All Mantras", "Popular", "Stotrams"];

// Mock "popular" and "stotram" track IDs for demo filtering
const POPULAR_TRACK_IDS_SUFFIX = ["1", "2"];
const STOTRAM_KEYWORDS = ["stotram", "stotras", "chalisa", "ashtakam"];

function formatSecs(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AlbumScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const album = getAlbumById(id ?? "1");
  const [activeTab, setActiveTab] = useState<FilterTab>("All Mantras");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudio();

  if (!album) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50">
        <Text className="text-gray-500">Album not found</Text>
      </SafeAreaView>
    );
  }

  const filteredTracks = album.tracks.filter((t) => {
    if (activeTab === "All Mantras") return true;
    if (activeTab === "Popular")
      return POPULAR_TRACK_IDS_SUFFIX.some((s) => t.id.endsWith(s));
    if (activeTab === "Stotrams")
      return STOTRAM_KEYWORDS.some((k) => t.title.toLowerCase().includes(k));
    return true;
  });

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handlePlayTrack = async (track: Track) => {
    if (currentTrack?.id === track.id) {
      await togglePlayPause();
    } else {
      await playTrack(track, album);
    }
  };

  const handlePlayAll = async () => {
    if (album.tracks.length > 0) {
      await playTrack(album.tracks[0], album);
    }
  };

  const isCurrentTrack = (track: Track) => currentTrack?.id === track.id;

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: currentTrack ? 100 : 32 }}
      >
        {/* Hero Image */}
        <View style={{ height: HERO_HEIGHT, position: "relative" }}>
          <Image
            source={{ uri: album.image }}
            style={{ width, height: HERO_HEIGHT }}
            resizeMode="cover"
          />
          {/* Dark gradient overlay */}
          <View
            style={{
              position: "absolute",
              inset: 0,
              //   background:
              //     "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
              //   backgroundColor: "rgba(0,0,0,0.4)",
            }}
          />

          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/mantras")}
            className="absolute top-4 left-4 w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          {/* More button */}
          <TouchableOpacity
            className="absolute top-4 right-4 w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Title overlay */}
          <View className="absolute bottom-5 left-5 right-16">
            <Text
              className="text-white text-2xl font-bold"
              style={{ letterSpacing: -0.3 }}
            >
              {album.title} Mantras
            </Text>
            <Text className="text-white/80 text-sm mt-1">
              {album.description}
            </Text>
          </View>

          {/* Play button */}
          <TouchableOpacity
            onPress={handlePlayAll}
            className="absolute bottom-4 right-5 w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: ORANGE }}
          >
            <Ionicons
              name="play"
              size={22}
              color="#fff"
              style={{ marginLeft: 2 }}
            />
          </TouchableOpacity>
        </View>

        {/* Header info */}
        <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-900 font-bold text-lg">
              {album.title}
            </Text>
            <Text className="text-sm mt-0.5" style={{ color: ORANGE }}>
              {album.tracks.length} Mantras & Aartis
            </Text>
          </View>
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 8,
            paddingBottom: 4,
          }}
          className="mb-4"
        >
          {TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: active ? ORANGE : "#fff",
                  borderWidth: active ? 0 : 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <Text
                  className="font-semibold text-sm"
                  style={{ color: active ? "#fff" : "#6B7280" }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Track List */}
        <View className="px-4">
          {filteredTracks.map((track, index) => {
            const isCurrent = isCurrentTrack(track);
            const isLiked = likedIds.has(track.id);

            return (
              <TouchableOpacity
                key={track.id}
                onPress={() => handlePlayTrack(track)}
                activeOpacity={0.75}
                className="flex-row items-center rounded-2xl mb-2 px-3 py-3"
                style={{
                  backgroundColor: isCurrent ? "#FFF5F0" : "#fff",
                  borderWidth: 1,
                  borderColor: isCurrent ? "#FBCDB5" : "transparent",
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 6,
                  elevation: 1,
                }}
              >
                {/* Icon / Number */}
                <View
                  className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: isCurrent ? "#FDEEE6" : "#FFF5F0" }}
                >
                  {isCurrent && isPlaying ? (
                    <View
                      className="flex-row items-end gap-x-0.5"
                      style={{ height: 16 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <View
                          key={i}
                          style={{
                            width: 3,
                            height: 8 + i * 4,
                            backgroundColor: ORANGE,
                            borderRadius: 2,
                          }}
                        />
                      ))}
                    </View>
                  ) : (
                    <Ionicons name="musical-note" size={18} color={ORANGE} />
                  )}
                </View>

                {/* Info */}
                <View className="flex-1">
                  <Text
                    className="font-semibold text-sm"
                    style={{ color: isCurrent ? ORANGE : "#111827" }}
                    numberOfLines={1}
                  >
                    {track.title}
                  </Text>
                  <Text
                    className="text-gray-500 text-xs mt-0.5"
                    numberOfLines={1}
                  >
                    {track.subtitle} · {track.duration}
                  </Text>
                </View>

                {/* Like */}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleLike(track.id);
                  }}
                  className="p-2"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={18}
                    color={isLiked ? ORANGE : "#D1D5DB"}
                  />
                </TouchableOpacity>

                {/* More */}
                <TouchableOpacity
                  className="p-2"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={16}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          {filteredTracks.length === 0 && (
            <View className="items-center py-12">
              <Ionicons
                name="musical-notes-outline"
                size={40}
                color="#D1D5DB"
              />
              <Text className="text-gray-400 mt-3 text-sm">
                No tracks in this category
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
