import type { ThemeVars } from "./generate-theme";

export type ApplyThemeOptions = {
  target?: HTMLElement;
  mode?: "light" | "dark";
  themeId?: string;
};

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

  if (options.themeId || vars["--aviala-theme-id"]) {
    target.setAttribute(
      "data-theme",
      options.themeId ?? vars["--aviala-theme-id"] ?? "default"
    );
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
