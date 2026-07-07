import { cn } from "../../lib/utils";
import { ColorPickerArea } from "./color-picker-area";
import { ColorPickerInputs } from "./color-picker-inputs";
import { ColorPickerPresets } from "./color-picker-presets";
import { ColorPickerSlider } from "./color-picker-slider";
import { ColorPickerContext } from "./color-picker-context";
import { useColorPickerState, type UseColorPickerStateOptions } from "./use-color-picker-state";

export type ColorPickerPanelProps = UseColorPickerStateOptions & {
  className?: string;
  disabled?: boolean;
  presets?: string[];
  onPresetsChange?: (presets: string[]) => void;
  maxPresets?: number;
  showEyedropper?: boolean;
  showPresets?: boolean;
};

export function ColorPickerPanel({
  className,
  disabled,
  presets,
  onPresetsChange,
  maxPresets = 8,
  showEyedropper = true,
  showPresets = true,
  value,
  defaultValue,
  onChange,
  format,
  defaultFormat,
  onFormatChange,
}: ColorPickerPanelProps) {
  const state = useColorPickerState({
    value,
    defaultValue,
    onChange,
    format,
    defaultFormat,
    onFormatChange,
  });

  const contextValue = {
    ...state,
    open: true,
    disabled,
    presets,
    onPresetsChange,
    maxPresets,
  };

  return (
    <ColorPickerContext.Provider value={contextValue}>
      <div className={cn("aviala-color-picker-panel", className)}>
        <ColorPickerArea disabled={disabled} />
        <ColorPickerSlider kind="hue" disabled={disabled} />
        <ColorPickerSlider kind="alpha" disabled={disabled} />
        <ColorPickerInputs disabled={disabled} showEyedropper={showEyedropper} />
        {showPresets ? (
          <ColorPickerPresets
            disabled={disabled}
            presets={presets}
            onPresetsChange={onPresetsChange}
            maxPresets={maxPresets}
          />
        ) : null}
      </div>
    </ColorPickerContext.Provider>
  );
}
