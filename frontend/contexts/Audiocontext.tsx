import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { AudioModule, useAudioPlayerStatus } from "expo-audio";
import { Track, Album } from "../app/(tabs)/mantras/data/albumData";

/**
 * Enhanced AudioContext for a premium music player experience.
 * Features:
 * - Auto-advance to next track
 * - Track/Album looping support
 * - Robust loading and error states
 * - Optimized performance via useMemo
 */

interface AudioContextType {
  // Playlist State
  currentTrack: Track | null;
  currentAlbum: Album | null;
  
  // Playback State (from expo-audio)
  isPlaying: boolean;
  isLoading: boolean;
  isBuffering: boolean;
  positionSecs: number;
  durationSecs: number;
  
  // Controls
  playTrack: (track: Track, album: Album) => Promise<void>;
  togglePlayPause: () => void;
  seekTo: (secs: number) => void;
  playNext: () => void;
  playPrev: () => void;
  
  // Settings
  isLooping: boolean;
  setIsLooping: (loop: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

/**
 * Hook to access audio player state and controls
 */
export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize expo-audio player manually to fix "Received 4 arguments, but 3 was expected" error.
  // The built-in useAudioPlayer hook in this version passes 4 arguments, but the native side expects 3.
  const player = useMemo(() => {
    try {
      // @ts-ignore - Manual constructor call with 3 arguments
      return new AudioModule.AudioPlayer(null, 500, false);
    } catch (e) {
      // Fallback if 3 args fails
      // @ts-ignore
      return new AudioModule.AudioPlayer(null, 500, false, 0);
    }
  }, []);

  const status = useAudioPlayerStatus(player);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [isLooping, setIsLooping] = useState(false);

  /**
   * Loads and plays a specific track from an album
   */
  const playTrack = useCallback(
    async (track: Track, album: Album) => {
      try {
        console.log(`[AudioProvider] Playing: ${track.title}`);
        setCurrentTrack(track);
        setCurrentAlbum(album);

        // Replace source and start playback
        await player.replace({ uri: track.audioUrl });
        player.play();
      } catch (err) {
        console.warn("[AudioProvider] Playback error:", err);
      }
    },
    [player]
  );

  /**
   * Advances to the next track in the current album
   */
  const playNext = useCallback(() => {
    if (!currentTrack || !currentAlbum) return;
    
    const tracks = currentAlbum.tracks;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    
    playTrack(tracks[nextIndex], currentAlbum);
  }, [currentTrack, currentAlbum, playTrack]);

  /**
   * Goes back to the previous track (or restarts current if > 3s)
   */
  const playPrev = useCallback(() => {
    if (!currentTrack || !currentAlbum) return;
    
    // If we've played more than 3 seconds, just restart the current track
    if (status.currentTime > 3) {
      player.seekTo(0);
      return;
    }

    const tracks = currentAlbum.tracks;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    
    playTrack(tracks[prevIndex], currentAlbum);
  }, [currentTrack, currentAlbum, status.currentTime, player, playTrack]);

  /**
   * Play / Pause toggle
   */
  const togglePlayPause = useCallback(() => {
    if (!status.isLoaded) return;
    status.playing ? player.pause() : player.play();
  }, [player, status.isLoaded, status.playing]);

  /**
   * Seek to position
   */
  const seekTo = useCallback(
    (secs: number) => {
      if (!status.isLoaded) return;
      player.seekTo(secs);
    },
    [player, status.isLoaded]
  );

  /**
   * Sync looping mode with native player
   */
  useEffect(() => {
    player.loop = isLooping;
  }, [player, isLooping]);

  /**
   * Event Listener: Handle track completion
   * Automatically advances to the next track if looping is disabled
   */
  useEffect(() => {
    const subscription = player.addListener("playbackFinished", () => {
      if (!isLooping) {
        playNext();
      }
    });
    return () => subscription.remove();
  }, [player, isLooping, playNext]);

  const value = useMemo(
    () => ({
      currentTrack,
      currentAlbum,
      isPlaying: status.playing,
      isLoading: !status.isLoaded,
      isBuffering: !!status.isBuffering,
      positionSecs: status.currentTime,
      durationSecs: status.duration,
      playTrack,
      togglePlayPause,
      seekTo,
      playNext,
      playPrev,
      isLooping,
      setIsLooping,
    }),
    [
      currentTrack,
      currentAlbum,
      status.playing,
      status.isLoaded,
      status.isBuffering,
      status.currentTime,
      status.duration,
      playTrack,
      togglePlayPause,
      seekTo,
      playNext,
      playPrev,
      isLooping,
    ]
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};