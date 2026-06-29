import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type InputGroupProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex",
        orientation === "horizontal"
          ? "flex-row items-center gap-[var(--gap-component,8px)]"
          : "flex-col gap-[var(--gap-inside,4px)]",
        className
      )}
      {...props}
    />
  )
);
InputGroup.displayName = "InputGroup";

export const InputGroupAddon = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center text-sm text-muted-foreground shrink-0",
      className
    )}
    {...props}
  />
));
InputGroupAddon.displayName = "InputGroupAddon";
