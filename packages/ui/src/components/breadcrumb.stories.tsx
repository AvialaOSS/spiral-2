import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbEllipsisItem,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Structure Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof Breadcrumb> = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbEllipsis
        menu={
          <>
            <BreadcrumbEllipsisItem href="#">Library</BreadcrumbEllipsisItem>
            <BreadcrumbEllipsisItem href="#">Docs</BreadcrumbEllipsisItem>
          </>
        }
      />
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Current</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const Small: StoryObj<typeof Breadcrumb> = {
  render: () => (
    <Breadcrumb size="small">
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbEllipsis
        menu={
          <>
            <BreadcrumbEllipsisItem href="#">Library</BreadcrumbEllipsisItem>
            <BreadcrumbEllipsisItem href="#">Docs</BreadcrumbEllipsisItem>
          </>
        }
      />
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Current</BreadcrumbItem>
    </Breadcrumb>
  ),
};

/** Figma Storage item button activated=ON */
export const EllipsisActivated: StoryObj<typeof Breadcrumb> = {
  render: () => {
    const [activated, setActivated] = useState(true);
    return (
      <Breadcrumb>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbEllipsis
          activated={activated}
          onActivatedChange={setActivated}
          menu={
            <>
              <BreadcrumbEllipsisItem href="#">Library</BreadcrumbEllipsisItem>
              <BreadcrumbEllipsisItem href="#">Docs</BreadcrumbEllipsisItem>
            </>
          }
        />
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Current</BreadcrumbItem>
      </Breadcrumb>
    );
  },
};
