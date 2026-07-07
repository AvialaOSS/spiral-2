import { type Colord } from "colord";
export type ColorFormat = "hex" | "rgb" | "hsl";
export type HSVA = {
    h: number;
    s: number;
    v: number;
    a: number;
};
export declare const DEFAULT_COLOR = "#FF0000";
export declare function parseColor(value?: string): Colord;
export declare function toHsva(value: string): HSVA;
export declare function fromHsva(hsva: HSVA): string;
export declare function toHexInput(value: string, includeAlpha?: boolean): string;
export declare function fromHexInput(input: string, alpha?: number): string;
export declare function alphaPercent(value: string): number;
export declare function setAlphaPercent(value: string, percent: number): string;
export declare function toRgbComponents(value: string): {
    r: number;
    g: number;
    b: number;
};
export declare function fromRgbComponents(r: number, g: number, b: number, alpha?: number): string;
export declare function toHslComponents(value: string): {
    h: number;
    s: number;
    l: number;
};
export declare function fromHslComponents(h: number, s: number, l: number, alpha?: number): string;
export declare function pureHueHex(h: number): string;
export declare function solidHex(value: string): string;
export declare function hueGradientStops(): string;
export declare function clamp01(n: number): number;
//# sourceMappingURL=color-utils.d.ts.map