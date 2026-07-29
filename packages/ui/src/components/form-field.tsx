import { SymbolInformationCircle, SymbolWrongCircle } from "@aviala-design/icons";
import { forwardRef, useId, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { Typeface } from "./typeface";
import { Typography } from "./typography";

/** Figma Components → System Composition → Form (527:57461 / 527:57641) */
export type FormFieldDirection = "vertical" | "horizontal";

export type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
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
};

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
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
    const labelNode =
      hasLabel || description ? (
        htmlFor ? (
          <label htmlFor={htmlFor} className="aviala-form__label aviala-form__label--control">
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
          {children}
          {error ? (
            <div className="aviala-form__message aviala-form__message--error" role="alert">
              <SymbolWrongCircle
                className="aviala-form__message-icon"
                width={14}
                height={14}
                aria-hidden
              />
              <Typography level="caption" as="p" className="aviala-form__message-text">
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
              <Typography level="caption" as="p" className="aviala-form__message-text">
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
FormField.displayName = "FormField";
