import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { TypefacePair } from "./typeface";

/** Figma Components → Information Collect → Radio */
export type RadioGroupDirection = "vertical" | "horizontal";
export type RadioInputVariant = "normal" | "card";

export type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
  /** Figma Radio Input Group `Direction` */
  direction?: RadioGroupDirection;
};

export const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, direction = "vertical", ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn("aviala-radio-group", className)}
    data-direction={direction}
    ref={ref}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

export const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn("aviala-radio aviala-focus-ring", className)}
    {...props}
  >
    <span aria-hidden className="aviala-radio__surface" />
    <span aria-hidden className="aviala-radio__indicator" />
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

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

  return <span className="aviala-radio-input__icon">{content}</span>;
}

export type RadioInputProps = Omit<RadioGroupItemProps, "children"> & {
  /** Figma Typeface primary line */
  title: ReactNode;
  /** Figma Typeface caption line */
  description?: ReactNode;
  icon?: ReactNode;
  /** Figma Radio Input `Style` */
  variant?: RadioInputVariant;
};

export const RadioInput = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioInputProps
>(
  (
    {
      className,
      title,
      description,
      icon,
      variant = "normal",
      disabled,
      id,
      ...props
    },
    ref
  ) => (
    <label
      htmlFor={id}
      className={cn("aviala-radio-input", className)}
      data-style={variant}
      data-disabled={disabled ? "true" : undefined}
    >
      <RadioGroupItem ref={ref} id={id} disabled={disabled} {...props} />
      {renderIcon(icon)}
      <TypefacePair
        className="aviala-radio-input__content min-w-0 flex-1"
        title={title}
        description={description}
      />
    </label>
  )
);
RadioInput.displayName = "RadioInput";
