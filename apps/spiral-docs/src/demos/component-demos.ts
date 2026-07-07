import type { KnobDef, KnobValues } from "../components/DemoKnobs";
import { DEFAULT_ICON_NAME, jsxIconProp } from "./demo-icons";

function jsxBool(value: boolean, attr: string) {
  return value ? ` ${attr}` : ` ${attr}={false}`;
}

function jsxString(value: string) {
  return JSON.stringify(value);
}

export const buttonKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: ["primary", "second", "default", "defaultCustom", "noBackground", "noBackgroundCustom", "destructive"],
    defaultValue: "primary",
  },
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["tiny", "small", "regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "loading", label: "loading", defaultValue: false },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  { kind: "boolean", name: "iconOnly", label: "iconOnly", defaultValue: false },
  { kind: "boolean", name: "showLeftIcon", label: "leftIcon 显示", defaultValue: true },
  {
    kind: "icon",
    name: "leftIcon",
    label: "leftIcon",
    defaultValue: DEFAULT_ICON_NAME,
  },
  { kind: "boolean", name: "showRightIcon", label: "rightIcon 显示", defaultValue: false },
  {
    kind: "icon",
    name: "rightIcon",
    label: "rightIcon",
    defaultValue: DEFAULT_ICON_NAME,
  },
  { kind: "string", name: "label", label: "children", defaultValue: "Primary", placeholder: "按钮文字" },
];

export function buildButtonCode(values: KnobValues): string {
  const mode = String(values.mode ?? "primary");
  const size = String(values.size ?? "regular");
  const label = String(values.label ?? "Primary");
  const disabled = Boolean(values.disabled);
  const loading = Boolean(values.loading);
  const allRound = Boolean(values.allRound);
  const iconOnly = Boolean(values.iconOnly);
  const showLeftIcon = Boolean(values.showLeftIcon);
  const showRightIcon = Boolean(values.showRightIcon);
  const leftIcon = String(values.leftIcon ?? DEFAULT_ICON_NAME);
  const rightIcon = String(values.rightIcon ?? DEFAULT_ICON_NAME);

  const leftIconProp = jsxIconProp(iconOnly || showLeftIcon, leftIcon, "leftIcon");
  const rightIconProp = iconOnly ? "" : jsxIconProp(showRightIcon, rightIcon, "rightIcon");
  const iconOnlyProp = iconOnly ? jsxBool(true, "iconOnly") : "";
  const ariaLabelProp = iconOnly ? `\n    aria-label=${JSON.stringify(label || "Button")}` : "";
  const childrenBlock = iconOnly ? "" : `\n    ${jsxString(label)}\n  `;

  return `render(
  <Button
    mode=${JSON.stringify(mode)}
    size=${JSON.stringify(size)}${jsxBool(disabled, "disabled")}${jsxBool(loading, "loading")}${jsxBool(allRound, "allRound")}${iconOnlyProp}${leftIconProp}${rightIconProp}${ariaLabelProp}
  >${childrenBlock}</Button>
);`;
}

export const buttonLiveCode = buildButtonCode(
  Object.fromEntries(buttonKnobs.map((k) => [k.name, k.kind === "boolean" ? k.defaultValue : k.defaultValue]))
);

export const inputKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "请输入内容",
    placeholder: "占位符",
  },
  {
    kind: "string",
    name: "defaultValue",
    label: "defaultValue",
    defaultValue: "",
    placeholder: "默认值（可选）",
  },
  { kind: "boolean", name: "showLeftIcon", label: "leftIcon 显示", defaultValue: true },
  {
    kind: "icon",
    name: "leftIcon",
    label: "leftIcon",
    defaultValue: "GeneralSearch",
  },
  { kind: "boolean", name: "showRightIcon", label: "rightIcon 显示", defaultValue: false },
  {
    kind: "icon",
    name: "rightIcon",
    label: "rightIcon",
    defaultValue: DEFAULT_ICON_NAME,
  },
];

export function buildInputCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const placeholder = String(values.placeholder ?? "");
  const defaultValue = String(values.defaultValue ?? "");
  const disabled = Boolean(values.disabled);
  const showLeftIcon = Boolean(values.showLeftIcon);
  const showRightIcon = Boolean(values.showRightIcon);
  const leftIcon = String(values.leftIcon ?? "GeneralSearch");
  const rightIcon = String(values.rightIcon ?? "GeneralSetting");

  const defaultValueAttr = defaultValue ? `\n    defaultValue=${JSON.stringify(defaultValue)}` : "";
  const leftIconProp = jsxIconProp(showLeftIcon, leftIcon, "leftIcon");
  const rightIconProp = jsxIconProp(showRightIcon, rightIcon, "rightIcon");

  return `render(
  <Input
    size=${JSON.stringify(size)}
    placeholder=${JSON.stringify(placeholder)}${defaultValueAttr}${jsxBool(disabled, "disabled")}${leftIconProp}${rightIconProp}
    className="max-w-sm"
  />
);`;
}

export const inputLiveCode = buildInputCode(
  Object.fromEntries(inputKnobs.map((k) => [k.name, k.kind === "boolean" ? k.defaultValue : k.defaultValue]))
);

export const segmentatorKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: ["nested", "tiled"],
    defaultValue: "nested",
  },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
];

export const segmentatorLiveCode = `function Demo() {
  const [value, setValue] = useState("a");
  return (
    <SegmentatorGroup value={value} onValueChange={setValue} mode="nested">
      <SegmentatorItem value="a">选项 A</SegmentatorItem>
      <SegmentatorItem value="b">选项 B</SegmentatorItem>
      <SegmentatorItem value="c">选项 C</SegmentatorItem>
    </SegmentatorGroup>
  );
}

render(<Demo />);`;

export function buildSegmentatorCode(values: KnobValues): string {
  const mode = String(values.mode ?? "nested");
  const allRound = Boolean(values.allRound);
  const disabled = Boolean(values.disabled);

  return `function Demo() {
  const [value, setValue] = useState("a");
  return (
    <SegmentatorGroup
      value={value}
      onValueChange={setValue}
      mode=${JSON.stringify(mode)}${jsxBool(allRound, "allRound")}${jsxBool(disabled, "disabled")}
    >
      <SegmentatorItem value="a">选项 A</SegmentatorItem>
      <SegmentatorItem value="b">选项 B</SegmentatorItem>
      <SegmentatorItem value="c">选项 C</SegmentatorItem>
    </SegmentatorGroup>
  );
}

render(<Demo />);`;
}

export const selectLiveCode = `render(
  <Select defaultValue="a">
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="请选择" />
    </SelectTrigger>
    <SelectContent>
      <SelectItemGroup label="选项">
        <SelectItem value="a" itemFunction="radio">选项 A</SelectItem>
        <SelectItem value="b" itemFunction="radio">选项 B</SelectItem>
        <SelectItem value="c" itemFunction="radio">选项 C</SelectItem>
      </SelectItemGroup>
    </SelectContent>
  </Select>
);`;

export const selectKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "defaultValue",
    label: "defaultValue",
    options: ["a", "b", "c"],
    defaultValue: "a",
  },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "请选择",
  },
];

export function buildSelectCode(values: KnobValues): string {
  const defaultValue = String(values.defaultValue ?? "a");
  const placeholder = String(values.placeholder ?? "请选择");

  return `render(
  <Select defaultValue=${JSON.stringify(defaultValue)}>
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder=${JSON.stringify(placeholder)} />
    </SelectTrigger>
    <SelectContent>
      <SelectItemGroup label="选项">
        <SelectItem value="a" itemFunction="radio">选项 A</SelectItem>
        <SelectItem value="b" itemFunction="radio">选项 B</SelectItem>
        <SelectItem value="c" itemFunction="radio">选项 C</SelectItem>
      </SelectItemGroup>
    </SelectContent>
  </Select>
);`;
}

export const alertKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "type",
    label: "type",
    options: ["info", "warning", "error", "success", "neutral"],
    defaultValue: "info",
  },
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["default", "small"],
    defaultValue: "default",
  },
  {
    kind: "select",
    name: "appearance",
    label: "appearance",
    options: ["default", "light"],
    defaultValue: "default",
  },
  { kind: "boolean", name: "dismissible", label: "dismissible", defaultValue: true },
  { kind: "boolean", name: "showActions", label: "showActions", defaultValue: false },
  {
    kind: "string",
    name: "title",
    label: "title",
    defaultValue: "Information",
    placeholder: "标题",
  },
  {
    kind: "string",
    name: "description",
    label: "description",
    defaultValue: "Supporting details for this alert message.",
    placeholder: "描述",
  },
];

export function buildAlertCode(values: KnobValues): string {
  const type = String(values.type ?? "info");
  const size = String(values.size ?? "default");
  const appearance = String(values.appearance ?? "default");
  const title = String(values.title ?? "Information");
  const description = String(values.description ?? "");
  const dismissible = Boolean(values.dismissible);
  const showActions = Boolean(values.showActions);

  const descriptionProp =
    size === "default" && description
      ? `\n    description=${JSON.stringify(description)}`
      : "";

  const actionsBlock = showActions
    ? `\n    showActions\n    action="Confirm"\n    secondaryAction="Cancel"`
    : "";

  return `render(
  <Alert
    type=${JSON.stringify(type)}
    size=${JSON.stringify(size)}
    appearance=${JSON.stringify(appearance)}${jsxBool(dismissible, "dismissible")}${descriptionProp}${actionsBlock}
    title=${JSON.stringify(title)}
  />
);`;
}

export const alertLiveCode = buildAlertCode(
  Object.fromEntries(alertKnobs.map((k) => [k.name, k.defaultValue]))
);

export const feedbackKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "type",
    label: "type",
    options: ["information", "warning", "wrong", "success", "normal"],
    defaultValue: "information",
  },
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["default", "small"],
    defaultValue: "default",
  },
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: ["default", "primary"],
    defaultValue: "default",
  },
  { kind: "boolean", name: "showClose", label: "showClose", defaultValue: true },
  {
    kind: "string",
    name: "title",
    label: "title",
    defaultValue: "Information",
    placeholder: "标题",
  },
  {
    kind: "string",
    name: "description",
    label: "description",
    defaultValue: "Supporting details for this message.",
    placeholder: "描述",
  },
];

export function buildFeedbackCode(values: KnobValues): string {
  const type = String(values.type ?? "information");
  const size = String(values.size ?? "default");
  const mode = String(values.mode ?? "default");
  const title = String(values.title ?? "Information");
  const description = String(values.description ?? "");
  const showClose = Boolean(values.showClose);

  const descriptionProp =
    size === "default" && description
      ? `\n    description=${JSON.stringify(description)}`
      : "";

  return `render(
  <Feedback
    type=${JSON.stringify(type)}
    size=${JSON.stringify(size)}
    mode=${JSON.stringify(mode)}${jsxBool(showClose, "showClose")}${descriptionProp}
    title=${JSON.stringify(title)}
  />
);`;
}

export const feedbackLiveCode = buildFeedbackCode(
  Object.fromEntries(feedbackKnobs.map((k) => [k.name, k.defaultValue]))
);

export const datePickerKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: ["single", "range"],
    defaultValue: "single",
  },
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "enableTime", label: "enableTime", defaultValue: true },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "error", label: "error", defaultValue: false },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "Select date",
    placeholder: "占位符",
  },
];

export function buildDatePickerCode(values: KnobValues): string {
  const mode = String(values.mode ?? "single");
  const size = String(values.size ?? "regular");
  const placeholder = String(values.placeholder ?? "Select date");
  const enableTime = Boolean(values.enableTime ?? true);
  const disabled = Boolean(values.disabled);
  const error = Boolean(values.error);
  const allRound = Boolean(values.allRound);
  const width = mode === "range" ? "320px" : "290px";

  return `function Demo() {
  const [value, setValue] = useState(${mode === "range" ? "{}" : "undefined"});
  return (
    <DatePickerField
      mode=${JSON.stringify(mode)}
      size=${JSON.stringify(size)}${enableTime ? "" : " enableTime={false}"}
      placeholder=${JSON.stringify(placeholder)}${jsxBool(disabled, "disabled")}${jsxBool(error, "error")}${jsxBool(allRound, "allRound")}
      value={value}
      onValueChange={setValue}
      className="w-[${width}]"
    />
  );
}

render(<Demo />);`;
}

export const datePickerLiveCode = buildDatePickerCode(
  Object.fromEntries(datePickerKnobs.map((k) => [k.name, k.defaultValue]))
);

export const switchKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "small"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "defaultChecked", label: "defaultChecked", defaultValue: true },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
];

export function buildSwitchCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const defaultChecked = Boolean(values.defaultChecked);
  const disabled = Boolean(values.disabled);

  return `render(
  <Switch
    size=${JSON.stringify(size)}${jsxBool(defaultChecked, "defaultChecked")}${jsxBool(disabled, "disabled")}
  />
);`;
}

export const switchLiveCode = buildSwitchCode(
  Object.fromEntries(switchKnobs.map((k) => [k.name, k.defaultValue]))
);

export const linkKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["caption", "text"],
    defaultValue: "text",
  },
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: ["noBackground", "noBackgroundCustom"],
    defaultValue: "noBackground",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  {
    kind: "string",
    name: "label",
    label: "children",
    defaultValue: "Text",
    placeholder: "链接文字",
  },
];

export function buildLinkCode(values: KnobValues): string {
  const level = String(values.level ?? "text");
  const mode = String(values.mode ?? "noBackground");
  const label = String(values.label ?? "Text");
  const disabled = Boolean(values.disabled);

  return `render(
  <Link
    href="#"
    level=${JSON.stringify(level)}
    mode=${JSON.stringify(mode)}${jsxBool(disabled, "disabled")}
    leftIcon={<GeneralSetting aria-hidden />}
    rightIcon={<GeneralSetting aria-hidden />}
  >
    ${jsxString(label)}
  </Link>
);`;
}

export const linkLiveCode = buildLinkCode(
  Object.fromEntries(linkKnobs.map((k) => [k.name, k.defaultValue]))
);

export const textareaKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "error", label: "error", defaultValue: false },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "Text",
    placeholder: "占位符",
  },
];

export function buildTextareaCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const placeholder = String(values.placeholder ?? "Text");
  const disabled = Boolean(values.disabled);
  const error = Boolean(values.error);

  return `render(
  <Textarea
    size=${JSON.stringify(size)}
    placeholder=${JSON.stringify(placeholder)}
    maxLength={200}${jsxBool(disabled, "disabled")}${jsxBool(error, "error")}
    leftIcon={<GeneralSetting aria-hidden />}
    rightIcon={<GeneralSetting aria-hidden />}
    className="max-w-sm"
  />
);`;
}

export const textareaLiveCode = buildTextareaCode(
  Object.fromEntries(textareaKnobs.map((k) => [k.name, k.defaultValue]))
);

export const checkboxKnobs: KnobDef[] = [
  { kind: "boolean", name: "defaultChecked", label: "defaultChecked", defaultValue: true },
  { kind: "boolean", name: "round", label: "round", defaultValue: false },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
];

export function buildCheckboxCode(values: KnobValues): string {
  const defaultChecked = Boolean(values.defaultChecked);
  const round = Boolean(values.round);
  const disabled = Boolean(values.disabled);

  return `render(
  <div className="flex items-center gap-3">
    <Checkbox
      id="demo-checkbox"${jsxBool(defaultChecked, "defaultChecked")}${jsxBool(round, "round")}${jsxBool(disabled, "disabled")}
    />
    <label htmlFor="demo-checkbox">Checkbox label</label>
  </div>
);`;
}

export const checkboxLiveCode = buildCheckboxCode(
  Object.fromEntries(checkboxKnobs.map((k) => [k.name, k.defaultValue]))
);

export const radioKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "direction",
    label: "direction",
    options: ["vertical", "horizontal"],
    defaultValue: "vertical",
  },
  {
    kind: "select",
    name: "variant",
    label: "variant",
    options: ["default", "card"],
    defaultValue: "default",
  },
];

export function buildRadioCode(values: KnobValues): string {
  const direction = String(values.direction ?? "vertical");
  const variant = String(values.variant ?? "default");
  const variantAttr = variant === "card" ? ' variant="card"' : "";

  return `render(
  <RadioGroup defaultValue="a" direction=${JSON.stringify(direction)} className="w-[200px]">
    <RadioInput value="a" id="radio-a" title="Text" description="Text"${variantAttr} />
    <RadioInput value="b" id="radio-b" title="Text" description="Text"${variantAttr} />
  </RadioGroup>
);`;
}

export const radioLiveCode = buildRadioCode(
  Object.fromEntries(radioKnobs.map((k) => [k.name, k.defaultValue]))
);

export const cascaderKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "error", label: "error", defaultValue: false },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "Text",
    placeholder: "占位符",
  },
];

export function buildCascaderCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const placeholder = String(values.placeholder ?? "Text");
  const disabled = Boolean(values.disabled);
  const error = Boolean(values.error);
  const allRound = Boolean(values.allRound);

  return `const regionOptions = [
  {
    value: "china",
    label: "China",
    children: [
      {
        value: "hainan",
        label: "Hainan",
        children: [
          { value: "haikou", label: "Haikou" },
          { value: "sanya", label: "Sanya" },
        ],
      },
    ],
  },
];

function Demo() {
  const [value, setValue] = useState(["china", "hainan", "haikou"]);
  return (
    <CascaderField
      options={regionOptions}
      value={value}
      onValueChange={setValue}
      size=${JSON.stringify(size)}
      placeholder=${JSON.stringify(placeholder)}${jsxBool(disabled, "disabled")}${jsxBool(error, "error")}${jsxBool(allRound, "allRound")}
      leftIcon={<GeneralSetting aria-hidden />}
      rightIcon={<GeneralSetting aria-hidden />}
      className="w-[290px]"
    />
  );
}

render(<Demo />);`;
}

export const cascaderLiveCode = buildCascaderCode(
  Object.fromEntries(cascaderKnobs.map((k) => [k.name, k.defaultValue]))
);

export const colorPickerKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
];

export function buildColorPickerCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const allRound = Boolean(values.allRound);
  const disabled = Boolean(values.disabled);

  return `function Demo() {
  const [color, setColor] = useState("#165DFF");
  return (
    <ColorPicker value={color} onChange={setColor} disabled={${disabled}}>
      <ColorPickerTrigger
        size=${JSON.stringify(size)}${jsxBool(allRound, "allRound")}
        className="w-[120px]"
      />
      <ColorPickerContent />
    </ColorPicker>
  );
}

render(<Demo />);`;
}

export const colorPickerLiveCode = buildColorPickerCode(
  Object.fromEntries(colorPickerKnobs.map((k) => [k.name, k.defaultValue]))
);

export const listKnobs: KnobDef[] = [
  {
    kind: "string",
    name: "title",
    label: "title",
    defaultValue: "Text",
    placeholder: "列表标题",
  },
];

export const listLiveCode = `function DemoSelect() {
  return (
    <Select defaultValue="a">
      <SelectTrigger
        size="regular"
        placeholder="Text"
        leftIcon={<GeneralSetting aria-hidden />}
        className="w-full"
      />
      <SelectContent portalled={false}>
        <SelectItemGroup>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  );
}

render(
  <List title="Text" className="w-[387px]">
    <ListItem itemType="select" leading="shaped" title="Text" subtitle="Text" select={<DemoSelect />} />
    <ListItem itemType="select" leading="shaped" title="Text" subtitle="Text" select={<DemoSelect />} />
    <ListItem itemType="action" leading="shaped" title="Text" subtitle="Text" />
  </List>
);`;

export function buildListCode(values: KnobValues): string {
  const title = String(values.title ?? "Text");

  return `function DemoSelect() {
  return (
    <Select defaultValue="a">
      <SelectTrigger
        size="regular"
        placeholder="Text"
        leftIcon={<GeneralSetting aria-hidden />}
        className="w-full"
      />
      <SelectContent portalled={false}>
        <SelectItemGroup>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  );
}

render(
  <List title=${JSON.stringify(title)} className="w-[387px]">
    <ListItem itemType="select" leading="shaped" title="Text" subtitle="Text" select={<DemoSelect />} />
    <ListItem itemType="select" leading="shaped" title="Text" subtitle="Text" select={<DemoSelect />} />
    <ListItem itemType="action" leading="shaped" title="Text" subtitle="Text" />
  </List>
);`;
}

export const typographyKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["display", "headline1", "headline2", "title", "subtitle", "text", "caption"],
    defaultValue: "text",
  },
  {
    kind: "select",
    name: "content",
    label: "content",
    options: ["text", "number"],
    defaultValue: "text",
  },
  {
    kind: "select",
    name: "tone",
    label: "tone",
    options: ["default", "white"],
    defaultValue: "default",
  },
  {
    kind: "string",
    name: "label",
    label: "children",
    defaultValue: "Text",
    placeholder: "文字内容",
  },
];

export function buildTypographyCode(values: KnobValues): string {
  const level = String(values.level ?? "text");
  const content = String(values.content ?? "text");
  const tone = String(values.tone ?? "default");
  const label = String(values.label ?? "Text");

  return `render(
  <Typography level=${JSON.stringify(level)} content=${JSON.stringify(content)} tone=${JSON.stringify(tone)}>
    ${jsxString(label)}
  </Typography>
);`;
}

export const typographyLiveCode = buildTypographyCode(
  Object.fromEntries(typographyKnobs.map((k) => [k.name, k.defaultValue]))
);

export const typefaceKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "content",
    label: "content",
    options: [
      "allCustom",
      "textCaption",
      "textCaptionSubtitle",
      "textTitle",
      "textHeadline2",
      "textHeadline1",
    ],
    defaultValue: "textCaption",
  },
  {
    kind: "string",
    name: "primary",
    label: "primary",
    defaultValue: "Primary line",
    placeholder: "主文字",
  },
  {
    kind: "string",
    name: "secondary",
    label: "secondary",
    defaultValue: "Caption line",
    placeholder: "副文字",
  },
];

export function buildTypefaceCode(values: KnobValues): string {
  const content = String(values.content ?? "textCaption");
  const primary = String(values.primary ?? "Primary line");
  const secondary = String(values.secondary ?? "Caption line");

  return `render(
  <Typeface
    content=${JSON.stringify(content)}
    primary=${JSON.stringify(primary)}
    secondary=${JSON.stringify(secondary)}
  />
);`;
}

export const typefaceLiveCode = buildTypefaceCode(
  Object.fromEntries(typefaceKnobs.map((k) => [k.name, k.defaultValue]))
);

export const formFieldKnobs: KnobDef[] = [
  {
    kind: "string",
    name: "label",
    label: "label",
    defaultValue: "Username",
    placeholder: "字段标签",
  },
  {
    kind: "string",
    name: "description",
    label: "description",
    defaultValue: "Your public display name.",
    placeholder: "描述文字",
  },
  {
    kind: "string",
    name: "placeholder",
    label: "input placeholder",
    defaultValue: "aviala",
    placeholder: "输入框占位符",
  },
];

export function buildFormFieldCode(values: KnobValues): string {
  const label = String(values.label ?? "Username");
  const description = String(values.description ?? "");
  const placeholder = String(values.placeholder ?? "aviala");
  const descriptionProp = description ? `\n    description=${JSON.stringify(description)}` : "";

  return `render(
  <FormField label=${JSON.stringify(label)}${descriptionProp} className="max-w-sm">
    <Input placeholder=${JSON.stringify(placeholder)} />
  </FormField>
);`;
}

export const formFieldLiveCode = buildFormFieldCode(
  Object.fromEntries(formFieldKnobs.map((k) => [k.name, k.defaultValue]))
);

export const anchorKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "activeItem",
    label: "activeItem",
    options: ["Getting started", "Installation", "Quick start"],
    defaultValue: "Getting started",
  },
];

export function buildAnchorCode(values: KnobValues): string {
  const activeItem = String(values.activeItem ?? "Getting started");

  return `render(
  <Anchor aria-label="Page sections" className="w-[200px]">
    <AnchorItem href="#" indentLevel={0} activated={${activeItem === "Getting started"}}>
      Getting started
    </AnchorItem>
    <AnchorItem href="#" indentLevel={0} activated={${activeItem === "Installation"}}>
      Installation
    </AnchorItem>
    <AnchorItem href="#" indentLevel={1} activated={${activeItem === "Quick start"}}>
      Quick start
    </AnchorItem>
    <AnchorItem href="#" indentLevel={2}>
      Configuration
    </AnchorItem>
  </Anchor>
);`;
}

export const anchorLiveCode = buildAnchorCode(
  Object.fromEntries(anchorKnobs.map((k) => [k.name, k.defaultValue]))
);

export const popoverKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "side",
    label: "side",
    options: ["top", "right", "bottom", "left"],
    defaultValue: "bottom",
  },
  { kind: "boolean", name: "showArrow", label: "showArrow", defaultValue: false },
];

export function buildPopoverCode(values: KnobValues): string {
  const side = String(values.side ?? "bottom");
  const showArrow = Boolean(values.showArrow);

  return `render(
  <Popover>
    <PopoverTrigger asChild>
      <Button mode="default">Open popover</Button>
    </PopoverTrigger>
    <PopoverContent side=${JSON.stringify(side)}${jsxBool(showArrow, "showArrow")}>
      Popover content with text typography.
    </PopoverContent>
  </Popover>
);`;
}

export const popoverLiveCode = buildPopoverCode(
  Object.fromEntries(popoverKnobs.map((k) => [k.name, k.defaultValue]))
);

export const modalKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["default", "large"],
    defaultValue: "default",
  },
  { kind: "boolean", name: "showIcon", label: "showIcon", defaultValue: true },
  { kind: "boolean", name: "showFooter", label: "showFooter", defaultValue: true },
];

export function buildModalCode(values: KnobValues): string {
  const size = String(values.size ?? "default");
  const showIcon = Boolean(values.showIcon);
  const showFooter = Boolean(values.showFooter);
  const sizeAttr = size === "default" ? "" : ` size=${JSON.stringify(size)}`;
  const iconBlock = showIcon
    ? `\n      showIcon\n      icon={<SymbolInformationCircle thickness="Regular" mode="fill" aria-hidden />}`
    : "";

  return `render(
  <Modal>
    <ModalTrigger asChild>
      <Button mode="default">Open modal</Button>
    </ModalTrigger>
    <ModalContent${sizeAttr}>
      <ModalHeaderText${iconBlock}
        title="Modal title"
        description="Supporting caption in the header."
      />
      <ModalBody layout="text" title="Section title" description="Body copy for the dialog." />${
        showFooter
          ? `
      <ModalFooter>
        <Button mode="second">Cancel</Button>
        <Button mode="primary">Confirm</Button>
      </ModalFooter>`
          : ""
      }
    </ModalContent>
  </Modal>
);`;
}

export const modalLiveCode = buildModalCode(
  Object.fromEntries(modalKnobs.map((k) => [k.name, k.defaultValue]))
);

export const tooltipKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "side",
    label: "side",
    options: ["top", "right", "bottom", "left"],
    defaultValue: "top",
  },
  { kind: "boolean", name: "showArrow", label: "showArrow", defaultValue: true },
];

export function buildTooltipCode(values: KnobValues): string {
  const side = String(values.side ?? "top");
  const showArrow = Boolean(values.showArrow);
  const showArrowProp = showArrow ? "" : "\n      showArrow={false}";

  return `render(
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button mode="default">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent side=${JSON.stringify(side)}${showArrowProp}>
        Tooltip with caption typography
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);`;
}

export const tooltipLiveCode = buildTooltipCode(
  Object.fromEntries(tooltipKnobs.map((k) => [k.name, k.defaultValue]))
);

export const loadingKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["display", "headline1", "headline2", "title", "subtitle", "text", "caption"],
    defaultValue: "text",
  },
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: ["theme", "themeText", "black", "white"],
    defaultValue: "theme",
  },
  { kind: "boolean", name: "lineHeightFix", label: "lineHeightFix", defaultValue: true },
];

export function buildLoadingCode(values: KnobValues): string {
  const level = String(values.level ?? "text");
  const mode = String(values.mode ?? "theme");
  const lineHeightFix = Boolean(values.lineHeightFix);

  return `render(
  <Loading
    level=${JSON.stringify(level)}
    mode=${JSON.stringify(mode)}${jsxBool(lineHeightFix, "lineHeightFix")}
  />
);`;
}

export const loadingLiveCode = buildLoadingCode(
  Object.fromEntries(loadingKnobs.map((k) => [k.name, k.defaultValue]))
);

export const datePickerWithTimeCode = `function Demo() {
  const [value, setValue] = useState(new Date(2026, 5, 10));
  return (
    <DatePickerField
      mode="single"
      value={value}
      onValueChange={setValue}
      className="w-[290px]"
    />
  );
}

render(<Demo />);`;

export const datePickerWithTimeRangeCode = `function Demo() {
  const [value, setValue] = useState({
    from: new Date(2026, 4, 23),
    to: new Date(2026, 4, 28),
  });
  return (
    <DatePickerField
      mode="range"
      value={value}
      onValueChange={setValue}
      className="w-[320px]"
    />
  );
}

render(<Demo />);`;

export const datePickerDateOnlyCode = `render(
  <DatePickerField
    mode="single"
    enableTime={false}
    defaultValue={new Date(2026, 6, 4)}
    className="w-[290px]"
  />
);`;

export const timePickerKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "error", label: "error", defaultValue: false },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "HH:mm",
    placeholder: "占位符",
  },
];

export function buildTimePickerCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const placeholder = String(values.placeholder ?? "HH:mm");
  const disabled = Boolean(values.disabled);
  const error = Boolean(values.error);
  const allRound = Boolean(values.allRound);

  return `function Demo() {
  const [value, setValue] = useState({ hours: 9, minutes: 30 });
  return (
    <TimePickerField
      size=${JSON.stringify(size)}
      placeholder=${JSON.stringify(placeholder)}${jsxBool(disabled, "disabled")}${jsxBool(error, "error")}${jsxBool(allRound, "allRound")}
      value={value}
      onValueChange={setValue}
      className="w-[160px]"
    />
  );
}

render(<Demo />);`;
}

export const timePickerLiveCode = buildTimePickerCode(
  Object.fromEntries(timePickerKnobs.map((k) => [k.name, k.defaultValue]))
);

export const timePickerWithFormFieldCode = `function Demo() {
  const [value, setValue] = useState({ hours: 14, minutes: 0 });
  return (
    <FormField label="预约时间" className="w-[200px]">
      <TimePickerField value={value} onValueChange={setValue} />
    </FormField>
  );
}

render(<Demo />);`;

export const timePickerCompoundCode = `function Demo() {
  const [value, setValue] = useState({ hours: 17, minutes: 0 });
  return (
    <TimePicker value={value} onValueChange={setValue} defaultOpen>
      <TimePickerTrigger className="w-[160px]" />
      <TimePickerContent>
        <TimePickerPanel />
      </TimePickerContent>
    </TimePicker>
  );
}

render(<Demo />);`;

export const navigationKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "direction",
    label: "direction",
    options: ["vertical", "horizontal"],
    defaultValue: "vertical",
  },
  {
    kind: "select",
    name: "background",
    label: "background",
    options: ["none", "default"],
    defaultValue: "default",
  },
  { kind: "boolean", name: "dividingLine", label: "dividingLine", defaultValue: false },
];

export function buildNavigationCode(values: KnobValues): string {
  const direction = String(values.direction ?? "vertical");
  const background = String(values.background ?? "default");
  const dividingLine = Boolean(values.dividingLine);
  const layoutClass =
    direction === "vertical" ? "w-[260px]" : "w-full max-w-[1076px]";
  const ariaLabel = direction === "vertical" ? "Sidebar" : "Top bar";

  const verticalItems = `    <NavigationBrand>
      <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
    </NavigationBrand>
    <NavigationGroup>
      <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>
        Overview
      </NavigationItem>
      <NavigationItemGroup>
        <NavigationItem itemType="child" active>
          Active child
        </NavigationItem>
        <NavigationItem itemType="child">Child item</NavigationItem>
      </NavigationItemGroup>
      <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
    </NavigationGroup>
    <NavigationActions>
      <Button mode="noBackgroundCustom" size="regular" leftIcon={<GeneralCollapseSidebar aria-hidden />}>
        Collapse
      </Button>
    </NavigationActions>`;

  const horizontalItems = `    <NavigationBrand>
      <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
    </NavigationBrand>
    <NavigationGroup>
      <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>
        Overview
      </NavigationItem>
      <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
      <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Billing</NavigationItem>
    </NavigationGroup>
    <NavigationActions>
      <NavigationActionsSlot>
        <Button
          mode="noBackgroundCustom"
          size="regular"
          iconOnly
          aria-label="Settings"
          leftIcon={<GeneralSetting aria-hidden />}
        />
      </NavigationActionsSlot>
    </NavigationActions>`;

  const children = direction === "vertical" ? verticalItems : horizontalItems;

  return `render(
  <Navigation
    direction=${JSON.stringify(direction)}
    background=${JSON.stringify(background)}${jsxBool(dividingLine, "dividingLine")}
    className=${JSON.stringify(layoutClass)}
    aria-label=${JSON.stringify(ariaLabel)}
  >
${children}
  </Navigation>
);`;
}

export const navigationLiveCode = buildNavigationCode(
  Object.fromEntries(navigationKnobs.map((k) => [k.name, k.defaultValue]))
);

export const navigationItemStatesCode = `render(
  <div className="flex w-[280px] flex-col gap-3">
    <NavigationItem
      leftIcon={<GeneralSetting aria-hidden />}
      rightIcon={<DirectionArrowDownLight aria-hidden />}
    >
      Default tab item
    </NavigationItem>
    <NavigationItem
      active
      leftIcon={<GeneralSetting aria-hidden />}
      rightIcon={<DirectionArrowDownLight aria-hidden />}
    >
      Active tab item
    </NavigationItem>
    <NavigationItem itemType="child">Default child item</NavigationItem>
    <NavigationItem itemType="child" active>
      Active child item
    </NavigationItem>
  </div>
);`;

export const navigationVerticalVariantsCode = `render(
  <div className="flex flex-wrap gap-4">
    <Navigation direction="vertical" background="none" className="h-[420px] w-[260px]" aria-label="V none">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="vertical" background="default" className="h-[420px] w-[260px]" aria-label="V default">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="vertical" background="none" dividingLine className="h-[420px] w-[260px]" aria-label="V none divider">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="vertical" background="default" dividingLine className="h-[420px] w-[260px]" aria-label="V default divider">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
      </NavigationGroup>
    </Navigation>
  </div>
);`;

export const navigationHorizontalVariantsCode = `render(
  <div className="flex flex-col gap-4">
    <Navigation direction="horizontal" background="none" className="max-w-[1076px]" aria-label="H none">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Billing</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="horizontal" background="default" className="max-w-[1076px]" aria-label="H default">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Billing</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="horizontal" background="none" dividingLine className="max-w-[1076px]" aria-label="H none divider">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Billing</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="horizontal" background="default" dividingLine className="max-w-[1076px]" aria-label="H default divider">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Billing</NavigationItem>
      </NavigationGroup>
    </Navigation>
  </div>
);`;
