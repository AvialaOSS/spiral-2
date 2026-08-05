import { useCallback, useEffect, useRef, useState } from "react";
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

function normalizeHex(value: string): string {
  return parseColor(value).toHex().toLowerCase();
}

/**
 * Keep HSVA as interaction source of truth so hue 360° (≡ hex red / 0°) does
 * not snap the spectrum thumb back to the start after a hex round-trip.
 */
export function useColorPickerState({
  value: controlledValue,
  defaultValue = DEFAULT_COLOR,
  onChange,
  format: controlledFormat,
  defaultFormat = "hex",
  onFormatChange,
}: UseColorPickerStateOptions) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [uncontrolledFormat, setUncontrolledFormat] =
    useState<ColorFormat>(defaultFormat);

  const value = controlledValue ?? uncontrolledValue;
  const format = controlledFormat ?? uncontrolledFormat;

  const [hsva, setHsvaState] = useState(() => toHsva(value));
  const hsvaRef = useRef(hsva);
  hsvaRef.current = hsva;

  const lastEmittedHexRef = useRef(normalizeHex(value));

  // Sync from props/parent only when the hex actually changed from outside
  // (not when we ourselves emitted an equivalent #ff0000 for h=360).
  useEffect(() => {
    const nextHex = normalizeHex(value);
    if (nextHex === lastEmittedHexRef.current) return;
    lastEmittedHexRef.current = nextHex;
    const nextHsva = toHsva(value);
    hsvaRef.current = nextHsva;
    setHsvaState(nextHsva);
  }, [value]);

  const emitHex = useCallback(
    (hex: string, meta?: ColorPickerChangeMeta) => {
      const normalized = parseColor(hex).toHex();
      lastEmittedHexRef.current = normalized.toLowerCase();
      if (controlledValue === undefined) {
        setUncontrolledValue(normalized);
      }
      onChange?.(normalized, meta);
    },
    [controlledValue, onChange]
  );

  const setValue = useCallback(
    (next: string, meta?: ColorPickerChangeMeta) => {
      const normalized = parseColor(next).toHex();
      const nextHsva = toHsva(normalized);
      hsvaRef.current = nextHsva;
      setHsvaState(nextHsva);
      emitHex(normalized, meta);
    },
    [emitHex]
  );

  const setHsva = useCallback(
    (partial: Partial<HSVA>, meta?: ColorPickerChangeMeta) => {
      const next = { ...hsvaRef.current, ...partial };
      hsvaRef.current = next;
      setHsvaState(next);
      emitHex(fromHsva(next), meta);
    },
    [emitHex]
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
