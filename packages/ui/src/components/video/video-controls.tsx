import {
  GeneralSetting,
  GeneralFullScreen,
  GeneralVolumeMax,
  GeneralVolumeMiddle,
  GeneralVolumeMin,
  GeneralVolumeSlash,
} from "@aviala-design/icons";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Slider } from "../slider";
import {
  formatVideoTime,
  parseVideoTime,
  type VideoObjectFit,
} from "./use-video-state";
import {
  VideoAnimatedIcon,
  VIDEO_TRANSPORT_ANIMATION_MS,
} from "./video-animated-icon";
import { VideoSettings } from "./video-settings";
import { VideoSpeed } from "./video-speed";
import { VideoVolume } from "./video-volume";

export type VideoControlsLocale = {
  play: string;
  pause: string;
  previous: string;
  next: string;
  speed: string;
  speedAdjust: string;
  speedRate: string;
  mute: string;
  unmute: string;
  volume: string;
  settings: string;
  fullscreen: string;
  exitFullscreen: string;
  settingsTitle: string;
  aspectRatio: string;
  aspectOriginal: string;
  aspectStretch: string;
  aspectFill: string;
  volumeBalance: string;
};

export type VideoControlsProps = {
  locale: VideoControlsLocale;
  playing: boolean;
  currentTime: number;
  duration: number;
  muted: boolean;
  fullscreen: boolean;
  playbackRate: number;
  playbackRates: number[];
  objectFit: VideoObjectFit;
  volume: number;
  volumeBalance: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeekCommit: (time: number) => void;
  onSeekPreview: (time: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onVolumeChange: (volume: number) => void;
  onObjectFitChange: (fit: VideoObjectFit) => void;
  onVolumeBalanceChange: (enabled: boolean) => void;
  onToggleFullscreen: () => void;
};

function volumePercent(volume: number, muted: boolean): number {
  if (muted) return 0;
  return Math.round(Math.min(1, Math.max(0, volume)) * 100);
}

function VolumeTriggerIcon({ percent }: { percent: number }) {
  if (percent <= 0) return <GeneralVolumeSlash mode="fill" aria-hidden />;
  if (percent < 34) return <GeneralVolumeMin mode="fill" aria-hidden />;
  if (percent < 67) return <GeneralVolumeMiddle mode="fill" aria-hidden />;
  return <GeneralVolumeMax mode="fill" aria-hidden />;
}

function ControlIconButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      mode="noBackgroundCustom"
      size="regular"
      iconOnly
      allRound
      aria-label={label}
      leftIcon={icon}
      onClick={onClick}
    />
  );
}

const VideoTransportButtons = memo(function VideoTransportButtons({
  playing,
  locale,
  onTogglePlay,
  onPrevious,
  onNext,
}: {
  playing: boolean;
  locale: VideoControlsLocale;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const [prevToken, setPrevToken] = useState(0);
  const [nextToken, setNextToken] = useState(0);
  const [playToken, setPlayToken] = useState(0);
  const playLockRef = useRef(false);

  return (
    <div className="aviala-video__group">
      <ControlIconButton
        label={locale.previous}
        icon={<VideoAnimatedIcon name="previous" playToken={prevToken} />}
        onClick={() => {
          setPrevToken((token) => token + 1);
          onPrevious();
        }}
      />
      <ControlIconButton
        label={playing ? locale.pause : locale.play}
        icon={
          <VideoAnimatedIcon
            name={playing ? "pause" : "play"}
            playToken={playToken}
          />
        }
        onClick={() => {
          if (playLockRef.current) return;
          playLockRef.current = true;
          window.setTimeout(() => {
            playLockRef.current = false;
          }, VIDEO_TRANSPORT_ANIMATION_MS);
          setPlayToken((token) => token + 1);
          onTogglePlay();
        }}
      />
      <ControlIconButton
        label={locale.next}
        icon={<VideoAnimatedIcon name="next" playToken={nextToken} />}
        onClick={() => {
          setNextToken((token) => token + 1);
          onNext();
        }}
      />
    </div>
  );
});

function VideoTimeInput({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const timeLabel = `${formatVideoTime(currentTime)} / ${formatVideoTime(safeDuration)}`;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(timeLabel);

  useEffect(() => {
    if (!editing) setDraft(timeLabel);
  }, [editing, timeLabel]);

  const commit = () => {
    const parsed = parseVideoTime(draft);
    if (parsed != null) {
      const next =
        safeDuration > 0
          ? Math.min(Math.max(0, parsed), safeDuration)
          : Math.max(0, parsed);
      onSeek(next);
    }
    setEditing(false);
  };

  return (
    <Input
      className="aviala-video__time"
      fullWidth={false}
      size="regular"
      value={editing ? draft : timeLabel}
      aria-label={timeLabel}
      style={{
        ["--video-time-ch" as string]: String(
          (editing ? draft : timeLabel).length
        ),
      }}
      onFocus={(event) => {
        setEditing(true);
        setDraft(timeLabel);
        event.currentTarget.select();
      }}
      onChange={(event) => {
        setEditing(true);
        setDraft(event.target.value);
      }}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        } else if (event.key === "Escape") {
          event.preventDefault();
          setDraft(timeLabel);
          setEditing(false);
          event.currentTarget.blur();
        }
      }}
    />
  );
}

export function VideoControls({
  locale,
  playing,
  currentTime,
  duration,
  muted,
  fullscreen,
  playbackRate,
  playbackRates,
  objectFit,
  volume,
  volumeBalance,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeekCommit,
  onSeekPreview,
  onSeekStart,
  onSeekEnd,
  onPlaybackRateChange,
  onVolumeChange,
  onObjectFitChange,
  onVolumeBalanceChange,
  onToggleFullscreen,
}: VideoControlsProps) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const sliderMax = safeDuration > 0 ? safeDuration : 1;
  const sliderValue = Math.min(Math.max(0, currentTime), sliderMax);
  const percent = volumePercent(volume, muted);

  return (
    <div className="aviala-video__controls">
      <div className="aviala-video__bar">
        <div className="aviala-video__bar-bg" aria-hidden />

        <VideoTransportButtons
          playing={playing}
          locale={locale}
          onTogglePlay={onTogglePlay}
          onPrevious={onPrevious}
          onNext={onNext}
        />

        <div className="aviala-video__progress">
          <VideoTimeInput
            currentTime={currentTime}
            duration={safeDuration}
            onSeek={(time) => {
              onSeekStart();
              onSeekPreview(time);
              onSeekCommit(time);
              onSeekEnd();
            }}
          />
          <Slider
            className="aviala-video__seek"
            size="default"
            min={0}
            max={sliderMax}
            step={0.1}
            value={[sliderValue]}
            disabled={safeDuration <= 0}
            onPointerDown={() => onSeekStart()}
            onValueChange={(values) => {
              const next = values[0] ?? 0;
              onSeekPreview(next);
            }}
            onValueCommit={(values) => {
              onSeekCommit(values[0] ?? 0);
              onSeekEnd();
            }}
            onPointerUp={() => onSeekEnd()}
            onPointerCancel={() => onSeekEnd()}
          />
        </div>

        <div className="aviala-video__group">
          <VideoSpeed
            label={locale.speed}
            title={locale.speedAdjust}
            rateTemplate={locale.speedRate}
            playbackRate={playbackRate}
            playbackRates={playbackRates}
            onPlaybackRateChange={onPlaybackRateChange}
            trigger={
              <Button
                type="button"
                mode="noBackgroundCustom"
                size="regular"
                allRound
                className="aviala-video__speed-trigger"
                aria-label={locale.speed}
              >
                {locale.speed}
              </Button>
            }
          />

          <VideoVolume
            label={locale.volume}
            percent={percent}
            onPercentChange={(next) => onVolumeChange(next / 100)}
            trigger={
              <Button
                type="button"
                mode="noBackgroundCustom"
                size="regular"
                iconOnly
                allRound
                aria-label={locale.volume}
                leftIcon={<VolumeTriggerIcon percent={percent} />}
              />
            }
          />

          <VideoSettings
            locale={locale}
            objectFit={objectFit}
            volumeBalance={volumeBalance}
            onObjectFitChange={onObjectFitChange}
            onVolumeBalanceChange={onVolumeBalanceChange}
            trigger={
              <Button
                type="button"
                mode="noBackgroundCustom"
                size="regular"
                iconOnly
                allRound
                aria-label={locale.settings}
                leftIcon={<GeneralSetting mode="fill" aria-hidden />}
              />
            }
          />

          <ControlIconButton
            label={fullscreen ? locale.exitFullscreen : locale.fullscreen}
            icon={<GeneralFullScreen mode="fill" aria-hidden />}
            onClick={onToggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
}
