/**
 * `@aviala-design/spiral/form` — the only entry that pulls in `react-hook-form`.
 * Import from here when you bind fields to a form; the main entry stays free of
 * the peer dependency.
 */
export {
  Form,
  FormField,
  type FormFieldProps,
  type FormFieldLayoutProps,
  type FormFieldControlledProps,
  type FormFieldRenderProps,
  type FormFieldDirection,
  useResolvedControlError,
} from "./components/form-field";
