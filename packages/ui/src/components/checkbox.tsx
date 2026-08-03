import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { TypefacePair } from "./typeface";
import { CheckboxCheckIcon } from "./checkbox-check-icon";

/** Figma Components → Information Collect → Checkbox */
export type CheckboxGroupDirection = "vertical" | "horizontal";

/** Figma Checkbox `Size` — Default → `default`, Huge → `huge` */
export type CheckboxSize = "default" | "huge";

export type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  /** Figma Checkbox `Round` */
  round?: boolean;
  /** Figma Checkbox `Size` */
  size?: CheckboxSize;
};

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, round = false, size = "default", ...props }, ref) => {
  /** Skip enter transitions on first paint (defaultChecked / controlled initial). */
  const [motionReady, setMotionReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMotionReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn("aviala-checkbox aviala-focus-ring", className)}
      data-round={round ? "true" : undefined}
      data-size={size}
      data-motion={motionReady ? "ready" : "boot"}
      {...props}
    >
      <span aria-hidden className="aviala-checkbox__surface" />
      <CheckboxPrimitive.Indicator forceMount className="aviala-checkbox__indicator">
        <CheckboxCheckIcon className="aviala-checkbox__indicator-icon aviala-checkbox__indicator-icon--check" />
        <span
          aria-hidden
          className="aviala-checkbox__indeterminate-mark aviala-checkbox__indicator-icon--indeterminate"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export type CheckboxGroupProps = ComponentPropsWithoutRef<"div"> & {
  /** Figma Checkbox Input Group `Direction` */
  direction?: CheckboxGroupDirection;
};

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ className, direction = "vertical", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("aviala-checkbox-group", className)}
      data-direction={direction}
      {...props}
    />
  )
);
CheckboxGroup.displayName = "CheckboxGroup";

function renderIcon(node: ReactNode): ReactNode {
  if (!node) return null;
  const icon = 18;
  const content =
    isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(node as ReactElement<{ width?: number; height?: number; className?: string }>, {
          width: icon,
          height: icon,
          className: cn(
            (node as ReactElement<{ className?: string }>).props.className,
            "shrink-0"
          ),
        })
      : node;

  return <span className="aviala-checkbox-input__icon">{content}</span>;
}

export type CheckboxInputProps = Omit<CheckboxProps, "children"> & {
  /** Figma Typeface primary line */
  title: ReactNode;
  /** Figma Typeface caption line */
  description?: ReactNode;
  icon?: ReactNode;
};

export const CheckboxInput = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxInputProps
>(
  (
    {
      className,
      title,
      description,
      icon,
      disabled,
      id,
      ...props
    },
    ref
  ) => (
    <label
      htmlFor={id}
      className={cn("aviala-checkbox-input", className)}
      data-disabled={disabled ? "true" : undefined}
    >
      <Checkbox ref={ref} id={id} disabled={disabled} {...props} />
      {renderIcon(icon)}
      <TypefacePair
        className="aviala-checkbox-input__content min-w-0 flex-1"
        title={title}
        description={description}
      />
    </label>
  )
);
CheckboxInput.displayName = "CheckboxInput";
