import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { GeneralSetting, SymbolMore } from "@aviala-design/icons";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { Table, TableCell, TableHead, TableRow } from "./table";

const meta: Meta<typeof Table> = {
  title: "Information Display/Table",
  component: Table,
  tags: ["autodocs"],
};
export default meta;

function MoreActions() {
  return (
    <>
      <Button mode="noBackgroundCustom" size="small" iconOnly aria-label="Settings">
        <GeneralSetting aria-hidden />
      </Button>
      <Button mode="noBackgroundCustom" size="small" iconOnly aria-label="More">
        <SymbolMore thickness="Light" aria-hidden />
      </Button>
    </>
  );
}

const ROWS = [
  { id: "1", name: "Kai Lark", caption: "Owner", badge: "Active", switchOn: true },
  { id: "2", name: "Ada Chen", caption: "Editor", badge: "Away", switchOn: false },
  { id: "3", name: "Bo Park", caption: "Viewer", badge: "Active", switchOn: true },
] as const;

function SelectableTable({ stickyHeader = false }: { stickyHeader?: boolean }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    "1": false,
    "2": true,
    "3": false,
  });

  const ids = useMemo(() => ROWS.map((row) => row.id), []);
  const selectedCount = ids.filter((id) => selected[id]).length;
  const allChecked = selectedCount === ids.length;
  const someChecked = selectedCount > 0 && !allChecked;

  return (
    <Table stickyHeader={stickyHeader} style={{ width: 720, maxHeight: stickyHeader ? 280 : undefined }}>
      <TableRow header>
        <TableHead
          content="checkbox"
          checkboxProps={{
            checked: allChecked ? true : someChecked ? "indeterminate" : false,
            onCheckedChange: (value) => {
              const next = value === true;
              setSelected(Object.fromEntries(ids.map((id) => [id, next])));
            },
            "aria-label": "Select all rows",
          }}
        />
        <TableHead actions={<MoreActions />}>Name</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Notify</TableHead>
      </TableRow>
      {ROWS.map((row) => (
        <TableRow key={row.id}>
          <TableCell
            content="checkbox"
            checkboxProps={{
              checked: Boolean(selected[row.id]),
              onCheckedChange: (value) =>
                setSelected((prev) => ({ ...prev, [row.id]: value === true })),
              "aria-label": `Select ${row.name}`,
            }}
          />
          <TableCell
            content="people"
            people={
              <Avatar content="text" level="text" lineHeightFix={false}>
                {row.name.charAt(0)}
              </Avatar>
            }
            text={row.name}
            caption={row.caption}
            actions={<MoreActions />}
          />
          <TableCell content="badge" badgeLabel={row.badge} actions={<MoreActions />} />
          <TableCell content="switch" switchProps={{ defaultChecked: row.switchOn }} />
        </TableRow>
      ))}
    </Table>
  );
}

export const Default: StoryObj<typeof Table> = {
  render: () => <SelectableTable />,
};

export const StickyHeader: StoryObj<typeof Table> = {
  render: () => <SelectableTable stickyHeader />,
};
