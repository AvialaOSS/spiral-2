import type { Meta, StoryObj } from "@storybook/react";
import { Scroll } from "./scroll";

const meta: Meta<typeof Scroll> = {
  title: "System Composition/Scroll",
  component: Scroll,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["default", "small"] },
  },
};

export default meta;
type Story = StoryObj<typeof Scroll>;

export const Default: Story = {
  args: {
    size: "default",
    style: { height: 160, width: 240 },
    children: (
      <div style={{ padding: 8 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} style={{ margin: "0 0 8px" }}>
            Line {i + 1}
          </p>
        ))}
      </div>
    ),
  },
};
