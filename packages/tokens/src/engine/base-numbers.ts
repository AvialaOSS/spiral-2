export type BaseNumbersDensity = "default" | "mobile-friendly";

export const BASE_NUMBERS_FILES: Record<BaseNumbersDensity, string> = {
  default: "Components/base-numbers/Default.tokens.json",
  "mobile-friendly": "Components/base-numbers/Mobile Friendly.tokens.json",
};

export const BASE_NUMBERS_DENSITY_ATTR = "data-density";

export function applyBaseNumbersDensity(
  target: HTMLElement,
  density: BaseNumbersDensity = "default"
): void {
  if (density === "mobile-friendly") {
    target.setAttribute(BASE_NUMBERS_DENSITY_ATTR, "mobile-friendly");
  } else {
    target.removeAttribute(BASE_NUMBERS_DENSITY_ATTR);
  }
}
