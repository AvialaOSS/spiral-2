import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Basic Input/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: "Email" } };
export const Error: Story = { args: { placeholder: "Invalid", error: true } };
export const Disabled: Story = { args: { placeholder: "Disabled", disabled: true } };
