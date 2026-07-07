import type { Meta, StoryObj } from "@storybook/react";
import {
  Typography,
  type TypographyContent,
  type TypographyLevel,
  type TypographyTone,
} from "./typography";

const levels = [
  "display",
  "headline1",
  "headline2",
  "title",
  "subtitle",
  "text",
  "caption",
] satisfies TypographyLevel[];

const meta: Meta<typeof Typography> = {
  title: "System Composition/Typography",
  component: Typography,
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: levels,
    },
    content: {
      control: "select",
      options: ["text", "number"] satisfies TypographyContent[],
    },
    tone: {
      control: "select",
      options: ["default", "white"] satisfies TypographyTone[],
    },
    as: {
      control: "select",
      options: ["span", "p", "div", "h1", "h2", "h3", "label"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  args: {
    level: "text",
    content: "text",
    tone: "default",
    children: "Text",
  },
};

export const LevelMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {levels.map((level) => (
        <div key={level} className="flex items-baseline gap-4">
          <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">{level}</span>
          <Typography level={level} content="text">
            Text
          </Typography>
          <Typography level={level} content="number">
            5
          </Typography>
        </div>
      ))}
    </div>
  ),
};

export const WhiteOnDark: Story = {
  render: () => (
    <div className="flex flex-col gap-3 rounded-lg bg-[var(--aviala-neutral-neutral-12,#343333)] p-4">
      {levels.map((level) => (
        <Typography key={level} level={level} tone="white">
          Text
        </Typography>
      ))}
    </div>
  ),
};

export const NumberContent: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {levels.map((level) => (
        <Typography key={level} level={level} content="number">
          12345
        </Typography>
      ))}
    </div>
  ),
};
