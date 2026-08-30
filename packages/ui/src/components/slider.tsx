import * as SliderPrimitive from "@radix-ui/react-slider";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useLayoutEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { OverlayPointerSvg, TOOLTIP_POINTER } from "./overlay-pointer";
import { typographyVariants } from "./typography";

/** Figma Components → Information Collect → Slider (384:21585) */
export type SliderSize = "default" | "big";
export type SliderType = "default" | "range";

type SliderRootProps = ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;
type SliderPointerHandler = SliderRootProps["onPointerMove"];

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

export type SliderProps = SliderRootProps &
  VariantProps<typeof sliderVariants> & {
    /** Figma `Type` — single thumb vs range (two thumbs) */
    type?: SliderType;
    /** Figma volume popover and other vertical tracks — `horizontal` (default) or `vertical`. */
    orientation?: "horizontal" | "vertical";
    /**
     * When true, hovering a thumb (and while dragging it) shows a value
     * tooltip bound to that thumb.
     */
    showValueTooltip?: boolean;
    /** Format the value tooltip label. Defaults to `String(value)`. */
    formatValueTooltip?: (value: number, index: number) => ReactNode;
  };

function SliderValueTooltip({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className="aviala-slider__value-tooltip"
      data-state={open ? "instant-open" : "closed"}
      aria-hidden={!open}
    >
      <span
        className={cn(
          "aviala-slider__value-tooltip__surface",
          typographyVariants({ level: "caption" })
        )}
      >
        {children}
      </span>
      <span className="aviala-slider__value-tooltip__arrow" aria-hidden>
        <OverlayPointerSvg
          className="aviala-tooltip-content__arrow"
          width={TOOLTIP_POINTER.width}
          height={TOOLTIP_POINTER.height}
          path={TOOLTIP_POINTER.path}
        />
      </span>
    </span>
  );
}

function SliderThumb({
  index,
  value,
  showValueTooltip,
  formatValueTooltip,
  forceTooltipOpen,
  onThumbPointerDown,
}: {
  index: number;
  value: number;
  showValueTooltip: boolean;
  formatValueTooltip?: (value: number, index: number) => ReactNode;
  forceTooltipOpen: boolean;
  onThumbPointerDown: () => void;
}) {
  const [hoverOpen, setHoverOpen] = useState(false);
  const tooltipOpen = Boolean(
    showValueTooltip && (forceTooltipOpen || hoverOpen)
  );
  const label = formatValueTooltip
    ? formatValueTooltip(value, index)
    : String(value);

  return (
    <SliderPrimitive.unstable_ThumbProvider>
      <SliderPrimitive.unstable_ThumbTrigger
        className="aviala-slider__thumb aviala-focus-ring"
        onPointerDown={onThumbPointerDown}
        onPointerEnter={showValueTooltip ? () => setHoverOpen(true) : undefined}
        onPointerLeave={
          showValueTooltip ? () => setHoverOpen(false) : undefined
        }
      >
        <span className="aviala-slider__thumb-face" aria-hidden />
        {showValueTooltip ? (
          <SliderValueTooltip open={tooltipOpen}>{label}</SliderValueTooltip>
        ) : null}
      </SliderPrimitive.unstable_ThumbTrigger>
      <SliderPrimitive.unstable_BubbleInput />
    </SliderPrimitive.unstable_ThumbProvider>
  );
}

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
      onValueChange,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture,
      showValueTooltip = false,
      formatValueTooltip,
      orientation,
      ...props
    },
    ref
  ) => {
    const resolvedType = type ?? "default";
    const resolvedSize = size ?? "default";
    const isRange = resolvedType === "range";
    const resolvedDefaultValue = defaultValue ?? (isRange ? [25, 75] : [50]);
    const thumbCount = isRange
      ? Math.max(2, value?.length ?? defaultValue?.length ?? 2)
      : 1;
    // Transition left/right on click/keyboard jumps; disable once the pointer moves
    // so dragging stays 1:1 with the cursor.
    const [isDragging, setIsDragging] = useState(false);
    // Pointer is down on the slider — keep the active thumb’s value tooltip open
    // (including track presses) without waiting for a move.
    const [pointerDown, setPointerDown] = useState(false);
    const [activeThumbIndex, setActiveThumbIndex] = useState<number | null>(
      null
    );
    // Keep value transitions off until Radix has painted the real thumb/range
    // insets — otherwise remount/reload animates from the unset (0) position.
    // Gate is keyed by type/orientation so Root remounts and axis swaps stay instant.
    const valueTransitionAxisKey = `${resolvedType}:${orientation ?? "horizontal"}`;
    const [valueTransitionGate, setValueTransitionGate] = useState({
      axisKey: valueTransitionAxisKey,
      ready: false,
    });
    const valueTransitionReady =
      valueTransitionGate.axisKey === valueTransitionAxisKey &&
      valueTransitionGate.ready;
    const [uncontrolledValue, setUncontrolledValue] =
      useState<number[]>(resolvedDefaultValue);
    const currentValues = value ?? uncontrolledValue;

    useLayoutEffect(() => {
      let frame2 = 0;
      const frame1 = requestAnimationFrame(() => {
        frame2 = requestAnimationFrame(() => {
          setValueTransitionGate({
            axisKey: valueTransitionAxisKey,
            ready: true,
          });
        });
      });
      return () => {
        cancelAnimationFrame(frame1);
        cancelAnimationFrame(frame2);
      };
    }, [valueTransitionAxisKey]);

    const handleValueChange = (next: number[]) => {
      if (value == null) setUncontrolledValue(next);
      if (showValueTooltip) {
        const prev = currentValues;
        const changed = next.findIndex((v, i) => v !== prev[i]);
        if (changed >= 0) setActiveThumbIndex(changed);
      }
      onValueChange?.(next);
    };

    const handlePointerDown: SliderRootProps["onPointerDown"] = (event) => {
      if (showValueTooltip && !disabled) setPointerDown(true);
      onPointerDown?.(event);
    };

    const handlePointerMove: SliderPointerHandler = (event) => {
      if (event.buttons !== 0) setIsDragging(true);
      onPointerMove?.(event);
    };

    const endPointer = () => {
      setIsDragging(false);
      setPointerDown(false);
      setActiveThumbIndex(null);
    };

    const handlePointerUp: SliderRootProps["onPointerUp"] = (event) => {
      endPointer();
      onPointerUp?.(event);
    };

    const handlePointerCancel: SliderRootProps["onPointerCancel"] = (event) => {
      endPointer();
      onPointerCancel?.(event);
    };

    const handleLostPointerCapture: SliderRootProps["onLostPointerCapture"] = (
      event
    ) => {
      endPointer();
      onLostPointerCapture?.(event);
    };

    return (
      <SliderPrimitive.Root
        // Remount when Type changes — Radix keeps internal value; switching
        // default↔range with a stale arity leaves the second thumb at display:none.
        key={resolvedType}
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
        data-dragging={isDragging ? "true" : undefined}
        data-value-transition={valueTransitionReady ? "true" : undefined}
        data-value-tooltip={showValueTooltip ? "true" : undefined}
        orientation={orientation}
        onValueChange={handleValueChange}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handleLostPointerCapture}
        {...props}
      >
        <SliderPrimitive.Track className="aviala-slider__track">
          <SliderPrimitive.Range className="aviala-slider__range" />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }, (_, index) => {
          const thumbValue =
            currentValues[index] ??
            resolvedDefaultValue[index] ??
            (isRange ? (index === 0 ? min : max) : min + (max - min) / 2);

          const forceTooltipOpen =
            pointerDown &&
            (activeThumbIndex === index ||
              (activeThumbIndex == null && thumbCount === 1 && index === 0));

          return (
            <SliderThumb
              key={index}
              index={index}
              value={thumbValue}
              showValueTooltip={Boolean(showValueTooltip && !disabled)}
              formatValueTooltip={formatValueTooltip}
              forceTooltipOpen={forceTooltipOpen}
              onThumbPointerDown={() => setActiveThumbIndex(index)}
            />
          );
        })}
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = "Slider";
