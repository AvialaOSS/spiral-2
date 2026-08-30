import { colord, type Colord } from "colord";

export type ColorFormat = "hex" | "rgb" | "hsl";

export type HSVA = { h: number; s: number; v: number; a: number };

export const DEFAULT_COLOR = "#FF0000";

export function parseColor(value?: string): Colord {
  const c = colord(value ?? DEFAULT_COLOR);
  return c.isValid() ? c : colord(DEFAULT_COLOR);
}

export function toHsva(value: string): HSVA {
  const { h, s, v, a } = parseColor(value).toHsv();
  return { h, s, v, a: a ?? 1 };
}

export function fromHsva(hsva: HSVA): string {
  return colord({ h: hsva.h, s: hsva.s, v: hsva.v, a: hsva.a }).toHex();
}

export function toHexInput(value: string, includeAlpha = false): string {
  const hex = parseColor(value).toHex().replace(/^#/, "").toUpperCase();
  return includeAlpha ? hex : hex.slice(0, 6);
}

export function fromHexInput(input: string, alpha = 1): string {
  const cleaned = input.replace(/^#/, "").trim();
  if (!cleaned) return parseColor(DEFAULT_COLOR).alpha(alpha).toHex();
  const base = cleaned.slice(0, 6);
  const alphaHex = cleaned.length >= 8 ? cleaned.slice(6, 8) : undefined;
  let c = parseColor(`#${base}`);
  if (alphaHex) {
    c = c.alpha(parseInt(alphaHex, 16) / 255);
  } else if (alpha < 1) {
    c = c.alpha(alpha);
  }
  return c.toHex();
}

export function alphaPercent(value: string): number {
  return Math.round(parseColor(value).alpha() * 100);
}

export function setAlphaPercent(value: string, percent: number): string {
  const clamped = Math.min(100, Math.max(0, percent));
  return parseColor(value)
    .alpha(clamped / 100)
    .toHex();
}

export function toRgbComponents(value: string) {
  const { r, g, b } = parseColor(value).toRgb();
  return { r, g, b };
}

export function fromRgbComponents(
  r: number,
  g: number,
  b: number,
  alpha = 1
): string {
  return colord({ r, g, b, a: alpha }).toHex();
}

export function toHslComponents(value: string) {
  const { h, s, l } = parseColor(value).toHsl();
  return { h: Math.round(h), s: Math.round(s), l: Math.round(l) };
}

export function fromHslComponents(
  h: number,
  s: number,
  l: number,
  alpha = 1
): string {
  return colord({ h, s, l, a: alpha }).toHex();
}

export function pureHueHex(h: number): string {
  return colord({ h, s: 100, v: 100 }).toHex();
}

export function solidHex(value: string): string {
  const { r, g, b } = parseColor(value).toRgb();
  return colord({ r, g, b, a: 1 }).toHex();
}

export function hueGradientStops(): string {
  return [0, 60, 120, 180, 240, 300, 360]
    .map((h) => colord({ h, s: 100, v: 100 }).toHex())
    .join(", ");
}

export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}
