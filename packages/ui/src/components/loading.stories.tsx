import type { Meta, StoryObj } from "@storybook/react";
import { Loading, type LoadingLevel, type LoadingMode } from "./loading";

const meta: Meta<typeof Loading> = {
  title: "System Composition/Loading Icon",
  component: Loading,
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: [
        "display",
        "headline1",
        "headline2",
        "title",
        "subtitle",
        "text",
        "caption",
      ] satisfies LoadingLevel[],
    },
    mode: {
      control: "select",
      options: ["theme", "themeText", "black", "white"] satisfies LoadingMode[],
    },
    lineHeightFix: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  args: {
    level: "text",
    mode: "theme",
    lineHeightFix: true,
  },
};

const levels: LoadingLevel[] = [
  "display",
  "headline1",
  "headline2",
  "title",
  "subtitle",
  "text",
  "caption",
];

const modes: LoadingMode[] = ["theme", "themeText", "black", "white"];

export const ModeMatrixLineHeightFix: Story = {
  render: () => (
    <div className="flex gap-10">
      {modes.map((mode) => (
        <div key={mode} className="flex flex-col items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">{mode}</span>
          {levels.map((level) => (
            <Loading key={`${mode}-${level}`} level={level} mode={mode} lineHeightFix />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const ModeMatrixCompact: Story = {
  render: () => (
    <div className="flex gap-10">
      {modes.map((mode) => (
        <div key={mode} className="flex flex-col items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">{mode}</span>
          {levels.map((level) => (
            <Loading
              key={`${mode}-${level}-compact`}
              level={level}
              mode={mode}
              lineHeightFix={false}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const OnDarkBackground: Story = {
  render: () => (
    <div className="flex items-center gap-6 rounded-lg bg-neutral-800 p-6">
      <Loading mode="white" level="text" lineHeightFix={false} />
      <Loading mode="theme" level="title" lineHeightFix={false} />
    </div>
  ),
};
