import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "Response And Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["default", "success", "fail"] },
    size: { control: "select", options: ["default", "big"] },
    shape: { control: "select", options: ["bar", "ring"] },
    value: { control: { type: "range", min: 0, max: 100 } },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Bar: Story = {
  args: { shape: "bar", value: 75, type: "default" },
};

export const Ring: Story = {
  args: { shape: "ring", value: 60, size: "big" },
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Progress value={75} type="default" />
      <Progress value={100} type="success" />
      <Progress value={40} type="fail" />
    </div>
  ),
};
