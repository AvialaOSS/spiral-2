import { useCallback, useMemo, useState } from "react";
import { DEFAULT_COLOR, fromHsva, parseColor, toHsva, } from "./color-utils";
export function useColorPickerState({ value: controlledValue, defaultValue = DEFAULT_COLOR, onChange, format: controlledFormat, defaultFormat = "hex", onFormatChange, }) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const [uncontrolledFormat, setUncontrolledFormat] = useState(defaultFormat);
    const value = controlledValue ?? uncontrolledValue;
    const format = controlledFormat ?? uncontrolledFormat;
    const setValue = useCallback((next, meta) => {
        const normalized = parseColor(next).toHex();
        if (controlledValue === undefined) {
            setUncontrolledValue(normalized);
        }
        onChange?.(normalized, meta);
    }, [controlledValue, onChange]);
    const hsva = useMemo(() => toHsva(value), [value]);
    const setHsva = useCallback((partial, meta) => {
        setValue(fromHsva({ ...hsva, ...partial }), meta);
    }, [hsva, setValue]);
    const setFormat = useCallback((next) => {
        if (controlledFormat === undefined) {
            setUncontrolledFormat(next);
        }
        onFormatChange?.(next);
    }, [controlledFormat, onFormatChange]);
    return { value, format, setValue, hsva, setHsva, setFormat };
}
