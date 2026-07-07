import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover";
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
