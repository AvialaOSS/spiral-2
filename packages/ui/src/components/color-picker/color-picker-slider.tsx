import { useCallback, useRef } from "react";
import { spiralDebugId } from "../../lib/spiral-debug";
import { cn } from "../../lib/utils";
import { clamp01, hueGradientStops, solidHex } from "./color-utils";
import { useOptionalColorPickerContext } from "./color-picker-context";
import { usePointerDrag } from "./use-pointer-drag";
import { useColorPickerState, type UseColorPickerStateOptions } from "./use-color-picker-state";

export type ColorPickerSliderKind = "hue" | "alpha";

export type ColorPickerSliderProps = {
  kind: ColorPickerSliderKind;
  className?: string;
  disabled?: boolean;
} & Pick<UseColorPickerStateOptions, "value" | "defaultValue" | "onChange">;

export function ColorPickerSlider({
  kind,
  className,
  disabled,
  value: valueProp,
  defaultValue,
  onChange,
}: ColorPickerSliderProps) {
  const ctx = useOptionalColorPickerContext();
  const local = useColorPickerState({
    value: ctx ? undefined : valueProp,
    defaultValue: ctx?.value ?? defaultValue,
    onChange: ctx ? undefined : onChange,
  });

  const { value, hsva, setHsva } = ctx ?? local;
  const isDisabled = disabled ?? ctx?.disabled;

  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (x: number) => {
      if (isDisabled) return;
      const ratio = clamp01(x);
      if (kind === "hue") {
        setHsva({ h: ratio * 360 }, { source: "hue" });
      } else {
        setHsva({ a: ratio }, { source: "alpha" });
      }
    },
    [isDisabled, kind, setHsva]
  );

  const handleMove2d = useCallback(
    (x: number, _y: number) => {
      handleMove(x);
    },
    [handleMove]
  );

  const { handlePointerDown, handlePointerMove } = usePointerDrag(
    ref,
    handleMove2d,
    !isDisabled
  );

  const thumbLeft = kind === "hue" ? (hsva.h / 360) * 100 : hsva.a * 100;
  const ariaValueNow = kind === "hue" ? Math.round(hsva.h) : Math.round(hsva.a * 100);
  const ariaMax = kind === "hue" ? 360 : 100;

  const trackStyle =
    kind === "hue"
      ? { background: `linear-gradient(90deg, ${hueGradientStops()})` }
      : {
          backgroundImage: `linear-gradient(90deg, transparent, ${solidHex(value)})`,
          backgroundColor: "var(--color-picker-checkerboard)",
        };

  return (
    <div
      className={cn("aviala-color-picker-slider-row", className)}
      {...spiralDebugId(`color-picker.content.${kind}-slider`)}
    >
      <div
        ref={ref}
        className="aviala-color-picker-slider aviala-focus-ring"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        role="slider"
        aria-label={kind === "hue" ? "Hue" : "Opacity"}
        aria-valuemin={0}
        aria-valuemax={ariaMax}
        aria-valuenow={ariaValueNow}
        tabIndex={isDisabled ? -1 : 0}
      >
        <div className="aviala-color-picker-slider__track" style={trackStyle} />
        <div
          className="aviala-color-picker-slider__thumb"
          style={{ left: `${thumbLeft}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
