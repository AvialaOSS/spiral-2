import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { DirectionArrowDownLight, DirectionArrowRightLight, SymbolRight, SymbolRightBold, } from "@aviala-design/icons";
import { cloneElement, createContext, forwardRef, isValidElement, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, } from "react";
import { Badge } from "./badge";
import { typographyVariants } from "./typography";
import { cn } from "../lib/utils";
const CascaderContext = createContext(null);
function useCascaderContext() {
    const context = useContext(CascaderContext);
    if (!context) {
        throw new Error("Cascader compound components must be used within Cascader.");
    }
    return context;
}
function renderSlotIcon(node, size) {
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
    return _jsx("span", { className: "aviala-cascader-trigger__slot", children: content });
}
function renderItemIcon(node, iconSize = 18) {
    if (!node)
        return null;
    const content = isValidElement(node) && typeof node.type !== "string"
        ? cloneElement(node, {
            width: iconSize,
            height: iconSize,
            className: cn(node.props.className, "shrink-0"),
        })
        : node;
    return (_jsx("span", { className: cn("aviala-cascader-item__icon", iconSize === 16 && "aviala-cascader-item__icon--sm"), children: content }));
}
function renderBadgeSlot(node) {
    if (node == null || node === false)
        return null;
    return (_jsx("span", { className: "aviala-cascader-item__badge", children: isValidElement(node) && node.type === Badge ? node : _jsx(Badge, { children: node }) }));
}
function CascaderItemFormRadio() {
    return (_jsxs("span", { className: "aviala-cascader-item__form-radio", "aria-hidden": true, children: [_jsx("span", { className: "aviala-cascader-item__form-radio-surface" }), _jsx("span", { className: "aviala-cascader-item__form-radio-indicator" })] }));
}
function CascaderItemFormCheckbox() {
    return (_jsx("span", { className: "aviala-cascader-item__form-checkbox", "aria-hidden": true, children: _jsx(SymbolRightBold, { className: "aviala-cascader-item__form-checkbox-icon", thickness: "Bold", width: 12, height: 12, "aria-hidden": true }) }));
}
function CascaderItemTrailingRadio({ selected }) {
    if (!selected)
        return null;
    return (_jsx("span", { className: "aviala-cascader-item__trailing-radio", "aria-hidden": true, children: _jsx(SymbolRight, { thickness: "Light", width: 18, height: 18, "aria-hidden": true }) }));
}
function CascaderItemTrailingCheckbox({ selected }) {
    if (!selected)
        return null;
    return (_jsx("span", { className: "aviala-cascader-item__trailing-checkbox", "aria-hidden": true, children: _jsx(SymbolRight, { thickness: "Light", width: 18, height: 18, "aria-hidden": true }) }));
}
function renderFunctionSlot(itemFunction, layout, showFunctionIcon, hasChildren, selected, icon) {
    if (!showFunctionIcon || layout === "title")
        return null;
    if (icon !== undefined) {
        return _jsx("span", { className: "aviala-cascader-item__function", children: icon });
    }
    switch (itemFunction) {
        case "radio":
            return (_jsx("span", { className: "aviala-cascader-item__function", children: _jsx(CascaderItemTrailingRadio, { selected: selected }) }));
        case "checkbox":
            return (_jsx("span", { className: "aviala-cascader-item__function", children: _jsx(CascaderItemTrailingCheckbox, { selected: selected }) }));
        case "simple":
        default:
            return (_jsxs("span", { className: "aviala-cascader-item__function", children: [selected ? (_jsx(SymbolRight, { thickness: "Light", width: 18, height: 18, "aria-hidden": true })) : null, hasChildren ? (_jsx(DirectionArrowRightLight, { thickness: "Light", width: 18, height: 18, "aria-hidden": true })) : null] }));
    }
}
function findOptionPath(options, targetPath) {
    let currentOptions = options;
    let current;
    for (const segment of targetPath) {
        current = currentOptions.find((option) => option.value === segment);
        if (!current)
            return undefined;
        currentOptions = current.children ?? [];
    }
    return current;
}
function getOptionsAtPath(options, path) {
    if (path.length === 0)
        return options;
    const node = findOptionPath(options, path);
    return node?.children ?? [];
}
function getLabelsForPath(options, path) {
    const labels = [];
    let currentOptions = options;
    for (const segment of path) {
        const option = currentOptions.find((item) => item.value === segment);
        if (!option)
            break;
        labels.push(option.label);
        currentOptions = option.children ?? [];
    }
    return labels;
}
/** True when `path` is a prefix of `selectedPath` (item lies on the current selection). */
function isPathOnSelectedPath(path, selectedPath) {
    if (path.length === 0 || path.length > selectedPath.length)
        return false;
    return path.every((segment, index) => segment === selectedPath[index]);
}
/**
 * Radix Popover closes on `window` blur (e.g. focusing DevTools). Suppress only
 * blur-initiated closes; pointer-down (outside click, item select, trigger toggle)
 * and Escape must still dismiss on the first interaction.
 */
export function Cascader({ children, options = [], value: valueProp, defaultValue, onValueChange, open: openProp, defaultOpen = false, onOpenChange, disabled = false, size = "regular", changeOnSelect = true, className, }) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [internalValue, setInternalValue] = useState(defaultValue ?? []);
    const [activePath, setActivePath] = useState(defaultValue ?? []);
    const [highlightedValue, setHighlightedValue] = useState(null);
    const windowBlurCloseRef = useRef(false);
    const pointerDownCloseRef = useRef(false);
    const isOpenControlled = openProp !== undefined;
    const isValueControlled = valueProp !== undefined;
    const open = isOpenControlled ? openProp : internalOpen;
    const selectedPath = isValueControlled ? valueProp ?? [] : internalValue;
    useEffect(() => {
        const markWindowBlur = () => {
            windowBlurCloseRef.current = true;
        };
        window.addEventListener("blur", markWindowBlur, true);
        return () => window.removeEventListener("blur", markWindowBlur, true);
    }, []);
    useEffect(() => {
        if (open) {
            setActivePath(selectedPath.length > 0 ? selectedPath.slice(0, -1) : []);
        }
    }, [open, selectedPath]);
    useEffect(() => {
        if (!open) {
            pointerDownCloseRef.current = false;
            return;
        }
        const markPointerDown = () => {
            pointerDownCloseRef.current = true;
        };
        document.addEventListener("pointerdown", markPointerDown, true);
        return () => document.removeEventListener("pointerdown", markPointerDown, true);
    }, [open]);
    const handleOpenChange = useCallback((nextOpen) => {
        if (disabled && nextOpen)
            return;
        if (!nextOpen && windowBlurCloseRef.current && !pointerDownCloseRef.current) {
            windowBlurCloseRef.current = false;
            return;
        }
        windowBlurCloseRef.current = false;
        pointerDownCloseRef.current = false;
        if (!isOpenControlled) {
            setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
    }, [disabled, isOpenControlled, onOpenChange]);
    const commitValue = useCallback((path) => {
        const selectedOptions = path
            .map((_, index) => findOptionPath(options, path.slice(0, index + 1)))
            .filter((option) => option !== undefined);
        if (!isValueControlled) {
            setInternalValue(path);
        }
        onValueChange?.(path, selectedOptions);
    }, [isValueControlled, onValueChange, options]);
    const expandTo = useCallback((path) => {
        setActivePath(path);
    }, []);
    const selectPath = useCallback((path, closeOnLeaf = true) => {
        const option = findOptionPath(options, path);
        const hasChildren = Boolean(option?.children?.length);
        if (!changeOnSelect && hasChildren) {
            expandTo(path);
            return;
        }
        commitValue(path);
        if (hasChildren) {
            expandTo(path);
            return;
        }
        if (closeOnLeaf) {
            handleOpenChange(false);
        }
    }, [changeOnSelect, commitValue, expandTo, handleOpenChange, options]);
    const contextValue = useMemo(() => ({
        open,
        disabled,
        size,
        activePath,
        selectedPath,
        highlightedValue,
        setHighlightedValue,
        expandTo,
        selectPath,
        getOptionAtPath: (path) => findOptionPath(options, path),
        getOptionsAtPath: (path) => getOptionsAtPath(options, path),
        isPathSelected: (path) => isPathOnSelectedPath(path, selectedPath),
        isPathExpanded: (path) => {
            const expandedPrefix = activePath.length > 0 ? activePath : selectedPath.slice(0, -1);
            return (path.length <= expandedPrefix.length &&
                path.every((segment, index) => segment === expandedPrefix[index]));
        },
    }), [
        activePath,
        disabled,
        expandTo,
        highlightedValue,
        open,
        options,
        selectPath,
        selectedPath,
        size,
    ]);
    return (_jsx(CascaderContext.Provider, { value: contextValue, children: _jsx(PopoverPrimitive.Root, { open: open, onOpenChange: handleOpenChange, modal: false, children: _jsx("div", { className: cn("inline-flex", className), children: children }) }) }));
}
export const CascaderTrigger = forwardRef(({ className, size: sizeProp, allRound = false, leftIcon, rightIcon, placeholder = "Text", error = false, displayValue, separator = "/", disabled: disabledProp, ...props }, ref) => {
    const { open, disabled: disabledContext, size: sizeContext, selectedPath, getOptionAtPath } = useCascaderContext();
    const size = sizeProp ?? sizeContext;
    const disabled = disabledProp ?? disabledContext;
    const labels = selectedPath
        .map((_, index) => getOptionAtPath(selectedPath.slice(0, index + 1))?.label)
        .filter((label) => label != null && label !== false);
    const resolvedDisplay = displayValue ??
        (labels.length > 0
            ? labels.map((label, index) => (_jsxs("span", { children: [index > 0 ? separator : null, label] }, `${selectedPath[index]}-${index}`)))
            : null);
    const hasValue = resolvedDisplay != null && resolvedDisplay !== false;
    return (_jsx(PopoverPrimitive.Trigger, { asChild: true, children: _jsxs("button", { ref: ref, type: "button", className: cn("aviala-cascader-trigger", className), "data-size": size, "data-all-round": allRound ? "true" : "false", "data-state": open ? "open" : "closed", "data-error": error ? "true" : undefined, disabled: disabled, "aria-expanded": open, "aria-haspopup": "listbox", ...props, children: [renderSlotIcon(leftIcon, size), _jsx("span", { className: "aviala-cascader-trigger__field", children: _jsx("span", { className: cn("aviala-cascader-trigger__value", typographyVariants({ level: "text" })), "data-placeholder": hasValue ? undefined : "true", children: hasValue ? resolvedDisplay : placeholder }) }), renderSlotIcon(rightIcon, size), _jsx("span", { className: "aviala-cascader-trigger__expand", "aria-hidden": true, children: _jsx(DirectionArrowDownLight, { thickness: "Light", width: 18, height: 18, "aria-hidden": true }) })] }) }));
});
CascaderTrigger.displayName = "CascaderTrigger";
export const CascaderContent = forwardRef(({ className, children, sideOffset = 8, align = "start", portalled = true, ...props }, ref) => {
    const content = (_jsx(PopoverPrimitive.Content, { ref: ref, className: cn("aviala-cascader-content", className), sideOffset: sideOffset, align: align, ...props, children: children }));
    if (!portalled)
        return content;
    return _jsx(PopoverPrimitive.Portal, { children: content });
});
CascaderContent.displayName = "CascaderContent";
/** Figma Cascader Menu — horizontal column container (`348:13915`). */
export const CascaderMenu = forwardRef(({ children, className }, ref) => (_jsx("div", { ref: ref, className: cn("aviala-cascader-menu", className), children: children })));
CascaderMenu.displayName = "CascaderMenu";
/** Figma Cascader Menu Item Group Group — single cascade column (`345:20543`). */
export const CascaderColumn = forwardRef(({ children, className, animateEnter, animateExit, exitLayout }, ref) => {
    const animate = animateExit ? "exit" : animateEnter ? "enter" : undefined;
    const exitStyle = animateExit && exitLayout
        ? {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: exitLayout.left,
            width: exitLayout.width,
            zIndex: 0,
        }
        : undefined;
    return (_jsx("div", { ref: ref, className: cn("aviala-cascader-column", className), "data-animate": animate, style: exitStyle, children: _jsx("div", { className: "aviala-cascader-column__surface", "data-animate": animate, children: children }) }));
});
CascaderColumn.displayName = "CascaderColumn";
/** Figma Cascader Menu Item Group (`345:16552`). */
export function CascaderItemGroup({ label, showDivider = true, children, className, }) {
    return (_jsxs("div", { className: cn("aviala-cascader-group", className), children: [label ? (_jsx("div", { className: cn("aviala-cascader-label", typographyVariants({ level: "caption" })), children: label })) : null, _jsx("div", { className: "aviala-cascader-group__slot", children: children }), showDivider ? _jsx("div", { className: "aviala-cascader-separator", role: "separator" }) : null] }));
}
/** Figma Cascader Menu Item (`345:12487`). */
export const CascaderItem = forwardRef(({ value, pathPrefix = [], itemFunction = "simple", layout = "default", leftIcon, showLeftIcon = false, rightIcon, showRightIcon = false, badge, showBadge = false, showFunctionIcon = true, icon, disabled = false, children, className, hasChildren: hasChildrenProp, }, ref) => {
    const { highlightedValue, setHighlightedValue, expandTo, selectPath, getOptionAtPath, isPathSelected, isPathExpanded, } = useCascaderContext();
    const path = [...pathPrefix, value];
    const option = getOptionAtPath(path);
    const hasChildren = hasChildrenProp ?? Boolean(option?.children?.length);
    const isTitle = layout === "title";
    const isSelected = isPathSelected(path);
    const isExpanded = isPathExpanded(path);
    const isHighlighted = highlightedValue === value;
    const isDisabled = disabled || option?.disabled;
    const isFormLeading = itemFunction === "form-radio" || itemFunction === "form-checkbox";
    const leftIconSize = 18;
    const showTrailingFunction = showFunctionIcon &&
        !isTitle &&
        itemFunction !== "form-radio" &&
        itemFunction !== "form-checkbox";
    const handleClick = () => {
        if (isTitle || isDisabled)
            return;
        if (hasChildren) {
            selectPath(path, false);
            return;
        }
        selectPath(path, true);
    };
    const handleKeyDown = (event) => {
        if (isTitle || isDisabled)
            return;
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleClick();
        }
        if (event.key === "ArrowRight" && hasChildren) {
            event.preventDefault();
            expandTo(path);
        }
    };
    return (_jsxs("button", { ref: ref, type: "button", role: isTitle ? "presentation" : "option", "aria-selected": isSelected, "aria-expanded": hasChildren ? isExpanded : undefined, disabled: isDisabled, className: cn("aviala-cascader-item", className), "data-layout": layout !== "default" ? layout : undefined, "data-function": itemFunction !== "simple" ? itemFunction : undefined, "data-selected": isSelected ? "true" : undefined, "data-highlighted": isHighlighted ? "true" : undefined, "data-disabled": isDisabled ? "true" : undefined, onClick: handleClick, onKeyDown: handleKeyDown, onMouseEnter: () => {
            if (!isTitle)
                setHighlightedValue(value);
            if (hasChildren)
                expandTo(pathPrefix.concat(value));
        }, onMouseLeave: (event) => {
            if (isTitle)
                return;
            const next = event.relatedTarget;
            if (next instanceof Node && event.currentTarget.contains(next))
                return;
            if (highlightedValue === value)
                setHighlightedValue(null);
        }, onFocus: () => {
            if (!isTitle)
                setHighlightedValue(value);
        }, children: [isFormLeading && itemFunction === "form-radio" ? _jsx(CascaderItemFormRadio, {}) : null, isFormLeading && itemFunction === "form-checkbox" ? _jsx(CascaderItemFormCheckbox, {}) : null, showLeftIcon && leftIcon ? renderItemIcon(leftIcon, leftIconSize) : null, _jsx("span", { className: cn("aviala-cascader-item__text", typographyVariants({ level: isTitle ? "caption" : "text" })), children: children ?? option?.label }), showBadge ? renderBadgeSlot(badge ?? "Text") : null, showRightIcon && rightIcon ? renderItemIcon(rightIcon, leftIconSize) : null, renderFunctionSlot(itemFunction, layout, showTrailingFunction, hasChildren, isSelected, icon)] }));
});
CascaderItem.displayName = "CascaderItem";
const COLUMN_ANIMATION_MS = 150;
function toColumnKey(pathPrefix) {
    return pathPrefix.join("/") || "root";
}
function prefersReducedMotion() {
    return (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
/** Renders cascade columns from `Cascader` `options` prop. */
export function CascaderOptionsMenu({ className }) {
    const { activePath, selectedPath, getOptionsAtPath, open } = useCascaderContext();
    const prevColumnCountRef = useRef(null);
    const prevColumnPathsRef = useRef([]);
    const lastPathChangeAtRef = useRef(0);
    const menuRef = useRef(null);
    const columnElRefs = useRef(new Map());
    const [columns, setColumns] = useState([]);
    const columnPaths = useMemo(() => {
        const paths = [[]];
        const expansion = activePath.length > 0 ? activePath : selectedPath.slice(0, -1);
        for (let index = 0; index < expansion.length; index += 1) {
            const prefix = expansion.slice(0, index + 1);
            const nextOptions = getOptionsAtPath(prefix);
            if (nextOptions.length > 0) {
                paths.push(prefix);
            }
        }
        return paths;
    }, [activePath, getOptionsAtPath, selectedPath]);
    useLayoutEffect(() => {
        if (!open) {
            prevColumnCountRef.current = null;
            prevColumnPathsRef.current = [];
            lastPathChangeAtRef.current = 0;
            setColumns([]);
            return;
        }
        const prevPaths = prevColumnPathsRef.current;
        const prevCount = prevColumnCountRef.current;
        const nextKeys = new Set(columnPaths.map(toColumnKey));
        const now = performance.now();
        const isRapid = now - lastPathChangeAtRef.current < COLUMN_ANIMATION_MS;
        lastPathChangeAtRef.current = now;
        const skipAnimations = prefersReducedMotion() || isRapid;
        const isExpanding = prevCount !== null && columnPaths.length > prevCount;
        const enterFromIndex = isExpanding ? prevCount : columnPaths.length;
        const isLateralReplace = prevPaths.length > 0 &&
            columnPaths.length === prevPaths.length &&
            columnPaths.some((pathPrefix, index) => toColumnKey(pathPrefix) !== toColumnKey(prevPaths[index]));
        const removedCount = prevPaths.filter((pathPrefix) => !nextKeys.has(toColumnKey(pathPrefix))).length;
        const allowExitAnimation = !skipAnimations && !isLateralReplace && removedCount === 1;
        const measureExitLayout = (key) => {
            const columnEl = columnElRefs.current.get(key);
            const menuEl = menuRef.current;
            if (!columnEl || !menuEl)
                return undefined;
            const columnRect = columnEl.getBoundingClientRect();
            const menuRect = menuEl.getBoundingClientRect();
            return {
                left: columnRect.left - menuRect.left,
                width: columnRect.width,
            };
        };
        setColumns((prev) => {
            const settled = prev.filter((column) => !column.animateExit);
            const prevByKey = new Map(settled.map((column) => [column.key, column]));
            const active = columnPaths.map((pathPrefix, index) => {
                const key = toColumnKey(pathPrefix);
                const existing = prevByKey.get(key);
                return {
                    pathPrefix,
                    key,
                    animateEnter: skipAnimations ? false : existing ? false : index >= enterFromIndex,
                    animateExit: false,
                };
            });
            if (settled.length === 0) {
                return active;
            }
            const toExit = allowExitAnimation
                ? settled
                    .filter((column) => !nextKeys.has(column.key))
                    .flatMap((column) => {
                    const exitLayout = measureExitLayout(column.key);
                    if (!exitLayout) {
                        return [];
                    }
                    return [
                        {
                            ...column,
                            animateEnter: false,
                            animateExit: true,
                            exitLayout,
                        },
                    ];
                })
                : [];
            const activeMap = new Map(active.map((column) => [column.key, column]));
            const merged = columnPaths.map((pathPrefix) => activeMap.get(toColumnKey(pathPrefix)));
            return [...merged, ...toExit];
        });
        prevColumnCountRef.current = columnPaths.length;
        prevColumnPathsRef.current = columnPaths;
    }, [columnPaths, open]);
    useEffect(() => {
        if (!open || !columns.some((column) => column.animateExit)) {
            return undefined;
        }
        const timeout = window.setTimeout(() => {
            setColumns((prev) => prev.filter((column) => !column.animateExit));
        }, COLUMN_ANIMATION_MS);
        return () => window.clearTimeout(timeout);
    }, [columns, open]);
    return (_jsx(CascaderMenu, { ref: menuRef, className: className, children: columns.map(({ pathPrefix, key, animateEnter, animateExit, exitLayout }) => (_jsx(CascaderColumn, { ref: (element) => {
                if (element) {
                    columnElRefs.current.set(key, element);
                    return;
                }
                columnElRefs.current.delete(key);
            }, animateEnter: animateEnter, animateExit: animateExit, exitLayout: exitLayout, children: _jsx(CascaderItemGroup, { label: "Title", showDivider: true, children: getOptionsAtPath(pathPrefix).map((option) => (_jsx(CascaderItem, { value: option.value, pathPrefix: pathPrefix, disabled: option.disabled, hasChildren: Boolean(option.children?.length), children: option.label }, [...pathPrefix, option.value].join("/")))) }) }, key))) }));
}
/** Convenience field — trigger + options-driven menu. */
export function CascaderField({ options, value, defaultValue, onValueChange, open, defaultOpen, onOpenChange, disabled, size = "regular", changeOnSelect, className, contentClassName, menuClassName, allRound, leftIcon, rightIcon, placeholder, error, separator, ...triggerProps }) {
    return (_jsxs(Cascader, { options: options, value: value, defaultValue: defaultValue, onValueChange: onValueChange, open: open, defaultOpen: defaultOpen, onOpenChange: onOpenChange, disabled: disabled, size: size, changeOnSelect: changeOnSelect, className: className, children: [_jsx(CascaderTrigger, { size: size, allRound: allRound, leftIcon: leftIcon, rightIcon: rightIcon, placeholder: placeholder, error: error, separator: separator, ...triggerProps }), _jsx(CascaderContent, { className: contentClassName, children: _jsx(CascaderOptionsMenu, { className: menuClassName }) })] }));
}
export { getLabelsForPath, getOptionsAtPath, findOptionPath as getOptionAtPath };
