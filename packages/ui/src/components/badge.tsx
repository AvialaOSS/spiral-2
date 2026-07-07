import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Typography } from "./typography";

/** Figma Components → Information Display → Badge (also used in BaseInput badge area) */
export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
};

function renderBadgeIcon(node: ReactNode): ReactNode {
  if (!node) return null;
  const content =
    isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(node as ReactElement<{ width?: number; height?: number; className?: string }>, {
          width: 18,
          height: 18,
          className: cn(
            (node as ReactElement<{ className?: string }>).props.className,
            "shrink-0"
          ),
        })
      : node;

  return (
    <span className="aviala-badge__icon" aria-hidden>
      {content}
    </span>
  );
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, children, leftIcon, rightIcon, ...props }, ref) => (
    <span ref={ref} className={cn("aviala-badge", className)} {...props}>
      {renderBadgeIcon(leftIcon)}
      <Typography level="text" as="span" className="aviala-badge__text whitespace-nowrap">
        {children}
      </Typography>
      {renderBadgeIcon(rightIcon)}
    </span>
  )
);
Badge.displayName = "Badge";
