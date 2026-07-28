import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { parseColor } from "./color-utils";

export type ColorPickButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  color: string;
  selected?: boolean;
};

export const ColorPickButton = forwardRef<HTMLButtonElement, ColorPickButtonProps>(
  ({ className, color, selected = false, style, ...props }, ref) => {
    const swatch = parseColor(color).toHex();

    return (
      <button
        ref={ref}
        type="button"
        className={cn("aviala-color-pick-button aviala-focus-ring", className)}
        data-selected={selected ? "true" : undefined}
        style={style}
        {...props}
      >
        <span
          className="aviala-color-pick-button__swatch"
          style={{ backgroundColor: swatch }}
          aria-hidden
        />
      </button>
    );
  }
);
ColorPickButton.displayName = "ColorPickButton";
