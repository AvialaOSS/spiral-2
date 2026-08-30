import type { Meta, StoryObj } from "@storybook/react";
import { Badge, type BadgeLevel, type BadgeStyle } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Information Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    style: {
      control: "select",
      options: [
        "theme",
        "info",
        "fail",
        "warning",
        "success",
        "normal",
      ] satisfies BadgeStyle[],
    },
    level: {
      control: "select",
      options: ["caption", "text"] satisfies BadgeLevel[],
    },
    primary: { control: "boolean" },
    lineHeightFix: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Theme: Story = {
  args: { style: "theme", level: "caption", children: "Text" },
};

export const Primary: Story = {
  args: { style: "theme", primary: true, children: "Text" },
};

export const Styles: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {(["theme", "info", "fail", "warning", "success", "normal"] as const).map(
        (style) => (
          <Badge key={style} style={style}>
            {style}
          </Badge>
        )
      )}
    </div>
  ),
};
