import type { Meta, StoryObj } from "@storybook/react";
import { GeneralSetting } from "@aviala-design/icons";
import { Button } from "./button";
import { TooltipProvider } from "./tooltip";
import { ResponsiveTooltip } from "./responsive-tooltip";

const meta: Meta<typeof ResponsiveTooltip> = {
  title: "System Composition/ResponsiveTooltip",
  component: ResponsiveTooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Same Tooltip content with a device-aware trigger: hover/focus on desktop, long-press on touch. To preview the touch branch, enable device emulation (which sets `pointer: coarse`) and reload — the same markup then opens as a Popover on long-press (short tap still fires the trigger’s own click).",
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ResponsiveTooltip>;

export const Default: Story = {
  render: () => (
    <ResponsiveTooltip content="Tooltip with caption typography">
      <Button mode="default">Hover (desktop) / Long-press (touch)</Button>
    </ResponsiveTooltip>
  ),
};

export const WithIconTrigger: Story = {
  render: () => (
    <ResponsiveTooltip content="Settings" side="bottom">
      <Button
        mode="default"
        iconOnly
        leftIcon={<GeneralSetting aria-hidden />}
        aria-label="Settings"
      />
    </ResponsiveTooltip>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4 p-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <ResponsiveTooltip
          key={side}
          content={`Tooltip on ${side}`}
          side={side}
        >
          <Button mode="second" size="small">
            {side}
          </Button>
        </ResponsiveTooltip>
      ))}
    </div>
  ),
};
