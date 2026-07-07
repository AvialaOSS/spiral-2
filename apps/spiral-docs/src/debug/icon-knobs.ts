import {
  DEFAULT_ICON_MODE,
  DEFAULT_ICON_THICKNESS,
  type IconLevel,
  type IconMode,
  type IconThickness,
} from "@aviala-design/icons";
import { createElement } from "react";

import type { KnobDef, KnobValues } from "../components/DemoKnobs";
import {
  DEFAULT_ICON_NAME,
  resolveIconComponent,
  resolveIconName,
} from "../demos/demo-icons";

export const ICON_THICKNESS_OPTIONS = ["Light", "Regular", "Medium", "Bold"] as const;
export const ICON_MODE_OPTIONS = ["default", "fill"] as const;
export const ICON_LEVEL_OPTIONS = [
  "display",
  "headline1",
  "headline2",
  "title",
  "subtitle",
  "text",
  "caption",
] as const;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** e.g. role `leftIcon` → showLeftIcon, leftIconName, leftIconThickness… */
export function iconRoleKnobNames(role: string) {
  return {
    show: `show${capitalize(role)}`,
    name: `${role}Name`,
    thickness: `${role}Thickness`,
    mode: `${role}Mode`,
    biggerSize: `${role}BiggerSize`,
    level: `${role}Level`,
  };
}

export function iconRoleKnobs(
  role: string,
  showDefault: boolean,
  iconDefault: string
): KnobDef[] {
  const names = iconRoleKnobNames(role);
  return [
    { kind: "boolean", name: names.show, label: "visible", defaultValue: showDefault },
    { kind: "icon", name: names.name, label: "icon", defaultValue: iconDefault },
    {
      kind: "select",
      name: names.thickness,
      label: "thickness",
      options: [...ICON_THICKNESS_OPTIONS],
      defaultValue: DEFAULT_ICON_THICKNESS,
    },
    {
      kind: "select",
      name: names.mode,
      label: "mode",
      options: [...ICON_MODE_OPTIONS],
      defaultValue: DEFAULT_ICON_MODE,
    },
    { kind: "boolean", name: names.biggerSize, label: "biggerSize", defaultValue: true },
    {
      kind: "select",
      name: names.level,
      label: "level",
      options: [...ICON_LEVEL_OPTIONS],
      defaultValue: "text",
    },
  ];
}

export function applyIconRoleOverride<T extends Record<string, unknown>>(
  state: T,
  value: KnobValues,
  role: string
): T {
  const names = iconRoleKnobNames(role);
  return {
    ...state,
    [names.show]: Boolean(value[names.show]),
    [names.name]: resolveIconName(String(value[names.name] ?? DEFAULT_ICON_NAME)),
    [names.thickness]: String(value[names.thickness] ?? DEFAULT_ICON_THICKNESS) as IconThickness,
    [names.mode]: String(value[names.mode] ?? DEFAULT_ICON_MODE) as IconMode,
    [names.biggerSize]: Boolean(value[names.biggerSize] ?? true),
    [names.level]: String(value[names.level] ?? "text") as IconLevel,
  };
}

export function readIconRoleFromState(
  state: Record<string, unknown>,
  role: string,
  showDefault = true
) {
  const names = iconRoleKnobNames(role);
  return {
    visible: Boolean(state[names.show] ?? showDefault),
    iconName: String(state[names.name] ?? DEFAULT_ICON_NAME),
    thickness: (state[names.thickness] ?? DEFAULT_ICON_THICKNESS) as IconThickness,
    mode: (state[names.mode] ?? DEFAULT_ICON_MODE) as IconMode,
    biggerSize: Boolean(state[names.biggerSize] ?? true),
    level: (state[names.level] ?? "text") as IconLevel,
  };
}

export function renderDebugIcon(
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
