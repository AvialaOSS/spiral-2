import { Link, type LinkLevel, type LinkMode } from "@aviala-design/spiral";

import type { KnobValues } from "../../components/DemoKnobs";
import {
  applyIconRoleOverride,
  iconRoleKnobs,
  readIconRoleFromState,
  renderDebugIcon,
} from "../icon-knobs";
import { spiralDebugProps, type DebugComponentEntry } from "../types";

export type LinkDebugState = {
  level: LinkLevel;
  mode: LinkMode;
  iconOnly: boolean;
  disabled: boolean;
  label: string;
  showLeftIcon: boolean;
  leftIconName: string;
  leftIconThickness: string;
  leftIconMode: string;
  leftIconBiggerSize: boolean;
  leftIconLevel: string;
  showRightIcon: boolean;
  rightIconName: string;
  rightIconThickness: string;
  rightIconMode: string;
  rightIconBiggerSize: boolean;
  rightIconLevel: string;
};

const initialState: LinkDebugState = {
  level: "text",
  mode: "noBackground",
  iconOnly: false,
  disabled: false,
  label: "Link text",
  showLeftIcon: true,
  leftIconName: "GeneralSetting",
  leftIconThickness: "Light",
  leftIconMode: "default",
  leftIconBiggerSize: true,
  leftIconLevel: "text",
  showRightIcon: false,
  rightIconName: "GeneralSetting",
  rightIconThickness: "Light",
  rightIconMode: "default",
  rightIconBiggerSize: true,
  rightIconLevel: "text",
};

export const linkEntry: DebugComponentEntry<LinkDebugState> = {
  id: "link",
  label: "Link",
  description: "Figma Basic Input → Link",
  initialState,
  nodes: [
    {
      debugId: "link",
      label: "Link",
      knobs: [
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
        { kind: "boolean", name: "iconOnly", label: "iconOnly", defaultValue: false },
        { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
        { kind: "string", name: "label", label: "children", defaultValue: "Link text" },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        level: String(value.level ?? "text") as LinkLevel,
        mode: String(value.mode ?? "noBackground") as LinkMode,
        iconOnly: Boolean(value.iconOnly),
        disabled: Boolean(value.disabled),
        label: String(value.label ?? "Link text"),
      }),
    },
    {
      debugId: "link.icon-left",
      label: "Left icon",
      parent: "link",
      knobs: iconRoleKnobs("leftIcon", true, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "leftIcon"),
    },
    {
      debugId: "link.label",
      label: "Label",
      parent: "link",
      knobs: [],
      description: "Typography label — set children on the root Link node.",
      applyOverride: (state) => state,
    },
    {
      debugId: "link.icon-right",
      label: "Right icon",
      parent: "link",
      knobs: iconRoleKnobs("rightIcon", false, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "rightIcon"),
    },
  ],
  renderPreview: (state) => {
    const left = readIconRoleFromState(state, "leftIcon", true);
    const right = readIconRoleFromState(state, "rightIcon", false);
    const showLeft = state.iconOnly || left.visible;
    const showRight = !state.iconOnly && right.visible;

    return (
      <div {...spiralDebugProps("link")}>
        <Link
          href="#"
          level={state.level}
          mode={state.mode}
          iconOnly={state.iconOnly}
          disabled={state.disabled}
          onClick={(event) => event.preventDefault()}
          leftIcon={renderDebugIcon(
            showLeft,
            left.iconName,
            left.thickness,
            left.mode,
            left.biggerSize,
            left.level
          )}
          rightIcon={renderDebugIcon(
            showRight,
            right.iconName,
            right.thickness,
            right.mode,
            right.biggerSize,
            right.level
          )}
          aria-label={state.iconOnly ? state.label : undefined}
        >
          {state.iconOnly ? undefined : state.label}
        </Link>
      </div>
    );
  },
};
