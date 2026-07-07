import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cloneElement, forwardRef, isValidElement, } from "react";
import { cn } from "../lib/utils";
import { Typography } from "./typography";
function renderBadgeIcon(node) {
    if (!node)
        return null;
    const content = isValidElement(node) && typeof node.type !== "string"
        ? cloneElement(node, {
            width: 18,
            height: 18,
            className: cn(node.props.className, "shrink-0"),
        })
        : node;
    return (_jsx("span", { className: "aviala-badge__icon", "aria-hidden": true, children: content }));
}
export const Badge = forwardRef(({ className, children, leftIcon, rightIcon, ...props }, ref) => (_jsxs("span", { ref: ref, className: cn("aviala-badge", className), ...props, children: [renderBadgeIcon(leftIcon), _jsx(Typography, { level: "text", as: "span", className: "aviala-badge__text whitespace-nowrap", children: children }), renderBadgeIcon(rightIcon)] })));
Badge.displayName = "Badge";
