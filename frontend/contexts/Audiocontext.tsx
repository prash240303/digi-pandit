import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Track, Album } from "../app/(tabs)/mantras/data/albumData";

interface PlayerState {
  currentTrack: Track | null;
  currentAlbum: Album | null;
  isPlaying: boolean;
  positionSecs: number;
  durationSecs: number;
  isLoading: boolean;
}

interface AudioContextType extends PlayerState {
  playTrack: (track: Track, album: Album) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (secs: number) => Promise<void>;
  playNext: () => void;
  playPrev: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    currentAlbum: null,
    isPlaying: false,
    positionSecs: 0,
    durationSecs: 0,
    isLoading: false,
  });

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setState((prev) => ({
      ...prev,
      isPlaying: status.isPlaying,
      positionSecs: (status.positionMillis ?? 0) / 1000,
      durationSecs: (status.durationMillis ?? 0) / 1000,
      isLoading: status.isBuffering,
    }));
    if (status.didJustFinish) {
      setState((prev) => ({ ...prev, isPlaying: false, positionSecs: 0 }));
    }
  }, []);

  const playTrack = useCallback(
    async (track: Track, album: Album) => {
      try {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          currentTrack: track,
          currentAlbum: album,
        }));

        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: track.audioUrl },
          { shouldPlay: true, progressUpdateIntervalMillis: 500 },
          onPlaybackStatusUpdate,
        );
        soundRef.current = sound;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isPlaying: true,
          positionSecs: 0,
          durationSecs: track.durationSecs,
        }));
      } catch (e) {
        console.warn("Audio load error:", e);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [onPlaybackStatusUpdate],
  );

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    if (state.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  }, [state.isPlaying]);

  const seekTo = useCallback(async (secs: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(secs * 1000);
    setState((prev) => ({ ...prev, positionSecs: secs }));
  }, []);

  const playNext = useCallback(() => {
    if (!state.currentTrack || !state.currentAlbum) return;
    const tracks = state.currentAlbum.tracks;
    const idx = tracks.findIndex((t) => t.id === state.currentTrack!.id);
    const next = tracks[(idx + 1) % tracks.length];
    playTrack(next, state.currentAlbum);
  }, [state.currentTrack, state.currentAlbum, playTrack]);

  const playPrev = useCallback(() => {
    if (!state.currentTrack || !state.currentAlbum) return;
    const tracks = state.currentAlbum.tracks;
    const idx = tracks.findIndex((t) => t.id === state.currentTrack!.id);
    const prev = tracks[(idx - 1 + tracks.length) % tracks.length];
    playTrack(prev, state.currentAlbum);
  }, [state.currentTrack, state.currentAlbum, playTrack]);

  return (
    <AudioContext.Provider
      value={{
        ...state,
        playTrack,
        togglePlayPause,
        seekTo,
        playNext,
        playPrev,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
