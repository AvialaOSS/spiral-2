import { ArrowRight, Icon, Settings } from "@aviala/icons";
import {
  Button,
  Checkbox,
  Fieldset,
  FormField,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  RadioGroup,
  RadioGroupItem,
  Stack,
  Switch,
  Textarea,
  ThemeProvider,
  useTheme,
} from "@aviala/spiral";
import { useId, useState } from "react";

function ThemeSwitcher() {
  const { mode, setMode, primaryColor, setPrimaryColor, presets, applyPreset } =
    useTheme();

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Theme Switcher</h2>
      <Stack gap="component">
        <div className="flex flex-wrap gap-2">
          {(["light", "dark"] as const).map((m) => (
            <Button
              key={m}
              variant={mode === m ? "default" : "outline"}
              size="sm"
              onClick={() => setMode(m)}
            >
              {m}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <Button key={p.id} variant="secondary" size="sm" onClick={() => applyPreset(p.id)}>
              {p.name}
            </Button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          Primary
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="h-8 w-12 cursor-pointer rounded border border-border"
          />
          <code className="text-xs text-muted-foreground">{primaryColor}</code>
        </label>
      </Stack>
    </section>
  );
}

function ColorPalette() {
  const swatches = [
    "--primary",
    "--secondary",
    "--accent",
    "--destructive",
    "--muted",
    "--background",
    "--foreground",
    "--border",
  ];

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Color Palette</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {swatches.map((token) => (
          <div key={token} className="overflow-hidden rounded-md border border-border">
            <div className="h-12" style={{ background: `var(${token})` }} />
            <p className="p-2 font-mono text-xs">{token}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function IconGallery() {
  const icons = [
    { name: "ArrowRight", El: ArrowRight },
    { name: "Settings", El: Settings },
  ];

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Icon Gallery</h2>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {icons.map(({ name, El }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 rounded-md border border-border p-3"
          >
            <Icon icon={El} size={24} className="text-primary" />
            <code className="text-xs">{name}</code>
          </div>
        ))}
      </div>
    </section>
  );
}

function BasicInputDemo() {
  const id = useId();
  const [checked, setChecked] = useState(false);
  const [on, setOn] = useState(true);

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Basic Input</h2>
      <Stack gap="block">
        <FormField label="Email" htmlFor={`${id}-email`} description="We never share your email.">
          <Input id={`${id}-email`} type="email" placeholder="you@example.com" />
        </FormField>
        <FormField label="Bio" htmlFor={`${id}-bio`}>
          <Textarea id={`${id}-bio`} placeholder="Tell us about yourself" />
        </FormField>
        <FormField label="Amount">
          <InputGroup>
            <InputGroupAddon>$</InputGroupAddon>
            <Input type="number" placeholder="0.00" className="flex-1" />
          </InputGroup>
        </FormField>
        <div className="flex items-center gap-2">
          <Checkbox id={`${id}-cb`} checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
          <Label htmlFor={`${id}-cb`}>Accept terms</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id={`${id}-sw`} checked={on} onCheckedChange={setOn} />
          <Label htmlFor={`${id}-sw`}>Notifications</Label>
        </div>
        <FormField label="Plan">
          <RadioGroup defaultValue="pro" className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="free" id={`${id}-free`} />
              <Label htmlFor={`${id}-free`}>Free</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="pro" id={`${id}-pro`} />
              <Label htmlFor={`${id}-pro`}>Pro</Label>
            </div>
          </RadioGroup>
        </FormField>
      </Stack>
    </section>
  );
}

function SystemCompositionDemo() {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">System Composition</h2>
      <Fieldset legend="Account settings">
        <Stack gap="content">
          <FormField label="Display name">
            <Input defaultValue="Aviala User" />
          </FormField>
          <Stack direction="row" gap="component">
            <Button>Save</Button>
            <Button variant="outline">Cancel</Button>
          </Stack>
        </Stack>
      </Fieldset>
    </section>
  );
}

export function App() {
  return (
    <ThemeProvider defaultMode="light" defaultPresetId="default">
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border px-6 py-4">
          <h1 className="text-2xl font-bold">Spiral 2 Playground</h1>
          <p className="text-sm text-muted-foreground">Aviala Design · React Component Library</p>
        </header>
        <main className="mx-auto grid max-w-5xl gap-6 p-6">
          <ThemeSwitcher />
          <ColorPalette />
          <IconGallery />
          <BasicInputDemo />
          <SystemCompositionDemo />
        </main>
      </div>
    </ThemeProvider>
  );
}
