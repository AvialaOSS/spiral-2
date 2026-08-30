import {
  DirectionArrowDownLight,
  DirectionArrowUpLight,
} from "@aviala-design/icons";
import {
  forwardRef,
  isValidElement,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { renderSlotIcon } from "../lib/render-slot-icon";
import { cn } from "../lib/utils";
import { spiralDebugId } from "../lib/spiral-debug";
import { useLocaleMessages } from "../locale";
import { typographyVariants } from "./typography";
import { Badge } from "./badge";
import {
  inputRootVariants,
  type InputSize,
  type InputState,
} from "./input";
import { useResolvedControlError } from "./form-field-context";

/** Figma Components → Information Collect → NumberInput (197:3237) */
export type NumberInputStyle = "default" | "monospaced";

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  ref.current = value;
}

function resolveInputState(
  value: string | number | readonly string[] | undefined,
  defaultValue: string | number | readonly string[] | undefined,
  focused: boolean
): InputState {
  const current = value ?? defaultValue ?? "";
  if (String(current).length === 0) return "empty";
  return focused ? "typing" : "fill";
}

function parseNumeric(raw: string): number | null {
  if (raw.trim() === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function clamp(value: number, min?: number, max?: number): number {
  let next = value;
  if (min !== undefined && Number.isFinite(min)) next = Math.max(min, next);
  if (max !== undefined && Number.isFinite(max)) next = Math.min(max, next);
  return next;
}

function stepValue(
  current: number | null,
  direction: 1 | -1,
  step: number,
  min?: number,
  max?: number
): number {
  const base = current ?? (direction > 0 ? (min ?? 0) : (max ?? 0));
  const next = clamp(base + direction * step, min, max);
  // Avoid float noise for common decimal steps
  const precision = Math.max(
    decimalPlaces(step),
    decimalPlaces(base),
    decimalPlaces(min ?? 0),
    decimalPlaces(max ?? 0)
  );
  return Number(next.toFixed(precision));
}

function decimalPlaces(n: number): number {
  if (!Number.isFinite(n)) return 0;
  const text = String(n);
  const i = text.indexOf(".");
  return i === -1 ? 0 : text.length - i - 1;
}


function renderBadgeArea(node: ReactNode): ReactNode {
  if (node == null || node === false) return null;

  return (
    <span className="aviala-input__badge-area">
      {isValidElement(node) && node.type === Badge ? node : <Badge>{node}</Badge>}
    </span>
  );
}

const numberInputRootVariants = inputRootVariants;

export type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "value" | "defaultValue" | "onChange"
> & {
  /** Figma `Size` */
  size?: InputSize;
  /** Figma `All-Round` */
  allRound?: boolean;
  /** Figma `Style` — Default vs Monospaced (tabular / light numeric) */
  inputStyle?: NumberInputStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftBadge?: ReactNode;
  rightBadge?: ReactNode;
  /** Figma `showNumberControlButton` — vertical steppers */
  showControls?: boolean;
  /** When false, input sizes to content */
  fullWidth?: boolean;
  error?: boolean;
  value?: number | string | "";
  defaultValue?: number | string;
  step?: number;
  min?: number;
  max?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Fires with the parsed number (or `null` when empty / invalid) */
  onValueChange?: (value: number | null) => void;
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      size = "regular",
      allRound = false,
      inputStyle = "default",
      leftIcon,
      rightIcon,
      leftBadge,
      rightBadge,
      showControls = true,
      fullWidth = true,
      error,
      disabled,
      value,
      defaultValue,
      step = 1,
      min,
      max,
      onChange,
      onValueChange,
      onFocus,
      onBlur,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("NumberInput");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(() =>
      defaultValue === undefined || defaultValue === null ? "" : String(defaultValue)
    );
    const isControlled = value !== undefined;
    const resolvedValue = isControlled
      ? value === "" || value === null || value === undefined
        ? ""
        : String(value)
      : internalValue;
    const inputState = resolveInputState(resolvedValue, undefined, focused);
    const resolvedError = useResolvedControlError(error);
    const numeric = parseNumeric(resolvedValue);
    const stepAmount = Number.isFinite(step) && step !== 0 ? Math.abs(step) : 1;

    const commitString = (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(parseNumeric(next));
      onChange?.({
        target: { value: next },
        currentTarget: { value: next },
      } as ChangeEvent<HTMLInputElement>);
    };

    const applyStep = (direction: 1 | -1) => {
      if (disabled) return;
      const next = stepValue(numeric, direction, stepAmount, min, max);
      commitString(String(next));
      inputRef.current?.focus();
    };

    return (
      <div
        className={cn(
          inputRootVariants({ fullWidth }),
          "aviala-number-input",
          className
        )}
        data-size={size}
        data-all-round={allRound ? "true" : undefined}
        data-input-state={inputState}
        data-input-style={inputStyle}
        data-error={resolvedError ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        {...spiralDebugId("number-input")}
      >
        {renderSlotIcon(leftIcon, "aviala-input__slot", "number-input.left-icon")}
        {renderBadgeArea(leftBadge)}

        <div
          className="aviala-input__field relative z-[1] flex min-w-0 flex-1 flex-col justify-center"
          {...spiralDebugId("number-input.field")}
        >
          <input
            ref={(node) => {
              inputRef.current = node;
              assignRef(ref, node);
            }}
            type="number"
            inputMode="decimal"
            disabled={disabled}
            value={resolvedValue}
            step={stepAmount}
            min={min}
            max={max}
            aria-invalid={resolvedError || undefined}
            className={cn(
              typographyVariants({ level: "text" }),
              "aviala-number-input__input w-full min-w-0 border-0 bg-transparent p-0 text-[var(--input-fg,#343333)] outline-none",
              "disabled:cursor-not-allowed"
            )}
            data-content={inputStyle === "monospaced" ? "number" : "text"}
            onChange={(event) => {
              const next = event.target.value;
              if (!isControlled) setInternalValue(next);
              onValueChange?.(parseNumeric(next));
              onChange?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              // Clamp on blur when a finite number is present
              const parsed = parseNumeric(event.target.value);
              if (parsed !== null) {
                const clamped = clamp(parsed, min, max);
                if (clamped !== parsed) {
                  commitString(String(clamped));
                }
              }
              onBlur?.(event);
            }}
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "ArrowUp") {
                event.preventDefault();
                applyStep(1);
              } else if (event.key === "ArrowDown") {
                event.preventDefault();
                applyStep(-1);
              }
              onKeyDown?.(event);
            }}
            {...props}
          />
        </div>

        {renderBadgeArea(rightBadge)}
        {renderSlotIcon(rightIcon, "aviala-input__slot", "number-input.right-icon")}

        {showControls ? (
          <div
            className="aviala-number-input__controls"
            {...spiralDebugId("number-input.controls")}
          >
            <button
              type="button"
              className="aviala-number-input__step aviala-number-input__step--up"
              tabIndex={-1}
              disabled={
                disabled ||
                (max !== undefined && numeric !== null && numeric >= max)
              }
              aria-label={locale.increment}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyStep(1)}
              {...spiralDebugId("number-input.step-up")}
            >
              <DirectionArrowUpLight level="text" biggerSize aria-hidden />
            </button>
            <button
              type="button"
              className="aviala-number-input__step aviala-number-input__step--down"
              tabIndex={-1}
              disabled={
                disabled ||
                (min !== undefined && numeric !== null && numeric <= min)
              }
              aria-label={locale.decrement}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyStep(-1)}
              {...spiralDebugId("number-input.step-down")}
            >
              <DirectionArrowDownLight level="text" biggerSize aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export { parseNumeric, clamp, stepValue, decimalPlaces, resolveInputState };
export { numberInputRootVariants };
