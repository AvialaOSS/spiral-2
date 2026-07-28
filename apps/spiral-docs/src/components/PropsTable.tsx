import { Table, TableCell, TableHead, TableRow, Typography } from "@aviala-design/spiral";

export type PropItem = {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  description?: string;
};

type PropsTableProps = {
  title?: string;
  props: PropItem[];
};

export function PropsTable({ title = "API", props }: PropsTableProps) {
  if (props.length === 0) return null;

  return (
    <section className="docs-props" id="api">
      <Typography level="title" as="h2">
        {title}
      </Typography>
      <div className="docs-props-table-wrap">
        <Table className="docs-props-table" aria-label={title}>
          <TableRow header>
            <TableHead>属性</TableHead>
            <TableHead>说明</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>默认值</TableHead>
          </TableRow>
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell>
                <code>{prop.name}</code>
                {prop.required ? <span className="docs-props-required">*</span> : null}
              </TableCell>
              <TableCell text={prop.description ?? "—"} />
              <TableCell>
                <code className="docs-props-type">{prop.type}</code>
              </TableCell>
              <TableCell text={prop.defaultValue ?? "—"} />
            </TableRow>
          ))}
        </Table>
      </div>
    </section>
  );
}
