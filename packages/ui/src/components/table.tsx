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

/** Figma Components → Information Display → Table (1457:1475) */
export type TableCellContent =
  | "text"
  | "icon+text"
  | "people"
  | "badge"
  | "switch"
  | "action"
  | "checkbox";

export type TableProps = HTMLAttributes<HTMLDivElement>;

export const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="table"
      className={cn("aviala-table", className)}
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

export type TableHeadProps = ComponentPropsWithoutRef<"div"> & {
  content?: Extract<TableCellContent, "text" | "checkbox">;
};

export const TableHead = forwardRef<HTMLDivElement, TableHeadProps>(
  ({ className, content = "text", children, ...props }, ref) => (
    <div
      ref={ref}
      role="columnheader"
      className={cn("aviala-table-head", className)}
      data-content={content}
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Typography level="caption" as="span">
          {children}
        </Typography>
      ) : (
        children
      )}
    </div>
  )
);
TableHead.displayName = "TableHead";

function renderCellIcon(node: ReactNode): ReactNode {
  if (!node) return null;
  const content =
    isValidElement(node) && typeof node.type !== "string"
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

export type TableCellProps = ComponentPropsWithoutRef<"div"> & {
  content?: TableCellContent;
  icon?: ReactNode;
  text?: ReactNode;
  people?: ReactNode;
  badge?: ReactNode;
  badgeLabel?: ReactNode;
  switchProps?: SwitchProps;
  actions?: ReactNode;
  checkboxProps?: ComponentPropsWithoutRef<typeof Checkbox>;
};

export const TableCell = forwardRef<HTMLDivElement, TableCellProps>(
  (
    {
      className,
      content = "text",
      icon,
      text,
      people,
      badge,
      badgeLabel,
      switchProps,
      actions,
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
        case "icon+text":
          return (
            <>
              {renderCellIcon(icon)}
              <span className="aviala-table-cell__text">
                <Typography level="text" as="span">
                  {text}
                </Typography>
              </span>
            </>
          );
        case "people":
          return (
            <>
              {people ?? <Avatar content="text" level="text">A</Avatar>}
              <span className="aviala-table-cell__text">
                <Typography level="text" as="span">
                  {text}
                </Typography>
              </span>
            </>
          );
        case "badge":
          return (
            badge ?? (
              <Badge style="theme" level="caption">
                {badgeLabel ?? "Text"}
              </Badge>
            )
          );
        case "switch":
          return <Switch {...switchProps} />;
        case "action":
          return <div className="aviala-table-cell__actions">{actions}</div>;
        case "text":
        default:
          return (
            <span className="aviala-table-cell__text">
              <Typography level="text" as="span">
                {text}
              </Typography>
            </span>
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
