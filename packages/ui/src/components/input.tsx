import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  isValidElement,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cloneAvialaIconElement } from "../lib/clone-aviala-icon";
import { iconSlotCssVarStyle } from "../lib/icon-slot-sizing";
import { cn } from "../lib/utils";
import { spiralDebugId } from "../lib/spiral-debug";
import { typographyVariants } from "./typography";
import { Badge } from "./badge";

/** Figma Components → Information Collect → BaseInput */
export type InputSize = "regular" | "big";
export type InputState = "empty" | "fill" | "typing";

function resolveInputState(
  value: string | number | readonly string[] | undefined,
  defaultValue: string | number | readonly string[] | undefined,
  focused: boolean
): InputState {
  const current = value ?? defaultValue ?? "";
  if (String(current).length === 0) return "empty";
  return focused ? "typing" : "fill";
}

const inputRootVariants = cva("aviala-input relative min-w-0 font-sans", {
  variants: {
    fullWidth: {
      true: "w-full",
      false: "w-auto",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

function renderSlotIcon(node: ReactNode, debugId?: string): ReactNode {
  if (!node) return null;
  const content = cloneAvialaIconElement(node, {
    level: "text",
    biggerSize: true,
  });

  return (
    <span
      className="aviala-input__slot"
      style={iconSlotCssVarStyle(node, "--input-slot-icon-size", "text", true)}
      {...(debugId ? spiralDebugId(debugId) : undefined)}
    >
      {content}
    </span>
  );
}

function renderBadgeArea(node: ReactNode): ReactNode {
  if (node == null || node === false) return null;

  return (
    <span className="aviala-input__badge-area">
      {isValidElement(node) && node.type === Badge ? node : <Badge>{node}</Badge>}
    </span>
  );
}

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputRootVariants> & {
    /** Figma `Size` */
    size?: InputSize;
    /** Figma `All-Round` */
    allRound?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    /** Figma badge area — left slot inside BaseInput */
    leftBadge?: ReactNode;
    /** Figma badge area — right slot inside BaseInput */
    rightBadge?: ReactNode;
    /** When false, input sizes to content (e.g. ColorPicker panel row) */
    fullWidth?: boolean;
    error?: boolean;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = "regular",
      allRound = false,
      leftIcon,
      rightIcon,
      leftBadge,
      rightBadge,
      fullWidth = true,
      error = false,
      disabled,
      type = "text",
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(() => String(defaultValue ?? ""));
    const resolvedValue = value !== undefined ? String(value) : internalValue;
    const inputState = resolveInputState(resolvedValue, undefined, focused);

    return (
      <div
        className={cn(inputRootVariants({ fullWidth }), className)}
        data-size={size}
        data-all-round={allRound ? "true" : undefined}
        data-input-state={inputState}
        data-error={error ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        {...spiralDebugId("input")}
      >
        {renderSlotIcon(leftIcon, "input.left-icon")}
        {renderBadgeArea(leftBadge)}

        <div
          className="aviala-input__field relative z-[1] flex min-w-0 flex-1 flex-col justify-center"
          {...spiralDebugId("input.field")}
        >
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={error || undefined}
            className={cn(
              typographyVariants({ level: "text" }),
              "w-full min-w-0 border-0 bg-transparent p-0 text-[var(--input-fg,#343333)] outline-none",
              "disabled:cursor-not-allowed"
            )}
            onChange={(event) => {
              if (value === undefined) {
                setInternalValue(event.target.value);
              }
              onChange?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            {...props}
          />
        </div>

        {renderBadgeArea(rightBadge)}
        {renderSlotIcon(rightIcon, "input.right-icon")}
      </div>
    );
  }
);
Input.displayName = "Input";

export { inputRootVariants };
