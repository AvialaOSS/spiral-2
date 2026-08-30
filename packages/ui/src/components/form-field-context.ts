import { createContext, useContext } from "react";

/**
 * Kept free of `react-hook-form` imports so the controls that consume it
 * (Input, Textarea, Select, …) stay usable from the main entry without the
 * peer dependency installed. The RHF-aware pieces live in `form-field.tsx`,
 * which is only reachable through `@aviala-design/spiral/form`.
 */
type FormFieldControlContextValue = {
  /** True when FormField is showing an error tip (layout `error` or RHF message). */
  invalid: boolean;
};

export const FormFieldControlContext = createContext<FormFieldControlContextValue | null>(null);

/**
 * Resolve a control `error` prop against the surrounding FormField.
 * Explicit `error={true|false}` wins; otherwise inherits FormField tip invalidity.
 */
export function useResolvedControlError(errorProp?: boolean): boolean {
  const ctx = useContext(FormFieldControlContext);
  return errorProp ?? ctx?.invalid ?? false;
}
