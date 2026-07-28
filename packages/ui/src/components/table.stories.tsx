import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./avatar";
import { Table, TableCell, TableHead, TableRow } from "./table";

const meta: Meta<typeof Table> = {
  title: "Information Display/Table",
  component: Table,
  tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof Table> = {
  render: () => (
    <Table style={{ width: 640 }}>
      <TableRow header>
        <TableHead content="checkbox" />
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Notify</TableHead>
      </TableRow>
      <TableRow>
        <TableCell content="checkbox" />
        <TableCell
          content="people"
          people={
            <Avatar content="text" level="text" lineHeightFix={false}>
              K
            </Avatar>
          }
          text="Kai Lark"
        />
        <TableCell content="badge" badgeLabel="Active" />
        <TableCell content="switch" />
      </TableRow>
    </Table>
  ),
};
