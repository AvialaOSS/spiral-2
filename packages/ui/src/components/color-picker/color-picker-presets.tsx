import { SymbolAdd } from "@aviala/icons";
import { Button } from "../button";
import { spiralDebugId } from "../../lib/spiral-debug";
import { cn } from "../../lib/utils";
import { parseColor } from "./color-utils";
import { ColorPickButton } from "./color-pick-button";
import { useOptionalColorPickerContext } from "./color-picker-context";

export type ColorPickerPresetsProps = {
  className?: string;
  presets?: string[];
  onPresetsChange?: (presets: string[]) => void;
  maxPresets?: number;
  disabled?: boolean;
};

export function ColorPickerPresets({
  className,
  presets: presetsProp,
  onPresetsChange: onPresetsChangeProp,
  maxPresets: maxPresetsProp,
  disabled,
}: ColorPickerPresetsProps) {
  const ctx = useOptionalColorPickerContext();
  const presets = presetsProp ?? ctx?.presets ?? [];
  const onPresetsChange = onPresetsChangeProp ?? ctx?.onPresetsChange;
  const maxPresets = maxPresetsProp ?? ctx?.maxPresets ?? 8;
  const isDisabled = disabled ?? ctx?.disabled;
  const value = ctx?.value;
  const setValue = ctx?.setValue;

  const handleAdd = () => {
    if (!onPresetsChange || !value || isDisabled) return;
    const normalized = parseColor(value).toHex();
    if (presets.includes(normalized)) return;
    const next = [...presets, normalized].slice(-maxPresets);
    onPresetsChange(next);
  };

  return (
    <div className={cn("aviala-color-picker-presets", className)} {...spiralDebugId("color-picker.content.presets")}>
      <Button
        type="button"
        mode="defaultCustom"
        size="regular"
        iconOnly
        disabled={isDisabled || !onPresetsChange || presets.length >= maxPresets}
        aria-label="Add current color to presets"
        onClick={handleAdd}
      >
        <SymbolAdd aria-hidden />
      </Button>
      {presets.map((color) => (
        <ColorPickButton
          key={color}
          color={color}
          selected={value === color}
          disabled={isDisabled}
          onClick={() => setValue?.(color, { source: "preset" })}
        />
      ))}
    </div>
  );
}
