import type { Meta, StoryObj } from "@storybook/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "./alert";
import { Button } from "./button";
import { Form, FormField } from "./form-field";
import { Input } from "./input";
import { Textarea } from "./textarea";
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

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email("Enter a valid email address"),
  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileFormDemo = () => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { username: "", email: "", bio: "" },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-[320px] flex-col gap-4"
        onSubmit={form.handleSubmit((values) => {
          alert(JSON.stringify(values, null, 2));
        })}
      >
        <FormField
          control={form.control}
          name="username"
          label="Username"
          description="Your public display name."
          required
          render={({ field, id }) => (
            <Input id={id} placeholder="aviala" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="email"
          label="Email"
          description="We never share your email."
          required
          render={({ field, id }) => (
            <Input id={id} type="email" placeholder="you@example.com" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          label="Bio"
          description="Tell us a little about yourself."
          render={({ field, id }) => (
            <Textarea id={id} rows={3} {...field} />
          )}
        />
        <div className="flex gap-2">
          <Button mode="primary" type="submit">
            Submit
          </Button>
          <Button mode="second" type="button" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};

/** react-hook-form + zod — shadcn-style controlled fields with automatic error messages */
export const WithReactHookForm: Story = {
  render: () => <ProfileFormDemo />,
};
