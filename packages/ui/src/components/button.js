import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Loading, loadingLevelForButtonSize } from "./loading";
import { typographyVariants } from "./typography";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cloneElement, forwardRef, isValidElement, } from "react";
import { cn } from "../lib/utils";
const sizeStyles = {
    tiny: {
        root: "h-6 px-[var(--padding-tiny,4px)] py-[var(--padding-min,2px)] rounded-[var(--border-radius-small,8px)]",
        labelLevel: "caption",
        iconOnly: "size-6 min-w-0 px-[var(--padding-tiny,4px)] py-[var(--padding-min,2px)] rounded-[var(--border-radius-small,8px)]",
        iconBox: "h-5",
        iconOnlyIconBox: "h-5",
        iconOnlySquareBox: "h-5 w-5",
        icon: 16,
        iconOnlyIcon: 16,
        loader: 16,
    },
    small: {
        root: "h-7 px-[var(--padding-small,6px)] py-[var(--padding-min,2px)] rounded-[var(--border-radius-extra-small-2,6px)]",
        labelLevel: "text",
        iconOnly: "size-7 min-w-0 px-[var(--padding-smaller,5px)] py-[var(--padding-min,2px)] rounded-[var(--border-radius-extra-small-2,6px)]",
        iconBox: "h-6",
        iconOnlyIconBox: "h-6",
        iconOnlySquareBox: "h-6 w-6",
        icon: 18,
        iconOnlyIcon: 18,
        loader: 18,
    },
    regular: {
        root: "h-8 px-[var(--padding-middle,10px)] py-[var(--padding-tiny,4px)] rounded-[var(--border-radius-small,8px)]",
        labelLevel: "text",
        iconOnly: "size-8 min-w-0 px-[var(--padding-littlesmall,7px)] py-[var(--padding-tiny,4px)] rounded-[var(--border-radius-small,8px)]",
        iconBox: "h-6",
        iconOnlyIconBox: "h-6",
        iconOnlySquareBox: "h-6 w-6",
        icon: 18,
        iconOnlyIcon: 18,
        loader: 18,
    },
    big: {
        root: "h-10 px-[var(--padding-big,14px)] py-[var(--padding-default,8px)] rounded-[var(--border-radius-small,8px)]",
        labelLevel: "text",
        iconOnly: "size-9 min-w-0 p-[var(--padding-default,8px)] rounded-[var(--border-radius-small,8px)]",
        iconBox: "h-6",
        iconOnlyIconBox: "",
        iconOnlySquareBox: "h-6 w-6",
        icon: 18,
        iconOnlyIcon: 20,
        loader: 18,
    },
};
const buttonVariants = cva("aviala-button relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden border-0 bg-transparent font-sans whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[var(--button-disabled-opacity,0.55)]", {
    variants: {
        mode: {
            primary: "aviala-button--mode-primary",
            second: "aviala-button--mode-second",
            default: "aviala-button--mode-default",
            defaultCustom: "aviala-button--mode-defaultCustom",
            noBackground: "aviala-button--mode-noBackground",
            noBackgroundCustom: "aviala-button--mode-noBackgroundCustom",
            destructive: "aviala-button--mode-destructive",
        },
        size: {
            tiny: sizeStyles.tiny.root,
            small: sizeStyles.small.root,
            regular: sizeStyles.regular.root,
            big: sizeStyles.big.root,
        },
        allRound: {
            true: "min-w-[var(--button-min-width-allround,48px)] !rounded-[var(--border-radius-allround,99px)]",
            false: "min-w-[var(--button-min-width,46px)]",
        },
        iconOnly: {
            true: "gap-0",
            false: "gap-[var(--button-gap,6px)]",
        },
    },
    compoundVariants: [
        { iconOnly: true, class: "!min-w-0" },
        { iconOnly: true, size: "tiny", class: sizeStyles.tiny.iconOnly },
        { iconOnly: true, size: "small", class: sizeStyles.small.iconOnly },
        { iconOnly: true, size: "regular", class: sizeStyles.regular.iconOnly },
        { iconOnly: true, size: "big", class: sizeStyles.big.iconOnly },
    ],
    defaultVariants: {
        mode: "primary",
        size: "regular",
        allRound: false,
        iconOnly: false,
    },
});
function resolveMode(mode, variant) {
    if (mode)
        return mode;
    switch (variant) {
        case "secondary":
            return "second";
        case "outline":
            return "default";
        case "ghost":
            return "noBackground";
        case "destructive":
            return "destructive";
        case "link":
            return "noBackground";
        default:
            return "primary";
    }
}
function resolveSize(size, iconOnly, variant) {
    if (size === "tiny" || size === "small" || size === "regular" || size === "big") {
        return size;
    }
    switch (size) {
        case "sm":
            return "small";
        case "lg":
            return "big";
        case "icon":
            return "regular";
        default:
            break;
    }
    if (variant === "link" || iconOnly)
        return "regular";
    return "regular";
}
function hasSurface(mode) {
    return (mode !== "noBackground" &&
        mode !== "noBackgroundCustom");
}
function renderIcon(node, size, dimmed, iconOnly) {
    if (!node)
        return null;
    const styles = sizeStyles[size];
    const iconBox = iconOnly ? styles.iconOnlyIconBox : styles.iconBox;
    const icon = iconOnly ? styles.iconOnlyIcon : styles.icon;
    const content = isValidElement(node) && typeof node.type !== "string"
        ? cloneElement(node, {
            ...(iconOnly ? { width: icon, height: icon } : { height: icon }),
            className: cn(node.props.className, "shrink-0"),
        })
        : node;
    return (_jsx("span", { className: cn("relative z-[1] inline-flex shrink-0 items-center justify-center text-inherit", iconBox, iconOnly && styles.iconOnlySquareBox, dimmed && "opacity-[var(--button-disabled-opacity,0.55)]"), children: content }));
}
function resolveIconOnlyIcon(leftIcon, icon, children, iconOnly) {
    const fromProp = leftIcon ?? icon;
    if (fromProp)
        return fromProp;
    if (!iconOnly || children == null || children === false)
        return undefined;
    if (isValidElement(children) && typeof children.type !== "string")
        return children;
    return undefined;
}
export const Button = forwardRef(({ className, mode: modeProp, variant, size: sizeProp, allRound = false, iconOnly: iconOnlyProp, asChild = false, loading = false, disabled, icon, leftIcon, rightIcon, children, ...props }, ref) => {
    const mode = resolveMode(modeProp, variant);
    const iconOnly = iconOnlyProp ??
        (sizeProp === "icon" ||
            ((!!(leftIcon ?? icon) ||
                (isValidElement(children) && typeof children.type !== "string")) &&
                !rightIcon &&
                (leftIcon ?? icon ? !children : true)));
    const size = resolveSize(sizeProp, iconOnly, variant);
    const isDisabled = disabled || loading;
    const showSurface = hasSurface(mode);
    const contentOpacity = loading
        ? "opacity-[var(--button-loading-opacity,0.6)]"
        : undefined;
    const resolvedLeft = iconOnly
        ? resolveIconOnlyIcon(leftIcon, icon, children, true)
        : leftIcon ?? icon;
    const label = iconOnly ? null : children;
    const inner = (_jsxs(_Fragment, { children: [showSurface && (_jsx("span", { "aria-hidden": true, className: "aviala-button-surface pointer-events-none absolute inset-0 rounded-[inherit]" })), loading && (_jsx(Loading, { level: loadingLevelForButtonSize(size), mode: "inherit", lineHeightFix: false, className: "relative z-[1] shrink-0 text-inherit", "aria-hidden": true })), !iconOnly && renderIcon(resolvedLeft, size, false), iconOnly
                ? renderIcon(resolvedLeft, size, false, true)
                : label !== null && label !== undefined && (_jsx("span", { className: cn(typographyVariants({ level: sizeStyles[size].labelLevel }), "relative z-[1] shrink-0", contentOpacity), children: label })), !iconOnly && renderIcon(rightIcon, size, false)] }));
    const classes = cn(buttonVariants({ mode, size, allRound, iconOnly }), className);
    if (asChild) {
        return (_jsx(Slot, { className: classes, ref: ref, "aria-disabled": isDisabled || undefined, ...props, children: children }));
    }
    return (_jsx("button", { className: classes, ref: ref, disabled: isDisabled, "aria-busy": loading || undefined, ...props, children: inner }));
});
Button.displayName = "Button";
export { buttonVariants };
