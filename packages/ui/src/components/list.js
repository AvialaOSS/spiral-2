import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DirectionArrowRightLight, GeneralSetting, } from "@aviala/icons";
import { cloneElement, forwardRef, isValidElement, } from "react";
import { Button } from "./button";
import { Switch } from "./switch";
import { Typeface } from "./typeface";
import { typographyVariants } from "./typography";
import { cn } from "../lib/utils";
/** Figma Structure Navigation → List root */
export const List = forwardRef(({ className, title, children, ...props }, ref) => (_jsxs("div", { ref: ref, className: cn("aviala-list", className), role: "list", ...props, children: [title != null ? _jsx(ListTitle, { children: title }) : null, _jsx(ListGroup, { children: children })] })));
List.displayName = "List";
/** Figma List title row — Typography text level */
export const ListTitle = forwardRef(({ className, children, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("aviala-list-title", className), ...props, children: _jsx("span", { className: cn(typographyVariants({ level: "text" })), children: children }) })));
ListTitle.displayName = "ListTitle";
/** Figma List card container — rounded white surface for items */
export const ListGroup = forwardRef(({ className, children, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("aviala-list-group", className), ...props, children: children })));
ListGroup.displayName = "ListGroup";
/** Convenience wrapper — titled list section (Figma List title + card) */
export function ListItemGroup({ label, children, className }) {
    return (_jsxs("div", { className: cn("aviala-list", className), children: [label != null ? _jsx(ListTitle, { children: label }) : null, _jsx(ListGroup, { children: children })] }));
}
/** Vertical divider between trailing actions (Figma `last` separator) */
export const ListDivider = forwardRef(({ className, ...props }, ref) => (_jsx("span", { ref: ref, className: cn("aviala-list-item__divider", className), "aria-hidden": true, ...props })));
ListDivider.displayName = "ListDivider";
/** Horizontal separator between list groups */
export const ListSeparator = forwardRef(({ className, ...props }, ref) => (_jsx("hr", { ref: ref, className: cn("aviala-list-separator", className), ...props })));
ListSeparator.displayName = "ListSeparator";
function renderLeadingIcon(node, leading) {
    if (leading === "none")
        return null;
    const iconSize = leading === "shaped" ? 20 : 22;
    const content = node ??
        (leading === "shaped" ? (_jsx(GeneralSetting, { "aria-hidden": true })) : (_jsx(GeneralSetting, { "aria-hidden": true })));
    const rendered = isValidElement(content) && typeof content.type !== "string"
        ? cloneElement(content, {
            width: iconSize,
            height: iconSize,
            className: cn(content.props.className, "shrink-0"),
        })
        : content;
    return (_jsx("span", { className: "aviala-list-item__icon", children: _jsx("span", { className: cn(leading === "shaped"
                ? "aviala-list-item__icon--shaped"
                : "aviala-list-item__icon--default"), children: rendered }) }));
}
/** Figma Structure Navigation → List item */
export const ListItem = forwardRef(({ className, itemType = "select", leading = "shaped", icon, title, subtitle, actionLabel = "Text", action, secondaryAction, select, switchProps, trailing, selected = false, disabled = false, interactive, onClick, ...props }, ref) => {
    const isInteractive = interactive ?? onClick != null;
    const primaryAction = action ??
        (_jsx(Button, { mode: "primary", size: "regular", leftIcon: _jsx(GeneralSetting, { "aria-hidden": true }), children: actionLabel }));
    const renderTrailing = () => {
        if (trailing !== undefined)
            return trailing;
        switch (itemType) {
            case "action":
                return (_jsxs("div", { className: "aviala-list-item__more", children: [_jsxs("div", { className: "aviala-list-item__trailing", children: [primaryAction, secondaryAction ?? (_jsx(Button, { mode: "default", size: "regular", iconOnly: true, "aria-label": "More", leftIcon: _jsx(GeneralSetting, { "aria-hidden": true }) }))] }), _jsx(ListDivider, {}), _jsx("span", { className: "aviala-list-item__chevron", "aria-hidden": true, children: _jsx(DirectionArrowRightLight, { thickness: "Light", width: 18, height: 18 }) })] }));
            case "switch":
                return (_jsxs("div", { className: "aviala-list-item__trailing", children: [primaryAction, _jsx(ListDivider, {}), _jsx(Switch, { defaultChecked: true, ...switchProps })] }));
            case "select":
            default:
                return (_jsxs("div", { className: "aviala-list-item__trailing", children: [primaryAction, _jsx(ListDivider, {}), _jsx("span", { className: "aviala-list-item__select", children: select })] }));
        }
    };
    return (_jsxs("div", { ref: ref, role: "listitem", className: cn("aviala-list-item", className), "data-leading": leading, "data-type": itemType, "data-selected": selected ? "true" : undefined, "data-disabled": disabled ? "true" : undefined, "data-interactive": isInteractive ? "true" : undefined, onClick: disabled ? undefined : onClick, ...props, children: [renderLeadingIcon(icon, leading), _jsx("div", { className: "aviala-list-item__body", children: _jsxs("div", { className: "aviala-list-item__content", children: [_jsx("div", { className: "aviala-list-item__head", children: _jsx(Typeface, { content: "textCaption", primary: title, secondary: subtitle }) }), renderTrailing()] }) })] }));
});
ListItem.displayName = "ListItem";
