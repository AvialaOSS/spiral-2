import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  DirectionArrowLeft,
  DirectionArrowRight,
  TimeAndDateClock,
  TimeAndDateDate,
  type AvialaIconProps,
} from "@aviala-design/icons";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { cloneAvialaIconElement } from "../../lib/clone-aviala-icon";
import { iconSlotCssVarStyle } from "../../lib/icon-slot-sizing";
import { typographyVariants } from "../typography";
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
  startOfDay,
  WEEKDAY_LABELS,
  type DateRange,
  type RangeSelectionPosition,
} from "./date-utils";
import {
  SegmentatorGroup,
  SegmentatorItem,
} from "../segmentator";
import { DatePickerTimeWheelColumn } from "./date-picker-time-wheel";
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

function renderSlotIcon(node: ReactNode): ReactNode {
  if (!node) return null;
  const content = cloneAvialaIconElement(node, {
    level: "text",
    biggerSize: true,
  });

  return (
    <span
      className="aviala-datepicker-trigger__slot"
      style={iconSlotCssVarStyle(node, "--input-slot-icon-size", "text", true)}
    >
      {content}
    </span>
  );
}

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
    },
    [onTimeChange, timeValueProp]
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

    const markPointerDown = () => {
      pointerDownCloseRef.current = true;
    };
    document.addEventListener("pointerdown", markPointerDown, true);
    return () => document.removeEventListener("pointerdown", markPointerDown, true);
  }, [open]);

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

  const selectDate = useCallback(
    (date: Date) => {
      if (disabled || isDateDisabled(date, minDate, maxDate)) return;
      const day = startOfDay(date);
      setFocusedDay(day);

      if (!isSameMonth(day, viewMonth)) {
        setViewMonth(new Date(day.getFullYear(), day.getMonth(), 1));
      }

      if (mode === "single") {
        commitSingle(day);
        handleOpenChange(false);
        return;
      }

      const currentFrom = rangeDraftFrom ?? rangeValue.from;
      const currentTo = rangeValue.to;

      if (!currentFrom || (currentFrom && currentTo)) {
        setRangeDraftFrom(day);
        commitRange({ from: day, to: undefined });
        return;
      }

      if (isSameDay(day, currentFrom)) {
        commitRange({ from: day, to: day });
        setRangeDraftFrom(undefined);
        handleOpenChange(false);
        return;
      }

      const normalized = normalizeRange(currentFrom, day);
      commitRange(normalized);
      setRangeDraftFrom(undefined);
      handleOpenChange(false);
    },
    [
      commitRange,
      commitSingle,
      disabled,
      handleOpenChange,
      maxDate,
      minDate,
      mode,
      rangeDraftFrom,
      rangeValue.from,
      rangeValue.to,
      viewMonth,
    ]
  );

  const contextValue = useMemo(
    () => ({
      open,
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
      disabled,
      enableTime,
      focusedDay,
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

export type DatePickerTriggerProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
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
};

export const DatePickerTrigger = forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
  (
    {
      className,
      size: sizeProp,
      allRound = false,
      leftIcon,
      rightIcon,
      placeholder = "YYYY/MM/DD",
      rangePlaceholder = "Start date - End date",
      error = false,
      displayValue,
      rangeSeparator = " - ",
      disabled: disabledProp,
      ...props
    },
    ref
  ) => {
    const {
      open,
      disabled: disabledContext,
      size: sizeContext,
      mode,
      singleValue,
      rangeValue,
      enableTime,
      timeValue,
    } = useDatePickerContext();
    const size = sizeProp ?? sizeContext;
    const disabled = disabledProp ?? disabledContext;

    const formatted =
      displayValue ??
      (mode === "single"
        ? singleValue
          ? enableTime
            ? formatDisplayDateTime(singleValue, timeValue.hours, timeValue.minutes)
            : formatDisplayDate(singleValue)
          : null
        : rangeValue.from && rangeValue.to
          ? enableTime
            ? `${formatDisplayDateTime(rangeValue.from, timeValue.hours, timeValue.minutes)}${rangeSeparator}${formatDisplayDateTime(rangeValue.to, timeValue.hours, timeValue.minutes)}`
            : `${formatDisplayDate(rangeValue.from)}${rangeSeparator}${formatDisplayDate(rangeValue.to)}`
          : rangeValue.from
            ? enableTime
              ? `${formatDisplayDateTime(rangeValue.from, timeValue.hours, timeValue.minutes)}${rangeSeparator}…`
              : `${formatDisplayDate(rangeValue.from)}${rangeSeparator}…`
            : null);

    const defaultPlaceholder = enableTime ? "YYYY-MM-DD HH:mm" : placeholder;

    const hasValue = formatted != null && formatted !== false;

    return (
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          className={cn("aviala-datepicker-trigger", className)}
          data-size={size}
          data-all-round={allRound ? "true" : "false"}
          data-state={open ? "open" : "closed"}
          data-error={error ? "true" : undefined}
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="dialog"
          {...props}
        >
          {renderSlotIcon(
            leftIcon ?? (
              <TimeAndDateDate level="text" biggerSize aria-hidden />
            )
          )}
          <span className="aviala-datepicker-trigger__field">
            <span
              className={cn(
                "aviala-datepicker-trigger__value",
                typographyVariants({ level: "text" })
              )}
              data-placeholder={hasValue ? undefined : "true"}
            >
              {hasValue ? formatted : mode === "range" ? rangePlaceholder : defaultPlaceholder}
            </span>
          </span>
          {renderSlotIcon(rightIcon)}
        </button>
      </PopoverPrimitive.Trigger>
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
    return <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>;
  }
);
DatePickerContent.displayName = "DatePickerContent";

export type DatePickerCalendarProps = {
  className?: string;
};

function getFooterDateLabel(
  mode: DatePickerMode,
  singleValue: Date | undefined,
  rangeValue: DateRange
): string {
  if (mode === "single") {
    return singleValue ? formatIsoDate(singleValue) : "选择日期";
  }
  if (rangeValue.from && rangeValue.to) {
    return `${formatIsoDate(rangeValue.from)} 至 ${formatIsoDate(rangeValue.to)}`;
  }
  if (rangeValue.from) {
    return `${formatIsoDate(rangeValue.from)} 至 …`;
  }
  return "选择日期范围";
}

function DatePickerTimePanel() {
  const { timeValue, setTimeValue } = useDatePickerContext();

  return <TimePickerWheels value={timeValue} onChange={setTimeValue} />;
}

function DatePickerPanelFooter() {
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

  const panelValue = activePanel === "date" ? "date" : "time";
  const isRangeMode = mode === "range";

  return (
    <SegmentatorGroup
      value={panelValue}
      onValueChange={(value) => setActivePanel(value as DatePickerPanel)}
      mode="nested"
      className="aviala-datepicker-footer"
      data-layout={isRangeMode ? "range" : "single"}
      data-active-panel={activePanel}
      aria-label="日期与时间切换"
    >
      <SegmentatorItem
        value="date"
        leftIcon={<TimeAndDateDate level="text" biggerSize aria-hidden />}
        iconOnly={isRangeMode && activePanel === "time"}
      >
        {getFooterDateLabel(mode, singleValue, rangeValue)}
      </SegmentatorItem>
      <SegmentatorItem
        value="time"
        leftIcon={<TimeAndDateClock level="text" biggerSize aria-hidden />}
        iconOnly={isRangeMode && activePanel === "date"}
      >
        {formatTimeValue(timeValue.hours, timeValue.minutes)}
      </SegmentatorItem>
    </SegmentatorGroup>
  );
}

export function DatePickerCalendar({ className }: DatePickerCalendarProps) {
  const calendarId = useId();
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
    enableTime,
  } = useDatePickerContext();

  const today = useMemo(() => startOfDay(new Date()), []);
  const days = useMemo(() => getCalendarDays(viewMonth), [viewMonth]);

  const handleDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    let next: Date | null = null;
    switch (event.key) {
      case "ArrowLeft":
        next = new Date(date);
        next.setDate(next.getDate() - 1);
        break;
      case "ArrowRight":
        next = new Date(date);
        next.setDate(next.getDate() + 1);
        break;
      case "ArrowUp":
        next = new Date(date);
        next.setDate(next.getDate() - 7);
        break;
      case "ArrowDown":
        next = new Date(date);
        next.setDate(next.getDate() + 7);
        break;
      case "Home":
        next = new Date(date.getFullYear(), date.getMonth(), 1);
        break;
      case "End":
        next = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        break;
      case "PageUp":
        next = addMonths(date, event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        next = addMonths(date, event.shiftKey ? 12 : 1);
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
    if (!next) return;
    const normalized = startOfDay(next);
    setFocusedDay(normalized);
    if (!isSameMonth(normalized, viewMonth)) {
      setViewMonth(new Date(normalized.getFullYear(), normalized.getMonth(), 1));
    }
  };

  return (
    <div
      className={cn("aviala-datepicker-calendar", className)}
      role="application"
      aria-label="Calendar"
    >
      {activePanel === "time" && enableTime ? (
        <div className="aviala-datepicker-calendar__body">
          <DatePickerTimePanel />
        </div>
      ) : (
        <div className="aviala-datepicker-calendar__body">
          <div className="aviala-datepicker-calendar__header">
            <button
              type="button"
              className="aviala-datepicker-calendar__nav"
              aria-label="Previous month"
              onClick={() => setViewMonth(addMonths(viewMonth, -1))}
            >
              <DirectionArrowLeft level="text" biggerSize aria-hidden />
            </button>
            <div
              id={`${calendarId}-label`}
              className={cn(
                "aviala-datepicker-calendar__title",
                typographyVariants({ level: "subtitle" })
              )}
            >
              {formatMonthYear(viewMonth)}
            </div>
            <button
              type="button"
              className="aviala-datepicker-calendar__nav"
              aria-label="Next month"
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            >
              <DirectionArrowRight level="text" biggerSize aria-hidden />
            </button>
          </div>

          <div className="aviala-datepicker-calendar__weekdays" aria-hidden>
            {WEEKDAY_LABELS.map((label) => (
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

          <div
            className="aviala-datepicker-calendar__grid"
            role="grid"
            aria-labelledby={`${calendarId}-label`}
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
              const disabled = isDateDisabled(day, minDate, maxDate);
              const focused = focusedDay ? isSameDay(day, focusedDay) : false;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  role="gridcell"
                  tabIndex={focused || (!focusedDay && isToday) ? 0 : -1}
                  className="aviala-datepicker-day"
                  data-outside={outside ? "true" : undefined}
                  data-selected={selected ? "true" : undefined}
                  data-in-range={inRange && !selected ? "true" : undefined}
                  data-range-pos={rangePos !== "none" ? rangePos : undefined}
                  data-today={isToday ? "true" : undefined}
                  data-disabled={disabled ? "true" : undefined}
                  aria-label={formatDisplayDate(day)}
                  aria-selected={selected || undefined}
                  aria-disabled={disabled || undefined}
                  disabled={disabled}
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
      )}

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
      />
      <DatePickerContent className={contentClassName}>
        <DatePickerCalendar className={calendarClassName} />
      </DatePickerContent>
    </DatePicker>
  );
}
