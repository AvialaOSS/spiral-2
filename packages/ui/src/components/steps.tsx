import {
  SymbolRight,
  SymbolWarning,
  SymbolWrong,
} from "@aviala-design/icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Typography } from "./typography";

/** Figma Components → Structure Navigation → Steps (791:143425) */
export type StepsDirection = "horizontal" | "vertical";
export type StepsState =
  | "done"
  | "fail"
  | "warning"
  | "waiting"
  | "inProgress"
  | "default";

const stepsVariants = cva("aviala-steps", {
  variants: {
    direction: {
      horizontal: "aviala-steps--direction-horizontal",
      vertical: "aviala-steps--direction-vertical",
    },
  },
  defaultVariants: {
    direction: "horizontal",
  },
});

export type StepsProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof stepsVariants>;

export const Steps = forwardRef<HTMLDivElement, StepsProps>(
  ({ className, direction = "horizontal", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(stepsVariants({ direction }), className)}
      data-direction={direction}
      {...props}
    >
      {children}
    </div>
  )
);
Steps.displayName = "Steps";

export type StepsIconProps = HTMLAttributes<HTMLSpanElement> & {
  state?: StepsState;
  /** Step number shown for default / inProgress / waiting */
  index?: number;
  children?: ReactNode;
};

function defaultStepsIconContent(state: StepsState, index?: number): ReactNode {
  switch (state) {
    case "done":
      return <SymbolRight width={12} height={12} thickness="Bold" aria-hidden />;
    case "fail":
      return <SymbolWrong width={12} height={12} thickness="Bold" aria-hidden />;
    case "warning":
      return <SymbolWarning width={12} height={12} thickness="Bold" aria-hidden />;
    case "waiting":
    case "inProgress":
    case "default":
    default:
      return index != null ? (
        <Typography level="caption" as="span" className="aviala-steps-icon__index">
          {index}
        </Typography>
      ) : null;
  }
}

export const StepsIcon = forwardRef<HTMLSpanElement, StepsIconProps>(
  ({ className, state = "default", index, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("aviala-steps-icon", className)}
      data-state={state}
      {...props}
    >
      {children ?? defaultStepsIconContent(state, index)}
    </span>
  )
);
StepsIcon.displayName = "StepsIcon";

export type StepsItemProps = HTMLAttributes<HTMLDivElement> & {
  state?: StepsState;
  title?: ReactNode;
  description?: ReactNode;
  index?: number;
  icon?: ReactNode;
};

export const StepsItem = forwardRef<HTMLDivElement, StepsItemProps>(
  (
    {
      className,
      state = "default",
      title,
      description,
      index,
      icon,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn("aviala-steps-item", className)}
      data-state={state}
      {...props}
    >
      {icon ?? <StepsIcon state={state} index={index} />}
      <div className="aviala-steps-item__body">
        {title != null ? (
          <Typography
            level="subtitle"
            as="div"
            className="aviala-steps-item__title"
          >
            {title}
          </Typography>
        ) : null}
        {description != null ? (
          <Typography
            level="text"
            as="div"
            className="aviala-steps-item__description"
          >
            {description}
          </Typography>
        ) : null}
        {children}
      </div>
    </div>
  )
);
StepsItem.displayName = "StepsItem";
