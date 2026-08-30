import { useCallback, type CSSProperties } from "react";
import { spiralDebugId } from "../../lib/spiral-debug";
import { cn } from "../../lib/utils";
import { useLocaleMessages } from "../../locale";
import { Slider } from "../slider";
import { hueGradientStops, solidHex, toRgbComponents } from "./color-utils";
import { useOptionalColorPickerContext } from "./color-picker-context";
import {
  useColorPickerState,
  type UseColorPickerStateOptions,
} from "./use-color-picker-state";

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
  const locale = useLocaleMessages("ColorPicker");
  const ctx = useOptionalColorPickerContext();
  const local = useColorPickerState({
    value: ctx ? undefined : valueProp,
    defaultValue: ctx?.value ?? defaultValue,
    onChange: ctx ? undefined : onChange,
  });

  const { value, hsva, setHsva } = ctx ?? local;
  const isDisabled = disabled ?? ctx?.disabled;

  const sliderValue = kind === "hue" ? [hsva.h] : [Math.round(hsva.a * 100)];

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

  // Hue: spectrum only. Alpha: same-hue 0→1 (avoid `transparent` muddy lerp);
  // checkerboard sits under the gradient in CSS.
  // Literal rgb()/hex is required here: these track gradients render the user's
  // picked color, which is runtime color math and has no design token equivalent.
  const trackBg =
    kind === "hue"
      ? `linear-gradient(90deg, ${hueGradientStops()})`
      : (() => {
          const solid = solidHex(value);
          const { r, g, b } = toRgbComponents(solid);
          return `linear-gradient(90deg, rgba(${r},${g},${b},0), ${solid})`;
        })();

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
        data-kind={kind}
        size="big"
        min={0}
        max={kind === "hue" ? 360 : 100}
        step={1}
        value={sliderValue}
        onValueChange={handleValueChange}
        disabled={isDisabled}
        aria-label={kind === "hue" ? locale.hue : locale.opacity}
      />
    </div>
  );
}
