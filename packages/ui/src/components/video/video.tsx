import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type VideoHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";
import { spiralDebugId } from "../../lib/spiral-debug";
import { useLocaleMessages } from "../../locale";
import { VideoControls } from "./video-controls";
import { useVideoControlsAutoHide } from "./use-controls-auto-hide";
import {
  DEFAULT_PLAYBACK_RATES,
  useVideoState,
  videoObjectFitToCss,
  type VideoObjectFit,
} from "./use-video-state";

/** Figma Components → Information Display → Video (1958:1400) Style */
export type VideoAppearance = "default" | "light";

export type VideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "controls" | "muted" | "onVolumeChange"
> & {
  /** Figma `Style` — Default stacks the bar; Light floats a pill bar over the stage. */
  appearance?: VideoAppearance;
  /** Seconds to skip when Previous / Next have no playlist handlers. */
  skipSeconds?: number;
  /** Available playback rates in the speed popover. */
  playbackRates?: number[];
  muted?: boolean;
  defaultMuted?: boolean;
  onMutedChange?: (muted: boolean) => void;
  playbackRate?: number;
  defaultPlaybackRate?: number;
  onPlaybackRateChange?: (rate: number) => void;
  /** Figma 画面比例 — original→contain, stretch→fill, fill→cover. */
  objectFit?: VideoObjectFit;
  defaultObjectFit?: VideoObjectFit;
  onObjectFitChange?: (fit: VideoObjectFit) => void;
  /** Lightweight loudness balance via Web Audio DynamicsCompressor. */
  volumeBalance?: boolean;
  defaultVolumeBalance?: boolean;
  onVolumeBalanceChange?: (enabled: boolean) => void;
  /** Linear gain 0–1 (`HTMLMediaElement.volume`). */
  volume?: number;
  defaultVolume?: number;
  onVolumeChange?: (volume: number) => void;
  /** Override Previous (default: seek back `skipSeconds`). */
  onPrevious?: () => void;
  /** Override Next (default: seek forward `skipSeconds`). */
  onNext?: () => void;
  /**
   * Letterbox / pillarbox fill behind the media.
   * CSS color value — prefer a token, e.g. `var(--box-box-normal-background-blackonly)`.
   * Defaults to Black (`--box-box-normal-background-blackonly`).
   */
  stageBackground?: string;
  /**
   * Auto-hide the control bar after idle (slide down + fade).
   * Pointer move / press on the player reveals it again.
   */
  autoHideControls?: boolean;
  /** Idle time in ms before hiding when `autoHideControls` is on. Default 2500. */
  autoHideDelay?: number;
  className?: string;
  style?: CSSProperties;
};

export type VideoHandle = {
  video: HTMLVideoElement | null;
  play: () => Promise<void> | undefined;
  pause: () => void;
};

export const Video = forwardRef<VideoHandle, VideoProps>(
  (
    {
      appearance = "default",
      skipSeconds = 10,
      playbackRates = [...DEFAULT_PLAYBACK_RATES],
      muted,
      defaultMuted,
      onMutedChange,
      playbackRate,
      defaultPlaybackRate,
      onPlaybackRateChange,
      objectFit,
      defaultObjectFit,
      onObjectFitChange,
      volumeBalance,
      defaultVolumeBalance,
      onVolumeBalanceChange,
      volume,
      defaultVolume,
      onVolumeChange,
      onPrevious,
      onNext,
      stageBackground,
      autoHideControls = false,
      autoHideDelay,
      className,
      style,
      src,
      poster,
      children,
      ...videoProps
    },
    ref
  ) => {
    const locale = useLocaleMessages("Video");
    const rootRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const state = useVideoState({
      videoRef,
      rootRef,
      skipSeconds,
      muted,
      defaultMuted,
      onMutedChange,
      playbackRate,
      defaultPlaybackRate,
      onPlaybackRateChange,
      objectFit,
      defaultObjectFit,
      onObjectFitChange,
      volumeBalance,
      defaultVolumeBalance,
      onVolumeBalanceChange,
      volume,
      defaultVolume,
      onVolumeChange,
      onPrevious,
      onNext,
    });

    const controlsHidden = useVideoControlsAutoHide({
      enabled: autoHideControls,
      delayMs: autoHideDelay,
      playing: state.playing,
      seeking: state.seeking,
      rootRef,
    });

    useImperativeHandle(
      ref,
      () => ({
        video: videoRef.current,
        play: () => videoRef.current?.play(),
        pause: () => videoRef.current?.pause(),
      }),
      []
    );

    return (
      <div
        ref={rootRef}
        className={cn(
          "aviala-video",
          appearance === "light" && "aviala-video--appearance-light",
          className
        )}
        style={
          {
            ...style,
            ...(stageBackground
              ? ({ "--video-stage-bg": stageBackground } as CSSProperties)
              : null),
          } as CSSProperties
        }
        data-appearance={appearance}
        data-auto-hide-controls={autoHideControls ? "true" : undefined}
        data-controls-hidden={controlsHidden ? "true" : undefined}
        data-playing={state.playing ? "true" : undefined}
        data-muted={state.muted ? "true" : undefined}
        data-fullscreen={state.fullscreen ? "true" : undefined}
        {...spiralDebugId("video")}
      >
        <div className="aviala-video__stage">
          <video
            ref={videoRef}
            className="aviala-video__media"
            src={src}
            poster={poster}
            playsInline
            muted={state.muted}
            style={{
              objectFit: videoObjectFitToCss(
                state.objectFit
              ) as CSSProperties["objectFit"],
            }}
            {...videoProps}
            {...spiralDebugId("video.media")}
          >
            {children}
          </video>
        </div>

        <VideoControls
          locale={locale}
          playing={state.playing}
          currentTime={state.currentTime}
          duration={state.duration}
          muted={state.muted}
          fullscreen={state.fullscreen}
          playbackRate={state.playbackRate}
          playbackRates={playbackRates}
          objectFit={state.objectFit}
          volume={state.volume}
          volumeBalance={state.volumeBalance}
          onTogglePlay={state.togglePlay}
          onPrevious={state.handlePrevious}
          onNext={state.handleNext}
          onSeekStart={state.beginSeek}
          onSeekPreview={state.previewSeek}
          onSeekCommit={state.seekTo}
          onSeekEnd={state.endSeek}
          onPlaybackRateChange={state.setPlaybackRate}
          onVolumeChange={state.setVolume}
          onObjectFitChange={state.setObjectFit}
          onVolumeBalanceChange={state.setVolumeBalance}
          onToggleFullscreen={state.toggleFullscreen}
        />
      </div>
    );
  }
);
Video.displayName = "Video";

export type { VideoObjectFit };
