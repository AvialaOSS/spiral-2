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
  args: { shape: "bar", value: 75, type: "default", size: "default" },
};

export const BarBig: Story = {
  args: { shape: "bar", value: 75, type: "default", size: "big" },
};

export const Ring: Story = {
  args: { shape: "ring", value: 75, type: "default", size: "big" },
};

/** Figma Progress matrix (589:55818) */
export const FigmaMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Progress shape="bar" size="default" type="default" value={75} />
        <Progress shape="bar" size="default" type="success" value={100} />
        <Progress shape="bar" size="default" type="fail" value={75} />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Progress shape="bar" size="big" type="default" value={75} />
        <Progress shape="bar" size="big" type="success" value={100} />
        <Progress shape="bar" size="big" type="fail" value={75} />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Progress shape="ring" size="big" type="default" value={75} />
        <Progress shape="ring" size="big" type="success" value={100} />
        <Progress shape="ring" size="big" type="fail" value={75} />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Progress shape="ring" size="default" type="default" value={75} />
        <Progress shape="ring" size="default" type="success" value={100} />
        <Progress shape="ring" size="default" type="fail" value={75} />
      </div>
    </div>
  ),
};
