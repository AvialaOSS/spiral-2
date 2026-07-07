import type { Meta, StoryObj } from "@storybook/react";
import { Typeface, TypefacePair, type TypefaceContent } from "./typeface";

const contents = [
  "allCustom",
  "textCaption",
  "textCaptionSubtitle",
  "textTitle",
  "textHeadline2",
  "textHeadline1",
] satisfies TypefaceContent[];

const meta: Meta<typeof Typeface> = {
  title: "System Composition/Typeface",
  component: Typeface,
  tags: ["autodocs"],
  argTypes: {
    content: {
      control: "select",
      options: contents,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typeface>;

export const TextCaption: Story = {
  args: {
    content: "textCaption",
    primary: "Primary line",
    secondary: "Caption line",
  },
};

export const ContentMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {contents.map((content) => (
        <div key={content} className="flex items-start gap-4">
          <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground">{content}</span>
          <Typeface
            content={content}
            primary="Primary"
            secondary="Secondary"
            tertiary="Caption"
          />
        </div>
      ))}
    </div>
  ),
};

export const Pair: Story = {
  render: () => (
    <TypefacePair title="Radio option title" description="Supporting caption text" />
  ),
};

export const CustomLines: Story = {
  args: {
    content: "allCustom",
    primary: "Custom primary",
    secondary: "Custom caption",
  },
};
