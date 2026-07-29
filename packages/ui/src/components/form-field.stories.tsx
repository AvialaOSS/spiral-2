import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";
import { Button } from "./button";
import { FormField } from "./form-field";
import { Input } from "./input";
import { Fieldset } from "./stack";

const meta: Meta<typeof FormField> = {
  title: "System Composition/FormField",
  component: FormField,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const WithInput: Story = {
  render: () => (
    <FormField
      className="w-[290px]"
      label="Username"
      description="Your public display name."
      htmlFor="username"
    >
      <Input id="username" placeholder="aviala" />
    </FormField>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <FormField
      className="w-[290px]"
      direction="horizontal"
      label="Username"
      description="Public name"
      htmlFor="username-h"
      info="Visible on your profile"
    >
      <Input id="username-h" placeholder="aviala" />
    </FormField>
  ),
};

export const WithMessages: Story = {
  render: () => (
    <FormField
      className="w-[290px]"
      label="Email"
      description="We never share your email."
      htmlFor="email"
      error="Enter a valid email address"
      info="Use your work email if possible"
      alert={
        <Alert type="warning" title="Verify soon" description="Confirm within 7 days." />
      }
    >
      <Input id="email" defaultValue="not-an-email" />
    </FormField>
  ),
};

/** Figma Form Group (530:65349) — title + field slot + actions */
export const FieldsetExample: Story = {
  render: () => (
    <Fieldset
      className="w-[290px]"
      title="Profile"
      description="Update how others see you."
      actions={
        <>
          <Button mode="primary">Save</Button>
          <Button mode="second">Cancel</Button>
        </>
      }
    >
      <FormField label="Name" description="Your display name" htmlFor="profile-name">
        <Input id="profile-name" defaultValue="Aviala" />
      </FormField>
      <FormField
        label="Email"
        description="Account contact"
        htmlFor="profile-email"
        error="Enter a valid email address"
        info="Used for notifications"
      >
        <Input id="profile-email" defaultValue="hello@aviala" />
      </FormField>
    </Fieldset>
  ),
};
