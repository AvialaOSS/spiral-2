import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Basic Input/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "Button" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Secondary" } };
export const Outline: Story = { args: { variant: "outline", children: "Outline" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete" } };
export const Loading: Story = { args: { loading: true, children: "Loading" } };
