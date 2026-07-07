import {
  forwardRef,
  useState,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";
import { cloneAvialaIconElement } from "../lib/clone-aviala-icon";
import { iconSlotCssVarStyle } from "../lib/icon-slot-sizing";
import { cn } from "../lib/utils";
import { spiralDebugId } from "../lib/spiral-debug";
import { typographyVariants } from "./typography";
import type { InputState } from "./input";

/** Figma Components → Information Collect → TextareaInput */
export type TextareaSize = "regular" | "big";

function resolveTextareaState(
  value: string | number | readonly string[] | undefined,
  defaultValue: string | number | readonly string[] | undefined,
  focused: boolean
): InputState {
  const current = value ?? defaultValue ?? "";
  if (String(current).length === 0) return "empty";
  return focused ? "typing" : "fill";
}

function renderSlotIcon(node: ReactNode, debugId?: string): ReactNode {
  if (!node) return null;
  const content = cloneAvialaIconElement(node, {
    level: "text",
    biggerSize: true,
  });

  return (
    <span
      className="aviala-textarea__slot"
      style={iconSlotCssVarStyle(node, "--input-slot-icon-size", "text", true)}
      {...(debugId ? spiralDebugId(debugId) : undefined)}
    >
      {content}
    </span>
  );
}

function resolveLength(
  value: string | number | readonly string[] | undefined,
  defaultValue: string | number | readonly string[] | undefined
) {
  const current = value ?? defaultValue ?? "";
  return String(current).length;
}

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
  /** Figma `Size` */
  size?: TextareaSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Figma `Controller` — character counter + resize affordance */
  showController?: boolean;
  error?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size = "regular",
      leftIcon,
      rightIcon,
      showController: showControllerProp,
      maxLength,
      error = false,
      disabled,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [length, setLength] = useState(() => resolveLength(value, defaultValue));
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(() => String(defaultValue ?? ""));
    const showController = showControllerProp ?? maxLength !== undefined;
    const resolvedSize = size ?? "regular";
    const resolvedValue = value !== undefined ? String(value) : internalValue;
    const displayLength = resolvedValue.length;
    const inputState = resolveTextareaState(resolvedValue, undefined, focused);

    return (
      <div
        className={cn("aviala-textarea", className)}
        data-size={resolvedSize}
        data-input-state={inputState}
        data-error={error ? "true" : undefined}
        data-has-controller={showController ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        {...spiralDebugId("textarea")}
      >
        {renderSlotIcon(leftIcon, "textarea.left-icon")}

        <div className="aviala-textarea__field" {...spiralDebugId("textarea.field")}>
          <textarea
            ref={ref}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={error || undefined}
            className={cn("aviala-textarea__input", typographyVariants({ level: "text" }))}
            onChange={(event) => {
              if (value === undefined) {
                setInternalValue(event.target.value);
                setLength(event.target.value.length);
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

        {renderSlotIcon(rightIcon, "textarea.right-icon")}

        {showController && (
          <div className="aviala-textarea__controller" aria-hidden {...spiralDebugId("textarea.controller")}>
            <span className={cn("aviala-textarea__counter", typographyVariants({ level: "caption" }))}>
              {displayLength}
              {maxLength !== undefined ? `/${maxLength}` : ""}
            </span>
            <span className="aviala-textarea__resize-handle" />
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
