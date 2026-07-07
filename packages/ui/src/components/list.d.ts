import { type ComponentPropsWithoutRef, type HTMLAttributes, type ReactNode } from "react";
import { type SwitchProps } from "./switch";
/** Figma List item `Type` variant (738:148304, 647:87555) */
export type ListItemType = "action" | "switch" | "select";
/** Figma List item `left icon setting` variant */
export type ListItemLeading = "shaped" | "default" | "none";
export type ListProps = HTMLAttributes<HTMLDivElement> & {
    /** Optional section title above the list card */
    title?: ReactNode;
};
/** Figma Structure Navigation → List root */
export declare const List: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & {
    /** Optional section title above the list card */
    title?: ReactNode;
} & import("react").RefAttributes<HTMLDivElement>>;
export type ListTitleProps = HTMLAttributes<HTMLDivElement>;
/** Figma List title row — Typography text level */
export declare const ListTitle: import("react").ForwardRefExoticComponent<ListTitleProps & import("react").RefAttributes<HTMLDivElement>>;
export type ListGroupProps = HTMLAttributes<HTMLDivElement>;
/** Figma List card container — rounded white surface for items */
export declare const ListGroup: import("react").ForwardRefExoticComponent<ListGroupProps & import("react").RefAttributes<HTMLDivElement>>;
export type ListItemGroupProps = {
    label?: ReactNode;
    children: ReactNode;
    className?: string;
};
/** Convenience wrapper — titled list section (Figma List title + card) */
export declare function ListItemGroup({ label, children, className }: ListItemGroupProps): import("react").JSX.Element;
export type ListDividerProps = HTMLAttributes<HTMLSpanElement>;
/** Vertical divider between trailing actions (Figma `last` separator) */
export declare const ListDivider: import("react").ForwardRefExoticComponent<ListDividerProps & import("react").RefAttributes<HTMLSpanElement>>;
export type ListSeparatorProps = HTMLAttributes<HTMLHRElement>;
/** Horizontal separator between list groups */
export declare const ListSeparator: import("react").ForwardRefExoticComponent<ListSeparatorProps & import("react").RefAttributes<HTMLHRElement>>;
export type ListItemProps = ComponentPropsWithoutRef<"div"> & {
    /** Figma `Type` variant */
    itemType?: ListItemType;
    /** Figma `left icon setting` variant */
    leading?: ListItemLeading;
    /** Leading icon node — defaults to GeneralSetting */
    icon?: ReactNode;
    /** Primary line (Typeface text) */
    title: ReactNode;
    /** Secondary line (Typeface caption) */
    subtitle?: ReactNode;
    /** Primary trailing button label */
    actionLabel?: ReactNode;
    /** Override primary trailing button */
    action?: ReactNode;
    /** Secondary icon-only button for `action` type */
    secondaryAction?: ReactNode;
    /** Trailing select slot for `select` type */
    select?: ReactNode;
    /** Trailing switch props for `switch` type */
    switchProps?: Omit<SwitchProps, "size">;
    /** Fully custom trailing region — overrides type presets */
    trailing?: ReactNode;
    selected?: boolean;
    disabled?: boolean;
    /** Enables hover highlight (auto when `onClick` is set) */
    interactive?: boolean;
};
/** Figma Structure Navigation → List item */
export declare const ListItem: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & {
    /** Figma `Type` variant */
    itemType?: ListItemType;
    /** Figma `left icon setting` variant */
    leading?: ListItemLeading;
    /** Leading icon node — defaults to GeneralSetting */
    icon?: ReactNode;
    /** Primary line (Typeface text) */
    title: ReactNode;
    /** Secondary line (Typeface caption) */
    subtitle?: ReactNode;
    /** Primary trailing button label */
    actionLabel?: ReactNode;
    /** Override primary trailing button */
    action?: ReactNode;
    /** Secondary icon-only button for `action` type */
    secondaryAction?: ReactNode;
    /** Trailing select slot for `select` type */
    select?: ReactNode;
    /** Trailing switch props for `switch` type */
    switchProps?: Omit<SwitchProps, "size">;
    /** Fully custom trailing region — overrides type presets */
    trailing?: ReactNode;
    selected?: boolean;
    disabled?: boolean;
    /** Enables hover highlight (auto when `onClick` is set) */
    interactive?: boolean;
} & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=list.d.ts.map