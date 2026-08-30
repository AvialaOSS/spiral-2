import * as PopoverPrimitive from "@radix-ui/react-popover";
import { TimeAndDateClock } from "@aviala-design/icons";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { useOverlayPortalContainer } from "../../overlay/overlay-container";
import { renderSlotIcon } from "../../lib/render-slot-icon";
import { useLocaleMessages } from "../../locale";
import { formatTimeValue } from "../date-picker/date-utils";
import { typographyVariants } from "../typography";
import { useResolvedControlError } from "../form-field";
import {
  TimePickerProvider,
  useTimePickerContext,
  type TimePickerSize,
  type TimePickerValue,
} from "./time-picker-context";
import { TimePickerWheels } from "./time-picker-wheels";

export type { TimePickerSize, TimePickerValue } from "./time-picker-context";

export type TimePickerProps = {
  children: ReactNode;
  value?: TimePickerValue;
  defaultValue?: TimePickerValue;
  onValueChange?: (value: TimePickerValue) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  size?: TimePickerSize;
  className?: string;
};


export function TimePicker({
  children,
  value: valueProp,
  defaultValue = { hours: 17, minutes: 0 },
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  size = "regular",
  className,
}: TimePickerProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalValue, setInternalValue] = useState<TimePickerValue>(defaultValue);
  const windowBlurCloseRef = useRef(false);
  const pointerDownCloseRef = useRef(false);

  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : internalOpen;
  const value = valueProp !== undefined ? valueProp : internalValue;

  const setValue = useCallback(
    (next: TimePickerValue) => {
      if (valueProp === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [onValueChange, valueProp]
  );

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

  const contextValue = useMemo(
    () => ({
      open,
      disabled,
      size,
      value,
      setValue,
    }),
    [disabled, open, size, value, setValue]
  );

  return (
    <TimePickerProvider value={contextValue}>
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange} modal={false}>
        <div className={cn("inline-flex", className)}>{children}</div>
      </PopoverPrimitive.Root>
    </TimePickerProvider>
  );
}

export type TimePickerTriggerProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
  size?: TimePickerSize;
  allRound?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  placeholder?: string;
  error?: boolean;
  displayValue?: string | null;
};

export const TimePickerTrigger = forwardRef<HTMLButtonElement, TimePickerTriggerProps>(
  (
    {
      className,
      size: sizeProp,
      allRound = false,
      leftIcon,
      rightIcon,
      placeholder,
      error,
      displayValue,
      disabled: disabledProp,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("TimePicker");
    const { open, disabled: disabledContext, size: sizeContext, value } = useTimePickerContext();
    const size = sizeProp ?? sizeContext;
    const disabled = disabledProp ?? disabledContext;
    const resolvedError = useResolvedControlError(error);
    const resolvedPlaceholder = placeholder ?? locale.placeholder;
    const formatted =
      displayValue !== undefined
        ? displayValue
        : formatTimeValue(value.hours, value.minutes);
    const hasValue = formatted != null && formatted !== "";

    return (
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          className={cn("aviala-timepicker-trigger aviala-focus-ring", className)}
          data-size={size}
          data-all-round={allRound ? "true" : "false"}
          data-state={open ? "open" : "closed"}
          data-error={resolvedError ? "true" : undefined}
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="dialog"
          {...props}
        >
          {renderSlotIcon(
            leftIcon ?? <TimeAndDateClock level="text" biggerSize aria-hidden />,
            "aviala-timepicker-trigger__slot"
          )}
          <span className="aviala-timepicker-trigger__field">
            <span
              className={cn(
                "aviala-timepicker-trigger__value",
                typographyVariants({ level: "text" })
              )}
              data-placeholder={hasValue ? undefined : "true"}
            >
              {hasValue ? formatted : resolvedPlaceholder}
            </span>
          </span>
          {renderSlotIcon(rightIcon, "aviala-timepicker-trigger__slot")}
        </button>
      </PopoverPrimitive.Trigger>
    );
  }
);
TimePickerTrigger.displayName = "TimePickerTrigger";

export type TimePickerContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  portalled?: boolean;
};

export const TimePickerContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  TimePickerContentProps
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
        className={cn("aviala-timepicker-content", className)}
        sideOffset={sideOffset}
        align={align}
        {...props}
      >
        {children ?? <TimePickerPanel />}
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
TimePickerContent.displayName = "TimePickerContent";

export type TimePickerPanelProps = {
  className?: string;
};

export function TimePickerPanel({ className }: TimePickerPanelProps) {
  const locale = useLocaleMessages("TimePicker");
  const { value, setValue } = useTimePickerContext();

  // Hour/minute wheels already expose listbox + aria-activedescendant + Up/Down/
  // Home/End. The panel is a group so those widgets stay in browse mode; a
  // panel-level listbox would fight the two independent spin columns.
  return (
    <div
      className={cn("aviala-timepicker-panel", className)}
      role="group"
      aria-label={locale.panel}
    >
      <TimePickerWheels value={value} onChange={setValue} />
    </div>
  );
}

export type TimePickerFieldProps = Omit<TimePickerTriggerProps, "displayValue"> & {
  contentClassName?: string;
  panelClassName?: string;
  value?: TimePickerValue;
  defaultValue?: TimePickerValue;
  onValueChange?: (value: TimePickerValue) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  size?: TimePickerSize;
  className?: string;
};

/** Convenience field — trigger + time wheel panel. */
export function TimePickerField({
  contentClassName,
  panelClassName,
  className,
  size = "regular",
  allRound,
  leftIcon,
  rightIcon,
  placeholder,
  error,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
}: TimePickerFieldProps) {
  return (
    <TimePicker
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      size={size}
      className={className}
    >
      <TimePickerTrigger
        size={size}
        allRound={allRound}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        placeholder={placeholder}
        error={error}
      />
      <TimePickerContent className={contentClassName}>
        <TimePickerPanel className={panelClassName} />
      </TimePickerContent>
    </TimePicker>
  );
}
