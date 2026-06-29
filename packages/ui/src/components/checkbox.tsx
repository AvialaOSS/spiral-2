import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { ArrowRight } from "@aviala/icons";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/utils";

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-[var(--checkbox-size,16px)] w-[var(--checkbox-size,16px)] shrink-0 rounded-[var(--checkbox-radius,var(--radius-xs))] border border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <ArrowRight className="h-3 w-3 rotate-[-90deg]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
