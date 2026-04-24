import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "../contexts/Audiocontext";

const ORANGE = "#E8590C";

export const FloatingPlayer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentTrack,
    currentAlbum,
    isPlaying,
    isLoading,
    isBuffering,
    togglePlayPause,
    playNext,
    playPrev,
  } = useAudio();

  if (!currentTrack) return null;
  if (pathname?.startsWith("/player")) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => router.push("/player")}
      className="absolute bottom-0 left-0 right-0 mx-3 mb-2"
      style={{ zIndex: 999 }}
    >
      <View
        className="flex-row items-center rounded-2xl px-3 py-2.5"
        style={{
          backgroundColor: "#1C1C1E",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 20,
        }}
      >
        {/* Album Art */}
        {(currentTrack.cover ?? currentAlbum?.image) && (
          <Image
            source={currentTrack.cover ?? currentAlbum?.image}
            style={{ width: 44, height: 44, borderRadius: 12 }}
            resizeMode="cover"
          />
        )}

        {/* Track Info */}
        <View className="flex-1 ml-3">
          <Text className="text-white font-semibold text-sm" numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
            {currentAlbum?.title}
          </Text>
        </View>

        {/* Controls */}
        <View className="flex-row items-center gap-x-1">
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              playPrev();
            }}
            className="p-2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="play-skip-back" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className="w-10 h-10 rounded-full items-center justify-center ml-1"
            style={{ backgroundColor: ORANGE }}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            {isLoading || isBuffering ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={18}
                color="#fff"
                style={{ marginLeft: isPlaying ? 0 : 2 }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              playNext();
            }}
            className="p-2 ml-1"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="play-skip-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
