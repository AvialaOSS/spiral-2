import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  DirectionArrowLeftLight,
  DirectionArrowRightLight,
  TimeAndDateClock,
  TimeAndDateDate,
} from "@aviala-design/icons";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { useOverlayPortalContainer } from "../../overlay/overlay-container";
import { renderSlotIcon } from "../../lib/render-slot-icon";
import { useRtl } from "../../config";
import { useLocale, useLocaleMessages } from "../../locale";
import { typographyVariants } from "../typography";
import { useResolvedControlError } from "../form-field";
import {
  DatePickerProvider,
  useDatePickerContext,
  type DatePickerMode,
  type DatePickerPanel,
  type DatePickerSize,
  type DatePickerTimeValue,
} from "./date-picker-context";
import {
  addMonths,
  applyTimeToDate,
  formatDisplayDate,
  formatDisplayDateTime,
  formatIsoDate,
  formatMonthYear,
  formatTimeValue,
  getCalendarDays,
  getRangeSelectionPosition,
  isDateDisabled,
  isDateInRange,
  isSameDay,
  isSameMonth,
  normalizeRange,
  parseDateInput,
  parseDateRangeInput,
  startOfDay,
  type DateRange,
  type RangeSelectionPosition,
} from "./date-utils";
import type { LocaleDatePicker } from "../../locale/interface";

import {
  SegmentatorGroup,
  SegmentatorItem,
} from "../segmentator";
import { DatePickerMonthYearWheels } from "./date-picker-month-wheels";
import { TimePickerWheels } from "../time-picker/time-picker-wheels";

export type { DatePickerMode, DatePickerPanel, DatePickerSize, DatePickerTimeValue } from "./date-picker-context";

type DatePickerBaseProps = {
  children: ReactNode;
  mode?: DatePickerMode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  size?: DatePickerSize;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  /** Figma DatePickerLIstGroup — footer date/time Segmentator */
  enableTime?: boolean;
  timeValue?: DatePickerTimeValue;
  defaultTimeValue?: DatePickerTimeValue;
  onTimeChange?: (value: DatePickerTimeValue) => void;
};

export type DatePickerSingleProps = DatePickerBaseProps & {
  mode?: "single";
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
};

export type DatePickerRangeProps = DatePickerBaseProps & {
  mode: "range";
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
};

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;


function getInitialViewMonth(
  mode: DatePickerMode,
  singleValue?: Date,
  rangeValue?: DateRange
): Date {
  if (mode === "single" && singleValue) return startOfDay(singleValue);
  if (mode === "range") {
    if (rangeValue?.from) return startOfDay(rangeValue.from);
    if (rangeValue?.to) return startOfDay(rangeValue.to);
  }
  return startOfDay(new Date());
}

/**
 * Radix Popover closes on `window` blur (e.g. focusing DevTools). Suppress only
 * blur-initiated closes; pointer-down and Escape must still dismiss on first interaction.
 */
export function DatePicker(props: DatePickerProps) {
  const {
    children,
    mode = "single",
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    size = "regular",
    minDate,
    maxDate,
    className,
    enableTime = true,
    timeValue: timeValueProp,
    defaultTimeValue = { hours: 17, minutes: 0 },
    onTimeChange,
  } = props;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalSingle, setInternalSingle] = useState<Date | undefined>(() =>
    mode === "single" ? (props as DatePickerSingleProps).defaultValue : undefined
  );
  const [internalRange, setInternalRange] = useState<DateRange>(() =>
    mode === "range" ? (props as DatePickerRangeProps).defaultValue ?? {} : {}
  );
  const [rangeDraftFrom, setRangeDraftFrom] = useState<Date | undefined>(undefined);
  const [activePanel, setActivePanel] = useState<DatePickerPanel>("date");
  const [internalTime, setInternalTime] = useState<DatePickerTimeValue>(defaultTimeValue);

  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : internalOpen;

  const timeValue =
    timeValueProp !== undefined ? timeValueProp : internalTime;

  const setTimeValue = useCallback(
    (next: DatePickerTimeValue) => {
      if (timeValueProp === undefined) {
        setInternalTime(next);
      }
      onTimeChange?.(next);

      // Keep committed Date in sync with the time wheels when a day is selected.
      if (!enableTime) return;
      if (mode === "single") {
        const current =
          (props as DatePickerSingleProps).value !== undefined
            ? (props as DatePickerSingleProps).value
            : internalSingle;
        if (!current) return;
        const controlled = (props as DatePickerSingleProps).value !== undefined;
        const merged = applyTimeToDate(current, next.hours, next.minutes);
        if (!controlled) {
          setInternalSingle(merged);
        }
        (props as DatePickerSingleProps).onValueChange?.(merged);
        return;
      }

      const currentRange =
        (props as DatePickerRangeProps).value !== undefined
          ? ((props as DatePickerRangeProps).value ?? {})
          : internalRange;
      if (!currentRange.from && !currentRange.to) return;
      const controlled = (props as DatePickerRangeProps).value !== undefined;
      const merged: DateRange = {
        from: currentRange.from
          ? applyTimeToDate(currentRange.from, next.hours, next.minutes)
          : undefined,
        to: currentRange.to
          ? applyTimeToDate(currentRange.to, next.hours, next.minutes)
          : undefined,
      };
      if (!controlled) {
        setInternalRange(merged);
      }
      (props as DatePickerRangeProps).onValueChange?.(merged);
    },
    [
      enableTime,
      internalRange,
      internalSingle,
      mode,
      onTimeChange,
      props,
      timeValueProp,
    ]
  );

  const singleValue =
    mode === "single"
      ? (props as DatePickerSingleProps).value !== undefined
        ? (props as DatePickerSingleProps).value
        : internalSingle
      : undefined;

  const rangeValue =
    mode === "range"
      ? (props as DatePickerRangeProps).value !== undefined
        ? ((props as DatePickerRangeProps).value ?? {})
        : internalRange
      : { from: rangeDraftFrom };

  const [viewMonth, setViewMonth] = useState(() =>
    getInitialViewMonth(mode, singleValue, mode === "range" ? rangeValue : undefined)
  );
  const [focusedDay, setFocusedDay] = useState<Date | null>(null);
  const windowBlurCloseRef = useRef(false);
  const pointerDownCloseRef = useRef(false);

  useEffect(() => {
    const markWindowBlur = () => {
      windowBlurCloseRef.current = true;
    };
    window.addEventListener("blur", markWindowBlur, true);
    return () => window.removeEventListener("blur", markWindowBlur, true);
  }, []);

  useEffect(() => {
    if (!open) {
      pointerDownCloseRef.current = false;
      setRangeDraftFrom(undefined);
      setActivePanel("date");
      return;
    }

    setFocusedDay((current) => {
      if (current) return current;
      if (mode === "single" && singleValue) return startOfDay(singleValue);
      const rangeAnchor =
        mode === "range" ? rangeValue.from ?? rangeValue.to : undefined;
      if (rangeAnchor) return startOfDay(rangeAnchor);
      return startOfDay(new Date());
    });

    const markPointerDown = () => {
      pointerDownCloseRef.current = true;
    };
    document.addEventListener("pointerdown", markPointerDown, true);
    return () => document.removeEventListener("pointerdown", markPointerDown, true);
  }, [mode, open, rangeValue.from, rangeValue.to, singleValue]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (disabled && nextOpen) return;
      if (!nextOpen && windowBlurCloseRef.current && !pointerDownCloseRef.current) {
        windowBlurCloseRef.current = false;
        return;
      }
      windowBlurCloseRef.current = false;
      pointerDownCloseRef.current = false;
      if (!isOpenControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [disabled, isOpenControlled, onOpenChange]
  );

  const commitSingle = useCallback(
    (next: Date | undefined) => {
      if (mode !== "single") return;
      const controlled = (props as DatePickerSingleProps).value !== undefined;
      if (!controlled) {
        setInternalSingle(next);
      }
      (props as DatePickerSingleProps).onValueChange?.(next);
    },
    [mode, props]
  );

  const commitRange = useCallback(
    (next: DateRange) => {
      if (mode !== "range") return;
      const controlled = (props as DatePickerRangeProps).value !== undefined;
      if (!controlled) {
        setInternalRange(next);
      }
      (props as DatePickerRangeProps).onValueChange?.(next);
    },
    [mode, props]
  );

  const commitTypedValue = useCallback(
    (text: string) => {
      const trimmed = text.trim();

      if (mode === "single") {
        if (!trimmed) {
          commitSingle(undefined);
          return true;
        }
        const parsed = parseDateInput(trimmed);
        if (!parsed) return false;
        if (isDateDisabled(parsed.date, minDate, maxDate)) return false;

        const hours = parsed.hours ?? timeValue.hours;
        const minutes = parsed.minutes ?? timeValue.minutes;
        if (enableTime && (parsed.hours != null || parsed.minutes != null)) {
          setTimeValue({ hours, minutes });
        }

        const next = enableTime
          ? applyTimeToDate(parsed.date, hours, minutes)
          : parsed.date;
        commitSingle(next);
        setViewMonth(new Date(next.getFullYear(), next.getMonth(), 1));
        setFocusedDay(startOfDay(next));
        return true;
      }

      if (!trimmed) {
        setRangeDraftFrom(undefined);
        commitRange({});
        return true;
      }

      const parsedRange = parseDateRangeInput(trimmed);
      if (!parsedRange) return false;
      if (parsedRange.from && isDateDisabled(parsedRange.from, minDate, maxDate)) {
        return false;
      }
      if (parsedRange.to && isDateDisabled(parsedRange.to, minDate, maxDate)) {
        return false;
      }

      const withTime = (date: Date) =>
        enableTime
          ? applyTimeToDate(date, timeValue.hours, timeValue.minutes)
          : date;

      const next: DateRange = {
        from: parsedRange.from ? withTime(parsedRange.from) : undefined,
        to: parsedRange.to ? withTime(parsedRange.to) : undefined,
      };
      setRangeDraftFrom(next.to ? undefined : next.from ? startOfDay(next.from) : undefined);
      commitRange(next);
      const anchor = next.from ?? next.to;
      if (anchor) {
        setViewMonth(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
        setFocusedDay(startOfDay(anchor));
      }
      return true;
    },
    [
      commitRange,
      commitSingle,
      enableTime,
      maxDate,
      minDate,
      mode,
      setTimeValue,
      timeValue.hours,
      timeValue.minutes,
    ]
  );

  const selectDate = useCallback(
    (date: Date, options?: { close?: boolean; switchToTime?: boolean }) => {
      if (disabled || isDateDisabled(date, minDate, maxDate)) return;
      const day = startOfDay(date);
      setFocusedDay(day);

      if (!isSameMonth(day, viewMonth)) {
        setViewMonth(new Date(day.getFullYear(), day.getMonth(), 1));
      }

      const switchToTime = options?.switchToTime ?? enableTime;
      const shouldClose = options?.close ?? !enableTime;

      if (mode === "single") {
        const next = enableTime
          ? applyTimeToDate(day, timeValue.hours, timeValue.minutes)
          : day;
        commitSingle(next);
        if (switchToTime) {
          setActivePanel("time");
        } else if (shouldClose) {
          handleOpenChange(false);
        }
        return;
      }

      const currentFrom = rangeDraftFrom ?? rangeValue.from;
      const currentTo = rangeValue.to;
      const withTime = (d: Date) =>
        enableTime ? applyTimeToDate(d, timeValue.hours, timeValue.minutes) : d;

      if (!currentFrom || (currentFrom && currentTo)) {
        setRangeDraftFrom(day);
        commitRange({ from: withTime(day), to: undefined });
        return;
      }

      if (isSameDay(day, currentFrom)) {
        commitRange({ from: withTime(day), to: withTime(day) });
        setRangeDraftFrom(undefined);
        if (switchToTime) {
          setActivePanel("time");
        } else if (shouldClose) {
          handleOpenChange(false);
        }
        return;
      }

      const normalized = normalizeRange(currentFrom, day);
      commitRange({
        from: normalized.from ? withTime(normalized.from) : undefined,
        to: normalized.to ? withTime(normalized.to) : undefined,
      });
      setRangeDraftFrom(undefined);
      if (switchToTime) {
        setActivePanel("time");
      } else if (shouldClose) {
        handleOpenChange(false);
      }
    },
    [
      commitRange,
      commitSingle,
      disabled,
      enableTime,
      handleOpenChange,
      maxDate,
      minDate,
      mode,
      rangeDraftFrom,
      rangeValue.from,
      rangeValue.to,
      timeValue.hours,
      timeValue.minutes,
      viewMonth,
    ]
  );

  const contextValue = useMemo(
    () => ({
      open,
      setOpen: handleOpenChange,
      disabled,
      size,
      mode,
      viewMonth,
      setViewMonth,
      singleValue,
      rangeValue:
        mode === "range"
          ? rangeDraftFrom
            ? { from: rangeDraftFrom, to: rangeValue.to }
            : rangeValue
          : rangeValue,
      selectDate,
      commitTypedValue,
      minDate,
      maxDate,
      focusedDay,
      setFocusedDay,
      enableTime,
      activePanel,
      setActivePanel,
      timeValue,
      setTimeValue,
    }),
    [
      activePanel,
      commitTypedValue,
      disabled,
      enableTime,
      focusedDay,
      handleOpenChange,
      maxDate,
      minDate,
      mode,
      open,
      rangeDraftFrom,
      rangeValue,
      selectDate,
      singleValue,
      size,
      timeValue,
      setTimeValue,
      viewMonth,
    ]
  );

  return (
    <DatePickerProvider value={contextValue}>
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange} modal={false}>
        <div className={cn("inline-flex", className)}>{children}</div>
      </PopoverPrimitive.Root>
    </DatePickerProvider>
  );
}

export type DatePickerTriggerProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "size" | "onChange"
> & {
  size?: DatePickerSize;
  allRound?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  placeholder?: string;
  rangePlaceholder?: string;
  error?: boolean;
  displayValue?: ReactNode;
  rangeSeparator?: string;
  className?: string;
  /** When false, shows a read-only value instead of an editable input. Default true. */
  editable?: boolean;
};

function formatTriggerValue(
  mode: DatePickerMode,
  singleValue: Date | undefined,
  rangeValue: DateRange,
  enableTime: boolean,
  timeValue: DatePickerTimeValue,
  rangeSeparator: string
): string | null {
  if (mode === "single") {
    if (!singleValue) return null;
    return enableTime
      ? formatDisplayDateTime(singleValue, timeValue.hours, timeValue.minutes)
      : formatIsoDate(singleValue);
  }

  if (rangeValue.from && rangeValue.to) {
    return enableTime
      ? `${formatDisplayDateTime(rangeValue.from, timeValue.hours, timeValue.minutes)}${rangeSeparator}${formatDisplayDateTime(rangeValue.to, timeValue.hours, timeValue.minutes)}`
      : `${formatIsoDate(rangeValue.from)}${rangeSeparator}${formatIsoDate(rangeValue.to)}`;
  }

  if (rangeValue.from) {
    return enableTime
      ? `${formatDisplayDateTime(rangeValue.from, timeValue.hours, timeValue.minutes)}${rangeSeparator}…`
      : `${formatIsoDate(rangeValue.from)}${rangeSeparator}…`;
  }

  return null;
}

export const DatePickerTrigger = forwardRef<HTMLInputElement, DatePickerTriggerProps>(
  (
    {
      className,
      size: sizeProp,
      allRound = false,
      leftIcon,
      rightIcon,
      placeholder,
      rangePlaceholder,
      error,
      displayValue,
      rangeSeparator = " - ",
      disabled: disabledProp,
      editable = true,
      onFocus,
      onBlur,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("DatePicker");
    const {
      open,
      setOpen,
      disabled: disabledContext,
      size: sizeContext,
      mode,
      singleValue,
      rangeValue,
      enableTime,
      timeValue,
      commitTypedValue,
    } = useDatePickerContext();
    const size = sizeProp ?? sizeContext;
    const disabled = disabledProp ?? disabledContext;
    const resolvedError = useResolvedControlError(error);
    const resolvedPlaceholder = placeholder ?? locale.placeholder;
    const resolvedRangePlaceholder = rangePlaceholder ?? locale.rangePlaceholder;
    const inputRef = useRef<HTMLInputElement>(null);
    const editingRef = useRef(false);

    const setInputRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const formatted =
      displayValue ??
      formatTriggerValue(
        mode,
        singleValue,
        rangeValue,
        enableTime,
        timeValue,
        rangeSeparator
      );

    const defaultPlaceholder = enableTime
      ? locale.placeholderWithTime
      : resolvedPlaceholder;
    const emptyPlaceholder =
      mode === "range" ? resolvedRangePlaceholder : defaultPlaceholder;
    const formattedText = typeof formatted === "string" ? formatted : null;
    const [draft, setDraft] = useState(formattedText ?? "");

    useEffect(() => {
      if (editingRef.current) return;
      setDraft(formattedText ?? "");
    }, [formattedText]);

    const commitDraft = useCallback(() => {
      const nextText = draft;
      const ok = commitTypedValue(nextText);
      if (!ok) {
        setDraft(formattedText ?? "");
      }
      return ok;
    }, [commitTypedValue, draft, formattedText]);

    const openPicker = () => {
      if (disabled) return;
      setOpen(true);
    };

    const showEditableInput = editable && displayValue == null;

    if (!showEditableInput) {
      const hasValue = formatted != null && formatted !== false;
      return (
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            className={cn("aviala-datepicker-trigger aviala-focus-ring", className)}
            data-size={size}
            data-all-round={allRound ? "true" : "false"}
            data-state={open ? "open" : "closed"}
            data-error={resolvedError ? "true" : undefined}
            disabled={disabled}
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            {renderSlotIcon(
              leftIcon ?? <TimeAndDateDate level="text" biggerSize aria-hidden />,
              "aviala-datepicker-trigger__slot"
            )}
            <span className="aviala-datepicker-trigger__field">
              <span
                className={cn(
                  "aviala-datepicker-trigger__value",
                  typographyVariants({ level: "text" })
                )}
                data-placeholder={hasValue ? undefined : "true"}
              >
                {hasValue ? formatted : emptyPlaceholder}
              </span>
            </span>
            {renderSlotIcon(rightIcon, "aviala-datepicker-trigger__slot")}
          </button>
        </PopoverPrimitive.Trigger>
      );
    }

    return (
      <PopoverPrimitive.Anchor asChild>
        <div
          className={cn("aviala-datepicker-trigger aviala-focus-ring", className)}
          data-size={size}
          data-all-round={allRound ? "true" : "false"}
          data-state={open ? "open" : "closed"}
          data-error={resolvedError ? "true" : undefined}
          data-disabled={disabled ? "true" : undefined}
          onMouseDown={(event) => {
            if (disabled) return;
            if (event.target === inputRef.current) return;
            event.preventDefault();
            inputRef.current?.focus();
            openPicker();
          }}
        >
          {renderSlotIcon(
            leftIcon ?? <TimeAndDateDate level="text" biggerSize aria-hidden />,
            "aviala-datepicker-trigger__slot"
          )}
          <span className="aviala-datepicker-trigger__field">
            <input
              ref={setInputRefs}
              type="text"
              className={cn(
                "aviala-datepicker-trigger__input",
                typographyVariants({ level: "text" })
              )}
              value={draft}
              placeholder={emptyPlaceholder}
              disabled={disabled}
              aria-expanded={open}
              aria-haspopup="dialog"
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setDraft(event.target.value)}
              onFocus={(event) => {
                editingRef.current = true;
                openPicker();
                onFocus?.(event);
              }}
              onBlur={(event) => {
                editingRef.current = false;
                window.setTimeout(() => {
                  const active = document.activeElement;
                  if (
                    active?.closest(
                      ".aviala-datepicker-content, .aviala-datepicker-trigger"
                    )
                  ) {
                    return;
                  }
                  commitDraft();
                }, 0);
                onBlur?.(event);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitDraft();
                }
                if (event.key === "Escape") {
                  setDraft(formattedText ?? "");
                  setOpen(false);
                }
                if (event.key === "ArrowDown" && !open) {
                  event.preventDefault();
                  openPicker();
                }
                onKeyDown?.(event);
              }}
              {...props}
            />
          </span>
          {renderSlotIcon(rightIcon, "aviala-datepicker-trigger__slot")}
        </div>
      </PopoverPrimitive.Anchor>
    );
  }
);
DatePickerTrigger.displayName = "DatePickerTrigger";

export type DatePickerContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  portalled?: boolean;
};

export const DatePickerContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  DatePickerContentProps
>(
  (
    {
      className,
      children,
      portalled = true,
      sideOffset = 8,
      align = "start",
      ...props
    },
    ref
  ) => {
    const overlayContainer = useOverlayPortalContainer();
    const content = (
      <PopoverPrimitive.Content
        ref={ref}
        className={cn("aviala-datepicker-content", className)}
        sideOffset={sideOffset}
        align={align}
        {...props}
      >
        {children ?? <DatePickerCalendar />}
      </PopoverPrimitive.Content>
    );

    if (!portalled) return content;
    return (
      <PopoverPrimitive.Portal container={overlayContainer}>
        {content}
      </PopoverPrimitive.Portal>
    );
  }
);
DatePickerContent.displayName = "DatePickerContent";

export type DatePickerCalendarProps = {
  className?: string;
};

function getFooterDateLabel(
  mode: DatePickerMode,
  singleValue: Date | undefined,
  rangeValue: DateRange,
  messages: LocaleDatePicker
): string {
  if (mode === "single") {
    return singleValue ? formatIsoDate(singleValue) : messages.selectDate;
  }
  if (rangeValue.from && rangeValue.to) {
    return `${formatIsoDate(rangeValue.from)}${messages.rangeTo}${formatIsoDate(rangeValue.to)}`;
  }
  if (rangeValue.from) {
    return `${formatIsoDate(rangeValue.from)}${messages.rangeTo}…`;
  }
  return messages.selectDateRange;
}

function DatePickerTimePanel() {
  const { timeValue, setTimeValue } = useDatePickerContext();

  return <TimePickerWheels value={timeValue} onChange={setTimeValue} />;
}

function DatePickerPanelFooter() {
  const locale = useLocaleMessages("DatePicker");
  const {
    mode,
    singleValue,
    rangeValue,
    enableTime,
    activePanel,
    setActivePanel,
    timeValue,
  } = useDatePickerContext();

  if (!enableTime) return null;

  const panelValue = activePanel === "time" ? "time" : "date";
  const isRangeMode = mode === "range";

  return (
    <div className="aviala-datepicker-footer-wrap">
      <SegmentatorGroup
        value={panelValue}
        onValueChange={(value) => setActivePanel(value as DatePickerPanel)}
        mode="nested"
        className="aviala-datepicker-footer"
        data-layout={isRangeMode ? "range" : "single"}
        data-active-panel={activePanel}
        aria-label={locale.dateTimeSwitch}
      >
        <SegmentatorItem
          value="date"
          leftIcon={<TimeAndDateDate level="text" biggerSize aria-hidden />}
          iconOnly={isRangeMode && panelValue === "time"}
        >
          {getFooterDateLabel(mode, singleValue, rangeValue, locale)}
        </SegmentatorItem>
        <SegmentatorItem
          value="time"
          leftIcon={<TimeAndDateClock level="text" biggerSize aria-hidden />}
          iconOnly={isRangeMode && panelValue === "date"}
        >
          {formatTimeValue(timeValue.hours, timeValue.minutes)}
        </SegmentatorItem>
      </SegmentatorGroup>
    </div>
  );
}

type MonthSlideDirection = "prev" | "next";

type MonthSlideState = {
  direction: MonthSlideDirection;
  outgoingMonth: Date;
};

type CalendarContentView = "date" | "month";

type ViewCrossfadeState = {
  outgoing: CalendarContentView;
};

type PanelKind = "date" | "time";

type PanelSlideState = {
  outgoing: PanelKind;
  direction: MonthSlideDirection;
};

function monthDiff(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function DatePickerCalendar({ className }: DatePickerCalendarProps) {
  const calendarId = useId();
  const { code } = useLocale();
  const locale = useLocaleMessages("DatePicker");
  const rtl = useRtl();
  const PrevIcon = rtl ? DirectionArrowRightLight : DirectionArrowLeftLight;
  const NextIcon = rtl ? DirectionArrowLeftLight : DirectionArrowRightLight;
  const {
    mode,
    viewMonth,
    setViewMonth,
    singleValue,
    rangeValue,
    selectDate,
    minDate,
    maxDate,
    focusedDay,
    setFocusedDay,
    activePanel,
    setActivePanel,
    enableTime,
  } = useDatePickerContext();

  const today = useMemo(() => startOfDay(new Date()), []);
  const days = useMemo(() => getCalendarDays(viewMonth), [viewMonth]);
  const prevViewMonthRef = useRef(viewMonth);
  const dayGridRef = useRef<HTMLDivElement>(null);
  const pendingDayFocusRef = useRef(false);
  const [monthSlide, setMonthSlide] = useState<MonthSlideState | null>(null);
  /** Remount keys so prev/next icons replay exit→enter after each press. */
  const [prevNavAnimKey, setPrevNavAnimKey] = useState(0);
  const [nextNavAnimKey, setNextNavAnimKey] = useState(0);
  const [prevNavAnimating, setPrevNavAnimating] = useState(false);
  const [nextNavAnimating, setNextNavAnimating] = useState(false);
  const isMonthPanel = activePanel === "month";
  const isTimePanel = activePanel === "time" && enableTime;
  const targetContentView: CalendarContentView = isMonthPanel ? "month" : "date";
  const [contentView, setContentView] = useState<CalendarContentView>(targetContentView);
  const [viewCrossfade, setViewCrossfade] = useState<ViewCrossfadeState | null>(null);
  const [monthWheelLayoutKey, setMonthWheelLayoutKey] = useState(0);
  const contentViewRef = useRef(contentView);
  contentViewRef.current = contentView;

  const targetPanel: PanelKind = isTimePanel ? "time" : "date";
  const [panel, setPanel] = useState<PanelKind>(targetPanel);
  const [panelSlide, setPanelSlide] = useState<PanelSlideState | null>(null);
  const panelRef = useRef(panel);
  panelRef.current = panel;

  useLayoutEffect(() => {
    const previous = panelRef.current;
    if (targetPanel === previous) return;
    if (prefersReducedMotion()) {
      setPanel(targetPanel);
      setPanelSlide(null);
      panelRef.current = targetPanel;
      return;
    }
    setPanelSlide({
      outgoing: previous,
      direction: targetPanel === "time" ? "next" : "prev",
    });
    setPanel(targetPanel);
    panelRef.current = targetPanel;
  }, [targetPanel]);

  useLayoutEffect(() => {
    const previous = contentViewRef.current;
    if (targetContentView === previous) return;
    if (prefersReducedMotion()) {
      setContentView(targetContentView);
      setViewCrossfade(null);
      contentViewRef.current = targetContentView;
      return;
    }
    setViewCrossfade({ outgoing: previous });
    setContentView(targetContentView);
    contentViewRef.current = targetContentView;
  }, [targetContentView]);

  useLayoutEffect(() => {
    const previous = prevViewMonthRef.current;
    const diff = monthDiff(previous, viewMonth);
    prevViewMonthRef.current = viewMonth;
    if (diff === 0 || prefersReducedMotion() || contentView === "month" || panel === "time") {
      setMonthSlide(null);
      return;
    }
    setMonthSlide({
      direction: diff > 0 ? "next" : "prev",
      outgoingMonth: previous,
    });
  }, [contentView, panel, viewMonth]);

  useLayoutEffect(() => {
    if (!pendingDayFocusRef.current || !focusedDay) return;
    const grid = dayGridRef.current;
    if (!grid) return;
    const target = grid.querySelector<HTMLButtonElement>(
      `button[data-day="${formatIsoDate(focusedDay)}"]`
    );
    if (!target || target.disabled) return;
    pendingDayFocusRef.current = false;
    target.focus();
  }, [focusedDay, days, monthSlide]);

  const outgoingDays = useMemo(
    () => (monthSlide ? getCalendarDays(monthSlide.outgoingMonth) : null),
    [monthSlide]
  );

  const handleDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    let deltaDays = 0;
    switch (event.key) {
      case "ArrowLeft":
        deltaDays = -1;
        break;
      case "ArrowRight":
        deltaDays = 1;
        break;
      case "ArrowUp":
        deltaDays = -7;
        break;
      case "ArrowDown":
        deltaDays = 7;
        break;
      case "Home":
      case "End":
      case "PageUp":
      case "PageDown":
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectDate(date);
        return;
      default:
        return;
    }

    event.preventDefault();

    let next: Date;
    if (event.key === "Home") {
      next = new Date(date.getFullYear(), date.getMonth(), 1);
    } else if (event.key === "End") {
      next = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    } else if (event.key === "PageUp") {
      next = addMonths(date, event.shiftKey ? -12 : -1);
    } else if (event.key === "PageDown") {
      next = addMonths(date, event.shiftKey ? 12 : 1);
    } else {
      next = new Date(date);
      next.setDate(next.getDate() + deltaDays);
      // Skip disabled days while moving in the same direction
      let guard = 0;
      while (isDateDisabled(next, minDate, maxDate) && guard < 366) {
        next.setDate(next.getDate() + (deltaDays > 0 ? 1 : -1));
        guard += 1;
      }
    }

    const normalized = startOfDay(next);
    if (isDateDisabled(normalized, minDate, maxDate)) return;

    pendingDayFocusRef.current = true;
    if (mode === "single") {
      selectDate(normalized, { close: false, switchToTime: false });
      return;
    }

    setFocusedDay(normalized);
    if (!isSameMonth(normalized, viewMonth)) {
      setViewMonth(new Date(normalized.getFullYear(), normalized.getMonth(), 1));
    }
  };

  const stepMonth = isMonthPanel ? 12 : 1;

  const renderDateContent = () => (
    <>
      <div className="aviala-datepicker-calendar__weekdays" aria-hidden>
        {locale.weekdays.map((label) => (
          <span
            key={label}
            className={cn(
              "aviala-datepicker-calendar__weekday",
              typographyVariants({ level: "caption" })
            )}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="aviala-datepicker-calendar__grid-viewport">
        {monthSlide && outgoingDays ? (
          <div
            key={`out-${monthSlide.outgoingMonth.getFullYear()}-${monthSlide.outgoingMonth.getMonth()}`}
            className="aviala-datepicker-calendar__grid"
            data-slide-role="exit"
            data-slide={monthSlide.direction}
            aria-hidden
          >
            {outgoingDays.map((day) => {
              const outside = !isSameMonth(day, monthSlide.outgoingMonth);
              return (
                <span
                  key={day.toISOString()}
                  className="aviala-datepicker-day"
                  data-outside={outside ? "true" : undefined}
                >
                  <span
                    className={cn(
                      "aviala-datepicker-day__label",
                      typographyVariants({ level: "text" })
                    )}
                  >
                    {day.getDate()}
                  </span>
                </span>
              );
            })}
          </div>
        ) : null}

        <div
          ref={dayGridRef}
          key={`in-${viewMonth.getFullYear()}-${viewMonth.getMonth()}`}
          className="aviala-datepicker-calendar__grid"
          role="grid"
          aria-labelledby={`${calendarId}-label`}
          data-slide-role={monthSlide ? "enter" : undefined}
          data-slide={monthSlide?.direction}
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.currentTarget.dataset.slideRole === "enter") {
              setMonthSlide(null);
            }
          }}
        >
          {days.map((day) => {
            const outside = !isSameMonth(day, viewMonth);
            const rangePos: RangeSelectionPosition =
              mode === "range"
                ? getRangeSelectionPosition(day, rangeValue.from, rangeValue.to)
                : singleValue && isSameDay(day, singleValue)
                  ? "single"
                  : "none";
            const selected = rangePos !== "none";
            const inRange =
              mode === "range" && isDateInRange(day, rangeValue.from, rangeValue.to);
            const isToday = isSameDay(day, today);
            const dayDisabled = isDateDisabled(day, minDate, maxDate);
            const focused = focusedDay ? isSameDay(day, focusedDay) : false;
            const dayKey = formatIsoDate(day);

            return (
              <button
                key={dayKey}
                type="button"
                role="gridcell"
                data-day={dayKey}
                tabIndex={focused || (!focusedDay && isToday) ? 0 : -1}
                className="aviala-datepicker-day aviala-focus-ring"
                data-outside={outside ? "true" : undefined}
                data-selected={selected ? "true" : undefined}
                data-in-range={inRange && !selected ? "true" : undefined}
                data-range-pos={rangePos !== "none" ? rangePos : undefined}
                data-today={isToday ? "true" : undefined}
                data-disabled={dayDisabled ? "true" : undefined}
                aria-label={formatDisplayDate(day, code)}
                aria-selected={selected || undefined}
                aria-disabled={dayDisabled || undefined}
                disabled={dayDisabled}
                onClick={() => selectDate(day)}
                onFocus={() => setFocusedDay(day)}
                onKeyDown={(event) => handleDayKeyDown(event, day)}
              >
                <span
                  className={cn(
                    "aviala-datepicker-day__label",
                    typographyVariants({ level: "text" })
                  )}
                >
                  {day.getDate()}
                </span>
                {isToday ? (
                  <span className="aviala-datepicker-day__today-dot" aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  const renderContentView = (view: CalendarContentView) =>
    view === "month" ? (
      <DatePickerMonthYearWheels layoutKey={monthWheelLayoutKey} />
    ) : (
      renderDateContent()
    );

  const renderDatePanel = () => (
    <>
      <div className="aviala-datepicker-calendar__header">
        <button
          type="button"
          className="aviala-datepicker-calendar__nav aviala-focus-ring"
          aria-label={isMonthPanel ? locale.previousYear : locale.previousMonth}
          onClick={() => {
            if (!prefersReducedMotion()) {
              setPrevNavAnimKey((n) => n + 1);
              setPrevNavAnimating(true);
            }
            setViewMonth(addMonths(viewMonth, -stepMonth));
          }}
        >
          <span className="aviala-datepicker-calendar__nav-icon">
            <span
              key={prevNavAnimKey}
              className="aviala-datepicker-calendar__nav-icon-inner"
              data-anim={prevNavAnimating ? "prev" : undefined}
              onAnimationEnd={() => setPrevNavAnimating(false)}
            >
              <PrevIcon level="text" biggerSize aria-hidden />
            </span>
          </span>
        </button>
        <button
          type="button"
          id={`${calendarId}-label`}
          className={cn(
            "aviala-datepicker-calendar__title aviala-focus-ring",
            typographyVariants({ level: "subtitle" })
          )}
          data-active={isMonthPanel ? "true" : undefined}
          aria-expanded={isMonthPanel}
          aria-label={isMonthPanel ? locale.closeMonthYear : locale.selectMonthYear}
          onClick={() => setActivePanel(isMonthPanel ? "date" : "month")}
        >
          <span
            key={`${viewMonth.getFullYear()}-${viewMonth.getMonth()}`}
            className="aviala-datepicker-calendar__title-text"
            data-slide={isMonthPanel ? undefined : monthSlide?.direction}
          >
            {formatMonthYear(viewMonth, code)}
          </span>
        </button>
        <button
          type="button"
          className="aviala-datepicker-calendar__nav aviala-focus-ring"
          aria-label={isMonthPanel ? locale.nextYear : locale.nextMonth}
          onClick={() => {
            if (!prefersReducedMotion()) {
              setNextNavAnimKey((n) => n + 1);
              setNextNavAnimating(true);
            }
            setViewMonth(addMonths(viewMonth, stepMonth));
          }}
        >
          <span className="aviala-datepicker-calendar__nav-icon">
            <span
              key={nextNavAnimKey}
              className="aviala-datepicker-calendar__nav-icon-inner"
              data-anim={nextNavAnimating ? "next" : undefined}
              onAnimationEnd={() => setNextNavAnimating(false)}
            >
              <NextIcon level="text" biggerSize aria-hidden />
            </span>
          </span>
        </button>
      </div>

      <div className="aviala-datepicker-calendar__view-viewport">
        {viewCrossfade ? (
          <div
            key={`exit-${viewCrossfade.outgoing}`}
            className="aviala-datepicker-calendar__view"
            data-view-role="exit"
            data-view={viewCrossfade.outgoing}
            aria-hidden
          >
            {renderContentView(viewCrossfade.outgoing)}
          </div>
        ) : null}
        <div
          key={`enter-${contentView}`}
          className="aviala-datepicker-calendar__view"
          data-view-role={viewCrossfade ? "enter" : undefined}
          data-view={contentView}
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.currentTarget.dataset.viewRole === "enter") {
              setViewCrossfade(null);
              if (contentView === "month") {
                setMonthWheelLayoutKey((key) => key + 1);
              }
            }
          }}
        >
          {renderContentView(contentView)}
        </div>
      </div>
    </>
  );

  const renderPanel = (kind: PanelKind) =>
    kind === "time" ? <DatePickerTimePanel /> : renderDatePanel();

  return (
    <div
      className={cn("aviala-datepicker-calendar", className)}
      role="application"
      aria-label={locale.calendar}
    >
      <div className="aviala-datepicker-calendar__panel-viewport">
        {panelSlide ? (
          <div
            key={`panel-exit-${panelSlide.outgoing}`}
            className="aviala-datepicker-calendar__panel aviala-datepicker-calendar__body"
            data-panel-role="exit"
            data-slide={panelSlide.direction}
            data-panel={panelSlide.outgoing}
            aria-hidden
          >
            {renderPanel(panelSlide.outgoing)}
          </div>
        ) : null}
        <div
          key={`panel-enter-${panel}`}
          className="aviala-datepicker-calendar__panel aviala-datepicker-calendar__body"
          data-panel-role={panelSlide ? "enter" : undefined}
          data-slide={panelSlide?.direction}
          data-panel={panel}
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.currentTarget.dataset.panelRole === "enter") {
              setPanelSlide(null);
            }
          }}
        >
          {renderPanel(panel)}
        </div>
      </div>

      <DatePickerPanelFooter />
    </div>
  );
}

export type DatePickerFieldProps = Omit<DatePickerTriggerProps, "displayValue"> & {
  contentClassName?: string;
  calendarClassName?: string;
  mode?: DatePickerMode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  size?: DatePickerSize;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  value?: Date | DateRange;
  defaultValue?: Date | DateRange;
  onValueChange?: ((value: Date | undefined) => void) | ((value: DateRange) => void);
  enableTime?: boolean;
  timeValue?: DatePickerTimeValue;
  defaultTimeValue?: DatePickerTimeValue;
  onTimeChange?: (value: DatePickerTimeValue) => void;
};

/** Convenience field — trigger + calendar panel. */
export function DatePickerField({
  contentClassName,
  calendarClassName,
  className,
  size = "regular",
  mode = "single",
  allRound,
  leftIcon,
  rightIcon,
  placeholder,
  rangePlaceholder,
  error,
  rangeSeparator,
  editable,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  minDate,
  maxDate,
  enableTime = true,
  timeValue,
  defaultTimeValue,
  onTimeChange,
}: DatePickerFieldProps) {
  const pickerProps =
    mode === "range"
      ? {
          mode: "range" as const,
          value: value as DateRange | undefined,
          defaultValue: defaultValue as DateRange | undefined,
          onValueChange: onValueChange as ((value: DateRange) => void) | undefined,
          open,
          defaultOpen,
          onOpenChange,
          disabled,
          minDate,
          maxDate,
          enableTime,
          timeValue,
          defaultTimeValue,
          onTimeChange,
        }
      : {
          mode: "single" as const,
          value: value as Date | undefined,
          defaultValue: defaultValue as Date | undefined,
          onValueChange: onValueChange as ((value: Date | undefined) => void) | undefined,
          open,
          defaultOpen,
          onOpenChange,
          disabled,
          minDate,
          maxDate,
          enableTime,
          timeValue,
          defaultTimeValue,
          onTimeChange,
        };

  return (
    <DatePicker {...pickerProps} size={size} className={className}>
      <DatePickerTrigger
        size={size}
        allRound={allRound}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        placeholder={placeholder}
        rangePlaceholder={rangePlaceholder}
        error={error}
        rangeSeparator={rangeSeparator}
        editable={editable}
      />
      <DatePickerContent className={contentClassName}>
        <DatePickerCalendar className={calendarClassName} />
      </DatePickerContent>
    </DatePicker>
  );
}
