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
  args: { size: "big", type: "default", defaultValue: [60] },
};

export const Range: Story = {
  args: { size: "default", type: "range", defaultValue: [20, 70] },
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
