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
  stickyRoundIndex,
  WHEEL_SCROLL_END_MS,
  WHEEL_STEP_THRESHOLD_FACTOR,
  WHEEL_STICKY_AMOUNT,
} from "../lib/sticky-wheel";
import { typographyVariants } from "./typography";

const LOOP_SECTIONS = 3;
const MIDDLE_SECTION = 1;

/** Figma Components → Information Collect → ScrollPicker (579:88681) */

function normalizeIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

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
  const items = container.querySelectorAll<HTMLElement>(".aviala-scroll-picker-item");
  const first = items[0];
  if (!first) return null;

  const itemHeight = first.offsetHeight;
  const second = items[1];
  const measuredPitch = second ? second.offsetTop - first.offsetTop : itemHeight;
  const pitch = measuredPitch > 0 ? measuredPitch : itemHeight;
  if (pitch <= 0) return null;

  return {
    pitch,
    originTop: first.offsetTop + itemHeight / 2 - container.clientHeight / 2,
  };
}

function scrollTopForIndex(container: HTMLElement, metrics: ColumnMetrics, index: number): number {
  const maxScroll = Math.max(container.scrollHeight - container.clientHeight, 0);
  return Math.min(Math.max(metrics.originTop + index * metrics.pitch, 0), maxScroll);
}

function fractionalIndexAtScrollTop(metrics: ColumnMetrics, scrollTop: number): number {
  return (scrollTop - metrics.originTop) / metrics.pitch;
}

export type ScrollPickerProps = HTMLAttributes<HTMLDivElement>;

export function ScrollPicker({ className, children, ...props }: ScrollPickerProps) {
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
  const isUserScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  /** When set, value-driven auto sync must not cancel an in-flight smooth scroll. */
  const smoothTargetValueRef = useRef<T | null>(null);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wheelAccumRef = useRef(0);
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

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "auto") => {
    const container = scrollRef.current;
    if (!container) return;

    const metrics = readMetrics(container);
    if (!metrics) return;

    isProgrammaticScrollRef.current = true;
    container.scrollTo({ top: scrollTopForIndex(container, metrics, index), behavior });
  }, []);

  const scrollToValue = useCallback(
    (nextValue: T, behavior: ScrollBehavior = "smooth") => {
      if (behavior === "smooth") {
        smoothTargetValueRef.current = nextValue;
      } else {
        smoothTargetValueRef.current = null;
      }
      const valueIndex = getIndex(nextValue);
      const targetIndex = loop ? values.length * MIDDLE_SECTION + valueIndex : valueIndex;
      scrollToIndex(targetIndex, behavior);
    },
    [getIndex, loop, scrollToIndex, values.length]
  );

  const settleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isProgrammaticScrollRef.current) {
      isProgrammaticScrollRef.current = false;
      smoothTargetValueRef.current = null;
      return;
    }

    const metrics = readMetrics(container);
    if (!metrics || values.length === 0) return;

    const lastIndex = values.length - 1;
    const maxScroll = Math.max(container.scrollHeight - container.clientHeight, 0);
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
      ? normalizeIndex(rawIndex, values.length)
      : Math.min(Math.max(rawIndex, 0), lastIndex);
    const nextValue = values[valueIndex];

    const targetIndex = loop ? values.length * MIDDLE_SECTION + valueIndex : valueIndex;
    const targetTop = scrollTopForIndex(container, metrics, targetIndex);
    const section = loop ? Math.floor(rawIndex / values.length) : MIDDLE_SECTION;
    const needsLoopRecenter = loop && section !== MIDDLE_SECTION;
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
    const targetIndex = loop ? values.length * MIDDLE_SECTION + valueIndex : valueIndex;
    const targetTop = scrollTopForIndex(container, metrics, targetIndex);

    if (Math.abs(container.scrollTop - targetTop) <= 1) return;

    scrollToIndex(targetIndex, "auto");
  }, [getIndex, loop, scrollToIndex, value, values.length]);

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
      if (isProgrammaticScrollRef.current || values.length === 0) return;

      const metrics = readMetrics(container);
      if (!metrics) return;

      wheelAccumRef.current += event.deltaY;
      const threshold = metrics.pitch * WHEEL_STEP_THRESHOLD_FACTOR;
      if (Math.abs(wheelAccumRef.current) < threshold) return;

      const direction = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;

      const currentIndex = getIndex(selectedValueRef.current);
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
      if (!Object.is(nextValue, selectedValueRef.current)) {
        onChange(nextValue);
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [getIndex, loop, onChange, scrollToValue, values]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = getIndex(selectedValueRef.current);
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
              const isSelected = Object.is(itemValue, value);
              const valueIndex = loop ? normalizeIndex(index, values.length) : index;
              const optionId = `${reactId}-${loop ? index : valueIndex}`;
              const key =
                getValueKey?.(itemValue, index) ??
                `${String(itemValue)}-${index}`;

              return (
                <li key={key} className="contents">
                  <ScrollPickerItem
                    id={isSelected ? selectedOptionId : optionId}
                    selected={isSelected}
                    onSelect={() => {
                      scrollToValue(itemValue, "smooth");
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
