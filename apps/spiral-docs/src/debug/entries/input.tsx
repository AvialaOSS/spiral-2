import { Input, type InputSize } from "@aviala-design/spiral";

import type { KnobValues } from "../../components/DemoKnobs";
import {
  applyIconRoleOverride,
  iconRoleKnobs,
  readIconRoleFromState,
  renderDebugIcon,
} from "../icon-knobs";
import type { DebugComponentEntry } from "../types";

export type InputDebugState = {
  value: string;
  size: InputSize;
  allRound: boolean;
  disabled: boolean;
  error: boolean;
  placeholder: string;
  fullWidth: boolean;
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

const initialState: InputDebugState = {
  value: "",
  size: "regular",
  allRound: false,
  disabled: false,
  error: false,
  placeholder: "Text",
  fullWidth: true,
  showLeftIcon: true,
  leftIconName: "GeneralSetting",
  leftIconThickness: "Light",
  leftIconMode: "default",
  leftIconBiggerSize: true,
  leftIconLevel: "text",
  showRightIcon: true,
  rightIconName: "GeneralSetting",
  rightIconThickness: "Light",
  rightIconMode: "default",
  rightIconBiggerSize: true,
  rightIconLevel: "text",
};

export const inputEntry: DebugComponentEntry<InputDebugState> = {
  id: "input",
  label: "Input",
  description: "Figma Information Collect → BaseInput",
  initialState,
  nodes: [
    {
      debugId: "input",
      label: "Input",
      knobs: [
        {
          kind: "select",
          name: "size",
          label: "size",
          options: ["regular", "big"],
          defaultValue: "regular",
        },
        { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
        { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
        { kind: "boolean", name: "error", label: "error", defaultValue: false },
        { kind: "string", name: "placeholder", label: "placeholder", defaultValue: "Text" },
        { kind: "boolean", name: "fullWidth", label: "fullWidth", defaultValue: true },
        { kind: "string", name: "value", label: "value", defaultValue: "" },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        size: String(value.size ?? "regular") as InputSize,
        allRound: Boolean(value.allRound),
        disabled: Boolean(value.disabled),
        error: Boolean(value.error),
        placeholder: String(value.placeholder ?? "Text"),
        fullWidth: Boolean(value.fullWidth ?? true),
        value: String(value.value ?? ""),
      }),
    },
    {
      debugId: "input.left-icon",
      label: "Left icon",
      parent: "input",
      knobs: iconRoleKnobs("leftIcon", true, "GeneralSetting"),
      description: "Leading icon slot with full icon catalog controls.",
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "leftIcon"),
    },
    {
      debugId: "input.field",
      label: "Field",
      parent: "input",
      knobs: [],
      description: "Native input element — value and placeholder controlled on root Input.",
      applyOverride: (state) => state,
    },
    {
      debugId: "input.right-icon",
      label: "Right icon",
      parent: "input",
      knobs: iconRoleKnobs("rightIcon", true, "GeneralSetting"),
      description: "Trailing icon slot with full icon catalog controls.",
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "rightIcon"),
    },
  ],
  renderPreview: (state) => {
    const left = readIconRoleFromState(state, "leftIcon", true);
    const right = readIconRoleFromState(state, "rightIcon", true);

    return (
      <Input
        className="max-w-sm"
        size={state.size}
        allRound={state.allRound}
        disabled={state.disabled}
        error={state.error}
        placeholder={state.placeholder}
        fullWidth={state.fullWidth}
        value={state.value}
        onChange={() => undefined}
        leftIcon={renderDebugIcon(
          left.visible,
          left.iconName,
          left.thickness,
          left.mode,
          left.biggerSize,
          left.level
        )}
        rightIcon={renderDebugIcon(
          right.visible,
          right.iconName,
          right.thickness,
          right.mode,
          right.biggerSize,
          right.level
        )}
      />
    );
  },
};
