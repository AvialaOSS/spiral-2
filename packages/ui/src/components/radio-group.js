import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cloneElement, forwardRef, isValidElement, } from "react";
import { cn } from "../lib/utils";
import { TypefacePair } from "./typeface";
export const RadioGroup = forwardRef(({ className, direction = "vertical", ...props }, ref) => (_jsx(RadioGroupPrimitive.Root, { className: cn("aviala-radio-group", className), "data-direction": direction, ref: ref, ...props })));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
export const RadioGroupItem = forwardRef(({ className, ...props }, ref) => (_jsxs(RadioGroupPrimitive.Item, { ref: ref, className: cn("aviala-radio", className), ...props, children: [_jsx("span", { "aria-hidden": true, className: "aviala-radio__surface" }), _jsx("span", { "aria-hidden": true, className: "aviala-radio__indicator" })] })));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
function renderIcon(node) {
    if (!node)
        return null;
    const icon = 18;
    const content = isValidElement(node) && typeof node.type !== "string"
        ? cloneElement(node, {
            width: icon,
            height: icon,
            className: cn(node.props.className, "shrink-0"),
        })
        : node;
    return _jsx("span", { className: "aviala-radio-input__icon", children: content });
}
export const RadioInput = forwardRef(({ className, title, description, icon, variant = "normal", disabled, id, ...props }, ref) => (_jsxs("label", { htmlFor: id, className: cn("aviala-radio-input", className), "data-style": variant, "data-disabled": disabled ? "true" : undefined, children: [_jsx(RadioGroupItem, { ref: ref, id: id, disabled: disabled, ...props }), renderIcon(icon), _jsx(TypefacePair, { className: "aviala-radio-input__content min-w-0 flex-1", title: title, description: description })] })));
RadioInput.displayName = "RadioInput";
