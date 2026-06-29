import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./form-field";
import { Input } from "./input";
import { Stack } from "./stack";
import { Fieldset } from "./stack";
import { Button } from "./button";

const meta: Meta<typeof FormField> = {
  title: "System Composition/FormField",
  component: FormField,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const WithInput: Story = {
  render: () => (
    <FormField label="Username" description="Your public display name.">
      <Input placeholder="aviala" />
    </FormField>
  ),
};

export const FieldsetExample: Story = {
  render: () => (
    <Fieldset legend="Profile">
      <Stack gap="content">
        <FormField label="Name">
          <Input defaultValue="Aviala" />
        </FormField>
        <Button>Save</Button>
      </Stack>
    </Fieldset>
  ),
};
