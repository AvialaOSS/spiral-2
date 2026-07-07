import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/** Figma System Composition → Tooltip pointer (14×5). */
export const TOOLTIP_POINTER = {
    width: 14,
    height: 5,
    path: "M14 0L0 0C4.97025 1 3.98967 5 7 5C10.0103 5 9.02975 1 14 0Z",
};
/** Figma System Composition → Popover pointer (16×5). */
export const POPOVER_POINTER = {
    width: 16,
    height: 5,
    path: "M16 0H0C4.12448 0 4.76977 5 8 5C11.2302 5 11.8755 0 16 0Z",
};
/** Curved caret SVG — fill via parent `color` / CSS token on the svg class. */
export function OverlayPointerSvg({ width, height, path, variant = "default", className, style, ...props }) {
    const isPopover = variant === "popover";
    return (_jsx("svg", { ...props, width: width, height: height, viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: "none", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true, className: className, style: { ...style, width, height }, children: isPopover ? (_jsxs(_Fragment, { children: [_jsx("path", { d: path, className: "aviala-popover-content__arrow-outline" }), _jsx("path", { d: path, className: "aviala-popover-content__arrow-fill" })] })) : (_jsx("path", { d: path })) }));
}
