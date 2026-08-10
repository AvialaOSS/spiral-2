import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { Switch, type SwitchProps } from "./switch";
import { Typography } from "./typography";

/** Figma Components → Information Display → Table (953:75844 / 1457:1475) */
export type TableCellContent =
  | "text"
  | "icon+text"
  | "icon-place+text"
  | "people"
  | "badge"
  | "switch"
  | "action"
  | "checkbox";

export type TableProps = HTMLAttributes<HTMLDivElement> & {
  /** Freeze header row while the table body scrolls */
  stickyHeader?: boolean;
};

export const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ className, stickyHeader = false, children, ...props }, ref) => (
    <div
      ref={ref}
      role="table"
      className={cn("aviala-table", className)}
      data-sticky-header={stickyHeader ? "true" : undefined}
      {...props}
    >
      {children}
    </div>
  )
);
Table.displayName = "Table";

export type TableRowProps = HTMLAttributes<HTMLDivElement> & {
  header?: boolean;
};

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ className, header = false, children, ...props }, ref) => (
    <div
      ref={ref}
      role="row"
      className={cn("aviala-table__row", className)}
      data-header={header ? "true" : undefined}
      {...props}
    >
      {children}
    </div>
  )
);
TableRow.displayName = "TableRow";

function renderCellIcon(node: ReactNode, sized = true): ReactNode {
  if (!node) return null;
  const content =
    sized && isValidElement(node) && typeof node.type !== "string"
      ? cloneElement(node as ReactElement<{ width?: number; height?: number; className?: string }>, {
          width: 16,
          height: 16,
          className: cn(
            (node as ReactElement<{ className?: string }>).props.className,
            "shrink-0"
          ),
        })
      : node;

  return <span className="aviala-table-cell__icon">{content}</span>;
}

function renderTextBlock(text: ReactNode, caption?: ReactNode) {
  return (
    <span className="aviala-table-cell__text">
      <Typography level="text" as="span">
        {text}
      </Typography>
      {caption != null && caption !== false ? (
        <Typography level="caption" as="span" className="aviala-table-cell__caption">
          {caption}
        </Typography>
      ) : null}
    </span>
  );
}

function renderActions(actions: ReactNode) {
  if (actions == null) return null;
  return <div className="aviala-table-cell__actions">{actions}</div>;
}

function renderCellBody(main: ReactNode, actions?: ReactNode) {
  return (
    <span className="aviala-table-cell__body">
      <span className="aviala-table-cell__main">{main}</span>
      {renderActions(actions)}
    </span>
  );
}

export type TableHeadProps = ComponentPropsWithoutRef<"div"> & {
  content?: Extract<TableCellContent, "text" | "checkbox">;
  /** Header trailing button area (Figma Table Head Default) */
  actions?: ReactNode;
  /** Select-all / indeterminate / unchecked via Checkbox props */
  checkboxProps?: ComponentPropsWithoutRef<typeof Checkbox>;
};

export const TableHead = forwardRef<HTMLDivElement, TableHeadProps>(
  (
    { className, content = "text", actions, checkboxProps, children, ...props },
    ref
  ) => {
    const renderBody = () => {
      if (content === "checkbox") {
        return children ?? <Checkbox {...checkboxProps} />;
      }

      if (children != null) {
        return (
          <>
            <span className="aviala-table-cell__main">
              {typeof children === "string" || typeof children === "number" ? (
                <Typography level="text" as="span">
                  {children}
                </Typography>
              ) : (
                children
              )}
            </span>
            {renderActions(actions)}
          </>
        );
      }

      return null;
    };

    return (
      <div
        ref={ref}
        role="columnheader"
        className={cn("aviala-table-head", className)}
        data-content={content}
        {...props}
      >
        {renderBody()}
      </div>
    );
  }
);
TableHead.displayName = "TableHead";

export type TableCellProps = ComponentPropsWithoutRef<"div"> & {
  content?: TableCellContent;
  icon?: ReactNode;
  /** Shaped icon place (Figma `icon place+text`) */
  iconPlace?: ReactNode;
  text?: ReactNode;
  /** Secondary caption under primary text (Figma Typeface pair) */
  caption?: ReactNode;
  people?: ReactNode;
  badge?: ReactNode;
  badgeLabel?: ReactNode;
  switchProps?: SwitchProps;
  /** Trailing button area — supported on text / icon / people / badge / action */
  actions?: ReactNode;
  /** Optional leading grabber control */
  grabber?: ReactNode;
  checkboxProps?: ComponentPropsWithoutRef<typeof Checkbox>;
};

export const TableCell = forwardRef<HTMLDivElement, TableCellProps>(
  (
    {
      className,
      content = "text",
      icon,
      iconPlace,
      text,
      caption,
      people,
      badge,
      badgeLabel,
      switchProps,
      actions,
      grabber,
      checkboxProps,
      children,
      ...props
    },
    ref
  ) => {
    const renderContent = () => {
      if (children != null) return children;

      switch (content) {
        case "checkbox":
          return <Checkbox {...checkboxProps} />;
        case "switch":
          return <Switch {...switchProps} />;
        case "action":
          return renderActions(actions);
        case "icon+text":
          return (
            <>
              {grabber}
              {renderCellBody(
                <>
                  {renderCellIcon(icon)}
                  {renderTextBlock(text, caption)}
                </>,
                actions
              )}
            </>
          );
        case "icon-place+text":
          return (
            <>
              {grabber}
              {renderCellBody(
                <>
                  <span className="aviala-table-cell__icon-place">
                    {iconPlace ?? renderCellIcon(icon, false) ?? (
                      <Avatar content="text" level="text" lineHeightFix={false}>
                        A
                      </Avatar>
                    )}
                  </span>
                  {renderTextBlock(text, caption)}
                </>,
                actions
              )}
            </>
          );
        case "people":
          return (
            <>
              {grabber}
              {renderCellBody(
                <>
                  {people ?? (
                    <Avatar content="text" level="text" lineHeightFix={false}>
                      A
                    </Avatar>
                  )}
                  {renderTextBlock(text, caption)}
                </>,
                actions
              )}
            </>
          );
        case "badge":
          return (
            <>
              {grabber}
              {renderCellBody(
                badge ?? (
                  <Badge style="theme" level="caption">
                    {badgeLabel ?? "Text"}
                  </Badge>
                ),
                actions
              )}
            </>
          );
        case "text":
        default:
          return (
            <>
              {grabber}
              {renderCellBody(renderTextBlock(text, caption), actions)}
            </>
          );
      }
    };

    return (
      <div
        ref={ref}
        role="cell"
        className={cn("aviala-table-cell", className)}
        data-content={content}
        {...props}
      >
        {renderContent()}
      </div>
    );
  }
);
TableCell.displayName = "TableCell";
