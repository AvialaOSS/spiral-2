import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "react-docgen-typescript";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const uiRoot = path.resolve(dirname, "../src");

const parser = ts.withDefaultConfig({
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => {
    if (prop.parent?.fileName.includes("node_modules")) return false;
    if (prop.name.startsWith("aria-")) return false;
    return true;
  },
});

/**
 * @typedef {{ exportName: string, key?: string, file?: string }} PartSpec
 * @typedef {{
 *   key: string,
 *   file: string,
 *   exportName: string,
 *   parts?: PartSpec[],
 * }} ComponentSpec
 */

/** @type {ComponentSpec[]} */
const components = [
  { key: "Button", file: "components/button.tsx", exportName: "Button" },
  { key: "Input", file: "components/input.tsx", exportName: "Input" },
  {
    key: "Select",
    file: "components/select.tsx",
    exportName: "Select",
    parts: [
      { exportName: "SelectTrigger" },
      { exportName: "SelectContent" },
      { exportName: "SelectItem" },
      { exportName: "SelectItemGroup" },
      { exportName: "SelectItemPeople" },
      { exportName: "SelectSubItem" },
      { exportName: "SelectValue" },
    ],
  },
  {
    key: "SegmentatorGroup",
    file: "components/segmentator.tsx",
    exportName: "SegmentatorGroup",
    parts: [{ exportName: "SegmentatorItem" }],
  },
  {
    key: "ThemeProvider",
    file: "theme/theme-provider.tsx",
    exportName: "ThemeProvider",
  },
  {
    key: "LocaleProvider",
    file: "locale/locale-provider.tsx",
    exportName: "LocaleProvider",
  },
  {
    key: "ConfigProvider",
    file: "config/config-provider.tsx",
    exportName: "ConfigProvider",
  },
  { key: "Alert", file: "components/alert.tsx", exportName: "Alert" },
  { key: "Feedback", file: "components/feedback.tsx", exportName: "Feedback" },
  {
    key: "DatePickerField",
    file: "components/date-picker/date-picker.tsx",
    exportName: "DatePickerField",
    parts: [
      { exportName: "DatePicker" },
      { exportName: "DatePickerTrigger" },
      { exportName: "DatePickerContent" },
      { exportName: "DatePickerCalendar" },
    ],
  },
  {
    key: "TimePickerField",
    file: "components/time-picker/time-picker.tsx",
    exportName: "TimePickerField",
    parts: [
      { exportName: "TimePicker" },
      { exportName: "TimePickerTrigger" },
      { exportName: "TimePickerContent" },
      { exportName: "TimePickerPanel" },
      {
        exportName: "TimePickerWheels",
        file: "components/time-picker/time-picker-wheels.tsx",
      },
    ],
  },
  { key: "Switch", file: "components/switch.tsx", exportName: "Switch" },
  { key: "Link", file: "components/link.tsx", exportName: "Link" },
  { key: "Textarea", file: "components/textarea.tsx", exportName: "Textarea" },
  {
    key: "Checkbox",
    file: "components/checkbox.tsx",
    exportName: "Checkbox",
    parts: [{ exportName: "CheckboxGroup" }, { exportName: "CheckboxInput" }],
  },
  {
    key: "RadioGroup",
    file: "components/radio-group.tsx",
    exportName: "RadioGroup",
    parts: [{ exportName: "RadioGroupItem" }, { exportName: "RadioInput" }],
  },
  {
    key: "CascaderField",
    file: "components/cascader.tsx",
    exportName: "CascaderField",
    parts: [
      { exportName: "Cascader" },
      { exportName: "CascaderTrigger" },
      { exportName: "CascaderContent" },
      { exportName: "CascaderMenu" },
      { exportName: "CascaderColumn" },
      { exportName: "CascaderItem" },
      { exportName: "CascaderItemGroup" },
      { exportName: "CascaderOptionsMenu" },
    ],
  },
  {
    key: "ColorPicker",
    file: "components/color-picker/color-picker.tsx",
    exportName: "ColorPicker",
    parts: [
      { exportName: "ColorPickerTrigger" },
      { exportName: "ColorPickerContent" },
      {
        exportName: "ColorPickerPanel",
        file: "components/color-picker/color-picker-panel.tsx",
      },
      {
        exportName: "ColorPickButton",
        file: "components/color-picker/color-pick-button.tsx",
      },
      {
        exportName: "ColorPickerArea",
        file: "components/color-picker/color-picker-area.tsx",
      },
      {
        exportName: "ColorPickerSlider",
        file: "components/color-picker/color-picker-slider.tsx",
      },
      {
        exportName: "ColorPickerInputs",
        file: "components/color-picker/color-picker-inputs.tsx",
      },
      {
        exportName: "ColorPickerPresets",
        file: "components/color-picker/color-picker-presets.tsx",
      },
    ],
  },
  {
    key: "Navigation",
    file: "components/navigation.tsx",
    exportName: "Navigation",
    parts: [
      { exportName: "NavigationBrand" },
      { exportName: "NavigationBrandTitle" },
      { exportName: "NavigationSection" },
      { exportName: "NavigationGroup" },
      { exportName: "NavigationItemGroup" },
      { exportName: "NavigationItem" },
      { exportName: "NavigationItemMenu" },
      { exportName: "NavigationItemMenuTrigger" },
      { exportName: "NavigationItemMenuContent" },
      { exportName: "NavigationItemMenuItem" },
      { exportName: "NavigationActions" },
      { exportName: "NavigationActionsSlot" },
    ],
  },
  {
    key: "List",
    file: "components/list.tsx",
    exportName: "List",
    parts: [
      { exportName: "ListTitle" },
      { exportName: "ListGroup" },
      { exportName: "ListItem" },
      { exportName: "ListItemGroup" },
      { exportName: "ListDivider" },
      { exportName: "ListSeparator" },
    ],
  },
  { key: "Typography", file: "components/typography.tsx", exportName: "Typography" },
  {
    key: "Typeface",
    file: "components/typeface.tsx",
    exportName: "Typeface",
    parts: [{ exportName: "TypefacePair" }],
  },
  { key: "FormField", file: "components/form-field.tsx", exportName: "FormField" },
  {
    key: "Anchor",
    file: "components/anchor.tsx",
    exportName: "Anchor",
    parts: [{ exportName: "AnchorItem" }],
  },
  {
    key: "Popover",
    file: "components/popover.tsx",
    exportName: "Popover",
    parts: [
      { exportName: "PopoverTrigger" },
      { exportName: "PopoverContent" },
      { exportName: "PopoverAnchor" },
    ],
  },
  {
    key: "Modal",
    file: "components/modal.tsx",
    exportName: "Modal",
    parts: [
      { exportName: "ModalTrigger" },
      { exportName: "ModalOverlay" },
      { exportName: "ModalContent" },
      { exportName: "ModalHeader" },
      { exportName: "ModalHeaderText" },
      { exportName: "ModalTitle" },
      { exportName: "ModalDescription" },
      { exportName: "ModalBody" },
      { exportName: "ModalFooter" },
      { exportName: "ModalClose" },
    ],
  },
  {
    key: "Tooltip",
    file: "components/tooltip.tsx",
    exportName: "Tooltip",
    parts: [
      { exportName: "TooltipProvider" },
      { exportName: "TooltipTrigger" },
      { exportName: "TooltipContent" },
    ],
  },
  {
    key: "ResponsiveTooltip",
    file: "components/responsive-tooltip.tsx",
    exportName: "ResponsiveTooltip",
  },
  { key: "Loading", file: "components/loading.tsx", exportName: "Loading" },
  { key: "Badge", file: "components/badge.tsx", exportName: "Badge" },
  { key: "Avatar", file: "components/avatar.tsx", exportName: "Avatar" },
  {
    key: "Tag",
    file: "components/tag.tsx",
    exportName: "Tag",
    parts: [{ exportName: "TagClose" }],
  },
  { key: "Progress", file: "components/progress.tsx", exportName: "Progress" },
  { key: "Scroll", file: "components/scroll.tsx", exportName: "Scroll" },
  { key: "Slider", file: "components/slider.tsx", exportName: "Slider" },
  { key: "Upload", file: "components/upload.tsx", exportName: "Upload" },
  { key: "Video", file: "components/video/video.tsx", exportName: "Video" },
  {
    key: "ScrollPicker",
    file: "components/scroll-picker.tsx",
    exportName: "ScrollPicker",
    parts: [{ exportName: "ScrollPickerColumn" }, { exportName: "ScrollPickerItem" }],
  },
  {
    key: "Breadcrumb",
    file: "components/breadcrumb.tsx",
    exportName: "Breadcrumb",
    parts: [
      { exportName: "BreadcrumbItem" },
      { exportName: "BreadcrumbSeparator" },
      { exportName: "BreadcrumbEllipsis" },
      { exportName: "BreadcrumbEllipsisItem" },
    ],
  },
  { key: "Pagehead", file: "components/pagehead.tsx", exportName: "Pagehead" },
  {
    key: "Steps",
    file: "components/steps.tsx",
    exportName: "Steps",
    parts: [{ exportName: "StepsItem" }, { exportName: "StepsIcon" }],
  },
  { key: "Pagination", file: "components/pagination.tsx", exportName: "Pagination" },
  {
    key: "Card",
    file: "components/card.tsx",
    exportName: "Card",
    parts: [
      { exportName: "CardHead" },
      { exportName: "CardBody" },
      { exportName: "CardBottom" },
    ],
  },
  {
    key: "Table",
    file: "components/table.tsx",
    exportName: "Table",
    parts: [
      { exportName: "TableRow" },
      { exportName: "TableHead" },
      { exportName: "TableCell" },
    ],
  },
];

/**
 * @param {unknown} raw
 * @returns {string | undefined}
 */
function literalFromDocgenValue(raw) {
  if (raw == null) return undefined;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed.slice(1, -1);
    }
    return trimmed;
  }
  if (typeof raw === "object" && raw !== null && "value" in raw) {
    return literalFromDocgenValue(/** @type {{ value: unknown }} */ (raw).value);
  }
  return String(raw);
}

/**
 * @param {{ name?: string, raw?: string, value?: unknown }} [type]
 * @returns {{ type: string, values?: string[] }}
 */
function formatPropType(type) {
  if (!type) return { type: "unknown" };

  const values = Array.isArray(type.value)
    ? type.value
        .map((entry) => literalFromDocgenValue(entry))
        .filter((value) => typeof value === "string" && value.length > 0)
    : [];

  // Deduplicate while preserving order (legacy unions can repeat).
  const unique = [...new Set(values)];

  if (unique.length > 0) {
    return {
      type: unique.map((value) => JSON.stringify(value)).join(" | "),
      values: unique,
    };
  }

  if (type.raw && type.raw !== "enum" && type.name === "enum") {
    return { type: type.raw };
  }

  return { type: type.name ?? type.raw ?? "unknown" };
}

/**
 * @param {import('react-docgen-typescript').ComponentDoc} match
 */
function serializeComponentDoc(match) {
  return {
    displayName: match.displayName,
    description: match.description ?? "",
    props: Object.values(match.props ?? {}).map((prop) => {
      const formatted = formatPropType(prop.type);
      return {
        name: prop.name,
        type: formatted.type,
        ...(formatted.values ? { values: formatted.values } : {}),
        defaultValue: prop.defaultValue?.value,
        required: prop.required,
        description: prop.description,
      };
    }),
  };
}

/**
 * @param {import('react-docgen-typescript').ComponentDoc[]} docs
 * @param {string} exportName
 */
function findDoc(docs, exportName) {
  return (
    docs.find((doc) => doc.displayName === exportName) ??
    docs.find((doc) => doc.displayName?.includes(exportName))
  );
}

const parseCache = new Map();

/**
 * @param {string} filePath
 */
function parseFile(filePath) {
  if (parseCache.has(filePath)) return parseCache.get(filePath);
  const docs = parser.parse(filePath);
  parseCache.set(filePath, docs);
  return docs;
}

const registry = {};

for (const entry of components) {
  const filePath = path.join(uiRoot, entry.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip missing ${filePath}`);
    continue;
  }

  const docs = parseFile(filePath);
  const match = findDoc(docs, entry.exportName) ?? docs[0];

  if (!match) {
    console.warn(`No docgen match for ${entry.key}`);
    continue;
  }

  const serialized = serializeComponentDoc(match);
  const parts = [];

  for (const part of entry.parts ?? []) {
    const partFilePath = path.join(uiRoot, part.file ?? entry.file);
    if (!fs.existsSync(partFilePath)) {
      console.warn(`Skip missing part file ${partFilePath}`);
      continue;
    }
    const partDocs = parseFile(partFilePath);
    const partMatch = findDoc(partDocs, part.exportName);
    if (!partMatch) {
      console.warn(`No docgen match for part ${entry.key} → ${part.exportName}`);
      continue;
    }
    const partDoc = serializeComponentDoc(partMatch);
    if (partDoc.props.length === 0 && !partDoc.description) {
      continue;
    }
    parts.push(partDoc);
  }

  registry[entry.key] = {
    ...serialized,
    ...(parts.length > 0 ? { parts } : {}),
  };
}

const outDir = path.resolve(dirname, "../dist");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "props.json"), `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Wrote ${Object.keys(registry).length} component prop docs to dist/props.json`);
