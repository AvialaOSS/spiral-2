import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const DEFAULT_AUTO_HIDE_DELAY_MS = 2500;

function isOverlayOpen(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(
    document.querySelector(
      ".aviala-popover-content[data-state='open'], .aviala-select-content[data-state='open']"
    )
  );
}

function isControlsEngaged(root: HTMLElement): boolean {
  const controls = root.querySelector(".aviala-video__controls");
  if (!(controls instanceof HTMLElement)) return false;
  return controls.matches(":hover") || controls.matches(":focus-within");
}

export function useVideoControlsAutoHide({
  enabled,
  delayMs = DEFAULT_AUTO_HIDE_DELAY_MS,
  playing,
  seeking,
  rootRef,
}: {
  enabled: boolean;
  delayMs?: number;
  playing: boolean;
  seeking: boolean;
  rootRef: RefObject<HTMLElement | null>;
}) {
  const [hidden, setHidden] = useState(false);
  const timerRef = useRef<number | null>(null);
  const enabledRef = useRef(enabled);
  const playingRef = useRef(playing);
  const seekingRef = useRef(seeking);
  const delayRef = useRef(delayMs);

  enabledRef.current = enabled;
  playingRef.current = playing;
  seekingRef.current = seeking;
  delayRef.current = delayMs;

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearTimer();
    if (!enabledRef.current || !playingRef.current) return;

    timerRef.current = window.setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;
      if (seekingRef.current || isControlsEngaged(root) || isOverlayOpen()) {
        scheduleHide();
        return;
      }
      setHidden(true);
    }, delayRef.current);
  }, [clearTimer, rootRef]);

  const reveal = useCallback(() => {
    setHidden(false);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    if (!enabled || !playing) {
      clearTimer();
      setHidden(false);
      return;
    }
    if (seeking) {
      setHidden(false);
      clearTimer();
      return;
    }
    scheduleHide();
  }, [clearTimer, enabled, playing, scheduleHide, seeking]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const onActivity = () => {
      if (!enabledRef.current) return;
      reveal();
    };

    root.addEventListener("pointermove", onActivity);
    root.addEventListener("pointerdown", onActivity);
    root.addEventListener("focusin", onActivity);
    return () => {
      root.removeEventListener("pointermove", onActivity);
      root.removeEventListener("pointerdown", onActivity);
      root.removeEventListener("focusin", onActivity);
    };
  }, [enabled, reveal, rootRef]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return enabled && playing ? hidden : false;
}

export { DEFAULT_AUTO_HIDE_DELAY_MS };
