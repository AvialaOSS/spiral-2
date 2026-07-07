import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cloneElement, forwardRef, isValidElement, useState, } from "react";
import { cn } from "../lib/utils";
import { typographyVariants } from "./typography";
function resolveTextareaState(value, defaultValue, focused) {
    const current = value ?? defaultValue ?? "";
    if (String(current).length === 0)
        return "empty";
    return focused ? "typing" : "fill";
}
const sizeStyles = {
    regular: {
        icon: 18,
    },
    big: {
        icon: 18,
    },
};
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
    return _jsx("span", { className: "aviala-textarea__slot", children: content });
}
function resolveLength(value, defaultValue) {
    const current = value ?? defaultValue ?? "";
    return String(current).length;
}
export const Textarea = forwardRef(({ className, size = "regular", leftIcon, rightIcon, showController: showControllerProp, maxLength, error = false, disabled, value, defaultValue, onChange, onFocus, onBlur, ...props }, ref) => {
    const [length, setLength] = useState(() => resolveLength(value, defaultValue));
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(() => String(defaultValue ?? ""));
    const showController = showControllerProp ?? maxLength !== undefined;
    const resolvedSize = size ?? "regular";
    const resolvedValue = value !== undefined ? String(value) : internalValue;
    const displayLength = resolvedValue.length;
    const inputState = resolveTextareaState(resolvedValue, undefined, focused);
    return (_jsxs("div", { className: cn("aviala-textarea", className), "data-size": resolvedSize, "data-input-state": inputState, "data-error": error ? "true" : undefined, "data-has-controller": showController ? "true" : undefined, "data-disabled": disabled ? "true" : undefined, children: [renderSlotIcon(leftIcon, resolvedSize), _jsx("div", { className: "aviala-textarea__field", children: _jsx("textarea", { ref: ref, disabled: disabled, maxLength: maxLength, value: value, defaultValue: defaultValue, "aria-invalid": error || undefined, className: cn("aviala-textarea__input", typographyVariants({ level: "text" })), onChange: (event) => {
                        if (value === undefined) {
                            setInternalValue(event.target.value);
                            setLength(event.target.value.length);
                        }
                        onChange?.(event);
                    }, onFocus: (event) => {
                        setFocused(true);
                        onFocus?.(event);
                    }, onBlur: (event) => {
                        setFocused(false);
                        onBlur?.(event);
                    }, ...props }) }), renderSlotIcon(rightIcon, resolvedSize), showController && (_jsxs("div", { className: "aviala-textarea__controller", "aria-hidden": true, children: [_jsxs("span", { className: cn("aviala-textarea__counter", typographyVariants({ level: "caption" })), children: [displayLength, maxLength !== undefined ? `/${maxLength}` : ""] }), _jsx("span", { className: "aviala-textarea__resize-handle" })] }))] }));
});
Textarea.displayName = "Textarea";
