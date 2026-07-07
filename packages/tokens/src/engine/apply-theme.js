import { applyBaseNumbersDensity } from "./base-numbers";
export function applyTheme(vars, options = {}) {
    const target = options.target ??
        (typeof document !== "undefined" ? document.documentElement : null);
    if (!target)
        return;
    const mode = options.mode ?? vars["--aviala-mode"] ?? "light";
    target.setAttribute("data-mode", mode);
    const density = options.density ??
        vars["--aviala-density"] ??
        "default";
    applyBaseNumbersDensity(target, density);
    if (options.themeId || vars["--aviala-theme-id"]) {
        target.setAttribute("data-theme", options.themeId ?? vars["--aviala-theme-id"] ?? "default");
    }
    for (const [key, value] of Object.entries(vars)) {
        target.style.setProperty(key, value);
    }
}
export function removeTheme(target = document.documentElement) {
    const style = target.style;
    const toRemove = [];
    for (let i = 0; i < style.length; i++) {
        const prop = style.item(i);
        if (prop.startsWith("--"))
            toRemove.push(prop);
    }
    toRemove.forEach((prop) => style.removeProperty(prop));
}
