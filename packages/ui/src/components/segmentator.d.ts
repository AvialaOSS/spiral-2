import { type ButtonHTMLAttributes, type ReactNode } from "react";
/** Figma Components → Basic Input → Segmentator */
export type SegmentatorMode = "nested" | "tiled";
export type SegmentatorGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    mode?: SegmentatorMode;
    allRound?: boolean;
    disabled?: boolean;
};
export declare const SegmentatorGroup: import("react").ForwardRefExoticComponent<Omit<import("react").HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    mode?: SegmentatorMode;
    allRound?: boolean;
    disabled?: boolean;
} & import("react").RefAttributes<HTMLDivElement>>;
export type SegmentatorItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
    value: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    iconOnly?: boolean;
};
export declare const SegmentatorItem: import("react").ForwardRefExoticComponent<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
    value: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    iconOnly?: boolean;
} & import("react").RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=segmentator.d.ts.map