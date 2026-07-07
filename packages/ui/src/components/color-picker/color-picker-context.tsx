import { createContext, useContext } from "react";
import type { ColorFormat, HSVA } from "./color-utils";
import type { ColorPickerChangeMeta } from "./use-color-picker-state";

export type ColorPickerContextValue = {
  value: string;
  setValue: (value: string, meta?: ColorPickerChangeMeta) => void;
  format: ColorFormat;
  setFormat: (format: ColorFormat) => void;
  hsva: HSVA;
  setHsva: (partial: Partial<HSVA>, meta?: ColorPickerChangeMeta) => void;
  open: boolean;
  disabled?: boolean;
  presets?: string[];
  onPresetsChange?: (presets: string[]) => void;
  maxPresets: number;
};

export const ColorPickerContext = createContext<ColorPickerContextValue | null>(null);

export function useColorPickerContext() {
  const ctx = useContext(ColorPickerContext);
  if (!ctx) {
    throw new Error("ColorPicker compound components must be used within <ColorPicker>");
  }
  return ctx;
}

export function useOptionalColorPickerContext() {
  return useContext(ColorPickerContext);
}
