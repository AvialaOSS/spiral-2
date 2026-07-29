import { forwardRef, useId, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { Typeface } from "./typeface";

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: "inside" | "component" | "content" | "block" | "page";
  direction?: "row" | "column";
};

const gapMap = {
  inside: "var(--gap-inside, 4px)",
  component: "var(--gap-component, 8px)",
  content: "var(--gap-content, 10px)",
  block: "var(--gap-block, 14px)",
  page: "var(--gap-page-space, 24px)",
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap = "component", direction = "column", style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex", direction === "row" ? "flex-row" : "flex-col", className)}
      style={{ gap: gapMap[gap], ...style }}
      {...props}
    />
  )
);
Stack.displayName = "Stack";

/** Figma Components → System Composition → Form Group (530:65349) */
export type FieldsetProps = HTMLAttributes<HTMLFieldSetElement> & {
  /** @deprecated Prefer `title` — kept for API compatibility */
  legend?: ReactNode;
  /** Form Group title (Typeface Text+Title primary) */
  title?: ReactNode;
  /** Form Group subtitle (Typeface Text+Title secondary) */
  description?: ReactNode;
  /** Optional footer info row above actions */
  info?: ReactNode;
  /** Optional Alert / Feedback above actions */
  feedback?: ReactNode;
  /** Action slot — typically a Button row */
  actions?: ReactNode;
};

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  (
    {
      className,
      legend,
      title,
      description,
      info,
      feedback,
      actions,
      children,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const headingId = `${reactId}-heading`;
    const heading = title ?? legend;
    const hasHeading = heading != null && heading !== "";
    const hasAction = info != null || feedback != null || actions != null;

    return (
      <fieldset
        ref={ref}
        className={cn("aviala-form-group", className)}
        aria-labelledby={hasHeading ? headingId : undefined}
        {...props}
      >
        {hasHeading || description ? (
          <Typeface
            id={headingId}
            className="aviala-form-group__header"
            content="textTitle"
            primary={heading}
            secondary={description}
          />
        ) : null}

        <div className="aviala-form-group__slot">{children}</div>

        {hasAction ? (
          <div className="aviala-form-group__action">
            {info ? <div className="aviala-form-group__info">{info}</div> : null}
            {feedback ? <div className="aviala-form-group__feedback">{feedback}</div> : null}
            {actions ? <div className="aviala-form-group__actions">{actions}</div> : null}
          </div>
        ) : null}
      </fieldset>
    );
  }
);
Fieldset.displayName = "Fieldset";
