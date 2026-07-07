import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { SymbolRightBold } from "@aviala/icons";
import { cloneElement, forwardRef, isValidElement, } from "react";
import { cn } from "../lib/utils";
import { TypefacePair } from "./typeface";
export const Checkbox = forwardRef(({ className, round = false, ...props }, ref) => (_jsxs(CheckboxPrimitive.Root, { ref: ref, className: cn("aviala-checkbox", className), "data-round": round ? "true" : undefined, ...props, children: [_jsx("span", { "aria-hidden": true, className: "aviala-checkbox__surface" }), _jsxs(CheckboxPrimitive.Indicator, { className: "aviala-checkbox__indicator", children: [_jsx(SymbolRightBold, { className: "aviala-checkbox__indicator-icon aviala-checkbox__indicator-icon--check", thickness: "Bold", width: 12, height: 12, "aria-hidden": true }), _jsx("span", { "aria-hidden": true, className: "aviala-checkbox__indeterminate-mark aviala-checkbox__indicator-icon--indeterminate" })] })] })));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
export const CheckboxGroup = forwardRef(({ className, direction = "vertical", ...props }, ref) => (_jsx("div", { ref: ref, className: cn("aviala-checkbox-group", className), "data-direction": direction, ...props })));
CheckboxGroup.displayName = "CheckboxGroup";
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
    return _jsx("span", { className: "aviala-checkbox-input__icon", children: content });
}
export const CheckboxInput = forwardRef(({ className, title, description, icon, disabled, id, ...props }, ref) => (_jsxs("label", { htmlFor: id, className: cn("aviala-checkbox-input", className), "data-disabled": disabled ? "true" : undefined, children: [_jsx(Checkbox, { ref: ref, id: id, disabled: disabled, ...props }), renderIcon(icon), _jsx(TypefacePair, { className: "aviala-checkbox-input__content min-w-0 flex-1", title: title, description: description })] })));
CheckboxInput.displayName = "CheckboxInput";
