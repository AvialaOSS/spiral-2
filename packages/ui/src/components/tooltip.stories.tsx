import type { Meta, StoryObj } from "@storybook/react";
import { GeneralSetting } from "@aviala-design/icons";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "System Composition/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button mode="default">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip with caption typography</TooltipContent>
    </Tooltip>
  ),
};

export const WithIconTrigger: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          mode="default"
          iconOnly
          leftIcon={<GeneralSetting aria-hidden />}
          aria-label="Settings"
        />
      </TooltipTrigger>
      <TooltipContent side="bottom">Settings</TooltipContent>
    </Tooltip>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4 p-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button mode="second" size="small">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const WithoutArrow: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button mode="noBackground">No arrow</Button>
      </TooltipTrigger>
      <TooltipContent showArrow={false}>Tooltip without caret</TooltipContent>
    </Tooltip>
  ),
};

export const TextLevel: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button mode="default">Text level</Button>
      </TooltipTrigger>
      <TooltipContent level="text">Tooltip with text typography</TooltipContent>
    </Tooltip>
  ),
};

export const InstantOpen: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button mode="primary">Always visible</Button>
        </TooltipTrigger>
        <TooltipContent>Instant tooltip — no hover delay</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
