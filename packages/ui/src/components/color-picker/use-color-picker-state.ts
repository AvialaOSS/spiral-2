import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_COLOR,
  fromHsva,
  parseColor,
  toHsva,
  type ColorFormat,
  type HSVA,
} from "./color-utils";

export type ColorPickerChangeMeta = { source?: string };

export type UseColorPickerStateOptions = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, meta?: ColorPickerChangeMeta) => void;
  format?: ColorFormat;
  defaultFormat?: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
};

export function useColorPickerState({
  value: controlledValue,
  defaultValue = DEFAULT_COLOR,
  onChange,
  format: controlledFormat,
  defaultFormat = "hex",
  onFormatChange,
}: UseColorPickerStateOptions) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [uncontrolledFormat, setUncontrolledFormat] = useState<ColorFormat>(defaultFormat);

  const value = controlledValue ?? uncontrolledValue;
  const format = controlledFormat ?? uncontrolledFormat;

  const setValue = useCallback(
    (next: string, meta?: ColorPickerChangeMeta) => {
      const normalized = parseColor(next).toHex();
      if (controlledValue === undefined) {
        setUncontrolledValue(normalized);
      }
      onChange?.(normalized, meta);
    },
    [controlledValue, onChange]
  );

  const hsva = useMemo(() => toHsva(value), [value]);

  const setHsva = useCallback(
    (partial: Partial<HSVA>, meta?: ColorPickerChangeMeta) => {
      setValue(fromHsva({ ...hsva, ...partial }), meta);
    },
    [hsva, setValue]
  );

  const setFormat = useCallback(
    (next: ColorFormat) => {
      if (controlledFormat === undefined) {
        setUncontrolledFormat(next);
      }
      onFormatChange?.(next);
    },
    [controlledFormat, onFormatChange]
  );

  return { value, format, setValue, hsva, setHsva, setFormat };
}
