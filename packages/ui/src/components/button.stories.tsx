import { DirectionArrowRight, GeneralSetting } from "@aviala/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, type ButtonMode, type ButtonSize } from "./button";

const meta: Meta<typeof Button> = {
  title: "Basic Input/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: [
        "primary",
        "second",
        "default",
        "defaultCustom",
        "noBackground",
        "noBackgroundCustom",
        "destructive",
      ] satisfies ButtonMode[],
    },
    size: {
      control: "select",
      options: ["tiny", "small", "regular", "big"] satisfies ButtonSize[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { mode: "primary", children: "Text" },
};

export const Second: Story = {
  args: { mode: "second", children: "Text" },
};

export const DefaultMode: Story = {
  args: { mode: "default", children: "Text" },
};

export const NoBackground: Story = {
  args: { mode: "noBackground", children: "Text" },
};

/** Non-theme custom color text/icon — transparent background (Figma `noBackgroundCustom`). */
export const NoBackgroundCustom: Story = {
  args: { mode: "noBackgroundCustom", children: "Text" },
};

export const AllRound: Story = {
  args: { mode: "primary", allRound: true, children: "Text" },
};

export const WithIcons: Story = {
  args: {
    mode: "primary",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
    children: "Text",
  },
};

/** Wide arrow icon — slot is line-height box; SVG height from --button-icon-size, width auto. */
export const WithWideIcon: Story = {
  args: {
    mode: "primary",
    leftIcon: <DirectionArrowRight aria-hidden />,
    children: "Continue",
  },
};

export const IconOnly: Story = {
  args: {
    mode: "primary",
    iconOnly: true,
    leftIcon: <GeneralSetting aria-hidden />,
    "aria-label": "Settings",
  },
};

export const IconOnlySizeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {modes.map((mode) => (
        <div key={mode} className="flex flex-wrap items-center gap-2">
          <span className="w-36 shrink-0 font-mono text-xs text-muted-foreground">
            {mode}
          </span>
          {sizes.map((size) => (
            <Button
              key={size}
              mode={mode}
              size={size}
              iconOnly
              leftIcon={<GeneralSetting aria-hidden />}
              aria-label={`${mode} ${size}`}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Icon-only squares should match text button height at each size. */
export const IconOnlyHeightMatch: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
            {size}
          </span>
          <Button mode="primary" size={size}>
            Text
          </Button>
          <Button
            mode="primary"
            size={size}
            iconOnly
            leftIcon={<GeneralSetting aria-hidden />}
            aria-label={`${size} icon`}
          />
        </div>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  args: { mode: "primary", loading: true, children: "Text" },
};

export const Disabled: Story = {
  args: { mode: "primary", disabled: true, children: "Text" },
};

const modes: ButtonMode[] = [
  "primary",
  "second",
  "default",
  "defaultCustom",
  "noBackground",
  "noBackgroundCustom",
];

const sizes: ButtonSize[] = ["tiny", "small", "regular", "big"];

export const ModeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {modes.map((mode) => (
        <div key={mode} className="flex flex-wrap items-center gap-2">
          <span className="w-36 shrink-0 font-mono text-xs text-muted-foreground">
            {mode}
          </span>
          {sizes.map((size) => (
            <Button key={size} mode={mode} size={size}>
              Text
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const StateMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["primary", "second", "default"] as ButtonMode[]).map((mode) => (
        <div key={mode} className="flex flex-wrap items-center gap-3">
          <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
            {mode}
          </span>
          <Button mode={mode}>Default</Button>
          <Button mode={mode} loading>
            Loading
          </Button>
          <Button mode={mode} disabled>
            Disabled
          </Button>
        </div>
      ))}
    </div>
  ),
};

/** Hover each mode to preview 250ms transitions. Primary rests primary-8, hovers primary-7. Default rests neutral-5, hovers neutral-6. */
export const HoverState: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          "primary",
          "second",
          "default",
          "defaultCustom",
          "noBackground",
          "noBackgroundCustom",
          "destructive",
        ] as ButtonMode[]
      ).map((mode) => (
        <Button key={mode} mode={mode}>
          {mode}
        </Button>
      ))}
    </div>
  ),
};

/** Click and hold to preview :active press (primary uses p-9; others darken 5%). */
export const PressedState: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(
        [
          "primary",
          "second",
          "default",
          "defaultCustom",
          "destructive",
        ] as ButtonMode[]
      ).map((mode) => (
        <Button key={mode} mode={mode}>
          {mode}
        </Button>
      ))}
    </div>
  ),
};
