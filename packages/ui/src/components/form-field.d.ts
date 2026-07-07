import { type HTMLAttributes, type ReactNode } from "react";
export type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
    label?: string;
    htmlFor?: string;
    description?: ReactNode;
    error?: string;
    required?: boolean;
};
export declare const FormField: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & {
    label?: string;
    htmlFor?: string;
    description?: ReactNode;
    error?: string;
    required?: boolean;
} & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=form-field.d.ts.map