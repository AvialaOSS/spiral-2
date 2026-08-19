import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

/** Figma 画面比例 → CSS object-fit */
export type VideoObjectFit = "original" | "stretch" | "fill";

export function videoObjectFitToCss(fit: VideoObjectFit): string {
  switch (fit) {
    case "stretch":
      return "fill";
    case "fill":
      return "cover";
    case "original":
    default:
      return "contain";
  }
}

export function formatVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/** Parse `mm:ss`, `h:mm:ss`, or `current / duration` (uses the first segment). */
export function parseVideoTime(input: string): number | null {
  const raw = input.trim();
  if (!raw) return null;
  const segment = raw.split("/")[0]?.trim() ?? raw;
  const parts = segment.split(":").map((part) => part.trim());
  if (parts.length < 2 || parts.length > 3) return null;
  if (parts.some((part) => part === "" || !/^\d+$/.test(part))) return null;
  const numbers = parts.map(Number);
  if (numbers.some((n) => !Number.isFinite(n) || n < 0)) return null;
  if (parts.length === 2) {
    const [minutes, seconds] = numbers;
    if (seconds! >= 60) return null;
    return minutes! * 60 + seconds!;
  }
  const [hours, minutes, seconds] = numbers;
  if (minutes! >= 60 || seconds! >= 60) return null;
  return hours! * 3600 + minutes! * 60 + seconds!;
}

export const DEFAULT_PLAYBACK_RATES = [0.5, 1, 1.5, 2, 3] as const;

type VolumeBalanceGraph = {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
  compressor: DynamicsCompressorNode;
};

export type UseVideoStateOptions = {
  videoRef: RefObject<HTMLVideoElement | null>;
  rootRef: RefObject<HTMLElement | null>;
  skipSeconds?: number;
  muted?: boolean;
  defaultMuted?: boolean;
  onMutedChange?: (muted: boolean) => void;
  playbackRate?: number;
  defaultPlaybackRate?: number;
  onPlaybackRateChange?: (rate: number) => void;
  objectFit?: VideoObjectFit;
  defaultObjectFit?: VideoObjectFit;
  onObjectFitChange?: (fit: VideoObjectFit) => void;
  volumeBalance?: boolean;
  defaultVolumeBalance?: boolean;
  onVolumeBalanceChange?: (enabled: boolean) => void;
  volume?: number;
  defaultVolume?: number;
  onVolumeChange?: (volume: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

export function useVideoState({
  videoRef,
  rootRef,
  skipSeconds = 10,
  muted: mutedProp,
  defaultMuted = false,
  onMutedChange,
  playbackRate: rateProp,
  defaultPlaybackRate = 1,
  onPlaybackRateChange,
  objectFit: objectFitProp,
  defaultObjectFit = "original",
  onObjectFitChange,
  volumeBalance: volumeBalanceProp,
  defaultVolumeBalance = false,
  onVolumeBalanceChange,
  volume: volumeProp,
  defaultVolume = 1,
  onVolumeChange,
  onPrevious,
  onNext,
}: UseVideoStateOptions) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [internalMuted, setInternalMuted] = useState(defaultMuted);
  const muted = mutedProp ?? internalMuted;

  const [internalRate, setInternalRate] = useState(defaultPlaybackRate);
  const playbackRate = rateProp ?? internalRate;

  const [internalObjectFit, setInternalObjectFit] =
    useState<VideoObjectFit>(defaultObjectFit);
  const objectFit = objectFitProp ?? internalObjectFit;

  const [internalVolumeBalance, setInternalVolumeBalance] =
    useState(defaultVolumeBalance);
  const volumeBalance = volumeBalanceProp ?? internalVolumeBalance;

  const [internalVolume, setInternalVolume] = useState(() =>
    Math.min(1, Math.max(0, defaultVolume))
  );
  const volume = volumeProp ?? internalVolume;

  const balanceGraphRef = useRef<VolumeBalanceGraph | null>(null);
  const seekingRef = useRef(false);

  const setMuted = useCallback(
    (next: boolean) => {
      if (mutedProp === undefined) setInternalMuted(next);
      onMutedChange?.(next);
      const video = videoRef.current;
      if (video) video.muted = next;
    },
    [mutedProp, onMutedChange, videoRef]
  );

  const setPlaybackRate = useCallback(
    (next: number) => {
      if (rateProp === undefined) setInternalRate(next);
      onPlaybackRateChange?.(next);
      const video = videoRef.current;
      if (video) video.playbackRate = next;
    },
    [rateProp, onPlaybackRateChange, videoRef]
  );

  const setObjectFit = useCallback(
    (next: VideoObjectFit) => {
      if (objectFitProp === undefined) setInternalObjectFit(next);
      onObjectFitChange?.(next);
    },
    [objectFitProp, onObjectFitChange]
  );

  const setVolume = useCallback(
    (next: number) => {
      const clamped = Math.min(1, Math.max(0, next));
      if (volumeProp === undefined) setInternalVolume(clamped);
      onVolumeChange?.(clamped);
      const video = videoRef.current;
      if (video) video.volume = clamped;
      if (clamped <= 0) setMuted(true);
      else if (muted) setMuted(false);
    },
    [muted, onVolumeChange, setMuted, videoRef, volumeProp]
  );

  const setVolumeBalance = useCallback(
    (next: boolean) => {
      if (volumeBalanceProp === undefined) setInternalVolumeBalance(next);
      onVolumeBalanceChange?.(next);
    },
    [volumeBalanceProp, onVolumeBalanceChange]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;
    video.playbackRate = playbackRate;
    video.volume = volume;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => {
      if (!seekingRef.current) setCurrentTime(video.currentTime);
    };
    const onLoadedMetadata = () => {
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
      setCurrentTime(video.currentTime);
    };
    const onDurationChange = () => {
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    };
    const onVolumeChangeEvent = () => {
      if (mutedProp === undefined) setInternalMuted(video.muted);
      if (volumeProp === undefined) setInternalVolume(video.volume);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("volumechange", onVolumeChangeEvent);

    setPlaying(!video.paused);
    if (Number.isFinite(video.duration)) setDuration(video.duration);
    setCurrentTime(video.currentTime);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("volumechange", onVolumeChangeEvent);
    };
  }, [videoRef, muted, playbackRate, volume, mutedProp, volumeProp]);

  // Drive the seek thumb from the media clock while playing — `timeupdate` is too sparse
  // and pairs poorly with Slider’s value easing.
  useEffect(() => {
    if (!playing) return;
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    const tick = () => {
      if (!seekingRef.current) {
        const next = video.currentTime;
        setCurrentTime((prev) => (Math.abs(prev - next) < 0.01 ? prev : next));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, videoRef]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const root = rootRef.current;
      const active =
        document.fullscreenElement === root ||
        // Safari
        (document as Document & { webkitFullscreenElement?: Element })
          .webkitFullscreenElement === root;
      setFullscreen(Boolean(active));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
  }, [rootRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const ensureGraph = async () => {
      try {
        let graph = balanceGraphRef.current;
        if (!graph) {
          if (!volumeBalance) return;
          const context = new AudioContext();
          const source = context.createMediaElementSource(video);
          const compressor = context.createDynamicsCompressor();
          source.connect(compressor);
          compressor.connect(context.destination);
          graph = { context, source, compressor };
          balanceGraphRef.current = graph;
        }
        if (cancelled || !graph) return;

        if (volumeBalance) {
          graph.compressor.threshold.value = -24;
          graph.compressor.knee.value = 30;
          graph.compressor.ratio.value = 12;
          graph.compressor.attack.value = 0.003;
          graph.compressor.release.value = 0.25;
        } else {
          // Passthrough — MediaElementSource can only be created once per element.
          graph.compressor.threshold.value = 0;
          graph.compressor.knee.value = 0;
          graph.compressor.ratio.value = 1;
          graph.compressor.attack.value = 0;
          graph.compressor.release.value = 0;
        }

        if (graph.context.state === "suspended") {
          await graph.context.resume();
        }
      } catch {
        // Ignore if the element is already wired or AudioContext is unavailable.
      }
    };

    void ensureGraph();

    return () => {
      cancelled = true;
    };
  }, [volumeBalance, videoRef]);

  useEffect(() => {
    return () => {
      const graph = balanceGraphRef.current;
      if (!graph) return;
      try {
        graph.source.disconnect();
        graph.compressor.disconnect();
      } catch {
        // ignore
      }
      void graph.context.close();
      balanceGraphRef.current = null;
    };
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }, [videoRef]);

  const seekBy = useCallback(
    (delta: number) => {
      const video = videoRef.current;
      if (!video) return;
      const next = Math.min(
        Math.max(0, video.currentTime + delta),
        Number.isFinite(video.duration) ? video.duration : video.currentTime + delta
      );
      video.currentTime = next;
      setCurrentTime(next);
    },
    [videoRef]
  );

  const handlePrevious = useCallback(() => {
    if (onPrevious) {
      onPrevious();
      return;
    }
    seekBy(-skipSeconds);
  }, [onPrevious, seekBy, skipSeconds]);

  const handleNext = useCallback(() => {
    if (onNext) {
      onNext();
      return;
    }
    seekBy(skipSeconds);
  }, [onNext, seekBy, skipSeconds]);

  const seekTo = useCallback(
    (time: number) => {
      const video = videoRef.current;
      if (!video) return;
      const next = Math.min(
        Math.max(0, time),
        Number.isFinite(video.duration) ? video.duration : time
      );
      video.currentTime = next;
      setCurrentTime(next);
    },
    [videoRef]
  );

  const beginSeek = useCallback(() => {
    seekingRef.current = true;
    setSeeking(true);
  }, []);

  const previewSeek = useCallback(
    (time: number) => {
      const video = videoRef.current;
      if (!video) return;
      const next = Math.min(
        Math.max(0, time),
        Number.isFinite(video.duration) ? video.duration : time
      );
      video.currentTime = next;
      setCurrentTime(next);
    },
    [videoRef]
  );

  const endSeek = useCallback(() => {
    seekingRef.current = false;
    setSeeking(false);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(!muted);
  }, [muted, setMuted]);

  const toggleFullscreen = useCallback(async () => {
    const root = rootRef.current;
    if (!root) return;
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void> | void;
      webkitFullscreenElement?: Element;
    };
    const el = root as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };

    const isFull =
      document.fullscreenElement === root || doc.webkitFullscreenElement === root;

    try {
      if (isFull) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      } else if (root.requestFullscreen) {
        await root.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
    } catch {
      // Fullscreen may be blocked without a user gesture or by policy.
    }
  }, [rootRef]);

  return {
    playing,
    currentTime,
    duration,
    seeking,
    fullscreen,
    muted,
    playbackRate,
    objectFit,
    volume,
    volumeBalance,
    togglePlay,
    handlePrevious,
    handleNext,
    seekTo,
    beginSeek,
    previewSeek,
    endSeek,
    toggleMute,
    setMuted,
    setPlaybackRate,
    setObjectFit,
    setVolume,
    setVolumeBalance,
    toggleFullscreen,
  };
}
