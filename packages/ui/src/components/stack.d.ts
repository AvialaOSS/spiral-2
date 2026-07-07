import { type HTMLAttributes } from "react";
export type StackProps = HTMLAttributes<HTMLDivElement> & {
    gap?: "inside" | "component" | "content" | "block" | "page";
    direction?: "row" | "column";
};
export declare const Stack: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & {
    gap?: "inside" | "component" | "content" | "block" | "page";
    direction?: "row" | "column";
} & import("react").RefAttributes<HTMLDivElement>>;
export declare const Fieldset: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLFieldSetElement> & {
    legend?: string;
} & import("react").RefAttributes<HTMLFieldSetElement>>;
//# sourceMappingURL=stack.d.ts.map