import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "../lib/utils";
import { Typography, } from "./typography";
const typefaceLayouts = {
    allCustom: [
        { level: "text", children: null },
        { level: "caption", children: null },
    ],
    textCaption: [
        { level: "text", children: null },
        { level: "caption", children: null },
    ],
    textCaptionSubtitle: [
        { level: "subtitle", children: null },
        { level: "text", children: null },
        { level: "caption", children: null },
    ],
    textTitle: [
        { level: "title", children: null },
        { level: "text", children: null },
    ],
    textHeadline2: [
        { level: "headline2", children: null },
        { level: "text", children: null },
    ],
    textHeadline1: [
        { level: "headline1", children: null },
        { level: "text", children: null },
    ],
};
export const Typeface = forwardRef(({ className, content = "allCustom", primary, secondary, tertiary, primaryContent = "text", secondaryContent = "text", tertiaryContent = "text", tone = "default", children, ...props }, ref) => {
    const layout = typefaceLayouts[content];
    const values = resolveTypefaceValues(content, primary, secondary, tertiary, children);
    return (_jsx("div", { ref: ref, className: cn("aviala-typeface", className), "data-content": content, ...props, children: layout.map((line, index) => {
            const value = values[index];
            if (value === undefined || value === null || value === false)
                return null;
            const lineContent = index === 0
                ? primaryContent
                : index === 1
                    ? secondaryContent
                    : tertiaryContent;
            return (_jsx("span", { className: "aviala-typeface__line", children: _jsx(Typography, { level: line.level, content: lineContent, tone: tone, children: value }) }, `${line.level}-${index}`));
        }) }));
});
Typeface.displayName = "Typeface";
function resolveTypefaceValues(content, primary, secondary, tertiary, children) {
    if (primary !== undefined || secondary !== undefined || tertiary !== undefined) {
        return [primary, secondary, tertiary];
    }
    if (children == null || children === false) {
        return typefaceLayouts[content].map(() => "Text");
    }
    if (Array.isArray(children)) {
        return children;
    }
    return [children];
}
export const TypefacePair = forwardRef(({ title, description, ...props }, ref) => (_jsx(Typeface, { ref: ref, content: "textCaption", primary: title, secondary: description, ...props })));
TypefacePair.displayName = "TypefacePair";
