import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover";
import { HoverPopover } from "./hover-popover";
import { Stack } from "./stack";

const meta: Meta<typeof Popover> = {
  title: "System Composition/Popover",
  component: Popover,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button mode="default">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Popover content with text typography. Use for rich panels, forms, or actions.</p>
      </PopoverContent>
    </Popover>
  ),
};

/** Side-aware enter/exit animation (150ms fade + translate). */
export const OpenByDefault: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button mode="primary">Anchor</Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start">
        Open by default — panel animates on close.
      </PopoverContent>
    </Popover>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button mode="second">With arrow</Button>
      </PopoverTrigger>
      <PopoverContent showArrow side="top">
        Popover with caret arrow pointing at the trigger.
      </PopoverContent>
    </Popover>
  ),
};

/** `appearance="tooltip"` — the shared inverted tooltip skin (dark surface, caption
 *  text, solid caret). This is what `ResponsiveTooltip` renders on touch devices. */
export const TooltipAppearance: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button mode="default">Tooltip look</Button>
      </PopoverTrigger>
      <PopoverContent appearance="tooltip" showArrow side="top">
        Looks like a tooltip, triggers like a popover.
      </PopoverContent>
    </Popover>
  ),
};

/** `appearance="primary"` — brand primary surface with white text (same tokens as the
 *  primary button), borderless with a solid primary caret. */
export const PrimaryAppearance: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button mode="default">Primary look</Button>
      </PopoverTrigger>
      <PopoverContent appearance="primary" showArrow side="top">
        Primary surface with white text.
      </PopoverContent>
    </Popover>
  ),
};

/** Hover (desktop) / tap (touch) to reveal — `HoverPopover` wraps Popover with
 *  hover-intent + keyboard focus, and degrades to tap on touch devices. */
export const HoverTrigger: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">将鼠标悬浮在按钮上以显示 Popover（触屏为点按）</p>
      <HoverPopover
        content={
          <div className="flex flex-col gap-2 p-1">
            <p>富内容浮层：可交互。</p>
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
        <Button mode="default">Hover to open</Button>
      </HoverPopover>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <Stack gap="block" className="items-center p-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button mode="default" size="small">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} showArrow>
            Popover on {side}
          </PopoverContent>
        </Popover>
      ))}
    </Stack>
  ),
};

export const WithAnchor: Story = {
  render: () => (
    <Popover>
      <PopoverAnchor asChild>
        <span className="inline-block rounded border border-border px-3 py-2 text-sm">
          Custom anchor element
        </span>
      </PopoverAnchor>
      <PopoverTrigger asChild>
        <Button mode="noBackground" size="small" className="ml-2">
          Toggle
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        Content positioned relative to the anchor, not the trigger button.
      </PopoverContent>
    </Popover>
  ),
};
