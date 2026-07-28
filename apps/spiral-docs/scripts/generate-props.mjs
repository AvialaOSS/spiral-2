import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "react-docgen-typescript";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const uiRoot = path.resolve(dirname, "../../../packages/ui/src");

const parser = ts.withDefaultConfig({
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  propFilter: (prop) => {
    if (prop.parent?.fileName.includes("node_modules")) return false;
    if (prop.name.startsWith("aria-")) return false;
    return true;
  },
});

const components = [
  { key: "Button", file: "components/button.tsx", exportName: "Button" },
  { key: "Input", file: "components/input.tsx", exportName: "Input" },
  { key: "Select", file: "components/select.tsx", exportName: "Select" },
  {
    key: "SegmentatorGroup",
    file: "components/segmentator.tsx",
    exportName: "SegmentatorGroup",
  },
  {
    key: "ThemeProvider",
    file: "theme/theme-provider.tsx",
    exportName: "ThemeProvider",
  },
  { key: "Alert", file: "components/alert.tsx", exportName: "Alert" },
  { key: "Feedback", file: "components/feedback.tsx", exportName: "Feedback" },
  {
    key: "DatePickerField",
    file: "components/date-picker/date-picker.tsx",
    exportName: "DatePickerField",
  },
  {
    key: "TimePickerField",
    file: "components/time-picker/time-picker.tsx",
    exportName: "TimePickerField",
  },
  { key: "Switch", file: "components/switch.tsx", exportName: "Switch" },
  { key: "Link", file: "components/link.tsx", exportName: "Link" },
  { key: "Textarea", file: "components/textarea.tsx", exportName: "Textarea" },
  { key: "Checkbox", file: "components/checkbox.tsx", exportName: "Checkbox" },
  {
    key: "RadioGroup",
    file: "components/radio-group.tsx",
    exportName: "RadioGroup",
  },
  {
    key: "CascaderField",
    file: "components/cascader.tsx",
    exportName: "CascaderField",
  },
  {
    key: "ColorPicker",
    file: "components/color-picker/color-picker.tsx",
    exportName: "ColorPicker",
  },
  { key: "Navigation", file: "components/navigation.tsx", exportName: "Navigation" },
  { key: "List", file: "components/list.tsx", exportName: "List" },
  { key: "Typography", file: "components/typography.tsx", exportName: "Typography" },
  { key: "Typeface", file: "components/typeface.tsx", exportName: "Typeface" },
  { key: "FormField", file: "components/form-field.tsx", exportName: "FormField" },
  { key: "Anchor", file: "components/anchor.tsx", exportName: "Anchor" },
  { key: "Popover", file: "components/popover.tsx", exportName: "Popover" },
  { key: "Modal", file: "components/modal.tsx", exportName: "Modal" },
  { key: "Tooltip", file: "components/tooltip.tsx", exportName: "Tooltip" },
  { key: "Loading", file: "components/loading.tsx", exportName: "Loading" },
  { key: "Badge", file: "components/badge.tsx", exportName: "Badge" },
  { key: "Avatar", file: "components/avatar.tsx", exportName: "Avatar" },
  { key: "Tag", file: "components/tag.tsx", exportName: "Tag" },
  { key: "Progress", file: "components/progress.tsx", exportName: "Progress" },
  { key: "Scroll", file: "components/scroll.tsx", exportName: "Scroll" },
  { key: "Slider", file: "components/slider.tsx", exportName: "Slider" },
  { key: "Upload", file: "components/upload.tsx", exportName: "Upload" },
  { key: "ScrollPicker", file: "components/scroll-picker.tsx", exportName: "ScrollPicker" },
  { key: "Breadcrumb", file: "components/breadcrumb.tsx", exportName: "Breadcrumb" },
  { key: "Pagehead", file: "components/pagehead.tsx", exportName: "Pagehead" },
  { key: "Steps", file: "components/steps.tsx", exportName: "Steps" },
  { key: "Pagination", file: "components/pagination.tsx", exportName: "Pagination" },
  { key: "Card", file: "components/card.tsx", exportName: "Card" },
  { key: "Table", file: "components/table.tsx", exportName: "Table" },
];

const registry = {};

for (const entry of components) {
  const filePath = path.join(uiRoot, entry.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip missing ${filePath}`);
    continue;
  }

  const docs = parser.parse(filePath);
  const match =
    docs.find((doc) => doc.displayName === entry.exportName) ??
    docs.find((doc) => doc.displayName?.includes(entry.exportName)) ??
    docs[0];

  if (!match) {
    console.warn(`No docgen match for ${entry.key}`);
    continue;
  }

  registry[entry.key] = {
    displayName: match.displayName,
    description: match.description ?? "",
    props: Object.values(match.props ?? {}).map((prop) => ({
      name: prop.name,
      type: prop.type?.name ?? "unknown",
      defaultValue: prop.defaultValue?.value,
      required: prop.required,
      description: prop.description,
    })),
  };
}

const outDir = path.resolve(dirname, "../src/generated");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "props.json"), `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Wrote ${Object.keys(registry).length} component prop docs to src/generated/props.json`);
