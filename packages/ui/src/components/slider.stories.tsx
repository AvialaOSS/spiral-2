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
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
    showValueTooltip: { control: "boolean" },
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

export const Vertical: Story = {
  args: {
    size: "default",
    orientation: "vertical",
    defaultValue: [70],
    style: { height: 96 },
  },
};

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(
        [
          ["Default", { size: "default" as const }],
          ["Big", { size: "big" as const }],
          [
            "Range · Default",
            { type: "range" as const, defaultValue: [25, 65] },
          ],
          [
            "Range · Big",
            {
              size: "big" as const,
              type: "range" as const,
              defaultValue: [25, 65],
            },
          ],
          ["Disabled · Default", { disabled: true }],
          ["Disabled · Big", { size: "big" as const, disabled: true }],
        ] as const
      ).map(([label, props]) => (
        <div key={label} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {label}
          </span>
          <Slider defaultValue={[40]} {...props} />
        </div>
      ))}
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

export const ValueTooltip: Story = {
  name: "Value tooltip",
  args: {
    showValueTooltip: true,
    defaultValue: [40],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Enable `showValueTooltip` to show the thumb value on hover and while dragging. Use `formatValueTooltip` to customize the label.",
      },
    },
  },
};

export const ValueTooltipFormatted: Story = {
  name: "Value tooltip · formatted",
  args: {
    showValueTooltip: true,
    defaultValue: [20, 70],
    type: "range",
    formatValueTooltip: (value) => `${value}%`,
  },
};
