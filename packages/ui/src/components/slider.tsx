import * as SliderPrimitive from "@radix-ui/react-slider";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/utils";

/** Figma Components → Information Collect → Slider (384:21585) */
export type SliderSize = "default" | "big";
export type SliderType = "default" | "range";

const sliderVariants = cva("aviala-slider", {
  variants: {
    size: {
      default: "aviala-slider--size-default",
      big: "aviala-slider--size-big",
    },
    type: {
      default: "aviala-slider--type-default",
      range: "aviala-slider--type-range",
    },
  },
  defaultVariants: {
    size: "default",
    type: "default",
  },
});

export type SliderProps = Omit<
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  "orientation"
> &
  VariantProps<typeof sliderVariants> & {
    /** Figma `Type` — single thumb vs range (two thumbs) */
    type?: SliderType;
  };

export const Slider = forwardRef<HTMLSpanElement, SliderProps>(
  (
    {
      className,
      size = "default",
      type = "default",
      disabled,
      value,
      defaultValue,
      min = 0,
      max = 100,
      ...props
    },
    ref
  ) => {
    const resolvedType = type ?? "default";
    const resolvedSize = size ?? "default";
    const isRange = resolvedType === "range";
    const resolvedDefaultValue =
      defaultValue ?? (isRange ? [25, 75] : [50]);
    const thumbCount = isRange
      ? Math.max(2, value?.length ?? defaultValue?.length ?? 2)
      : 1;

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          sliderVariants({ size: resolvedSize, type: resolvedType }),
          className
        )}
        disabled={disabled}
        value={value}
        defaultValue={value == null ? resolvedDefaultValue : undefined}
        min={min}
        max={max}
        data-size={resolvedSize}
        data-type={resolvedType}
        data-disabled={disabled ? "true" : undefined}
        {...props}
      >
        <SliderPrimitive.Track className="aviala-slider__track">
          <SliderPrimitive.Range className="aviala-slider__range" />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }, (_, index) => (
          <SliderPrimitive.Thumb key={index} className="aviala-slider__thumb aviala-focus-ring" />
        ))}
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = "Slider";
