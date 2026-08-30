import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { Typography } from "./typography";

/** Figma Components → Response And Feedback → Progress (589:55818) */
export type ProgressType = "default" | "success" | "fail";
export type ProgressSize = "default" | "big";
export type ProgressShape = "bar" | "ring";

const progressVariants = cva("aviala-progress", {
  variants: {
    type: {
      default: "aviala-progress--type-default",
      success: "aviala-progress--type-success",
      fail: "aviala-progress--type-fail",
    },
    size: {
      default: "",
      big: "aviala-progress--size-big",
    },
    shape: {
      bar: "aviala-progress--shape-bar",
      ring: "aviala-progress--shape-ring",
    },
  },
  defaultVariants: {
    type: "default",
    size: "default",
    shape: "bar",
  },
});

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export type ProgressProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressVariants> & {
    /** 0–100 */
    value?: number;
    /** Show percent label (bar shape only) */
    showLabel?: boolean;
    label?: string;
  };

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      type = "default",
      size = "default",
      shape = "bar",
      value = 0,
      showLabel = true,
      label,
      ...props
    },
    ref
  ) => {
    const percent = clampPercent(value ?? 0);
    const resolvedType = type ?? "default";
    const resolvedSize = size ?? "default";
    const resolvedShape = shape ?? "bar";
    const displayLabel = label ?? `${Math.round(percent)}%`;
    /* Figma ring: default 16 / big 24; stroke 2; radius = half − stroke/2 */
    const diameter = resolvedSize === "big" ? 24 : 16;
    const center = diameter / 2;
    const stroke = 2;
    const normalizedRadius = center - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        aria-label={props["aria-label"] ?? displayLabel}
        className={cn(
          progressVariants({
            type: resolvedType,
            size: resolvedSize,
            shape: resolvedShape,
          }),
          className
        )}
        data-type={resolvedType}
        data-size={resolvedSize}
        data-shape={resolvedShape}
        {...props}
      >
        {resolvedShape === "bar" ? (
          <>
            <div className="aviala-progress__track">
              <div
                className="aviala-progress__fill"
                style={{ width: `${percent}%` }}
              />
            </div>
            {showLabel ? (
              <Typography
                level="caption"
                content="number"
                as="span"
                className="aviala-progress__label"
              >
                {displayLabel}
              </Typography>
            ) : null}
          </>
        ) : (
          <svg
            className="aviala-progress__ring"
            width={diameter}
            height={diameter}
            viewBox={`0 0 ${diameter} ${diameter}`}
            aria-hidden
          >
            <circle
              className="aviala-progress__ring-track"
              cx={center}
              cy={center}
              r={normalizedRadius}
              fill="none"
              strokeWidth={stroke}
            />
            <circle
              className="aviala-progress__ring-fill"
              cx={center}
              cy={center}
              r={normalizedRadius}
              fill="none"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          </svg>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";
