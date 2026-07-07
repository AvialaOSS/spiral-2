export type ColorFormat = "hex" | "rgb" | "oklch";

export type PaletteStep = {
  step: number;
  color: string;
  tone: number;
  chroma: number;
};

export type ColorEntry = {
  id: string;
  name: string;
  subtitle: string;
  baseColor: string;
  /** Built-in semantic families cannot be deleted. */
  isDefault?: boolean;
};

export type ColorEntryPalettes = {
  light: PaletteStep[];
  dark: PaletteStep[];
};
