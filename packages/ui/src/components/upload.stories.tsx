import type { Meta, StoryObj } from "@storybook/react";
import { Upload } from "./upload";

const meta: Meta<typeof Upload> = {
  title: "Information Collect/Upload",
  component: Upload,
  tags: ["autodocs"],
  argTypes: {
    style: { control: "select", options: ["default", "large"] },
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Upload>;

export const Default: Story = {
  args: { style: "default", label: "Upload" },
};

export const Large: Story = {
  args: { style: "large" },
  decorators: [
    (Story) => (
      <div style={{ width: 331 }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: { style: "default", disabled: true },
};
