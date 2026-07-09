import { applyBaseNumbersDensity, type BaseNumbersDensity } from "./base-numbers";
import type { ThemeVars } from "./generate-theme";

export type ApplyThemeOptions = {
  target?: HTMLElement;
  mode?: "light" | "dark";
  themeId?: string;
  density?: BaseNumbersDensity;
};

export type { BaseNumbersDensity } from "./base-numbers";

export function applyTheme(
  vars: ThemeVars,
  options: ApplyThemeOptions = {}
): void {
  const target =
    options.target ??
    (typeof document !== "undefined" ? document.documentElement : null);

  if (!target) return;

  const mode = options.mode ?? vars["--aviala-mode"] ?? "light";
  target.setAttribute("data-mode", mode);

  const density =
    options.density ??
    (vars["--aviala-density"] as BaseNumbersDensity | undefined) ??
    "default";
  applyBaseNumbersDensity(target, density);

  const themeId = options.themeId ?? vars["--aviala-theme-id"];
  if (themeId) {
    target.setAttribute("data-theme", themeId);
  } else {
    // Leaving a static preset (e.g. ald) must drop data-theme so frozen
    // [data-theme="ald"] CSS no longer overrides dynamic inline vars.
    target.removeAttribute("data-theme");
    target.style.removeProperty("--aviala-theme-id");
  }

  for (const [key, value] of Object.entries(vars)) {
    target.style.setProperty(key, value);
  }
}

export function removeTheme(target: HTMLElement = document.documentElement): void {
  const style = target.style;
  const toRemove: string[] = [];
  for (let i = 0; i < style.length; i++) {
    const prop = style.item(i);
    if (prop.startsWith("--")) toRemove.push(prop);
  }
  toRemove.forEach((prop) => style.removeProperty(prop));
}
