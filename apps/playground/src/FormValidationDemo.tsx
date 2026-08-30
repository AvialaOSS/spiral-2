import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormField,
  Input,
  Stack,
  Textarea,
} from "@aviala-design/spiral";
import { useForm } from "react-hook-form";
import { z } from "zod";

const accountFormSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function FormValidationDemo() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { username: "", email: "", password: "", bio: "" },
  });

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-1 text-lg font-semibold">Form Validation</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        FormField + react-hook-form + zod (shadcn-style). Try submitting empty.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            alert(`Submitted:\n${JSON.stringify(values, null, 2)}`);
          })}
        >
          <Stack gap="content" className="max-w-sm">
            <FormField
              control={form.control}
              name="username"
              label="Username"
              description="Your public display name."
              required
              render={({ field, fieldState, id }) => (
                <Input
                  id={id}
                  placeholder="aviala"
                  error={fieldState.invalid}
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="email"
              label="Email"
              description="We never share your email."
              required
              render={({ field, fieldState, id }) => (
                <Input
                  id={id}
                  type="email"
                  placeholder="you@example.com"
                  error={fieldState.invalid}
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              required
              render={({ field, fieldState, id }) => (
                <Input
                  id={id}
                  type="password"
                  placeholder="At least 8 characters"
                  error={fieldState.invalid}
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              label="Bio"
              description="Optional. 160 characters max."
              render={({ field, fieldState, id }) => (
                <Textarea
                  id={id}
                  rows={3}
                  error={fieldState.invalid}
                  {...field}
                />
              )}
            />
            <Stack direction="row" gap="component">
              <Button mode="primary" type="submit">
                Create account
              </Button>
              <Button mode="second" type="button" onClick={() => form.reset()}>
                Reset
              </Button>
            </Stack>
          </Stack>
        </form>
      </Form>
    </section>
  );
}
