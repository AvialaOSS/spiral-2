import { Typography } from "@aviala-design/spiral";

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
        <table className="docs-props-table">
          <thead>
            <tr>
              <th>
                <Typography level="caption" as="span">
                  属性
                </Typography>
              </th>
              <th>
                <Typography level="caption" as="span">
                  说明
                </Typography>
              </th>
              <th>
                <Typography level="caption" as="span">
                  类型
                </Typography>
              </th>
              <th>
                <Typography level="caption" as="span">
                  默认值
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name}>
                <td>
                  <code>{prop.name}</code>
                  {prop.required ? <span className="docs-props-required">*</span> : null}
                </td>
                <td>
                  <Typography level="text" as="span">
                    {prop.description ?? "—"}
                  </Typography>
                </td>
                <td>
                  <code className="docs-props-type">{prop.type}</code>
                </td>
                <td>
                  <Typography level="caption" as="span">
                    {prop.defaultValue ?? "—"}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
