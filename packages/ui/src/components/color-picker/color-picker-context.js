import { createContext, useContext } from "react";
export const ColorPickerContext = createContext(null);
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
