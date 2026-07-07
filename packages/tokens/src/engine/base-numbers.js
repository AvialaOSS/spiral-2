export const BASE_NUMBERS_FILES = {
    default: "Components/base-numbers/Default.tokens.json",
    "mobile-friendly": "Components/base-numbers/Mobile Friendly.tokens.json",
};
export const BASE_NUMBERS_DENSITY_ATTR = "data-density";
export function applyBaseNumbersDensity(target, density = "default") {
    if (density === "mobile-friendly") {
        target.setAttribute(BASE_NUMBERS_DENSITY_ATTR, "mobile-friendly");
    }
    else {
        target.removeAttribute(BASE_NUMBERS_DENSITY_ATTR);
    }
}
