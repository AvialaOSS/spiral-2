import type { ComponentPropsWithoutRef } from "react";
/** Figma System Composition → Tooltip pointer (14×5). */
export declare const TOOLTIP_POINTER: {
    readonly width: 14;
    readonly height: 5;
    readonly path: "M14 0L0 0C4.97025 1 3.98967 5 7 5C10.0103 5 9.02975 1 14 0Z";
};
/** Figma System Composition → Popover pointer (16×5). */
export declare const POPOVER_POINTER: {
    readonly width: 16;
    readonly height: 5;
    readonly path: "M16 0H0C4.12448 0 4.76977 5 8 5C11.2302 5 11.8755 0 16 0Z";
};
export type OverlayPointerSvgProps = ComponentPropsWithoutRef<"svg"> & {
    width: number;
    height: number;
    path: string;
    /** Popover caret — stroked outline so the pointer reads on light page backgrounds. */
    variant?: "default" | "popover";
};
/** Curved caret SVG — fill via parent `color` / CSS token on the svg class. */
export declare function OverlayPointerSvg({ width, height, path, variant, className, style, ...props }: OverlayPointerSvgProps): import("react").JSX.Element;
//# sourceMappingURL=overlay-pointer.d.ts.map