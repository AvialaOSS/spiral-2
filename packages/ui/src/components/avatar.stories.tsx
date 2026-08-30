import type { Meta, StoryObj } from "@storybook/react";
import { UsersUserCircle } from "@aviala-design/icons";
import { Avatar, type AvatarLevel } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Information Display/Avatar",
  component: Avatar,
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
      ] satisfies AvatarLevel[],
    },
    content: {
      control: "select",
      options: ["text", "picture", "icon"],
    },
    lineHeightFix: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Text: Story = {
  args: { content: "text", level: "display", children: "K" },
};

export const Icon: Story = {
  args: {
    content: "icon",
    level: "display",
    icon: <UsersUserCircle />,
  },
};

export const Levels: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
      {(
        [
          "display",
          "headline1",
          "headline2",
          "title",
          "subtitle",
          "text",
        ] as const
      ).map((level) => (
        <Avatar key={level} level={level} content="text" lineHeightFix={false}>
          K
        </Avatar>
      ))}
    </div>
  ),
};
