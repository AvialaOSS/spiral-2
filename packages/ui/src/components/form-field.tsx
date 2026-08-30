import {
  SymbolInformationCircle,
  SymbolWrongCircle,
} from "@aviala-design/icons";
import {
  forwardRef,
  useId,
  useMemo,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import {
  FormProvider,
  useController,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  type UseFormStateReturn,
} from "react-hook-form";
import { cn } from "../lib/utils";
import { FormFieldControlContext } from "./form-field-context";
import { Typeface } from "./typeface";
import { Typography } from "./typography";

/** Figma Components → System Composition → Form (527:57461 / 527:57641) */
export type FormFieldDirection = "vertical" | "horizontal";

export { useResolvedControlError } from "./form-field-context";

/** Layout mode — the original props-driven wrapper */
export type FormFieldLayoutProps = HTMLAttributes<HTMLDivElement> & {
  label?: ReactNode;
  htmlFor?: string;
  description?: ReactNode;
  error?: ReactNode;
  info?: ReactNode;
  /** Optional Alert / Feedback under the control */
  alert?: ReactNode;
  required?: boolean;
  /** Figma `Direction` — vertical stacks label above control; horizontal places label beside */
  direction?: FormFieldDirection;
  children?: ReactNode;
};

/** Render arguments passed to `render` in react-hook-form mode */
export type FormFieldRenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
  /**
   * Auto-generated control id. The field label is already wired to it via
   * `htmlFor` — pass it to the underlying input (`<Input id={id} />`).
   */
  id: string;
};

/**
 * react-hook-form mode — bind the field to a form via `name` (+ optional
 * `control`; falls back to the surrounding `<Form>` context). Validation
 * errors from the resolver (zod etc.) are rendered automatically unless the
 * `error` prop overrides them. Nested controls inherit the invalid state via
 * context unless they set an explicit `error` prop.
 */
export type FormFieldControlledProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<FormFieldLayoutProps, "children" | "htmlFor"> &
  Pick<
    UseControllerProps<TFieldValues, TName>,
    "rules" | "defaultValue" | "shouldUnregister" | "disabled"
  > & {
    name: TName;
    control?: Control<TFieldValues>;
    render: (props: FormFieldRenderProps<TFieldValues, TName>) => ReactNode;
    /** Overrides the validation error message shown under the control */
    error?: ReactNode;
  };

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = FormFieldLayoutProps | FormFieldControlledProps<TFieldValues, TName>;

const FormFieldLayout = forwardRef<HTMLDivElement, FormFieldLayoutProps>(
  (
    {
      className,
      label,
      htmlFor,
      description,
      error,
      info,
      alert,
      required,
      direction = "vertical",
      children,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const labelId = `${reactId}-label`;
    const hasLabel = label != null && label !== "";
    const invalid = Boolean(error);
    const controlContext = useMemo(() => ({ invalid }), [invalid]);
    const labelNode =
      hasLabel || description ? (
        htmlFor ? (
          <label
            htmlFor={htmlFor}
            className="aviala-form__label aviala-form__label--control"
          >
            <Typeface
              id={labelId}
              content="textCaption"
              primary={
                hasLabel ? (
                  <>
                    {label}
                    {required ? (
                      <span className="aviala-form__required" aria-hidden>
                        *
                      </span>
                    ) : null}
                  </>
                ) : undefined
              }
              secondary={description}
            />
          </label>
        ) : (
          <Typeface
            id={labelId}
            className="aviala-form__label"
            content="textCaption"
            primary={
              hasLabel ? (
                <>
                  {label}
                  {required ? (
                    <span className="aviala-form__required" aria-hidden>
                      *
                    </span>
                  ) : null}
                </>
              ) : undefined
            }
            secondary={description}
          />
        )
      ) : null;

    return (
      <div
        ref={ref}
        className={cn("aviala-form", className)}
        data-direction={direction}
        aria-labelledby={hasLabel ? labelId : undefined}
        {...props}
      >
        {labelNode}
        <div className="aviala-form__content">
          <FormFieldControlContext.Provider value={controlContext}>
            {children}
          </FormFieldControlContext.Provider>
          {error ? (
            <div
              className="aviala-form__message aviala-form__message--error"
              role="alert"
            >
              <SymbolWrongCircle
                className="aviala-form__message-icon"
                width={14}
                height={14}
                aria-hidden
              />
              <Typography
                level="caption"
                as="p"
                className="aviala-form__message-text"
              >
                {error}
              </Typography>
            </div>
          ) : null}
          {info ? (
            <div className="aviala-form__message aviala-form__message--info">
              <SymbolInformationCircle
                className="aviala-form__message-icon"
                width={14}
                height={14}
                aria-hidden
              />
              <Typography
                level="caption"
                as="p"
                className="aviala-form__message-text"
              >
                {info}
              </Typography>
            </div>
          ) : null}
          {alert ? <div className="aviala-form__alert">{alert}</div> : null}
        </div>
      </div>
    );
  }
);
FormFieldLayout.displayName = "FormFieldLayout";

const FormFieldControlled = forwardRef<
  HTMLDivElement,
  FormFieldControlledProps
>(
  (
    {
      control,
      name,
      rules,
      defaultValue,
      shouldUnregister,
      disabled,
      render,
      error,
      ...layoutProps
    },
    ref
  ) => {
    const id = useId();
    const { field, fieldState, formState } = useController({
      name,
      control,
      rules,
      defaultValue,
      shouldUnregister,
      disabled,
    });
    const message =
      error !== undefined ? error : (fieldState.error?.message ?? null);

    return (
      <FormFieldLayout ref={ref} {...layoutProps} htmlFor={id} error={message}>
        {render({ field, fieldState, formState, id })}
      </FormFieldLayout>
    );
  }
);
FormFieldControlled.displayName = "FormFieldControlled";

function isControlledProps(
  props: FormFieldProps
): props is FormFieldControlledProps {
  return (
    "render" in props && typeof props.render === "function" && "name" in props
  );
}

const FormFieldRoot = forwardRef<HTMLDivElement, FormFieldProps>(
  (props, ref) => {
    if (isControlledProps(props)) {
      return <FormFieldControlled ref={ref} {...props} />;
    }
    return <FormFieldLayout ref={ref} {...props} />;
  }
);

/**
 * FormField — layout wrapper around a form control, or a react-hook-form
 * bound field when given `name` + `render` (shadcn-style).
 *
 * When an error tip is shown, nested Spiral controls that support `error`
 * (Input, Textarea, SelectTrigger, …) inherit the invalid state unless they
 * set an explicit `error` prop.
 *
 * @example Layout mode
 * <FormField label="Email" htmlFor="email" error="Required">
 *   <Input id="email" />
 * </FormField>
 *
 * @example react-hook-form + zod mode
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormField
 *       control={form.control}
 *       name="email"
 *       label="Email"
 *       render={({ field, id }) => (
 *         <Input id={id} {...field} />
 *       )}
 *     />
 *   </form>
 * </Form>
 */
export const FormField = FormFieldRoot as {
  <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  >(
    props: FormFieldProps<TFieldValues, TName> & { ref?: Ref<HTMLDivElement> }
  ): ReactElement | null;
  displayName?: string;
};
FormField.displayName = "FormField";

/** Alias of react-hook-form's FormProvider — wrap your form with it (shadcn-style `<Form {...form}>`) */
export const Form = FormProvider;
