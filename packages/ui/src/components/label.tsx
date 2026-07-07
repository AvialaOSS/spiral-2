import * as LabelPrimitive from "@radix-ui/react-label";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/utils";
import { typographyVariants } from "./typography";

export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      typographyVariants({ level: "text" }),
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-55",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;
