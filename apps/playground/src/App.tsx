import { DirectionArrowRight, GeneralSetting, iconCatalog } from "@aviala/icons";
import {
  Button,
  Checkbox,
  Fieldset,
  FormField,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Link,
  PALETTE_HUE_FAMILIES,
  RadioGroup,
  RadioGroupItem,
  RadioInput,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemPeople,
  SelectSubItem,
  SelectSubMenu,
  SelectTrigger,
  Cascader,
  CascaderColumn,
  CascaderContent,
  CascaderField,
  CascaderItem,
  CascaderItemGroup,
  CascaderMenu,
  CascaderTrigger,
  SegmentatorGroup,
  SegmentatorItem,
  Stack,
  Switch,
  Textarea,
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
  Loading,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  List,
  ListItem,
  useTheme,
  type HueFamily,
} from "@aviala/spiral";
import { useId, useState } from "react";
import { categoryCascaderOptions, regionCascaderOptions } from "./cascader-demo-data";

function ThemeSwitcher() {
  const {
    mode,
    setMode,
    primaryColor,
    setPrimaryColor,
    presets,
    presetId,
    applyPreset,
    isStaticTheme,
    density,
    setDensity,
  } = useTheme();

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Theme Switcher</h2>
      <Stack gap="component">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Base numbers density</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "default", label: "Default" },
                { id: "mobile-friendly", label: "Mobile Friendly" },
              ] as const
            ).map((option) => (
              <Button
                key={option.id}
                mode={density === option.id ? "primary" : "default"}
                size="small"
                onClick={() => setDensity(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["light", "dark"] as const).map((m) => (
            <Button
              key={m}
              mode={mode === m ? "primary" : "default"}
              size="small"
              onClick={() => setMode(m)}
            >
              {m}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <Button
              key={p.id}
              mode={presetId === p.id ? "primary" : "second"}
              size="small"
              onClick={() => applyPreset(p.id)}
            >
              {p.name}
            </Button>
          ))}
        </div>
        {isStaticTheme ? (
          <p className="text-xs text-muted-foreground">
            Frozen ALD theme — colors come verbatim from the Figma token exports.
            Pick another preset to enable palette generation.
          </p>
        ) : (
          <>
            <label className="flex items-center gap-2 text-sm">
              Primary
              <ColorPicker value={primaryColor} onChange={setPrimaryColor}>
                <ColorPickerTrigger size="regular" className="w-[120px]" />
                <ColorPickerContent />
              </ColorPicker>
              <code className="text-xs text-muted-foreground">{primaryColor}</code>
            </label>
            <PaletteConfigPanel />
          </>
        )}
      </Stack>
    </section>
  );
}

function PaletteConfigPanel() {
  const { paletteConfig, setPaletteConfig, resetPaletteConfig } = useTheme();
  const families = paletteConfig.protectHueFamilies ?? [];

  const toggleFamily = (family: HueFamily) => {
    const set = new Set(families);
    if (set.has(family)) set.delete(family);
    else set.add(family);
    setPaletteConfig({ protectHueFamilies: [...set] });
  };

  return (
    <details className="rounded-md border border-border bg-background/60 p-3 text-sm" open>
      <summary className="cursor-pointer font-medium">Color generation config</summary>
      <div className="mt-3 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="flex items-center justify-between">
            <span>Curve gamma</span>
            <code className="text-xs text-muted-foreground">
              {(paletteConfig.curveGamma ?? 1).toFixed(2)}
            </code>
          </span>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.05}
            value={paletteConfig.curveGamma ?? 1}
            onChange={(e) => setPaletteConfig({ curveGamma: Number(e.target.value) })}
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={paletteConfig.protectHues ?? true}
            onChange={(e) => setPaletteConfig({ protectHues: e.target.checked })}
          />
          <span>Protect hue families</span>
        </label>

        <fieldset
          className="flex flex-col gap-2"
          disabled={!(paletteConfig.protectHues ?? true)}
        >
          <div className="flex flex-wrap gap-1.5">
            {PALETTE_HUE_FAMILIES.map((family) => {
              const active = families.includes(family);
              return (
                <button
                  key={family}
                  type="button"
                  onClick={() => toggleFamily(family)}
                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {family}
                </button>
              );
            })}
          </div>
          <label className="flex flex-col gap-1">
            <span className="flex items-center justify-between">
              <span>Protect strength</span>
              <code className="text-xs text-muted-foreground">
                {(paletteConfig.protectHueStrength ?? 2).toFixed(1)}
              </code>
            </span>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={paletteConfig.protectHueStrength ?? 2}
              onChange={(e) =>
                setPaletteConfig({ protectHueStrength: Number(e.target.value) })
              }
            />
          </label>
        </fieldset>

        <label className="flex flex-col gap-1">
          <span className="flex items-center justify-between">
            <span>Theme mix ratio</span>
            <code className="text-xs text-muted-foreground">
              {(paletteConfig.mixRatio ?? 0).toFixed(2)}
            </code>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={paletteConfig.mixRatio ?? 0}
            onChange={(e) => setPaletteConfig({ mixRatio: Number(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Mix color e.g. #165DFF"
            value={paletteConfig.mixColor ?? ""}
            onChange={(e) => setPaletteConfig({ mixColor: e.target.value || undefined })}
            className="rounded border border-border bg-card px-2 py-1 text-xs"
          />
        </label>

        <button
          type="button"
          onClick={resetPaletteConfig}
          className="self-start rounded border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Reset to design defaults
        </button>
      </div>
    </details>
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

function IconGalleryPromo() {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <Stack gap="content">
        <div>
          <h2 className="text-lg font-semibold">Icon Gallery</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse all {iconCatalog.length} Aviala icons with category accordion, search, and
            live thickness/mode preview.
          </p>
        </div>
        <Stack direction="row" gap="component" className="flex-wrap">
          <Link href="/icons" level="text" mode="noBackgroundCustom" rightIcon={<DirectionArrowRight aria-hidden />}>
            Open Icon Gallery
          </Link>
          <Link href="/icon-sync" level="text" mode="noBackgroundCustom" rightIcon={<DirectionArrowRight aria-hidden />}>
            Open Sync Console
          </Link>
        </Stack>
      </Stack>
    </section>
  );
}

function ButtonDemo() {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Button</h2>
      <Stack gap="block">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Modes</p>
          <div className="flex flex-wrap gap-2">
            <Button mode="primary">Primary</Button>
            <Button mode="second">Second</Button>
            <Button mode="default">Default</Button>
            <Button mode="noBackground">No background</Button>
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Sizes</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="tiny">Tiny</Button>
            <Button size="small">Small</Button>
            <Button size="regular">Regular</Button>
            <Button size="big">Big</Button>
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Icon only</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="tiny" iconOnly leftIcon={<GeneralSetting aria-hidden />} aria-label="Settings" />
            <Button size="small" iconOnly leftIcon={<GeneralSetting aria-hidden />} aria-label="Settings" />
            <Button size="regular" iconOnly leftIcon={<GeneralSetting aria-hidden />} aria-label="Settings" />
            <Button size="big" iconOnly leftIcon={<GeneralSetting aria-hidden />} aria-label="Settings" />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">States</p>
          <div className="flex flex-wrap gap-2">
            <Button leftIcon={<DirectionArrowRight aria-hidden />} rightIcon={<DirectionArrowRight aria-hidden />}>
              With icons
            </Button>
            <Button allRound>All round</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </Stack>
    </section>
  );
}

function BasicInputControlsDemo() {
  const [segment, setSegment] = useState("a");
  const [on, setOn] = useState(true);

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Basic Input</h2>
      <Stack gap="block">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Link</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="#" level="caption" leftIcon={<GeneralSetting aria-hidden />} rightIcon={<GeneralSetting aria-hidden />}>
              Caption
            </Link>
            <Link href="#" level="text" mode="noBackgroundCustom" leftIcon={<GeneralSetting aria-hidden />}>
              Text custom
            </Link>
            <Link href="#" iconOnly leftIcon={<GeneralSetting aria-hidden />} aria-label="Settings" />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Switch</p>
          <div className="flex flex-wrap items-center gap-4">
            <Switch size="regular" checked={on} onCheckedChange={setOn} />
            <Switch size="small" defaultChecked />
            <Switch size="regular" defaultChecked disabled />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Segmentator</p>
          <Stack gap="content">
            <SegmentatorGroup value={segment} onValueChange={setSegment}>
              <SegmentatorItem value="a" leftIcon={<GeneralSetting aria-hidden />}>
                Option A
              </SegmentatorItem>
              <SegmentatorItem value="b" leftIcon={<GeneralSetting aria-hidden />}>
                Option B
              </SegmentatorItem>
              <SegmentatorItem value="c" leftIcon={<GeneralSetting aria-hidden />}>
                Option C
              </SegmentatorItem>
            </SegmentatorGroup>
            <SegmentatorGroup mode="tiled" defaultValue="x">
              <SegmentatorItem value="x">Tiled X</SegmentatorItem>
              <SegmentatorItem value="y">Tiled Y</SegmentatorItem>
            </SegmentatorGroup>
          </Stack>
        </div>
      </Stack>
    </section>
  );
}

function BasicInputDemo() {
  const id = useId();
  const [checked, setChecked] = useState(false);
  const [on, setOn] = useState(true);
  const [accentColor, setAccentColor] = useState("#FF0000");
  const [colorPresets, setColorPresets] = useState([
    "#FF0000",
    "#165DFF",
    "#00B42A",
    "#FF7D00",
  ]);

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Information Collect</h2>
      <Stack gap="block">
        <FormField label="Email" htmlFor={`${id}-email`} description="We never share your email.">
          <Input
            id={`${id}-email`}
            type="email"
            placeholder="you@example.com"
            leftIcon={<GeneralSetting aria-hidden />}
          />
        </FormField>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Sizes</p>
          <Stack gap="content">
            <Input
              placeholder="Regular"
              leftIcon={<GeneralSetting aria-hidden />}
              rightIcon={<GeneralSetting aria-hidden />}
            />
            <Input
              size="big"
              placeholder="Big"
              leftIcon={<GeneralSetting aria-hidden />}
              rightIcon={<GeneralSetting aria-hidden />}
            />
            <Input
              allRound
              placeholder="All round"
              leftIcon={<GeneralSetting aria-hidden />}
            />
          </Stack>
        </div>
        <FormField label="Bio" htmlFor={`${id}-bio`}>
          <Textarea
            id={`${id}-bio`}
            placeholder="Tell us about yourself"
            maxLength={200}
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<GeneralSetting aria-hidden />}
          />
        </FormField>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Textarea sizes</p>
          <Stack gap="content">
            <Textarea
              placeholder="Regular"
              maxLength={200}
              leftIcon={<GeneralSetting aria-hidden />}
              rightIcon={<GeneralSetting aria-hidden />}
            />
            <Textarea
              size="big"
              placeholder="Big"
              maxLength={200}
              leftIcon={<GeneralSetting aria-hidden />}
              rightIcon={<GeneralSetting aria-hidden />}
            />
          </Stack>
        </div>
        <FormField label="Country">
          <Select defaultValue="us">
            <SelectTrigger
              placeholder="Text"
              leftIcon={<GeneralSetting aria-hidden />}
              rightIcon={<GeneralSetting aria-hidden />}
              className="w-full max-w-xs"
            />
            <SelectContent>
              <SelectItemGroup label="Regions" showDivider>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectSubItem itemFunction="action">
                  More regions
                  <SelectSubMenu>
                    <SelectItemGroup>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="nz">New Zealand</SelectItem>
                    </SelectItemGroup>
                  </SelectSubMenu>
                </SelectSubItem>
              </SelectItemGroup>
              <SelectItemGroup label="Other">
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectItemGroup>
            </SelectContent>
          </Select>
        </FormField>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Select sizes</p>
          <Stack gap="content">
            <Select defaultValue="a">
              <SelectTrigger
                placeholder="Regular"
                leftIcon={<GeneralSetting aria-hidden />}
                className="w-full max-w-xs"
              />
              <SelectContent>
                <SelectItemGroup>
                  <SelectItem value="a">Option A</SelectItem>
                  <SelectItem value="b">Option B</SelectItem>
                </SelectItemGroup>
              </SelectContent>
            </Select>
            <Select defaultValue="a">
              <SelectTrigger
                size="big"
                placeholder="Big"
                leftIcon={<GeneralSetting aria-hidden />}
                className="w-full max-w-xs"
              />
              <SelectContent>
                <SelectItemGroup>
                  <SelectItem value="a">Option A</SelectItem>
                  <SelectItem value="b">Option B</SelectItem>
                </SelectItemGroup>
              </SelectContent>
            </Select>
          </Stack>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">
            Select menu item variants — trailing radio/checkbox show a checkmark only when
            selected (no empty ring); form controls always show leading rings/boxes; action rows
            show a trailing arrow only.
          </p>
          <Stack gap="content">
            <Select defaultValue="radio-trail-a">
              <SelectTrigger placeholder="Item function variants" className="w-full max-w-xs" />
              <SelectContent className="max-h-[480px]">
                <SelectItemGroup label="Action (trailing arrow)">
                  <SelectItem value="action-a" itemFunction="action">
                    Navigate A
                  </SelectItem>
                  <SelectItem value="action-b" itemFunction="action">
                    Navigate B
                  </SelectItem>
                </SelectItemGroup>
                <SelectItemGroup label="Trailing radio (checkmark when selected)" showDivider>
                  <SelectItem value="radio-trail-a" itemFunction="radio">
                    Selected — trailing checkmark
                  </SelectItem>
                  <SelectItem value="radio-trail-b" itemFunction="radio">
                    Unselected — no empty circle
                  </SelectItem>
                </SelectItemGroup>
                <SelectItemGroup label="Trailing checkbox (checkmark when selected)" showDivider>
                  <SelectItem value="checkbox-trail-a" itemFunction="checkbox">
                    Selected — trailing checkmark
                  </SelectItem>
                  <SelectItem value="checkbox-trail-b" itemFunction="checkbox">
                    Unselected — no empty box
                  </SelectItem>
                </SelectItemGroup>
                <SelectItemGroup label="Form radio (leading control always visible)" showDivider>
                  <SelectItem value="form-radio-a" itemFunction="form-radio">
                    Selected — filled leading radio
                  </SelectItem>
                  <SelectItem value="form-radio-b" itemFunction="form-radio">
                    Unselected — empty leading ring
                  </SelectItem>
                </SelectItemGroup>
                <SelectItemGroup label="Form checkbox (leading control always visible)" showDivider>
                  <SelectItem value="form-checkbox-a" itemFunction="form-checkbox">
                    Selected — checked leading box
                  </SelectItem>
                  <SelectItem value="form-checkbox-b" itemFunction="form-checkbox">
                    Unselected — empty leading box
                  </SelectItem>
                </SelectItemGroup>
              </SelectContent>
            </Select>
            <Select defaultValue="people-radio">
              <SelectTrigger placeholder="People layout variants" className="w-full max-w-xs" />
              <SelectContent>
                <SelectItemGroup>
                  <SelectItemPeople value="people-radio" subtitle="Trailing radio" itemFunction="radio">
                    Alex Chen
                  </SelectItemPeople>
                  <SelectItemPeople
                    value="people-form-radio"
                    subtitle="Leading form radio"
                    itemFunction="form-radio"
                  >
                    Sam Rivera
                  </SelectItemPeople>
                  <SelectItemPeople value="people-action" subtitle="Action only" itemFunction="action">
                    Jordan Lee
                  </SelectItemPeople>
                </SelectItemGroup>
              </SelectContent>
            </Select>
          </Stack>
        </div>
        <FormField label="Accent color">
          <ColorPicker
            value={accentColor}
            onChange={setAccentColor}
            presets={colorPresets}
            onPresetsChange={setColorPresets}
          >
            <ColorPickerTrigger className="w-full max-w-xs" />
            <ColorPickerContent />
          </ColorPicker>
        </FormField>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">
            Cascader — region / location picker (6 countries, up to 4 levels; switch siblings to
            preview path highlighting and column expand)
          </p>
          <Stack gap="content">
            <FormField label="Region">
              <CascaderField
                options={regionCascaderOptions}
                defaultValue={["cn", "gd", "sz", "ns"]}
                placeholder="Select region"
                leftIcon={<GeneralSetting aria-hidden />}
                rightIcon={<GeneralSetting aria-hidden />}
                className="w-full max-w-xs"
              />
            </FormField>
            <FormField label="Region (any level)">
              <CascaderField
                options={regionCascaderOptions}
                defaultValue={["cn", "hi"]}
                changeOnSelect
                placeholder="Province or city"
                leftIcon={<GeneralSetting aria-hidden />}
                className="w-full max-w-xs"
              />
            </FormField>
          </Stack>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">
            Cascader — product categories (4 departments, many siblings, long labels for hug-width
            columns)
          </p>
          <FormField label="Category">
            <CascaderField
              options={categoryCascaderOptions}
              defaultValue={["digital", "phones", "flagship"]}
              placeholder="Select category"
              leftIcon={<GeneralSetting aria-hidden />}
              rightIcon={<GeneralSetting aria-hidden />}
              className="w-full max-w-xs"
            />
          </FormField>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">
            Cascader — compound menu with grouped columns
          </p>
          <Cascader defaultValue={["asia", "cn", "gd"]}>
            <CascaderTrigger
              placeholder="Select region group"
              leftIcon={<GeneralSetting aria-hidden />}
              rightIcon={<GeneralSetting aria-hidden />}
              className="w-full max-w-xs"
            />
            <CascaderContent>
              <CascaderMenu>
                <CascaderColumn>
                  <CascaderItemGroup label="Asia-Pacific (亚太)" showDivider>
                    <CascaderItem value="asia" pathPrefix={[]} hasChildren>
                      East Asia
                    </CascaderItem>
                    <CascaderItem value="sea" pathPrefix={[]} hasChildren>
                      Southeast Asia
                    </CascaderItem>
                  </CascaderItemGroup>
                  <CascaderItemGroup label="Americas & Europe (欧美)">
                    <CascaderItem value="na" pathPrefix={[]} hasChildren>
                      North America
                    </CascaderItem>
                    <CascaderItem value="eu" pathPrefix={[]} hasChildren>
                      Europe — Western & Nordic
                    </CascaderItem>
                  </CascaderItemGroup>
                </CascaderColumn>
                <CascaderColumn>
                  <CascaderItemGroup label="Countries (国家/地区)" showDivider>
                    <CascaderItem value="cn" pathPrefix={["asia"]} hasChildren>
                      China (中国)
                    </CascaderItem>
                    <CascaderItem value="jp" pathPrefix={["asia"]} hasChildren>
                      Japan (日本)
                    </CascaderItem>
                    <CascaderItem value="sg" pathPrefix={["sea"]} hasChildren>
                      Singapore (新加坡)
                    </CascaderItem>
                    <CascaderItem value="us" pathPrefix={["na"]} hasChildren>
                      United States
                    </CascaderItem>
                    <CascaderItem value="uk" pathPrefix={["eu"]}>
                      United Kingdom — England & Scotland
                    </CascaderItem>
                  </CascaderItemGroup>
                </CascaderColumn>
                <CascaderColumn>
                  <CascaderItemGroup label="Provinces / States">
                    <CascaderItem value="gd" pathPrefix={["asia", "cn"]}>
                      Guangdong Province (广东省)
                    </CascaderItem>
                    <CascaderItem value="hi" pathPrefix={["asia", "cn"]}>
                      Hainan Province (海南省)
                    </CascaderItem>
                    <CascaderItem value="tk" pathPrefix={["asia", "jp"]}>
                      Tokyo Metropolis (東京都)
                    </CascaderItem>
                    <CascaderItem value="ca" pathPrefix={["na", "us"]}>
                      California — Bay Area & Southern CA
                    </CascaderItem>
                  </CascaderItemGroup>
                </CascaderColumn>
              </CascaderMenu>
            </CascaderContent>
          </Cascader>
        </div>
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
          <RadioGroup defaultValue="pro" direction="vertical" className="w-full max-w-xs">
            <RadioInput value="free" id={`${id}-free`} title="Free" description="Basic features" />
            <RadioInput value="pro" id={`${id}-pro`} title="Pro" description="All features" />
          </RadioGroup>
        </FormField>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Radio card style</p>
          <RadioGroup defaultValue="monthly" direction="vertical" className="w-full max-w-xs">
            <RadioInput
              value="monthly"
              id={`${id}-monthly`}
              title="Monthly"
              description="Pay as you go"
              variant="card"
            />
            <RadioInput
              value="yearly"
              id={`${id}-yearly`}
              title="Yearly"
              description="Save 20%"
              variant="card"
            />
          </RadioGroup>
        </div>
      </Stack>
    </section>
  );
}

function LoadingDemo() {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Loading Icon</h2>
      <Stack gap="block">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Modes</p>
          <div className="flex flex-wrap items-center gap-6">
            <Loading mode="theme" level="text" lineHeightFix={false} />
            <Loading mode="themeText" level="text" lineHeightFix={false} />
            <Loading mode="black" level="text" lineHeightFix={false} />
            <Loading mode="white" level="text" lineHeightFix={false} className="rounded bg-neutral-800 p-2" />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Levels (line-height fix)</p>
          <div className="flex flex-wrap items-end gap-4">
            <Loading mode="theme" level="display" />
            <Loading mode="theme" level="headline1" />
            <Loading mode="theme" level="headline2" />
            <Loading mode="theme" level="title" />
            <Loading mode="theme" level="subtitle" />
            <Loading mode="theme" level="text" />
            <Loading mode="theme" level="caption" />
          </div>
        </div>
      </Stack>
    </section>
  );
}

function OverlayDemo() {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Popover & Tooltip</h2>
      <Stack gap="block">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Popover</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button mode="default">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent showArrow className="max-w-xs">
              Rich content panel — same surface as Select menu (white bg, border, shadow).
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Tooltip</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button mode="second" leftIcon={<GeneralSetting aria-hidden />}>
                  Hover for hint
                </Button>
              </TooltipTrigger>
              <TooltipContent>Caption-sized hint text on inverted neutral surface</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Stack>
    </section>
  );
}

function ListDemo() {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Structure Navigation — List</h2>
      <List title="Settings" className="max-w-md">
        <ListItem
          itemType="select"
          leading="shaped"
          title="Display mode"
          subtitle="Choose how content appears"
          select={
            <Select defaultValue="a">
              <SelectTrigger
                size="regular"
                placeholder="Text"
                leftIcon={<GeneralSetting aria-hidden />}
                rightIcon={<GeneralSetting aria-hidden />}
                className="w-full"
              />
              <SelectContent portalled={false}>
                <SelectItemGroup>
                  <SelectItem value="a">Compact</SelectItem>
                  <SelectItem value="b">Comfortable</SelectItem>
                </SelectItemGroup>
              </SelectContent>
            </Select>
          }
        />
        <ListItem itemType="action" leading="default" title="Manage account" subtitle="Profile and security" />
        <ListItem
          itemType="switch"
          leading="none"
          title="Notifications"
          subtitle="Enable push alerts"
          switchProps={{ defaultChecked: true }}
        />
      </List>
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
            <Button mode="primary">Save</Button>
            <Button mode="default">Cancel</Button>
          </Stack>
        </Stack>
      </Fieldset>
    </section>
  );
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Spiral 2 Playground</h1>
            <p className="text-sm text-muted-foreground">Aviala Design · React Component Library</p>
          </div>
          <Stack direction="row" gap="component" className="items-center">
            <Link href="/icons" level="text" mode="noBackgroundCustom">
              Icon Gallery
            </Link>
            <Link href="/icon-sync" level="text" mode="noBackgroundCustom">
              Sync Console
            </Link>
          </Stack>
        </div>
      </header>
      <main className="mx-auto grid max-w-5xl gap-6 p-6">
        <ThemeSwitcher />
        <ColorPalette />
        <IconGalleryPromo />
        <ButtonDemo />
        <BasicInputControlsDemo />
        <BasicInputDemo />
        <LoadingDemo />
        <OverlayDemo />
        <ListDemo />
        <SystemCompositionDemo />
      </main>
    </div>
  );
}
