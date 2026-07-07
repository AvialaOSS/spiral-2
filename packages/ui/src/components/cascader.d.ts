import * as PopoverPrimitive from "@radix-ui/react-popover";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
/** Figma Components → Information Collect → Cascader Input */
export type CascaderSize = "regular" | "big";
/** Figma Cascader Menu Item `Function` variant */
export type CascaderItemFunction = "simple" | "checkbox" | "form-checkbox" | "radio" | "form-radio" | "search" | "custom";
/** Figma Cascader Menu Item `Type` variant */
export type CascaderItemLayout = "default" | "title" | "custom";
export type CascaderOption = {
    value: string;
    label: ReactNode;
    disabled?: boolean;
    children?: CascaderOption[];
};
declare function findOptionPath(options: CascaderOption[], targetPath: string[]): CascaderOption | undefined;
declare function getOptionsAtPath(options: CascaderOption[], path: string[]): CascaderOption[];
declare function getLabelsForPath(options: CascaderOption[], path: string[]): ReactNode[];
export type CascaderProps = {
    children: ReactNode;
    options?: CascaderOption[];
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[], selectedOptions: CascaderOption[]) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    size?: CascaderSize;
    /** Select parent nodes — Figma allows any-level selection (default true). */
    changeOnSelect?: boolean;
    className?: string;
};
/**
 * Radix Popover closes on `window` blur (e.g. focusing DevTools). Suppress only
 * blur-initiated closes; pointer-down (outside click, item select, trigger toggle)
 * and Escape must still dismiss on the first interaction.
 */
export declare function Cascader({ children, options, value: valueProp, defaultValue, onValueChange, open: openProp, defaultOpen, onOpenChange, disabled, size, changeOnSelect, className, }: CascaderProps): import("react").JSX.Element;
export type CascaderTriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & {
    size?: CascaderSize;
    allRound?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    placeholder?: string;
    error?: boolean;
    /** Override display when using manual composition without `options`. */
    displayValue?: ReactNode;
    separator?: string;
    className?: string;
};
export declare const CascaderTrigger: import("react").ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverTriggerProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    size?: CascaderSize;
    allRound?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    placeholder?: string;
    error?: boolean;
    /** Override display when using manual composition without `options`. */
    displayValue?: ReactNode;
    separator?: string;
    className?: string;
} & import("react").RefAttributes<HTMLButtonElement>>;
export type CascaderContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    portalled?: boolean;
    className?: string;
};
export declare const CascaderContent: import("react").ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverContentProps & import("react").RefAttributes<HTMLDivElement>, "ref"> & {
    portalled?: boolean;
    className?: string;
} & import("react").RefAttributes<HTMLDivElement>>;
export type CascaderMenuProps = {
    children?: ReactNode;
    className?: string;
};
/** Figma Cascader Menu — horizontal column container (`348:13915`). */
export declare const CascaderMenu: import("react").ForwardRefExoticComponent<CascaderMenuProps & import("react").RefAttributes<HTMLDivElement>>;
export type CascaderColumnProps = {
    children: ReactNode;
    className?: string;
    /** Slide + fade in when a new cascade column appears (options-driven menus set this automatically). */
    animateEnter?: boolean;
    /** Slide + fade out before unmount when a cascade column is removed (options-driven menus set this automatically). */
    animateExit?: boolean;
    /** Frozen layout slot for exit overlay columns (keeps flex width stable while animating out). */
    exitLayout?: {
        left: number;
        width: number;
    };
};
/** Figma Cascader Menu Item Group Group — single cascade column (`345:20543`). */
export declare const CascaderColumn: import("react").ForwardRefExoticComponent<CascaderColumnProps & import("react").RefAttributes<HTMLDivElement>>;
export type CascaderItemGroupProps = {
    label?: ReactNode;
    showDivider?: boolean;
    children: ReactNode;
    className?: string;
};
/** Figma Cascader Menu Item Group (`345:16552`). */
export declare function CascaderItemGroup({ label, showDivider, children, className, }: CascaderItemGroupProps): import("react").JSX.Element;
export type CascaderItemProps = {
    value: string;
    pathPrefix?: string[];
    itemFunction?: CascaderItemFunction;
    layout?: CascaderItemLayout;
    leftIcon?: ReactNode;
    showLeftIcon?: boolean;
    rightIcon?: ReactNode;
    showRightIcon?: boolean;
    badge?: ReactNode;
    showBadge?: boolean;
    showFunctionIcon?: boolean;
    icon?: ReactNode;
    disabled?: boolean;
    children?: ReactNode;
    className?: string;
    hasChildren?: boolean;
};
/** Figma Cascader Menu Item (`345:12487`). */
export declare const CascaderItem: import("react").ForwardRefExoticComponent<CascaderItemProps & import("react").RefAttributes<HTMLButtonElement>>;
export type CascaderOptionsMenuProps = {
    className?: string;
};
/** Renders cascade columns from `Cascader` `options` prop. */
export declare function CascaderOptionsMenu({ className }: CascaderOptionsMenuProps): import("react").JSX.Element;
export type CascaderFieldProps = Omit<CascaderProps, "children"> & Omit<CascaderTriggerProps, "displayValue"> & {
    contentClassName?: string;
    menuClassName?: string;
};
/** Convenience field — trigger + options-driven menu. */
export declare function CascaderField({ options, value, defaultValue, onValueChange, open, defaultOpen, onOpenChange, disabled, size, changeOnSelect, className, contentClassName, menuClassName, allRound, leftIcon, rightIcon, placeholder, error, separator, ...triggerProps }: CascaderFieldProps): import("react").JSX.Element;
export { getLabelsForPath, getOptionsAtPath, findOptionPath as getOptionAtPath };
//# sourceMappingURL=cascader.d.ts.map