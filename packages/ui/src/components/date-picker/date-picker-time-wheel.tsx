import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import {
  consumeWheelSteps,
  nearestLoopIndex,
  normalizeWheelIndex,
  recenterLoopIndex,
  stepLoopRawIndex,
  stickyRoundIndex,
  WHEEL_ACCUM_IDLE_MS,
  WHEEL_LOOP_MIDDLE_SECTION,
  WHEEL_LOOP_SECTIONS,
  WHEEL_SCROLL_END_MS,
  WHEEL_STEP_THRESHOLD_FACTOR,
  WHEEL_STICKY_AMOUNT,
} from "../../lib/sticky-wheel";
import { typographyVariants } from "../typography";

const LOOP_SECTIONS = WHEEL_LOOP_SECTIONS;
const MIDDLE_SECTION = WHEEL_LOOP_MIDDLE_SECTION;

type DatePickerTimeWheelColumnProps = {
  values: readonly number[];
  value: number;
  onChange: (value: number) => void;
  "aria-label": string;
  loop?: boolean;
  className?: string;
  formatValue?: (value: number) => string;
  /** Bump to force a scroll re-sync after layout/animation settles. */
  layoutKey?: number;
};

function formatWheelValue(value: number): string {
  return String(value).padStart(2, "0");
}

function getValueIndex(values: readonly number[], value: number): number {
  const index = values.indexOf(value);
  if (index >= 0) return index;

  let nearestIndex = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;

  values.forEach((candidate, candidateIndex) => {
    const distance = Math.abs(candidate - value);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearestIndex = candidateIndex;
    }
  });

  return nearestIndex;
}

function readItemHeight(container: HTMLElement): number {
  const item = container.querySelector<HTMLElement>(".aviala-datepicker-time__wheel-item");
  if (item) {
    // Prefer offsetHeight — getBoundingClientRect is skewed by ancestor
    // transforms (e.g. date ↔ month view enter scale animation).
    const layoutHeight = item.offsetHeight;
    if (layoutHeight > 0) return layoutHeight;
  }

  const style = getComputedStyle(container);
  const token = style.getPropertyValue("--datepicker-time-wheel-item-height").trim();
  const parsed = parseFloat(token);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 36;
}

export function DatePickerTimeWheelColumn({
  values,
  value,
  onChange,
  "aria-label": ariaLabel,
  loop = true,
  className,
  formatValue = formatWheelValue,
  /** Bump to force a scroll re-sync after layout/animation settles. */
  layoutKey = 0,
}: DatePickerTimeWheelColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const clipTrackRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  /** When set, value-driven auto sync must not cancel an in-flight smooth scroll. */
  const smoothTargetValueRef = useRef<number | null>(null);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wheelAccumRef = useRef(0);
  const wheelAccumIdleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const selectedValueRef = useRef(value);

  selectedValueRef.current = value;

  const repeatedValues = useMemo(() => {
    if (!loop) return [...values];
    return Array.from({ length: LOOP_SECTIONS }, () => values).flat();
  }, [loop, values]);

  const readRawIndex = useCallback((container: HTMLElement, itemHeight: number) => {
    return Math.round(container.scrollTop / itemHeight);
  }, []);

  const syncClipTrack = useCallback(() => {
    const container = scrollRef.current;
    const track = clipTrackRef.current;
    if (!container || !track) return;
    // List items start at 0 in the track; scroll padding is on the container, so
    // the highlight band lines up when we translate by scrollTop only.
    track.style.transform = `translate3d(0, ${-container.scrollTop}px, 0)`;
  }, []);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "auto") => {
      const container = scrollRef.current;
      if (!container) return;

      const itemHeight = readItemHeight(container);
      if (itemHeight <= 0) return;
      isProgrammaticScrollRef.current = true;
      container.scrollTo({ top: index * itemHeight, behavior });
      if (behavior === "auto") {
        syncClipTrack();
      } else {
        requestAnimationFrame(syncClipTrack);
      }
    },
    [syncClipTrack]
  );

  const syncScrollToValue = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      if (isUserScrollingRef.current) return;
      // Click/keyboard already started a smooth scroll to this value — don't snap.
      if (
        behavior === "auto" &&
        smoothTargetValueRef.current != null &&
        smoothTargetValueRef.current === selectedValueRef.current
      ) {
        return;
      }

      const container = scrollRef.current;
      if (!container) return;

      const itemHeight = readItemHeight(container);
      if (itemHeight <= 0) return;

      const valueIndex = getValueIndex(values, selectedValueRef.current);
      const currentIndex = readRawIndex(container, itemHeight);
      const currentValueIndex = loop
        ? normalizeWheelIndex(currentIndex, values.length)
        : Math.min(Math.max(currentIndex, 0), values.length - 1);

      if (currentValueIndex === valueIndex) {
        syncClipTrack();
        return;
      }

      const targetIndex = loop
        ? nearestLoopIndex(currentIndex, valueIndex, values.length, LOOP_SECTIONS)
        : valueIndex;
      scrollToIndex(targetIndex, behavior);
    },
    [loop, readRawIndex, scrollToIndex, syncClipTrack, values]
  );

  const settleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const wasProgrammatic = isProgrammaticScrollRef.current;
    isProgrammaticScrollRef.current = false;

    const itemHeight = readItemHeight(container);
    if (itemHeight <= 0 || values.length === 0) {
      smoothTargetValueRef.current = null;
      return;
    }

    const lastIndex = values.length - 1;
    const maxScroll = Math.max(container.scrollHeight - container.clientHeight, 0);
    const fractionalIndex = container.scrollTop / itemHeight;
    let rawIndex = stickyRoundIndex(fractionalIndex, WHEEL_STICKY_AMOUNT);

    if (!loop) {
      // Trailing spacer may be a hair short — pin ends to first/last.
      if (container.scrollTop >= maxScroll - 1) {
        rawIndex = lastIndex;
      } else if (container.scrollTop <= 1) {
        rawIndex = 0;
      }
    }

    const valueIndex = loop
      ? normalizeWheelIndex(rawIndex, values.length)
      : Math.min(Math.max(rawIndex, 0), lastIndex);
    const nextValue = values[valueIndex];

    const targetIndex = loop
      ? recenterLoopIndex(rawIndex, values.length, MIDDLE_SECTION)
      : valueIndex;
    const targetTop = targetIndex * itemHeight;
    const section = loop ? Math.floor(rawIndex / values.length) : MIDDLE_SECTION;
    const needsLoopRecenter = loop && section !== MIDDLE_SECTION;

    if (wasProgrammatic) {
      if (needsLoopRecenter) {
        isProgrammaticScrollRef.current = true;
        container.scrollTop = targetTop;
      }
      smoothTargetValueRef.current = null;
      syncClipTrack();
      return;
    }

    const needsSnap = Math.abs(container.scrollTop - targetTop) > 1;

    if (needsLoopRecenter) {
      // Invisible section wrap — keep instant so the list doesn't fly through copies.
      isProgrammaticScrollRef.current = true;
      container.scrollTop = targetTop;
    } else if (needsSnap) {
      isProgrammaticScrollRef.current = true;
      smoothTargetValueRef.current = nextValue;
      container.scrollTo({ top: targetTop, behavior: "smooth" });
    }

    if (nextValue !== selectedValueRef.current) {
      onChange(nextValue);
    }

    if (!needsSnap) {
      smoothTargetValueRef.current = null;
    }
    isUserScrollingRef.current = false;
    wheelAccumRef.current = 0;
    syncClipTrack();
  }, [loop, onChange, syncClipTrack, values]);

  const handleScroll = useCallback(() => {
    syncClipTrack();
    if (isProgrammaticScrollRef.current) return;
    isUserScrollingRef.current = true;
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }
    scrollEndTimerRef.current = setTimeout(settleScroll, WHEEL_SCROLL_END_MS);
  }, [settleScroll, syncClipTrack]);

  useLayoutEffect(() => {
    syncScrollToValue("auto");
    syncClipTrack();
    const raf = requestAnimationFrame(() => {
      syncScrollToValue("auto");
      syncClipTrack();
    });
    return () => cancelAnimationFrame(raf);
  }, [layoutKey, syncClipTrack, syncScrollToValue, value]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScrollEnd = () => {
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
      settleScroll();
    };

    container.addEventListener("scrollend", onScrollEnd);

    const resizeObserver = new ResizeObserver(() => {
      syncScrollToValue("auto");
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scrollend", onScrollEnd);
      resizeObserver.disconnect();
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, [settleScroll, syncScrollToValue]);

  // Mouse-wheel: accumulate delta into multi-item steps; finger drag still uses
  // CSS snap + sticky settle. Loop targets the nearest raw index so wraps stay short.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (values.length === 0) return;

      const itemHeight = readItemHeight(container);
      if (itemHeight <= 0) return;

      if (wheelAccumIdleTimerRef.current) {
        clearTimeout(wheelAccumIdleTimerRef.current);
      }
      wheelAccumIdleTimerRef.current = setTimeout(() => {
        wheelAccumRef.current = 0;
      }, WHEEL_ACCUM_IDLE_MS);

      const threshold = itemHeight * WHEEL_STEP_THRESHOLD_FACTOR;
      const { nextAccum, steps } = consumeWheelSteps(
        wheelAccumRef.current,
        event.deltaY,
        threshold
      );
      wheelAccumRef.current = nextAccum;
      if (steps === 0) return;

      const currentRaw = readRawIndex(container, itemHeight);
      let targetRaw: number;
      if (loop) {
        if (Math.floor(currentRaw / values.length) !== MIDDLE_SECTION) {
          isProgrammaticScrollRef.current = true;
          container.scrollTop =
            recenterLoopIndex(currentRaw, values.length, MIDDLE_SECTION) * itemHeight;
        }
        targetRaw = stepLoopRawIndex(
          readRawIndex(container, itemHeight),
          steps,
          values.length,
          LOOP_SECTIONS,
          MIDDLE_SECTION
        ).rawIndex;
      } else {
        targetRaw = Math.min(Math.max(currentRaw + steps, 0), values.length - 1);
        if (targetRaw === currentRaw) return;
      }

      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }

      const nextValue = values[normalizeWheelIndex(targetRaw, values.length)];
      isUserScrollingRef.current = false;
      smoothTargetValueRef.current = nextValue;
      scrollToIndex(targetRaw, "smooth");
      if (nextValue !== selectedValueRef.current) {
        onChange(nextValue);
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
      if (wheelAccumIdleTimerRef.current) {
        clearTimeout(wheelAccumIdleTimerRef.current);
      }
    };
  }, [loop, onChange, readRawIndex, scrollToIndex, values]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container || values.length === 0) return;

    const itemHeight = readItemHeight(container);
    if (itemHeight <= 0) return;

    const currentRaw = readRawIndex(container, itemHeight);
    let targetRaw: number | null = null;
    let preferDelta = 0;

    switch (event.key) {
      case "ArrowUp":
        preferDelta = -1;
        targetRaw = loop
          ? stepLoopRawIndex(currentRaw, -1, values.length, LOOP_SECTIONS, MIDDLE_SECTION).rawIndex
          : Math.max(currentRaw - 1, 0);
        break;
      case "ArrowDown":
        preferDelta = 1;
        targetRaw = loop
          ? stepLoopRawIndex(currentRaw, 1, values.length, LOOP_SECTIONS, MIDDLE_SECTION).rawIndex
          : Math.min(currentRaw + 1, values.length - 1);
        break;
      case "Home":
        targetRaw = loop
          ? nearestLoopIndex(currentRaw, 0, values.length, LOOP_SECTIONS, -1)
          : 0;
        break;
      case "End":
        targetRaw = loop
          ? nearestLoopIndex(currentRaw, values.length - 1, values.length, LOOP_SECTIONS, 1)
          : values.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    if (targetRaw === currentRaw && preferDelta === 0) return;

    const nextValue = values[normalizeWheelIndex(targetRaw, values.length)];
    isUserScrollingRef.current = false;
    smoothTargetValueRef.current = nextValue;
    scrollToIndex(targetRaw, "smooth");
    if (nextValue !== selectedValueRef.current) {
      onChange(nextValue);
    }
  };

  const committedIndex = getValueIndex(values, value);
  const selectedOptionId = loop
    ? `${ariaLabel}-${value}-${values.length * MIDDLE_SECTION + committedIndex}`
    : `${ariaLabel}-${value}`;

  return (
    <div className={cn("aviala-datepicker-time__wheel", className)}>
      <div className="aviala-datepicker-time__wheel-highlight" aria-hidden />
      <div
        className="aviala-datepicker-time__wheel-fade aviala-datepicker-time__wheel-fade--top"
        aria-hidden
      />
      <div
        className="aviala-datepicker-time__wheel-fade aviala-datepicker-time__wheel-fade--bottom"
        aria-hidden
      />
      <div
        ref={scrollRef}
        className="aviala-datepicker-time__wheel-scroll aviala-focus-ring"
        onScroll={handleScroll}
        role="listbox"
        aria-label={ariaLabel}
        aria-activedescendant={selectedOptionId}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <ul className="aviala-datepicker-time__wheel-list">
          {repeatedValues.map((itemValue, index) => {
            const isCommitted = itemValue === value;
            const optionId = loop ? `${ariaLabel}-${itemValue}-${index}` : `${ariaLabel}-${itemValue}`;

            return (
              <li
                key={optionId}
                id={
                  loop && isCommitted && Math.floor(index / values.length) === MIDDLE_SECTION
                    ? selectedOptionId
                    : optionId
                }
                className="aviala-datepicker-time__wheel-item"
                role="option"
                aria-selected={isCommitted}
              >
                <button
                  type="button"
                  className={cn(
                    "aviala-datepicker-time__wheel-option",
                    typographyVariants({ level: "text" })
                  )}
                  data-selected={isCommitted ? "true" : undefined}
                  tabIndex={-1}
                  onClick={() => {
                    isUserScrollingRef.current = false;
                    smoothTargetValueRef.current = itemValue;
                    scrollToIndex(index, "smooth");
                    if (itemValue !== selectedValueRef.current) {
                      onChange(itemValue);
                    }
                  }}
                >
                  {formatValue(itemValue)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="aviala-datepicker-time__wheel-clip" aria-hidden>
        <div ref={clipTrackRef} className="aviala-datepicker-time__wheel-clip-track">
          {repeatedValues.map((itemValue, index) => (
            <div
              key={`clip-${loop ? `${itemValue}-${index}` : itemValue}`}
              className={cn(
                "aviala-datepicker-time__wheel-clip-item",
                typographyVariants({ level: "text" })
              )}
            >
              {formatValue(itemValue)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
