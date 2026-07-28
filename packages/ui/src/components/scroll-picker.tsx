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
import { typographyVariants } from "./typography";

const LOOP_SECTIONS = 3;
const MIDDLE_SECTION = 1;
const SCROLL_END_DEBOUNCE_MS = 80;

/** Figma Components → Information Collect → ScrollPicker (579:88681) */

function normalizeIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

function readItemHeight(container: HTMLElement): number {
  const item = container.querySelector<HTMLElement>(".aviala-scroll-picker-item");
  if (item) {
    return item.getBoundingClientRect().height;
  }

  const style = getComputedStyle(container);
  const token = style.getPropertyValue("--scroll-picker-item-height").trim();
  const parsed = parseFloat(token);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 26;
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
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
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

    const itemHeight = readItemHeight(container);
    isProgrammaticScrollRef.current = true;
    container.scrollTo({ top: index * itemHeight, behavior });
  }, []);

  const scrollToValue = useCallback(
    (nextValue: T, behavior: ScrollBehavior = "smooth") => {
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
      return;
    }

    const itemHeight = readItemHeight(container);
    if (itemHeight <= 0 || values.length === 0) return;

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

    if (!Object.is(nextValue, selectedValueRef.current)) {
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
    if (!container || values.length === 0) return;

    const itemHeight = readItemHeight(container);
    if (itemHeight <= 0) return;

    const valueIndex = getIndex(value);
    const targetIndex = loop ? values.length * MIDDLE_SECTION + valueIndex : valueIndex;
    const currentIndex = Math.round(container.scrollTop / itemHeight);
    const currentValueIndex = loop
      ? normalizeIndex(currentIndex, values.length)
      : Math.min(Math.max(currentIndex, 0), values.length - 1);
    const inMiddleSection =
      !loop || Math.floor(currentIndex / values.length) === MIDDLE_SECTION;

    if (currentValueIndex === valueIndex && inMiddleSection) return;

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
          className="aviala-scroll-picker-column__scroll"
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
