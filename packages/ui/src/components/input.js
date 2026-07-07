import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cloneElement, forwardRef, isValidElement, useState, } from "react";
import { cn } from "../lib/utils";
import { typographyVariants } from "./typography";
import { Badge } from "./badge";
function resolveInputState(value, defaultValue, focused) {
    const current = value ?? defaultValue ?? "";
    if (String(current).length === 0)
        return "empty";
    return focused ? "typing" : "fill";
}
const sizeStyles = {
    regular: {
        root: "h-[var(--input-height-regular,32px)] gap-[var(--input-gap-regular,6px)] px-[var(--input-px-regular,8px)]",
        field: "py-[var(--input-field-py-regular,4px)]",
        slot: "py-[var(--input-slot-py-regular,4px)]",
        icon: 18,
    },
    big: {
        root: "h-[var(--input-height-big,40px)] gap-[var(--input-gap-big,8px)] px-[var(--input-px-big,10px)]",
        field: "py-[var(--input-field-py-big,8px)]",
        slot: "py-[var(--input-slot-py-big,8px)]",
        icon: 18,
    },
};
const inputRootVariants = cva("aviala-input relative inline-flex min-w-0 items-center overflow-hidden py-[var(--padding-none,0px)] font-sans", {
    variants: {
        size: {
            regular: sizeStyles.regular.root,
            big: sizeStyles.big.root,
        },
        allRound: {
            true: "rounded-[var(--input-radius-allround,99px)]",
            false: "rounded-[var(--input-radius,8px)]",
        },
        fullWidth: {
            true: "w-full",
            false: "w-auto",
        },
    },
    defaultVariants: {
        size: "regular",
        allRound: false,
        fullWidth: true,
    },
});
function renderSlotIcon(node, size) {
    if (!node)
        return null;
    const icon = sizeStyles[size].icon;
    const content = isValidElement(node) && typeof node.type !== "string"
        ? cloneElement(node, {
            width: icon,
            height: icon,
            className: cn(node.props.className, "shrink-0"),
        })
        : node;
    return (_jsx("span", { className: cn("aviala-input__slot", sizeStyles[size].slot), children: content }));
}
function renderBadgeArea(node, size) {
    if (node == null || node === false)
        return null;
    return (_jsx("span", { className: cn("aviala-input__badge-area", sizeStyles[size].slot), children: isValidElement(node) && node.type === Badge ? node : _jsx(Badge, { children: node }) }));
}
export const Input = forwardRef(({ className, size = "regular", allRound = false, leftIcon, rightIcon, leftBadge, rightBadge, fullWidth = true, error = false, disabled, type = "text", value, defaultValue, onChange, onFocus, onBlur, ...props }, ref) => {
    const styles = sizeStyles[size];
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(() => String(defaultValue ?? ""));
    const resolvedValue = value !== undefined ? String(value) : internalValue;
    const inputState = resolveInputState(resolvedValue, undefined, focused);
    return (_jsxs("div", { className: cn(inputRootVariants({ size, allRound, fullWidth }), className), "data-input-state": inputState, "data-error": error ? "true" : undefined, "data-disabled": disabled ? "true" : undefined, children: [renderSlotIcon(leftIcon, size), renderBadgeArea(leftBadge, size), _jsx("div", { className: cn("aviala-input__field relative z-[1] flex min-w-0 flex-1 flex-col justify-center", styles.field), children: _jsx("input", { ref: ref, type: type, disabled: disabled, value: value, defaultValue: defaultValue, "aria-invalid": error || undefined, className: cn(typographyVariants({ level: "text" }), "w-full min-w-0 border-0 bg-transparent p-0 text-[var(--input-fg,#343333)] outline-none", "disabled:cursor-not-allowed"), onChange: (event) => {
                        if (value === undefined) {
                            setInternalValue(event.target.value);
                        }
                        onChange?.(event);
                    }, onFocus: (event) => {
                        setFocused(true);
                        onFocus?.(event);
                    }, onBlur: (event) => {
                        setFocused(false);
                        onBlur?.(event);
                    }, ...props }) }), renderBadgeArea(rightBadge, size), renderSlotIcon(rightIcon, size)] }));
});
Input.displayName = "Input";
export { inputRootVariants };
