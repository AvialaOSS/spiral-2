import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cloneElement, createContext, forwardRef, isValidElement, useCallback, useContext, useLayoutEffect, useRef, useState, } from "react";
import { cn } from "../lib/utils";
import { typographyVariants } from "./typography";
const SegmentatorContext = createContext(null);
function useSegmentatorContext() {
    const ctx = useContext(SegmentatorContext);
    if (!ctx) {
        throw new Error("SegmentatorItem must be used within SegmentatorGroup");
    }
    return ctx;
}
function renderIcon(node, dimmed) {
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
    return (_jsx("span", { className: cn("relative z-[1] inline-flex h-6 shrink-0 items-center justify-center", dimmed && "opacity-[var(--button-disabled-opacity,0.55)]"), children: content }));
}
function useSegmentatorState(value, defaultValue, onValueChange) {
    const [internal, setInternal] = useState(defaultValue ?? "");
    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;
    const setValue = (next) => {
        if (!isControlled)
            setInternal(next);
        onValueChange?.(next);
    };
    return [current, setValue];
}
const SEGMENTATOR_ANIMATION_MS_FALLBACK = 300;
const SEGMENTATOR_ANIMATION_EASING_FALLBACK = "cubic-bezier(0.33, 1, 0.68, 1)";
function parseDurationMs(value) {
    const trimmed = value.trim();
    if (!trimmed)
        return SEGMENTATOR_ANIMATION_MS_FALLBACK;
    if (trimmed.endsWith("ms"))
        return parseFloat(trimmed) || SEGMENTATOR_ANIMATION_MS_FALLBACK;
    if (trimmed.endsWith("s")) {
        return (parseFloat(trimmed) || 0.3) * 1000;
    }
    const parsed = parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : SEGMENTATOR_ANIMATION_MS_FALLBACK;
}
function getSegmentatorAnimationTiming(el) {
    const style = getComputedStyle(el);
    const durationMs = parseDurationMs(style.getPropertyValue("--segmentator-transition-duration"));
    const easing = style.getPropertyValue("--segmentator-transition-easing").trim() ||
        SEGMENTATOR_ANIMATION_EASING_FALLBACK;
    return { durationMs, easing };
}
function applyThumbMetrics(el, metrics, instant = false) {
    if (instant) {
        el.setAttribute("data-instant", "true");
    }
    el.style.width = `${metrics.width}px`;
    el.style.height = `${metrics.height}px`;
    el.style.transform = `translate(${metrics.x}px, ${metrics.y}px)`;
    if (instant) {
        void el.offsetWidth;
        el.removeAttribute("data-instant");
    }
}
function measureThumbFromElement(thumbEl, groupEl) {
    const groupRect = groupEl.getBoundingClientRect();
    const thumbRect = thumbEl.getBoundingClientRect();
    return {
        x: thumbRect.left - groupRect.left,
        y: thumbRect.top - groupRect.top,
        width: thumbRect.width,
        height: thumbRect.height,
    };
}
function metricsApproxEqual(a, b, epsilon = 0.5) {
    return (Math.abs(a.x - b.x) < epsilon &&
        Math.abs(a.y - b.y) < epsilon &&
        Math.abs(a.width - b.width) < epsilon &&
        Math.abs(a.height - b.height) < epsilon);
}
function useSegmentatorThumb(groupRef, selectedValue) {
    const thumbElRef = useRef(null);
    const metricsRef = useRef(null);
    const animationRef = useRef(null);
    const animationGenerationRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const [thumb, setThumb] = useState(null);
    const isInitialMount = useRef(true);
    const measureThumb = useCallback(() => {
        const group = groupRef.current;
        if (!group)
            return null;
        const selected = group.querySelector('.aviala-segmentator-item[data-selected="true"]');
        if (!selected)
            return null;
        const groupRect = group.getBoundingClientRect();
        const itemRect = selected.getBoundingClientRect();
        return {
            x: itemRect.left - groupRect.left,
            y: itemRect.top - groupRect.top,
            width: itemRect.width,
            height: itemRect.height,
        };
    }, [groupRef]);
    const syncThumb = useCallback((metrics, instant = false) => {
        metricsRef.current = metrics;
        setThumb(metrics);
        const el = thumbElRef.current;
        if (el)
            applyThumbMetrics(el, metrics, instant);
    }, []);
    const onThumbRef = useCallback((node) => {
        thumbElRef.current = node;
        if (node && metricsRef.current && isInitialMount.current) {
            applyThumbMetrics(node, metricsRef.current, true);
            isInitialMount.current = false;
        }
    }, []);
    useLayoutEffect(() => {
        const group = groupRef.current;
        const next = measureThumb();
        if (!next)
            return;
        const el = thumbElRef.current;
        if (isInitialMount.current) {
            metricsRef.current = next;
            setThumb(next);
            if (el) {
                applyThumbMetrics(el, next, true);
                isInitialMount.current = false;
            }
            return;
        }
        if (!el || !group) {
            syncThumb(next, true);
            return;
        }
        const generation = ++animationGenerationRef.current;
        const hadActiveAnimation = animationRef.current != null;
        // Capture the thumb's current visual geometry before canceling WAAPI so
        // interrupted animations restart from where the user sees the thumb.
        const start = hadActiveAnimation || isAnimatingRef.current
            ? measureThumbFromElement(el, group)
            : metricsRef.current ?? next;
        animationRef.current?.cancel();
        animationRef.current = null;
        isAnimatingRef.current = false;
        if (metricsApproxEqual(start, next)) {
            syncThumb(next, true);
            return;
        }
        isAnimatingRef.current = true;
        applyThumbMetrics(el, start, true);
        el.setAttribute("data-instant", "true");
        const prefersReducedMotion = typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            el.removeAttribute("data-instant");
            syncThumb(next, true);
            isAnimatingRef.current = false;
            return;
        }
        const { durationMs, easing } = getSegmentatorAnimationTiming(el);
        const animation = el.animate([
            {
                transform: `translate(${start.x}px, ${start.y}px)`,
                width: `${start.width}px`,
                height: `${start.height}px`,
            },
            {
                transform: `translate(${next.x}px, ${next.y}px)`,
                width: `${next.width}px`,
                height: `${next.height}px`,
            },
        ], {
            duration: durationMs,
            easing,
            fill: "forwards",
        });
        animationRef.current = animation;
        const finish = () => {
            if (generation !== animationGenerationRef.current)
                return;
            animationRef.current = null;
            isAnimatingRef.current = false;
            el.removeAttribute("data-instant");
            syncThumb(next, true);
        };
        animation.addEventListener("finish", finish, { once: true });
        return () => {
            animation.removeEventListener("finish", finish);
        };
    }, [selectedValue, measureThumb, syncThumb, groupRef]);
    useLayoutEffect(() => {
        const group = groupRef.current;
        if (!group)
            return;
        const observer = new ResizeObserver(() => {
            if (isAnimatingRef.current)
                return;
            const metrics = measureThumb();
            if (metrics)
                syncThumb(metrics, true);
        });
        observer.observe(group);
        const items = group.querySelectorAll(".aviala-segmentator-item");
        items.forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, [groupRef, measureThumb, syncThumb]);
    return { thumb, onThumbRef };
}
export const SegmentatorGroup = forwardRef(({ className, value, defaultValue, onValueChange, mode = "nested", allRound = false, disabled, children, ...props }, ref) => {
    const [currentValue, setValue] = useSegmentatorState(value, defaultValue, onValueChange);
    const groupRef = useRef(null);
    const { thumb, onThumbRef } = useSegmentatorThumb(groupRef, currentValue);
    const thumbStyle = thumb
        ? {
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 0,
            width: thumb.width,
            height: thumb.height,
            transform: `translate(${thumb.x}px, ${thumb.y}px)`,
        }
        : undefined;
    return (_jsx(SegmentatorContext.Provider, { value: {
            value: currentValue,
            onValueChange: setValue,
            mode,
            allRound,
            disabled,
        }, children: _jsxs("div", { ref: (node) => {
                groupRef.current = node;
                if (typeof ref === "function")
                    ref(node);
                else if (ref)
                    ref.current = node;
            }, role: "group", className: cn("aviala-segmentator-group", className), "data-all-round": allRound ? "true" : "false", "data-mode": mode, ...props, children: [children, thumb && (_jsx("span", { ref: onThumbRef, "aria-hidden": true, className: "aviala-segmentator-thumb", "data-mode": mode, "data-all-round": allRound ? "true" : "false", style: thumbStyle }))] }) }));
});
SegmentatorGroup.displayName = "SegmentatorGroup";
export const SegmentatorItem = forwardRef(({ className, value, leftIcon, rightIcon, iconOnly: iconOnlyProp, children, disabled, onClick, ...props }, ref) => {
    const ctx = useSegmentatorContext();
    const selected = ctx.value === value;
    const iconOnly = iconOnlyProp ?? (!!(leftIcon ?? rightIcon) && !children);
    const isDisabled = disabled || ctx.disabled;
    const dimmed = isDisabled;
    const icon = iconOnly ? (leftIcon ?? rightIcon) : leftIcon;
    return (_jsxs("button", { ref: ref, type: "button", role: "radio", "aria-checked": selected, "data-selected": selected ? "true" : "false", "data-mode": ctx.mode, "data-all-round": ctx.allRound ? "true" : "false", disabled: isDisabled, className: cn("aviala-segmentator-item", iconOnly && "min-w-0", className), onClick: (e) => {
            ctx.onValueChange?.(value);
            onClick?.(e);
        }, ...props, children: [renderIcon(icon, dimmed && !!icon), !iconOnly && (_jsx("span", { className: cn("relative z-[1] shrink-0 [word-break:break-word]", typographyVariants({ level: "text" }), dimmed && "opacity-[var(--button-disabled-opacity,0.55)]"), children: children })), !iconOnly && renderIcon(rightIcon, dimmed && !!rightIcon)] }));
});
SegmentatorItem.displayName = "SegmentatorItem";
