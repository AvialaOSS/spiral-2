import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useId, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { useLocaleMessages } from "../locale";

/** Figma Components → Loading Icon */
export type LoadingLevel =
  | "display"
  | "headline1"
  | "headline2"
  | "title"
  | "subtitle"
  | "text"
  | "caption";

export type LoadingMode = "theme" | "themeText" | "black" | "white" | "inherit";

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
} as const satisfies Record<string, LoadingLevel>;

export type LoadingButtonSize = keyof typeof BUTTON_SIZE_TO_LOADING_LEVEL;

export function loadingLevelForButtonSize(size: LoadingButtonSize): LoadingLevel {
  return BUTTON_SIZE_TO_LOADING_LEVEL[size];
}

/** Conic fill — inline so theme tokens still apply inside SVG foreignObject. */
function loadingRingStyle(mode: LoadingMode): CSSProperties {
  const conic = (fg: string): CSSProperties => ({
    background: `conic-gradient(from 90deg, color-mix(in srgb, ${fg} 0%, transparent) 0deg, ${fg} 360deg)`,
  });

  switch (mode) {
    case "theme":
      return conic("var(--loading-fg-theme)");
    case "themeText":
      return conic("var(--loading-fg-theme-text)");
    case "black":
      return conic("var(--loading-fg-black)");
    case "white":
      return conic("var(--loading-fg-white)");
    case "inherit":
      return {
        background:
          "conic-gradient(from 90deg, color-mix(in srgb, currentColor 0%, transparent) 0deg, currentColor 360deg)",
      };
  }
}

export type LoadingProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof loadingVariants> & {
    /** Accessible name; omit when decorative (`aria-hidden`). */
    label?: string;
  };

export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(
  (
    {
      className,
      level = "text",
      mode = "theme",
      lineHeightFix = true,
      label,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("Loading");
    const ringMaskId = `aviala-loading-ring-${useId().replace(/:/g, "")}`;
    const resolvedLabel = label ?? locale.label;
    const isDecorative = props["aria-hidden"] === true || props["aria-hidden"] === "true";

    return (
      <span
        ref={ref}
        className={cn(loadingVariants({ level, mode, lineHeightFix }), className)}
        role={isDecorative ? undefined : "status"}
        aria-label={isDecorative ? undefined : resolvedLabel}
        aria-live={isDecorative ? undefined : "polite"}
        {...props}
      >
        <span className="aviala-loading__icon" aria-hidden>
          <svg className="aviala-loading__ring">
            <defs>
              <mask id={ringMaskId} maskUnits="userSpaceOnUse">
                <circle className="aviala-loading__path" cx="50%" cy="50%" fill="none" stroke="#fff" />
              </mask>
            </defs>
            <foreignObject width="100%" height="100%" mask={`url(#${ringMaskId})`}>
              <div className="aviala-loading__conic" style={loadingRingStyle(mode ?? "theme")} />
            </foreignObject>
          </svg>
        </span>
      </span>
    );
  }
);

Loading.displayName = "Loading";
