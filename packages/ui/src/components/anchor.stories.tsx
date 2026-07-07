import type { Meta, StoryObj } from "@storybook/react";
import { Anchor, AnchorItem, type AnchorIndentLevel } from "./anchor";

const meta: Meta<typeof Anchor> = {
  title: "System Composition/Anchor",
  component: Anchor,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Anchor>;

const indentLevels: AnchorIndentLevel[] = [0, 1, 2, 3];

const demoItems: { label: string; indentLevel: AnchorIndentLevel; activated: boolean }[] = [
  { label: "Getting started", indentLevel: 0, activated: true },
  { label: "Installation", indentLevel: 0, activated: false },
  { label: "Quick start", indentLevel: 1, activated: false },
  { label: "Configuration", indentLevel: 2, activated: false },
  { label: "Advanced", indentLevel: 3, activated: false },
];

export const Default: Story = {
  render: () => (
    <Anchor aria-label="Page sections" className="w-[200px]">
      {demoItems.map((item) => (
        <AnchorItem
          key={item.label}
          href="#"
          activated={item.activated}
          indentLevel={item.indentLevel}
        >
          {item.label}
        </AnchorItem>
      ))}
    </Anchor>
  ),
};

export const AllInactive: Story = {
  render: () => (
    <Anchor aria-label="Page sections" className="w-[200px]">
      {demoItems.map((item) => (
        <AnchorItem key={item.label} href="#" indentLevel={item.indentLevel}>
          {item.label}
        </AnchorItem>
      ))}
    </Anchor>
  ),
};

export const IndentMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {indentLevels.map((indentLevel) => (
        <div key={indentLevel} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">indent {indentLevel}</span>
          <Anchor aria-label={`Indent level ${indentLevel}`} className="w-[200px]">
            <AnchorItem href="#" indentLevel={indentLevel} activated>
              Active
            </AnchorItem>
            <AnchorItem href="#" indentLevel={indentLevel}>
              Inactive
            </AnchorItem>
          </Anchor>
        </div>
      ))}
    </div>
  ),
};
