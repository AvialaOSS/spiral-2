import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./tag";

const meta: Meta<typeof Tag> = {
  title: "Information Display/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    level: { control: "select", options: ["caption", "text"] },
    content: { control: "select", options: ["text", "people"] },
    disabled: { control: "boolean" },
    closable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { children: "Text", closable: true },
};

export const People: Story = {
  args: { content: "people", children: "Kai", avatarText: "K", closable: true },
};

export const Disabled: Story = {
  args: { children: "Text", disabled: true, closable: true },
};
