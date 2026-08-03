import type { SVGProps } from "react";
import { cn } from "../lib/utils";

type CheckboxCheckIconProps = Omit<SVGProps<SVGSVGElement>, "children">;

/**
 * Motion check path from Figma `symbol_right` Black.
 * Progress is driven by CSS transitions on the parent Checkbox `data-state`
 * (interruptible; `vector-effect: non-scaling-stroke` keeps stroke weight stable).
 * No clipPath — round caps must not be cropped at Default/Huge stroke widths.
 */
export function CheckboxCheckIcon({ className, ...props }: CheckboxCheckIconProps) {
  return (
    <svg
      className={cn("aviala-checkbox__check-icon", className)}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      overflow="visible"
      {...props}
    >
      <path
        className="aviala-checkbox__check-path"
        transform="translate(1 1.6)"
        d="M0 3.9L3.4974 8.35503C3.83947 8.79075 4.51016 8.75534 4.80444 8.28602L10 0"
        pathLength={1}
        stroke="currentColor"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
