import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "Information Collect/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["default", "big"] },
    type: { control: "select", options: ["default", "range"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: { size: "default", type: "default", defaultValue: [40] },
};

export const Big: Story = {
  args: { size: "big", type: "default", defaultValue: [40] },
};

export const Range: Story = {
  args: { size: "default", type: "range", defaultValue: [20, 70] },
};

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">Default</span>
        <Slider size="default" defaultValue={[40]} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">Big</span>
        <Slider size="big" defaultValue={[40]} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">Range · Default</span>
        <Slider type="range" defaultValue={[25, 65]} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">Disabled</span>
        <Slider disabled defaultValue={[40]} />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: [50] },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState([35]);
    return (
      <Slider value={value} onValueChange={setValue} aria-label="Volume" />
    );
  },
};
