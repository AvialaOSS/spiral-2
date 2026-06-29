import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/utils";

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-[var(--switch-height,20px)] w-[calc(var(--switch-width,22px)*2)] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55 data-[state=checked]:bg-primary",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-[var(--switch-height,20px)] w-[var(--switch-width,22px)] rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[var(--switch-width,22px)] data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;
