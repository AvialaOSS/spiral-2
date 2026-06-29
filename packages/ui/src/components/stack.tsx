import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: "inside" | "component" | "content" | "block" | "page";
  direction?: "row" | "column";
};

const gapMap = {
  inside: "var(--gap-inside, 4px)",
  component: "var(--gap-component, 8px)",
  content: "var(--gap-content, 10px)",
  block: "var(--gap-block, 14px)",
  page: "var(--gap-page-space, 24px)",
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap = "component", direction = "column", style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex", direction === "row" ? "flex-row" : "flex-col", className)}
      style={{ gap: gapMap[gap], ...style }}
      {...props}
    />
  )
);
Stack.displayName = "Stack";

export const Fieldset = forwardRef<
  HTMLFieldSetElement,
  HTMLAttributes<HTMLFieldSetElement> & { legend?: string }
>(({ className, legend, children, ...props }, ref) => (
  <fieldset
    ref={ref}
    className={cn(
      "rounded-[var(--radius-md)] border border-border p-[var(--padding-md,10px)]",
      className
    )}
    {...props}
  >
    {legend ? (
      <legend className="px-1 text-sm font-medium text-foreground">{legend}</legend>
    ) : null}
    {children}
  </fieldset>
));
Fieldset.displayName = "Fieldset";
