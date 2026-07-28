import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "./breadcrumb";
import { Button } from "./button";
import { Pagehead } from "./pagehead";

const meta: Meta<typeof Pagehead> = {
  title: "Structure Navigation/Pagehead",
  component: Pagehead,
  tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof Pagehead> = {
  args: {
    title: "Page title",
    description: "Supporting description for this page.",
    breadcrumb: (
      <Breadcrumb>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Page</BreadcrumbItem>
      </Breadcrumb>
    ),
    actions: (
      <Button mode="primary" size="small">
        Action
      </Button>
    ),
  },
};
