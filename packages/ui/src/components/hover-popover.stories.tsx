import type { Meta, StoryObj } from "@storybook/react";
import { GeneralSetting } from "@aviala-design/icons";
import { Button } from "./button";
import { HoverPopover } from "./hover-popover";

const meta: Meta<typeof HoverPopover> = {
  title: "System Composition/HoverPopover",
  component: HoverPopover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Popover that opens on hover (desktop) and tap (touch). Use for rich / interactive previews. To preview the touch branch, enable device emulation (sets `pointer: coarse`) and reload — the same markup then opens on tap like a normal Popover.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof HoverPopover>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        将鼠标悬浮在按钮上以显示 Popover（触屏为点按）
      </p>
      <HoverPopover
        content={
          <div className="flex flex-col gap-2 p-1">
            <p>Rich preview with interactive content.</p>
            <div className="flex gap-2">
              <Button mode="primary" size="small">
                Action
              </Button>
              <Button mode="second" size="small">
                Cancel
              </Button>
            </div>
          </div>
        }
      >
        <Button mode="default">Hover me</Button>
      </HoverPopover>
    </div>
  ),
};

export const WithIconTrigger: Story = {
  render: () => (
    <HoverPopover
      side="bottom"
      content={<p className="p-1">Settings preview</p>}
    >
      <Button
        mode="default"
        iconOnly
        leftIcon={<GeneralSetting aria-hidden />}
        aria-label="Settings"
      />
    </HoverPopover>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4 p-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <HoverPopover
          key={side}
          side={side}
          content={<p className="p-1">On {side}</p>}
        >
          <Button mode="second" size="small">
            {side}
          </Button>
        </HoverPopover>
      ))}
    </div>
  ),
};
