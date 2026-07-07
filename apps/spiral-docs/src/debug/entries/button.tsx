import {
  DEFAULT_ICON_MODE,
  DEFAULT_ICON_THICKNESS,
  type IconLevel,
  type IconMode,
  type IconThickness,
} from "@aviala-design/icons";
import { Button, type ButtonMode, type ButtonSize } from "@aviala-design/spiral";
import { createElement } from "react";

import type { KnobDef, KnobValues } from "../../components/DemoKnobs";
import {
  DEFAULT_ICON_NAME,
  resolveIconComponent,
  resolveIconName,
} from "../../demos/demo-icons";
import type { DebugComponentEntry } from "../types";

export type ButtonDebugState = {
  mode: ButtonMode;
  size: ButtonSize;
  allRound: boolean;
  loading: boolean;
  disabled: boolean;
  iconOnly: boolean;
  label: string;
  showLeftIcon: boolean;
  leftIconName: string;
  leftIconThickness: IconThickness;
  leftIconMode: IconMode;
  leftIconBiggerSize: boolean;
  leftIconLevel: IconLevel;
  showRightIcon: boolean;
  rightIconName: string;
  rightIconThickness: IconThickness;
  rightIconMode: IconMode;
  rightIconBiggerSize: boolean;
  rightIconLevel: IconLevel;
};

const ICON_THICKNESS_OPTIONS = ["Light", "Regular", "Medium", "Bold"] as const;
const ICON_MODE_OPTIONS = ["default", "fill"] as const;
const ICON_LEVEL_OPTIONS = [
  "display",
  "headline1",
  "headline2",
  "title",
  "subtitle",
  "text",
  "caption",
] as const;

function iconSlotKnobs(
  side: "left" | "right",
  showDefault: boolean,
  iconDefault: string
): KnobDef[] {
  const showName = side === "left" ? "showLeftIcon" : "showRightIcon";
  const iconName = side === "left" ? "leftIconName" : "rightIconName";
  const thicknessName = side === "left" ? "leftIconThickness" : "rightIconThickness";
  const modeName = side === "left" ? "leftIconMode" : "rightIconMode";
  const biggerSizeName = side === "left" ? "leftIconBiggerSize" : "rightIconBiggerSize";
  const levelName = side === "left" ? "leftIconLevel" : "rightIconLevel";

  return [
    { kind: "boolean", name: showName, label: "visible", defaultValue: showDefault },
    { kind: "icon", name: iconName, label: "icon", defaultValue: iconDefault },
    {
      kind: "select",
      name: thicknessName,
      label: "thickness",
      options: [...ICON_THICKNESS_OPTIONS],
      defaultValue: DEFAULT_ICON_THICKNESS,
    },
    {
      kind: "select",
      name: modeName,
      label: "mode",
      options: [...ICON_MODE_OPTIONS],
      defaultValue: DEFAULT_ICON_MODE,
    },
    { kind: "boolean", name: biggerSizeName, label: "biggerSize", defaultValue: true },
    {
      kind: "select",
      name: levelName,
      label: "level",
      options: [...ICON_LEVEL_OPTIONS],
      defaultValue: "text",
    },
  ];
}

function applyIconSlotOverride(
  state: ButtonDebugState,
  value: KnobValues,
  side: "left" | "right"
): ButtonDebugState {
  const showName = side === "left" ? "showLeftIcon" : "showRightIcon";
  const iconName = side === "left" ? "leftIconName" : "rightIconName";
  const thicknessName = side === "left" ? "leftIconThickness" : "rightIconThickness";
  const modeName = side === "left" ? "leftIconMode" : "rightIconMode";
  const biggerSizeName = side === "left" ? "leftIconBiggerSize" : "rightIconBiggerSize";
  const levelName = side === "left" ? "leftIconLevel" : "rightIconLevel";

  return {
    ...state,
    [showName]: Boolean(value[showName]),
    [iconName]: resolveIconName(String(value[iconName] ?? DEFAULT_ICON_NAME)),
    [thicknessName]: String(value[thicknessName] ?? DEFAULT_ICON_THICKNESS) as IconThickness,
    [modeName]: String(value[modeName] ?? DEFAULT_ICON_MODE) as IconMode,
    [biggerSizeName]: Boolean(value[biggerSizeName] ?? true),
    [levelName]: String(value[levelName] ?? "text") as IconLevel,
  };
}

function renderSlotIcon(
  visible: boolean,
  iconName: string,
  thickness: IconThickness,
  mode: IconMode,
  biggerSize: boolean,
  level: IconLevel
) {
  if (!visible) return undefined;

  const component = resolveIconComponent(resolveIconName(iconName));
  if (!component) return undefined;

  return createElement(component, {
    "aria-hidden": true,
    thickness,
    mode,
    biggerSize,
    level,
  });
}

const initialState: ButtonDebugState = {
  mode: "primary",
  size: "regular",
  allRound: false,
  loading: false,
  disabled: false,
  iconOnly: false,
  label: "Text",
  showLeftIcon: true,
  leftIconName: DEFAULT_ICON_NAME,
  leftIconThickness: DEFAULT_ICON_THICKNESS,
  leftIconMode: DEFAULT_ICON_MODE,
  leftIconBiggerSize: true,
  leftIconLevel: "text",
  showRightIcon: false,
  rightIconName: DEFAULT_ICON_NAME,
  rightIconThickness: DEFAULT_ICON_THICKNESS,
  rightIconMode: DEFAULT_ICON_MODE,
  rightIconBiggerSize: true,
  rightIconLevel: "text",
};

export const buttonEntry: DebugComponentEntry<ButtonDebugState> = {
  id: "button",
  label: "Button",
  description: "Figma Basic Input → Button",
  initialState,
  nodes: [
    {
      debugId: "button",
      label: "Button",
      knobs: [
        {
          kind: "select",
          name: "mode",
          label: "mode",
          options: [
            "primary",
            "second",
            "default",
            "defaultCustom",
            "noBackground",
            "noBackgroundCustom",
            "destructive",
          ],
          defaultValue: "primary",
        },
        {
          kind: "select",
          name: "size",
          label: "size",
          options: ["tiny", "small", "regular", "big"],
          defaultValue: "regular",
        },
        { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
        { kind: "boolean", name: "loading", label: "loading", defaultValue: false },
        { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
        { kind: "boolean", name: "iconOnly", label: "iconOnly", defaultValue: false },
        { kind: "string", name: "label", label: "children", defaultValue: "Text" },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        mode: String(value.mode ?? "primary") as ButtonMode,
        size: String(value.size ?? "regular") as ButtonSize,
        allRound: Boolean(value.allRound),
        loading: Boolean(value.loading),
        disabled: Boolean(value.disabled),
        iconOnly: Boolean(value.iconOnly),
        label: String(value.label ?? "Text"),
      }),
    },
    {
      debugId: "button.surface",
      label: "Surface",
      parent: "button",
      knobs: [],
      description: "Background fill layer — visible for modes with a surface (not noBackground*).",
      applyOverride: (state) => state,
    },
    {
      debugId: "button.icon-left",
      label: "Left icon",
      parent: "button",
      knobs: iconSlotKnobs("left", true, DEFAULT_ICON_NAME),
      description:
        "Leading icon slot. Preserves level and biggerSize when set on the icon; otherwise Button applies them from button size.",
      applyOverride: (state, value) => applyIconSlotOverride(state, value, "left"),
    },
    {
      debugId: "button.label",
      label: "Label",
      parent: "button",
      knobs: [],
      description: "Typography label — set children on the root Button node.",
      applyOverride: (state) => state,
    },
    {
      debugId: "button.icon-right",
      label: "Right icon",
      parent: "button",
      knobs: iconSlotKnobs("right", false, DEFAULT_ICON_NAME),
      description:
        "Trailing icon slot. Hidden when iconOnly is true. Preserves level and biggerSize when set on the icon; otherwise Button applies them from button size.",
      applyOverride: (state, value) => applyIconSlotOverride(state, value, "right"),
    },
  ],
  renderPreview: (state) => {
    const showLeft = state.iconOnly || state.showLeftIcon;
    const showRight = !state.iconOnly && state.showRightIcon;

    return (
      <Button
        mode={state.mode}
        size={state.size}
        allRound={state.allRound}
        loading={state.loading}
        disabled={state.disabled}
        iconOnly={state.iconOnly}
        leftIcon={renderSlotIcon(
          showLeft,
          state.leftIconName,
          state.leftIconThickness,
          state.leftIconMode,
          state.leftIconBiggerSize,
          state.leftIconLevel
        )}
        rightIcon={renderSlotIcon(
          showRight,
          state.rightIconName,
          state.rightIconThickness,
          state.rightIconMode,
          state.rightIconBiggerSize,
          state.rightIconLevel
        )}
        aria-label={state.iconOnly ? state.label : undefined}
      >
        {state.iconOnly ? undefined : state.label}
      </Button>
    );
  },
};
