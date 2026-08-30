import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
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
} from "../lib/sticky-wheel";
import { typographyVariants } from "./typography";

const LOOP_SECTIONS = WHEEL_LOOP_SECTIONS;
const MIDDLE_SECTION = WHEEL_LOOP_MIDDLE_SECTION;

/** Figma Components → Information Collect → ScrollPicker (579:88681) */

type ColumnMetrics = {
  /** Distance between the top edges of two consecutive items (height + gap). */
  pitch: number;
  /** Scroll offset that centers the item at index 0 inside the viewport. */
  originTop: number;
};

/**
 * Geometry is measured from the live DOM rather than derived from the height
 * token: items carry collapsible block margins and the list is padded by
 * spacer pseudo-elements, so the scroll pitch is not the item height and index
 * 0 does not sit at scrollTop 0.
 */
function readMetrics(container: HTMLElement): ColumnMetrics | null {
  const items = container.querySelectorAll<HTMLElement>(
    ".aviala-scroll-picker-item"
  );
  const first = items[0];
  if (!first) return null;

  const itemHeight = first.offsetHeight;
  const second = items[1];
  const measuredPitch = second
    ? second.offsetTop - first.offsetTop
    : itemHeight;
  const pitch = measuredPitch > 0 ? measuredPitch : itemHeight;
  if (pitch <= 0) return null;

  return {
    pitch,
    originTop: first.offsetTop + itemHeight / 2 - container.clientHeight / 2,
  };
}

function scrollTopForIndex(
  container: HTMLElement,
  metrics: ColumnMetrics,
  index: number
): number {
  const maxScroll = Math.max(
    container.scrollHeight - container.clientHeight,
    0
  );
  return Math.min(
    Math.max(metrics.originTop + index * metrics.pitch, 0),
    maxScroll
  );
}

function fractionalIndexAtScrollTop(
  metrics: ColumnMetrics,
  scrollTop: number
): number {
  return (scrollTop - metrics.originTop) / metrics.pitch;
}

function readRawIndex(container: HTMLElement, metrics: ColumnMetrics): number {
  return Math.round(fractionalIndexAtScrollTop(metrics, container.scrollTop));
}

export type ScrollPickerProps = HTMLAttributes<HTMLDivElement>;

export function ScrollPicker({
  className,
  children,
  ...props
}: ScrollPickerProps) {
  return (
    <div className={cn("aviala-scroll-picker", className)} {...props}>
      {children}
    </div>
  );
}

export type ScrollPickerColumnProps<T = string> = {
  className?: string;
  values: readonly T[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  loop?: boolean;
  formatValue?: (value: T) => ReactNode;
  getValueKey?: (value: T, index: number) => string;
};

export function ScrollPickerColumn<T = string>({
  className,
  values,
  value,
  onChange,
  "aria-label": ariaLabel,
  loop = true,
  formatValue,
  getValueKey,
}: ScrollPickerColumnProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const clipTrackRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  /** When set, value-driven auto sync must not cancel an in-flight smooth scroll. */
  const smoothTargetValueRef = useRef<T | null>(null);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const wheelAccumRef = useRef(0);
  const wheelAccumIdleTimerRef = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);
  const selectedValueRef = useRef(value);
  const reactId = useId();

  selectedValueRef.current = value;

  const getIndex = useCallback(
    (candidate: T) => {
      const index = values.findIndex((item) => Object.is(item, candidate));
      return index >= 0 ? index : 0;
    },
    [values]
  );

  const repeatedValues = useMemo(() => {
    if (!loop) return [...values];
    return Array.from({ length: LOOP_SECTIONS }, () => values).flat();
  }, [loop, values]);

  const syncClipTrack = useCallback(() => {
    const container = scrollRef.current;
    const track = clipTrackRef.current;
    if (!container || !track) return;
    // Clip track mirrors the list including spacer pseudo-elements; align the
    // highlight band to the same content Y as the main scroller's center strip.
    const band = container.parentElement?.querySelector<HTMLElement>(
      ".aviala-scroll-picker-column__highlight"
    );
    const bandHeight = band?.offsetHeight || 26;
    const offset =
      container.scrollTop + (container.clientHeight - bandHeight) / 2;
    track.style.transform = `translate3d(0, ${-offset}px, 0)`;
  }, []);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "auto") => {
      const container = scrollRef.current;
      if (!container) return;

      const metrics = readMetrics(container);
      if (!metrics) return;

      isProgrammaticScrollRef.current = true;
      container.scrollTo({
        top: scrollTopForIndex(container, metrics, index),
        behavior,
      });
      if (behavior === "auto") {
        syncClipTrack();
      } else {
        requestAnimationFrame(syncClipTrack);
      }
    },
    [syncClipTrack]
  );

  const settleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const wasProgrammatic = isProgrammaticScrollRef.current;
    isProgrammaticScrollRef.current = false;

    const metrics = readMetrics(container);
    if (!metrics || values.length === 0) {
      smoothTargetValueRef.current = null;
      return;
    }

    const lastIndex = values.length - 1;
    const maxScroll = Math.max(
      container.scrollHeight - container.clientHeight,
      0
    );
    let rawIndex = stickyRoundIndex(
      fractionalIndexAtScrollTop(metrics, container.scrollTop),
      WHEEL_STICKY_AMOUNT
    );

    if (!loop) {
      // The trailing spacer may be a hair too short to fully centre the edge
      // items; treat a scroll pinned to either end as that end's index so the
      // first/last option stays selectable.
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
    const targetTop = scrollTopForIndex(container, metrics, targetIndex);
    const section = loop
      ? Math.floor(rawIndex / values.length)
      : MIDDLE_SECTION;
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
      isProgrammaticScrollRef.current = true;
      container.scrollTop = targetTop;
    } else if (needsSnap) {
      isProgrammaticScrollRef.current = true;
      smoothTargetValueRef.current = nextValue;
      container.scrollTo({ top: targetTop, behavior: "smooth" });
    }

    if (!Object.is(nextValue, selectedValueRef.current)) {
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
    if (isUserScrollingRef.current) return;
    // Click/keyboard already started a smooth scroll to this value — don't snap.
    if (
      smoothTargetValueRef.current != null &&
      Object.is(smoothTargetValueRef.current, value)
    ) {
      return;
    }

    const container = scrollRef.current;
    if (!container || values.length === 0) return;

    const metrics = readMetrics(container);
    if (!metrics) return;

    const valueIndex = getIndex(value);
    const currentRaw = readRawIndex(container, metrics);
    const currentValueIndex = loop
      ? normalizeWheelIndex(currentRaw, values.length)
      : Math.min(Math.max(currentRaw, 0), values.length - 1);

    if (currentValueIndex === valueIndex) {
      syncClipTrack();
      return;
    }

    const targetIndex = loop
      ? nearestLoopIndex(currentRaw, valueIndex, values.length, LOOP_SECTIONS)
      : valueIndex;
    const targetTop = scrollTopForIndex(container, metrics, targetIndex);

    if (Math.abs(container.scrollTop - targetTop) <= 1) {
      syncClipTrack();
      return;
    }

    scrollToIndex(targetIndex, "auto");
  }, [getIndex, loop, scrollToIndex, syncClipTrack, value, values.length]);

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
    return () => {
      container.removeEventListener("scrollend", onScrollEnd);
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, [settleScroll]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (values.length === 0) return;

      const metrics = readMetrics(container);
      if (!metrics) return;

      if (wheelAccumIdleTimerRef.current) {
        clearTimeout(wheelAccumIdleTimerRef.current);
      }
      wheelAccumIdleTimerRef.current = setTimeout(() => {
        wheelAccumRef.current = 0;
      }, WHEEL_ACCUM_IDLE_MS);

      const threshold = metrics.pitch * WHEEL_STEP_THRESHOLD_FACTOR;
      const { nextAccum, steps } = consumeWheelSteps(
        wheelAccumRef.current,
        event.deltaY,
        threshold
      );
      wheelAccumRef.current = nextAccum;
      if (steps === 0) return;

      const currentRaw = readRawIndex(container, metrics);
      let targetRaw: number;
      if (loop) {
        if (Math.floor(currentRaw / values.length) !== MIDDLE_SECTION) {
          isProgrammaticScrollRef.current = true;
          container.scrollTop = scrollTopForIndex(
            container,
            metrics,
            recenterLoopIndex(currentRaw, values.length, MIDDLE_SECTION)
          );
        }
        targetRaw = stepLoopRawIndex(
          readRawIndex(container, metrics),
          steps,
          values.length,
          LOOP_SECTIONS,
          MIDDLE_SECTION
        ).rawIndex;
      } else {
        targetRaw = Math.min(
          Math.max(currentRaw + steps, 0),
          values.length - 1
        );
        if (targetRaw === currentRaw) return;
      }

      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }

      const nextValue = values[normalizeWheelIndex(targetRaw, values.length)];
      isUserScrollingRef.current = false;
      smoothTargetValueRef.current = nextValue;
      scrollToIndex(targetRaw, "smooth");
      if (!Object.is(nextValue, selectedValueRef.current)) {
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
  }, [loop, onChange, scrollToIndex, values]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container || values.length === 0) return;

    const metrics = readMetrics(container);
    if (!metrics) return;

    const currentRaw = readRawIndex(container, metrics);
    let targetRaw: number | null = null;

    switch (event.key) {
      case "ArrowUp":
        targetRaw = loop
          ? stepLoopRawIndex(
              currentRaw,
              -1,
              values.length,
              LOOP_SECTIONS,
              MIDDLE_SECTION
            ).rawIndex
          : Math.max(currentRaw - 1, 0);
        break;
      case "ArrowDown":
        targetRaw = loop
          ? stepLoopRawIndex(
              currentRaw,
              1,
              values.length,
              LOOP_SECTIONS,
              MIDDLE_SECTION
            ).rawIndex
          : Math.min(currentRaw + 1, values.length - 1);
        break;
      case "Home":
        targetRaw = loop
          ? nearestLoopIndex(currentRaw, 0, values.length, LOOP_SECTIONS, -1)
          : 0;
        break;
      case "End":
        targetRaw = loop
          ? nearestLoopIndex(
              currentRaw,
              values.length - 1,
              values.length,
              LOOP_SECTIONS,
              1
            )
          : values.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextValue = values[normalizeWheelIndex(targetRaw, values.length)];
    isUserScrollingRef.current = false;
    smoothTargetValueRef.current = nextValue;
    scrollToIndex(targetRaw, "smooth");
    if (!Object.is(nextValue, selectedValueRef.current)) {
      onChange(nextValue);
    }
  };

  const selectedOptionId = `${reactId}-${getIndex(value)}`;

  return (
    <div className={cn("aviala-scroll-picker-column", className)}>
      <div className="aviala-scroll-picker-column__viewport">
        <div className="aviala-scroll-picker-column__highlight" aria-hidden />
        <div
          ref={scrollRef}
          className="aviala-scroll-picker-column__scroll aviala-focus-ring"
          onScroll={handleScroll}
          role="listbox"
          aria-label={ariaLabel}
          aria-activedescendant={selectedOptionId}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <ul className="aviala-scroll-picker-column__list">
            {repeatedValues.map((itemValue, index) => {
              const isCommitted = Object.is(itemValue, value);
              const valueIndex = loop
                ? normalizeWheelIndex(index, values.length)
                : index;
              const optionId = `${reactId}-${loop ? index : valueIndex}`;
              const key =
                getValueKey?.(itemValue, index) ??
                `${String(itemValue)}-${index}`;
              const useSelectedId =
                isCommitted &&
                (!loop || Math.floor(index / values.length) === MIDDLE_SECTION);

              return (
                <li key={key} className="contents">
                  <ScrollPickerItem
                    id={useSelectedId ? selectedOptionId : optionId}
                    selected={isCommitted}
                    onSelect={() => {
                      isUserScrollingRef.current = false;
                      smoothTargetValueRef.current = itemValue;
                      scrollToIndex(index, "smooth");
                      if (!Object.is(itemValue, selectedValueRef.current)) {
                        onChange(itemValue);
                      }
                    }}
                  >
                    {formatValue ? formatValue(itemValue) : String(itemValue)}
                  </ScrollPickerItem>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="aviala-scroll-picker-column__clip" aria-hidden>
          <div
            ref={clipTrackRef}
            className="aviala-scroll-picker-column__clip-track"
          >
            <div className="aviala-scroll-picker-column__list">
              {repeatedValues.map((itemValue, index) => {
                const key =
                  getValueKey?.(itemValue, index) ??
                  `clip-${String(itemValue)}-${index}`;
                return (
                  <div
                    key={key}
                    className={cn(
                      "aviala-scroll-picker-column__clip-item",
                      typographyVariants({ level: "text" })
                    )}
                  >
                    {formatValue ? formatValue(itemValue) : String(itemValue)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type ScrollPickerItemProps = {
  id?: string;
  selected?: boolean;
  children?: ReactNode;
  className?: string;
  onSelect?: () => void;
};

export function ScrollPickerItem({
  id,
  selected = false,
  children,
  className,
  onSelect,
}: ScrollPickerItemProps) {
  return (
    <button
      type="button"
      id={id}
      role="option"
      aria-selected={selected}
      className={cn(
        "aviala-scroll-picker-item",
        typographyVariants({ level: "text" }),
        className
      )}
      data-selected={selected ? "true" : undefined}
      tabIndex={-1}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}
