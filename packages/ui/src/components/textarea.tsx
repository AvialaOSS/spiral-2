import { SymbolResize } from "@aviala-design/icons";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type TextareaHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { renderSlotIcon } from "../lib/render-slot-icon";
import { cn } from "../lib/utils";
import { spiralDebugId } from "../lib/spiral-debug";
import { useLocaleMessages } from "../locale";
import { typographyVariants } from "./typography";
import type { InputState } from "./input";
import { useResolvedControlError } from "./form-field-context";

/** Figma Components → Information Collect → TextareaInput (301:6320) */
export type TextareaSize = "regular" | "big";

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  ref.current = value;
}

function resolveTextareaState(
  value: string | number | readonly string[] | undefined,
  defaultValue: string | number | readonly string[] | undefined,
  focused: boolean
): InputState {
  const current = value ?? defaultValue ?? "";
  if (String(current).length === 0) return "empty";
  return focused ? "typing" : "fill";
}

export type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> & {
  /** Figma `Size` */
  size?: TextareaSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Figma `Controller` — character counter + SymbolResize drag handle */
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
      error,
      disabled,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      style,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("Textarea");
    const rootRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(() =>
      String(defaultValue ?? "")
    );
    const [resizing, setResizing] = useState(false);
    const showController = showControllerProp ?? maxLength !== undefined;
    const resolvedSize = size ?? "regular";
    const resolvedValue = value !== undefined ? String(value) : internalValue;
    const displayLength = resolvedValue.length;
    const inputState = resolveTextareaState(resolvedValue, undefined, focused);
    const resolvedError = useResolvedControlError(error);

    const setTextareaRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        assignRef(ref, node);
      },
      [ref]
    );

    /** Clicks on padding / icon slots should focus the real control. */
    const handleShellMouseDown = useCallback(
      (event: ReactMouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        const target = event.target as HTMLElement | null;
        if (!target) return;
        if (target.closest(".aviala-textarea__resize-handle")) return;
        if (target.closest("textarea") === textareaRef.current) return;

        event.preventDefault();
        textareaRef.current?.focus();
      },
      [disabled]
    );

    const handleResizePointerDown = useCallback(
      (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (disabled || event.button !== 0) return;
        const root = rootRef.current;
        if (!root) return;

        event.preventDefault();
        event.stopPropagation();

        const handle = event.currentTarget;
        const startX = event.clientX;
        const startY = event.clientY;
        const startW = root.offsetWidth;
        const startH = root.offsetHeight;
        const styles = getComputedStyle(root);
        const minW = parseFloat(styles.minWidth) || 46;
        const minH = parseFloat(styles.minHeight) || 70;

        handle.setPointerCapture(event.pointerId);
        setResizing(true);

        const onMove = (ev: PointerEvent) => {
          const nextW = Math.max(
            minW,
            Math.round(startW + (ev.clientX - startX))
          );
          const nextH = Math.max(
            minH,
            Math.round(startH + (ev.clientY - startY))
          );
          root.style.width = `${nextW}px`;
          root.style.height = `${nextH}px`;
        };

        const onUp = (ev: PointerEvent) => {
          if (handle.hasPointerCapture(ev.pointerId)) {
            handle.releasePointerCapture(ev.pointerId);
          }
          handle.removeEventListener("pointermove", onMove);
          handle.removeEventListener("pointerup", onUp);
          handle.removeEventListener("pointercancel", onUp);
          setResizing(false);
        };

        handle.addEventListener("pointermove", onMove);
        handle.addEventListener("pointerup", onUp);
        handle.addEventListener("pointercancel", onUp);
      },
      [disabled]
    );

    useEffect(() => {
      if (!resizing) return;
      const previous = document.body.style.cursor;
      const previousUserSelect = document.body.style.userSelect;
      document.body.style.cursor = "nwse-resize";
      document.body.style.userSelect = "none";
      return () => {
        document.body.style.cursor = previous;
        document.body.style.userSelect = previousUserSelect;
      };
    }, [resizing]);

    return (
      <div
        ref={rootRef}
        className={cn("aviala-textarea", className)}
        data-size={resolvedSize}
        data-input-state={inputState}
        data-error={resolvedError ? "true" : undefined}
        data-has-controller={showController ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        data-resizing={resizing ? "true" : undefined}
        style={style}
        onMouseDown={handleShellMouseDown}
        {...spiralDebugId("textarea")}
      >
        {renderSlotIcon(
          leftIcon,
          "aviala-textarea__slot",
          "textarea.left-icon"
        )}

        <div
          className="aviala-textarea__field"
          {...spiralDebugId("textarea.field")}
        >
          <textarea
            ref={setTextareaRef}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={resolvedError || undefined}
            className={cn(
              "aviala-textarea__input",
              typographyVariants({ level: "text" })
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

        {renderSlotIcon(
          rightIcon,
          "aviala-textarea__slot",
          "textarea.right-icon"
        )}

        {showController ? (
          <div
            className="aviala-textarea__controller"
            {...spiralDebugId("textarea.controller")}
          >
            <span
              className={cn(
                "aviala-textarea__counter",
                typographyVariants({ level: "caption" })
              )}
              aria-hidden
            >
              {displayLength}
              {maxLength !== undefined ? `/${maxLength}` : ""}
            </span>
            <button
              type="button"
              className="aviala-textarea__resize-handle"
              aria-label={locale.resize}
              disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              onPointerDown={handleResizePointerDown}
              {...spiralDebugId("textarea.resize")}
            >
              <SymbolResize thickness="Regular" mode="default" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
