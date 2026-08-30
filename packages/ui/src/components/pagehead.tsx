import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { Typeface } from "./typeface";

/** Figma Components → Structure Navigation → Pagehead (643:172156) */

export type PageheadProps = HTMLAttributes<HTMLElement> & {
  /** Optional leading control (typically back button) */
  back?: ReactNode;
  /** Optional breadcrumb above the title */
  breadcrumb?: ReactNode;
  /** Primary title line */
  title?: ReactNode;
  /** Secondary caption under title */
  description?: ReactNode;
  /** Trailing actions slot */
  actions?: ReactNode;
};

export const Pagehead = forwardRef<HTMLElement, PageheadProps>(
  (
    {
      className,
      back,
      breadcrumb,
      title,
      description,
      actions,
      children,
      ...props
    },
    ref
  ) => (
    <header ref={ref} className={cn("aviala-pagehead", className)} {...props}>
      <div className="aviala-pagehead__main">
        {back != null ? (
          <div className="aviala-pagehead__back">{back}</div>
        ) : null}
        <div className="aviala-pagehead__title-block">
          {breadcrumb != null ? (
            <div className="aviala-pagehead__breadcrumb">{breadcrumb}</div>
          ) : null}
          {title != null || description != null ? (
            <div className="aviala-pagehead__title">
              <Typeface
                content="textCaption"
                primary={title}
                secondary={description}
              />
            </div>
          ) : null}
          {children}
        </div>
      </div>
      {actions != null ? (
        <div className="aviala-pagehead__actions">{actions}</div>
      ) : null}
    </header>
  )
);
Pagehead.displayName = "Pagehead";
