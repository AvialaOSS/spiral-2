import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { type ComponentPropsWithoutRef } from "react";
/** Default show delay — 300ms per ALD / Radix convention. */
export declare const TOOLTIP_DELAY_DURATION = 300;
export type TooltipProviderProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;
export declare function TooltipProvider({ delayDuration, skipDelayDuration, ...props }: TooltipProviderProps): import("react").JSX.Element;
export declare const Tooltip: import("react").FC<TooltipPrimitive.TooltipProps>;
export declare const TooltipTrigger: import("react").ForwardRefExoticComponent<TooltipPrimitive.TooltipTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
export type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    /** Show a caret arrow pointing at the trigger (default true). */
    showArrow?: boolean;
};
export declare const TooltipContent: import("react").ForwardRefExoticComponent<Omit<TooltipPrimitive.TooltipContentProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & {
    /** Show a caret arrow pointing at the trigger (default true). */
    showArrow?: boolean;
} & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=tooltip.d.ts.map