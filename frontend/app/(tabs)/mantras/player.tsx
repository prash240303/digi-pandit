import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "../../../contexts/Audiocontext";

const ORANGE = "#E8590C";
const { width, height } = Dimensions.get("window");
const SCRUBBER_WIDTH = width - 48;

function formatSecs(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function PlayerScreen() {
  const router = useRouter();
  const {
    currentTrack,
    currentAlbum,
    isPlaying,
    isLoading,
    positionSecs,
    durationSecs,
    togglePlayPause,
    seekTo,
    playNext,
    playPrev,
  } = useAudio();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPos, setScrubPos] = useState(0);

  const progress = durationSecs > 0 ? positionSecs / durationSecs : 0;
  const displayPos = isScrubbing ? scrubPos : positionSecs;
  const displayProgress = durationSecs > 0 ? displayPos / durationSecs : 0;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setIsScrubbing(true);
      const x = evt.nativeEvent.locationX;
      const ratio = Math.max(0, Math.min(1, x / SCRUBBER_WIDTH));
      setScrubPos(ratio * durationSecs);
    },
    onPanResponderMove: (evt) => {
      const x = evt.nativeEvent.locationX;
      const ratio = Math.max(0, Math.min(1, x / SCRUBBER_WIDTH));
      setScrubPos(ratio * durationSecs);
    },
    onPanResponderRelease: async () => {
      await seekTo(scrubPos);
      setIsScrubbing(false);
    },
  });

  if (!currentTrack) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "#0F0F0F" }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-4 left-4 p-2"
        >
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="musical-notes-outline" size={64} color="#333" />
        <Text className="text-gray-600 mt-4">No track playing</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#0F0F0F" }}>
      <StatusBar barStyle="light-content" />

      {/* Background blur art */}
      <View style={{ position: "absolute", inset: 0 }}>
        <Image
          source={{ uri: currentAlbum?.image }}
          style={{ width, height, opacity: 0.15 }}
          resizeMode="cover"
          blurRadius={40}
        />
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(15,15,15,0.75)",
          }}
        />
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-white/50 text-xs uppercase tracking-widest font-semibold">
            Now Playing
          </Text>
          <Text className="text-white text-sm font-bold mt-0.5">
            {currentAlbum?.title}
          </Text>
        </View>
        <TouchableOpacity className="p-1">
          <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View className="items-center px-8 mt-4">
        <View
          className="rounded-3xl overflow-hidden"
          style={{
            width: width - 64,
            height: width - 64,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.5,
            shadowRadius: 30,
            elevation: 20,
          }}
        >
          <Image
            source={{ uri: currentAlbum?.image }}
            style={{ width: width - 64, height: width - 64 }}
            resizeMode="cover"
          />
          {/* Subtle color tint */}
          <View
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: ORANGE,
              opacity: 0.08,
            }}
          />
        </View>
      </View>

      {/* Track info */}
      <View className="flex-row items-start justify-between px-8 mt-8">
        <View className="flex-1 mr-4">
          <Text
            className="text-white font-bold"
            style={{ fontSize: 22, letterSpacing: -0.3 }}
            numberOfLines={1}
          >
            {currentTrack.title}
          </Text>
          <Text className="text-white/60 text-sm mt-1.5">
            {currentTrack.subtitle}
          </Text>
        </View>
        <TouchableOpacity className="mt-1">
          <Ionicons
            name="heart-outline"
            size={26}
            color="rgba(255,255,255,0.5)"
          />
        </TouchableOpacity>
      </View>

      {/* Scrubber */}
      <View className="px-6 mt-8">
        {/* Track bar */}
        <View
          {...panResponder.panHandlers}
          style={{
            width: SCRUBBER_WIDTH,
            height: 40,
            justifyContent: "center",
          }}
        >
          {/* Background track */}
          <View
            style={{
              width: SCRUBBER_WIDTH,
              height: 4,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 2,
            }}
          >
            {/* Progress fill */}
            <View
              style={{
                width: SCRUBBER_WIDTH * displayProgress,
                height: 4,
                backgroundColor: ORANGE,
                borderRadius: 2,
              }}
            />
            {/* Thumb */}
            <View
              style={{
                position: "absolute",
                left: SCRUBBER_WIDTH * displayProgress - 8,
                top: -6,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            />
          </View>
        </View>

        {/* Time labels */}
        <View className="flex-row justify-between mt-1">
          <Text className="text-white/50 text-xs">
            {formatSecs(displayPos)}
          </Text>
          <Text className="text-white/50 text-xs">
            {formatSecs(durationSecs)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View className="flex-row items-center justify-between px-10 mt-8">
        {/* Shuffle */}
        <TouchableOpacity className="p-2">
          <Ionicons name="shuffle" size={22} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>

        {/* Prev */}
        <TouchableOpacity
          onPress={playPrev}
          className="p-2"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="play-skip-back" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity
          onPress={togglePlayPause}
          className="w-18 h-18 rounded-full items-center justify-center"
          style={{
            width: 72,
            height: 72,
            backgroundColor: ORANGE,
            shadowColor: ORANGE,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.45,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={30}
              color="#fff"
              style={{ marginLeft: isPlaying ? 0 : 4 }}
            />
          )}
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          onPress={playNext}
          className="p-2"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="play-skip-forward" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity className="p-2">
          <Ionicons name="repeat" size={22} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
      </View>

      {/* Bottom extras */}
      <View className="flex-row items-center justify-between px-8 mt-8">
        <TouchableOpacity className="items-center">
          <Ionicons name="list" size={22} color="rgba(255,255,255,0.45)" />
          <Text className="text-white/40 text-xs mt-1">Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons
            name="share-outline"
            size={22}
            color="rgba(255,255,255,0.45)"
          />
          <Text className="text-white/40 text-xs mt-1">Share</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons
            name="download-outline"
            size={22}
            color="rgba(255,255,255,0.45)"
          />
          <Text className="text-white/40 text-xs mt-1">Download</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
