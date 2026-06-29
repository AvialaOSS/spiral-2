import { DEFAULT_PRIMARY } from "./variable-map";

export type ThemePreset = {
  id: string;
  name: string;
  primary: string;
  description?: string;
};

export const presets: Record<string, ThemePreset> = {
  default: {
    id: "default",
    name: "Aviala Default",
    primary: DEFAULT_PRIMARY,
    description: "Default Aviala Design theme (primary #FF5532)",
  },
  blue: {
    id: "blue",
    name: "Brand Blue",
    primary: "#165DFF",
    description: "Blue brand theme",
  },
  red: {
    id: "red",
    name: "Brand Red",
    primary: "#F53F3F",
    description: "Red brand theme",
  },
};

export const presetList = Object.values(presets);

export function getPreset(id: string): ThemePreset | undefined {
  return presets[id];
}
