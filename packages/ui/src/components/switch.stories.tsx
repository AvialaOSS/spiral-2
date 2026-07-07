import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch, type SwitchSize } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "Basic Input/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "small"] satisfies SwitchSize[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const On: Story = {
  args: { defaultChecked: true, size: "regular" },
};

export const Off: Story = {
  args: { defaultChecked: false, size: "regular" },
};

export const Disabled: Story = {
  args: { defaultChecked: true, disabled: true },
};

const sizes: SwitchSize[] = ["regular", "small"];

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-16 font-mono text-xs text-muted-foreground">{size}</span>
          <Switch size={size} defaultChecked={false} />
          <Switch size={size} defaultChecked />
          <Switch size={size} defaultChecked disabled />
        </div>
      ))}
    </div>
  ),
};

export const AnimationDemo: Story = {
  render: () => {
    const [controlled, setControlled] = useState(false);

    return (
      <div className="flex max-w-sm flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          Press and hold the thumb to see the pill stretch (width grows toward the toggle direction;
          ends stay fully rounded). Release or click to toggle — the thumb slides with a 300ms
          ease-in-out transition (Figma SMART_ANIMATE spec).
        </p>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 text-sm">
            <Switch defaultChecked={false} />
            Uncontrolled (starts off)
          </label>
          <label className="flex items-center gap-3 text-sm">
            <Switch defaultChecked />
            Uncontrolled (starts on)
          </label>
          <label className="flex items-center gap-3 text-sm">
            <Switch checked={controlled} onCheckedChange={setControlled} />
            Controlled ({controlled ? "on" : "off"})
          </label>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-16 font-mono text-xs text-muted-foreground">small</span>
          <Switch size="small" defaultChecked={false} />
          <Switch size="small" defaultChecked />
        </div>
      </div>
    );
  },
};
