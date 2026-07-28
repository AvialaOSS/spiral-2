import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import { typographyVariants } from "../typography";

const LOOP_SECTIONS = 3;
const MIDDLE_SECTION = 1;
const SCROLL_END_DEBOUNCE_MS = 80;

type DatePickerTimeWheelColumnProps = {
  values: readonly number[];
  value: number;
  onChange: (value: number) => void;
  "aria-label": string;
  loop?: boolean;
  className?: string;
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
    return item.getBoundingClientRect().height;
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
}: DatePickerTimeWheelColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
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
      isProgrammaticScrollRef.current = true;
      container.scrollTo({ top: index * itemHeight, behavior });
    },
    []
  );

  const scrollToValue = useCallback(
    (nextValue: number, behavior: ScrollBehavior = "smooth") => {
      const valueIndex = getValueIndex(values, nextValue);
      const targetIndex = loop ? values.length * MIDDLE_SECTION + valueIndex : valueIndex;
      scrollToIndex(targetIndex, behavior);
    },
    [loop, scrollToIndex, values]
  );

  const settleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isProgrammaticScrollRef.current) {
      isProgrammaticScrollRef.current = false;
      return;
    }

    const itemHeight = readItemHeight(container);
    if (itemHeight <= 0) return;

    const rawIndex = Math.round(container.scrollTop / itemHeight);
    const valueIndex = loop
      ? normalizeIndex(rawIndex, values.length)
      : Math.min(Math.max(rawIndex, 0), values.length - 1);
    const nextValue = values[valueIndex];

    if (loop) {
      const section = Math.floor(rawIndex / values.length);
      if (section !== MIDDLE_SECTION) {
        isProgrammaticScrollRef.current = true;
        container.scrollTop = (values.length * MIDDLE_SECTION + valueIndex) * itemHeight;
      }
    } else if (rawIndex !== valueIndex) {
      isProgrammaticScrollRef.current = true;
      container.scrollTop = valueIndex * itemHeight;
    }

    if (nextValue !== selectedValueRef.current) {
      onChange(nextValue);
    }

    isUserScrollingRef.current = false;
  }, [loop, onChange, values]);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    isUserScrollingRef.current = true;
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }
    scrollEndTimerRef.current = setTimeout(settleScroll, SCROLL_END_DEBOUNCE_MS);
  }, [settleScroll]);

  useLayoutEffect(() => {
    if (isUserScrollingRef.current) return;

    const container = scrollRef.current;
    if (!container) return;

    const itemHeight = readItemHeight(container);
    if (itemHeight <= 0) return;

    const valueIndex = getValueIndex(values, value);
    const targetIndex = loop ? values.length * MIDDLE_SECTION + valueIndex : valueIndex;
    const currentIndex = Math.round(container.scrollTop / itemHeight);
    const currentValueIndex = loop
      ? normalizeIndex(currentIndex, values.length)
      : Math.min(Math.max(currentIndex, 0), values.length - 1);
    const inMiddleSection =
      !loop || Math.floor(currentIndex / values.length) === MIDDLE_SECTION;

    if (currentValueIndex === valueIndex && inMiddleSection) return;

    scrollToIndex(targetIndex, "auto");
  }, [loop, scrollToIndex, value, values]);

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
                  {formatWheelValue(itemValue)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
