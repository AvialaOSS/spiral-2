import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../lib/utils";
const loadingVariants = cva("aviala-loading", {
    variants: {
        level: {
            display: "aviala-loading--level-display",
            headline1: "aviala-loading--level-headline1",
            headline2: "aviala-loading--level-headline2",
            title: "aviala-loading--level-title",
            subtitle: "aviala-loading--level-subtitle",
            text: "aviala-loading--level-text",
            caption: "aviala-loading--level-caption",
        },
        mode: {
            theme: "aviala-loading--mode-theme",
            themeText: "aviala-loading--mode-themeText",
            black: "aviala-loading--mode-black",
            white: "aviala-loading--mode-white",
            inherit: "aviala-loading--mode-inherit",
        },
        lineHeightFix: {
            true: "aviala-loading--line-height-fix",
            false: "",
        },
    },
    defaultVariants: {
        level: "text",
        mode: "theme",
        lineHeightFix: true,
    },
});
const BUTTON_SIZE_TO_LOADING_LEVEL = {
    tiny: "caption",
    small: "text",
    regular: "text",
    big: "text",
};
export function loadingLevelForButtonSize(size) {
    return BUTTON_SIZE_TO_LOADING_LEVEL[size];
}
/** Conic ring fill — inline so theme tokens apply reliably (CSS vars do not inherit into foreignObject). */
function loadingRingStyle(mode) {
    const themeFg = "var(--control-control-theme-background, var(--aviala-primary-primary-8, #ff856b))";
    const themeTextFg = "var(--text-text-theme-primary-black, var(--aviala-primary-primary-10, #d52b04))";
    const blackFg = "var(--text-text-normal-text-black, #343333)";
    const whiteFg = "var(--control-control-normal-lightbackground-whiteonly, #fefcfc)";
    const mixBase = "var(--control-control-normal-lightbackground-whiteonly, #fefcfc)";
    const conic = (fg, start) => ({
        background: `conic-gradient(from 90deg, ${start} 0deg, ${fg} 360deg)`,
    });
    switch (mode) {
        case "theme":
            return conic(themeFg, `color-mix(in srgb, ${themeFg} 8%, ${mixBase})`);
        case "themeText":
            return conic(themeTextFg, `color-mix(in srgb, ${themeTextFg} 8%, ${mixBase})`);
        case "black":
            return conic(blackFg, `color-mix(in srgb, ${blackFg} 10%, ${mixBase})`);
        case "white":
            return conic(whiteFg, `color-mix(in srgb, ${whiteFg} 35%, transparent)`);
        case "inherit":
            return {
                background: "conic-gradient(from 90deg, color-mix(in srgb, currentColor 18%, transparent) 0deg, currentColor 360deg)",
            };
    }
}
export const Loading = forwardRef(({ className, level = "text", mode = "theme", lineHeightFix = true, label = "Loading", ...props }, ref) => {
    const isDecorative = props["aria-hidden"] === true || props["aria-hidden"] === "true";
    return (_jsx("span", { ref: ref, className: cn(loadingVariants({ level, mode, lineHeightFix }), className), role: isDecorative ? undefined : "status", "aria-label": isDecorative ? undefined : label, "aria-live": isDecorative ? undefined : "polite", ...props, children: _jsx("span", { className: "aviala-loading__icon", "aria-hidden": true, children: _jsx("span", { className: "aviala-loading__ring", style: loadingRingStyle(mode ?? "theme") }) }) }));
});
Loading.displayName = "Loading";
