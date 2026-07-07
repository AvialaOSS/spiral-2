import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/utils";

/** Figma Components → Basic Input → Switch */
export type SwitchSize = "regular" | "small";

export type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
  size?: SwitchSize;
};

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size = "regular", ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "aviala-switch",
      size === "small" && "aviala-switch--small",
      className
    )}
    ref={ref}
    {...props}
  >
    <span aria-hidden className="aviala-switch__surface" />
    <SwitchPrimitive.Thumb className="aviala-switch__thumb" />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;
