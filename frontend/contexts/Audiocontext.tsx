// contexts/AudioContext.tsx
//
// Full expo-audio context — replaces the deprecated expo-av version.
// Handles both local require() assets (TrackSource = number)
// and remote { uri: string } sources transparently.
//
// Install dependency if not present:
//   npx expo install expo-audio

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AudioModule,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { Album, Track, TrackSource } from "../data/albumData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AudioContextValue {
  /** Currently loaded track, or null */
  currentTrack: Track | null;
  /** Album the current track belongs to */
  currentAlbum: Album | null;
  /** True while audio is playing */
  isPlaying: boolean;
  /** True while audio is buffering / loading */
  isLoading: boolean;
  /** Playback position in seconds */
  positionSecs: number;
  /** Total duration in seconds (0 until loaded) */
  durationSecs: number;
  /** Play a specific track. Replaces any current playback. */
  playTrack: (track: Track, album: Album) => Promise<void>;
  /** Toggle play / pause on the current track */
  togglePlayPause: () => void;
  /** Seek to an absolute position (seconds) */
  seekTo: (secs: number) => void;
  /** Skip to the next track in the current album */
  playNext: () => Promise<void>;
  /** Skip to the previous track (or restart if < 3 s in) */
  playPrev: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Single stable player instance for the lifetime of the provider.
  // Pass null so no audio is loaded until playTrack() is called.
  const player = useAudioPlayer(null);

  // Reactive status — replaces the old onPlaybackStatusUpdate callback.
  // Fields used: playing, isBuffering, currentTime, duration, didJustFinish.
  const status = useAudioPlayerStatus(player);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);

  // Stable refs so callbacks that close over these never go stale
  // without needing to be re-declared.
  const currentTrackRef = useRef<Track | null>(null);
  const currentAlbumRef = useRef<Album | null>(null);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    currentAlbumRef.current = currentAlbum;
  }, [currentAlbum]);

  // Forward-declared ref so the auto-advance effect can always call the
  // latest version of playNext without it being a dependency.
  const playNextRef = useRef<() => Promise<void>>(async () => {});

  // ── Configure audio session once on mount ─────────────────────────────────
  useEffect(() => {
    AudioModule.setAudioModeAsync({
      allowsRecording: false,
      shouldPlayInBackground: true, // keep playing when screen locks
      playsInSilentMode: true,      // respect iOS silent switch
    });

    // player.remove() releases native resources when the provider unmounts.
    return () => {
      player.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-advance when a track finishes ────────────────────────────────────
  // Guard with a ref to fire only on the leading edge of didJustFinish=true.
  const didHandleFinishRef = useRef(false);

  useEffect(() => {
    if (status.didJustFinish && !didHandleFinishRef.current) {
      didHandleFinishRef.current = true;
      playNextRef.current();
    }
    if (!status.didJustFinish) {
      didHandleFinishRef.current = false;
    }
  }, [status.didJustFinish]);

  // ── Core: load and play a track ───────────────────────────────────────────
  // player.replace() swaps the source without tearing down the native player,
  // which is lighter-weight than the old unload → createAsync dance.
  const playTrack = useCallback(
    async (track: Track, album: Album) => {
      try {
        setCurrentTrack(track);
        setCurrentAlbum(album);

        // track.source is either a require() number or { uri: string }
        player.replace(track.source as any);
        player.play();
      } catch (err) {
        console.error("playTrack error:", err);
      }
    },
    [player],
  );

  // ── Toggle play / pause ───────────────────────────────────────────────────
  const togglePlayPause = useCallback(() => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player, status.playing]);

  // ── Seek ──────────────────────────────────────────────────────────────────
  const seekTo = useCallback(
    (secs: number) => {
      player.seekTo(secs);
    },
    [player],
  );

  // ── Next track ────────────────────────────────────────────────────────────
  const playNext = useCallback(async () => {
    const track = currentTrackRef.current;
    const album = currentAlbumRef.current;
    if (!track || !album) return;

    const tracks = album.tracks;
    const idx = tracks.findIndex((t) => t.id === track.id);
    const next = tracks[(idx + 1) % tracks.length];
    await playTrack(next, album);
  }, [playTrack]);

  // Keep the forward ref in sync so auto-advance always uses the latest version.
  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  // ── Previous track ────────────────────────────────────────────────────────
  const playPrev = useCallback(async () => {
    const track = currentTrackRef.current;
    const album = currentAlbumRef.current;
    if (!track || !album) return;

    // If more than 3 seconds in, restart the current track instead.
    if (status.currentTime > 3) {
      player.seekTo(0);
      return;
    }

    const tracks = album.tracks;
    const idx = tracks.findIndex((t) => t.id === track.id);
    const prev = tracks[(idx - 1 + tracks.length) % tracks.length];
    await playTrack(prev, album);
  }, [player, status.currentTime, playTrack]);

  // ── Context value ─────────────────────────────────────────────────────────
  const value: AudioContextValue = {
    currentTrack,
    currentAlbum,
    isPlaying: status.playing,
    isLoading: status.isBuffering,
    positionSecs: status.currentTime,      // expo-audio gives seconds directly
    durationSecs: status.duration ?? 0,
    playTrack,
    togglePlayPause,
    seekTo,
    playNext,
    playPrev,
  };

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}