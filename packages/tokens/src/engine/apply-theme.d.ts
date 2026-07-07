import { type BaseNumbersDensity } from "./base-numbers";
import type { ThemeVars } from "./generate-theme";
export type ApplyThemeOptions = {
    target?: HTMLElement;
    mode?: "light" | "dark";
    themeId?: string;
    density?: BaseNumbersDensity;
};
export type { BaseNumbersDensity } from "./base-numbers";
export declare function applyTheme(vars: ThemeVars, options?: ApplyThemeOptions): void;
export declare function removeTheme(target?: HTMLElement): void;
//# sourceMappingURL=apply-theme.d.ts.map