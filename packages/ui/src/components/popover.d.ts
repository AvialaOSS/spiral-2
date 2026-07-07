import * as PopoverPrimitive from "@radix-ui/react-popover";
import { type ComponentPropsWithoutRef } from "react";
export type PopoverProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;
/**
 * Radix Popover closes on `window` blur (e.g. focusing DevTools). Suppress only
 * blur-initiated closes; pointer-down (outside click, trigger toggle) and Escape
 * must still dismiss on the first interaction.
 */
export declare function Popover({ open: openProp, defaultOpen, onOpenChange, modal, ...props }: PopoverProps): import("react").JSX.Element;
export declare const PopoverTrigger: import("react").ForwardRefExoticComponent<PopoverPrimitive.PopoverTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
export declare const PopoverAnchor: import("react").ForwardRefExoticComponent<PopoverPrimitive.PopoverAnchorProps & import("react").RefAttributes<HTMLDivElement>>;
export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    /** Render without Portal — use inside nested overlays. */
    portalled?: boolean;
    /** Show a caret arrow pointing at the trigger (Figma with-arrow variant). */
    showArrow?: boolean;
};
export declare const PopoverContent: import("react").ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverContentProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & {
    /** Render without Portal — use inside nested overlays. */
    portalled?: boolean;
    /** Show a caret arrow pointing at the trigger (Figma with-arrow variant). */
    showArrow?: boolean;
} & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=popover.d.ts.map