import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Link, type LinkLevel, type LinkMode } from "./link";

const meta: Meta<typeof Link> = {
  title: "Basic Input/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: ["caption", "text"] satisfies LinkLevel[],
    },
    mode: {
      control: "select",
      options: ["noBackground", "noBackgroundCustom"] satisfies LinkMode[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Caption: Story = {
  args: {
    href: "#",
    level: "caption",
    mode: "noBackground",
    children: "Text",
  },
};

export const Text: Story = {
  args: {
    href: "#",
    level: "text",
    mode: "noBackground",
    children: "Text",
  },
};

export const WithIcons: Story = {
  args: {
    href: "#",
    level: "text",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
    children: "Text",
  },
};

export const IconOnly: Story = {
  args: {
    href: "#",
    level: "caption",
    iconOnly: true,
    leftIcon: <GeneralSetting aria-hidden />,
    "aria-label": "Settings",
  },
};

export const Disabled: Story = {
  args: {
    href: "#",
    disabled: true,
    children: "Disabled",
  },
};

const levels: LinkLevel[] = ["caption", "text"];
const modes: LinkMode[] = ["noBackground", "noBackgroundCustom"];

export const ModeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {modes.map((mode) => (
        <div key={mode} className="flex flex-wrap items-center gap-3">
          <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground">
            {mode}
          </span>
          {levels.map((level) => (
            <Link
              key={level}
              href="#"
              mode={mode}
              level={level}
              leftIcon={<GeneralSetting aria-hidden />}
              rightIcon={<GeneralSetting aria-hidden />}
            >
              Text
            </Link>
          ))}
        </div>
      ))}
    </div>
  ),
};
