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
  stickyRoundIndex,
  WHEEL_SCROLL_END_MS,
  WHEEL_STEP_THRESHOLD_FACTOR,
  WHEEL_STICKY_AMOUNT,
} from "../../lib/sticky-wheel";
import { typographyVariants } from "../typography";

const LOOP_SECTIONS = 3;
const MIDDLE_SECTION = 1;

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

function normalizeIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
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
  const isUserScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  /** When set, value-driven auto sync must not cancel an in-flight smooth scroll. */
  const smoothTargetValueRef = useRef<number | null>(null);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wheelAccumRef = useRef(0);
  const selectedValueRef = useRef(value);

  selectedValueRef.current = value;

  const repeatedValues = useMemo(() => {
    if (!loop) return [...values];
    return Array.from({ length: LOOP_SECTIONS }, () => values).flat();
  }, [loop, values]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "auto") => {
      const container = scrollRef.current;
      if (!container) return;

      const itemHeight = readItemHeight(container);
      if (itemHeight <= 0) return;
      isProgrammaticScrollRef.current = true;
      container.scrollTo({ top: index * itemHeight, behavior });
    },
    []
  );

  const scrollToValue = useCallback(
    (nextValue: number, behavior: ScrollBehavior = "smooth") => {
      if (behavior === "smooth") {
        smoothTargetValueRef.current = nextValue;
      } else {
        smoothTargetValueRef.current = null;
      }
      const valueIndex = getValueIndex(values, nextValue);
      const targetIndex = loop ? values.length * MIDDLE_SECTION + valueIndex : valueIndex;
      scrollToIndex(targetIndex, behavior);
    },
    [loop, scrollToIndex, values]
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
      const targetIndex = loop ? values.length * MIDDLE_SECTION + valueIndex : valueIndex;
      const currentIndex = Math.round(container.scrollTop / itemHeight);
      const currentValueIndex = loop
        ? normalizeIndex(currentIndex, values.length)
        : Math.min(Math.max(currentIndex, 0), values.length - 1);
      const inMiddleSection =
        !loop || Math.floor(currentIndex / values.length) === MIDDLE_SECTION;

      if (currentValueIndex === valueIndex && inMiddleSection) return;
      scrollToIndex(targetIndex, behavior);
    },
    [loop, scrollToIndex, values]
  );

  const settleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isProgrammaticScrollRef.current) {
      isProgrammaticScrollRef.current = false;
      smoothTargetValueRef.current = null;
      return;
    }

    const itemHeight = readItemHeight(container);
    if (itemHeight <= 0 || values.length === 0) return;

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
      ? normalizeIndex(rawIndex, values.length)
      : Math.min(Math.max(rawIndex, 0), lastIndex);
    const nextValue = values[valueIndex];

    const targetIndex = loop ? values.length * MIDDLE_SECTION + valueIndex : valueIndex;
    const targetTop = targetIndex * itemHeight;
    const section = loop ? Math.floor(rawIndex / values.length) : MIDDLE_SECTION;
    const needsLoopRecenter = loop && section !== MIDDLE_SECTION;
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
  }, [loop, onChange, values]);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    isUserScrollingRef.current = true;
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }
    scrollEndTimerRef.current = setTimeout(settleScroll, WHEEL_SCROLL_END_MS);
  }, [settleScroll]);

  useLayoutEffect(() => {
    syncScrollToValue("auto");
    const raf = requestAnimationFrame(() => {
      syncScrollToValue("auto");
    });
    return () => cancelAnimationFrame(raf);
  }, [layoutKey, syncScrollToValue, value]);

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

  // Sticky mouse-wheel: require clearer intent to leave the current item, then
  // animate one step (finger drag still uses CSS snap + smooth settle).
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (isProgrammaticScrollRef.current || values.length === 0) return;

      const itemHeight = readItemHeight(container);
      if (itemHeight <= 0) return;

      wheelAccumRef.current += event.deltaY;
      const threshold = itemHeight * WHEEL_STEP_THRESHOLD_FACTOR;
      if (Math.abs(wheelAccumRef.current) < threshold) return;

      const direction = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;

      const currentIndex = getValueIndex(values, selectedValueRef.current);
      const nextIndex = loop
        ? normalizeIndex(currentIndex + direction, values.length)
        : Math.min(Math.max(currentIndex + direction, 0), values.length - 1);
      if (nextIndex === currentIndex) return;

      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }

      const nextValue = values[nextIndex];
      isUserScrollingRef.current = false;
      scrollToValue(nextValue, "smooth");
      if (nextValue !== selectedValueRef.current) {
        onChange(nextValue);
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [loop, onChange, scrollToValue, values]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = getValueIndex(values, selectedValueRef.current);
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowUp":
        nextIndex = loop
          ? normalizeIndex(currentIndex - 1, values.length)
          : Math.max(currentIndex - 1, 0);
        break;
      case "ArrowDown":
        nextIndex = loop
          ? normalizeIndex(currentIndex + 1, values.length)
          : Math.min(currentIndex + 1, values.length - 1);
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = values.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextValue = values[nextIndex];
    scrollToValue(nextValue, "smooth");
    if (nextValue !== selectedValueRef.current) {
      onChange(nextValue);
    }
  };

  const selectedOptionId = loop
    ? `${ariaLabel}-${value}-${values.length * MIDDLE_SECTION + getValueIndex(values, value)}`
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
            const isSelected = itemValue === value;
            const optionId = loop ? `${ariaLabel}-${itemValue}-${index}` : `${ariaLabel}-${itemValue}`;

            return (
              <li
                key={optionId}
                id={optionId}
                className="aviala-datepicker-time__wheel-item"
                role="option"
                aria-selected={isSelected}
              >
                <button
                  type="button"
                  className={cn(
                    "aviala-datepicker-time__wheel-option",
                    typographyVariants({ level: "text" })
                  )}
                  data-selected={isSelected ? "true" : undefined}
                  tabIndex={-1}
                  onClick={() => {
                    scrollToValue(itemValue, "smooth");
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
    </div>
  );
}
