import { useCallback, type CSSProperties } from "react";
import { spiralDebugId } from "../../lib/spiral-debug";
import { cn } from "../../lib/utils";
import { Slider } from "../slider";
import { hueGradientStops, solidHex } from "./color-utils";
import { useOptionalColorPickerContext } from "./color-picker-context";
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

  const sliderValue =
    kind === "hue" ? [hsva.h] : [Math.round(hsva.a * 100)];

  const handleValueChange = useCallback(
    (next: number[]) => {
      const raw = next[0] ?? 0;
      if (kind === "hue") {
        setHsva({ h: raw }, { source: "hue" });
      } else {
        setHsva({ a: raw / 100 }, { source: "alpha" });
      }
    },
    [kind, setHsva]
  );

  const trackBg =
    kind === "hue"
      ? `linear-gradient(90deg, ${hueGradientStops()})`
      : `linear-gradient(90deg, transparent, ${solidHex(value)}), var(--color-picker-checkerboard)`;

  return (
    <div
      className={cn("aviala-color-picker-slider-row", className)}
      style={
        {
          "--color-picker-slider-track-bg": trackBg,
        } as CSSProperties
      }
      {...spiralDebugId(`color-picker.content.${kind}-slider`)}
    >
      <Slider
        className="aviala-color-picker-slider"
        size="default"
        min={0}
        max={kind === "hue" ? 360 : 100}
        step={1}
        value={sliderValue}
        onValueChange={handleValueChange}
        disabled={isDisabled}
        aria-label={kind === "hue" ? "Hue" : "Opacity"}
      />
    </div>
  );
}
