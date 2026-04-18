import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { Track, Album } from "../app/(tabs)/mantras/data/albumData";

interface PlayerState {
  currentTrack: Track | null;
  currentAlbum: Album | null;
}

interface AudioContextType extends PlayerState {
  isPlaying: boolean;
  positionSecs: number;
  durationSecs: number;
  isLoading: boolean;
  playTrack: (track: Track, album: Album) => Promise<void>;
  togglePlayPause: () => void;
  seekTo: (secs: number) => void;
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
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);

  const playTrack = useCallback(
    async (track: Track, album: Album) => {
      try {
        setCurrentTrack(track);
        setCurrentAlbum(album);

        await player.replace({
          uri: track.audioUrl,
        });

        player.play();
      } catch (e) {
        console.warn("Audio load error:", e);
      }
    },
    [player],
  );

  const togglePlayPause = useCallback(() => {
    if (!status) return;
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player, status]);

  const seekTo = useCallback(
    (secs: number) => {
      player.seekTo(secs);
    },
    [player],
  );

  const playNext = useCallback(() => {
    if (!currentTrack || !currentAlbum) return;

    const tracks = currentAlbum.tracks;
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    const next = tracks[(idx + 1) % tracks.length];

    playTrack(next, currentAlbum);
  }, [currentTrack, currentAlbum, playTrack]);

  const playPrev = useCallback(() => {
    if (!currentTrack || !currentAlbum) return;

    const tracks = currentAlbum.tracks;
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    const prev = tracks[(idx - 1 + tracks.length) % tracks.length];

    playTrack(prev, currentAlbum);
  }, [currentTrack, currentAlbum, playTrack]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        currentAlbum,
        isPlaying: status?.playing ?? false,
        positionSecs: status?.currentTime ?? 0,
        durationSecs: status?.duration ?? 0,
        isLoading: status?.loading ?? false,
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