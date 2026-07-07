import { Textarea, type TextareaSize } from "@aviala-design/spiral";

import type { KnobValues } from "../../components/DemoKnobs";
import {
  applyIconRoleOverride,
  iconRoleKnobs,
  readIconRoleFromState,
  renderDebugIcon,
} from "../icon-knobs";
import { spiralDebugProps, type DebugComponentEntry } from "../types";

export type TextareaDebugState = {
  value: string;
  size: TextareaSize;
  disabled: boolean;
  error: boolean;
  placeholder: string;
  showController: boolean;
  maxLength: number;
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

const initialState: TextareaDebugState = {
  value: "",
  size: "regular",
  disabled: false,
  error: false,
  placeholder: "Text",
  showController: true,
  maxLength: 200,
  showLeftIcon: false,
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

export const textareaEntry: DebugComponentEntry<TextareaDebugState> = {
  id: "textarea",
  label: "Textarea",
  description: "Figma Information Collect → TextareaInput",
  initialState,
  nodes: [
    {
      debugId: "textarea",
      label: "Textarea",
      knobs: [
        {
          kind: "select",
          name: "size",
          label: "size",
          options: ["regular", "big"],
          defaultValue: "regular",
        },
        { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
        { kind: "boolean", name: "error", label: "error", defaultValue: false },
        { kind: "string", name: "placeholder", label: "placeholder", defaultValue: "Text" },
        { kind: "boolean", name: "showController", label: "showController", defaultValue: true },
        { kind: "string", name: "maxLength", label: "maxLength", defaultValue: "200" },
        { kind: "string", name: "value", label: "value", defaultValue: "" },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        size: String(value.size ?? "regular") as TextareaSize,
        disabled: Boolean(value.disabled),
        error: Boolean(value.error),
        placeholder: String(value.placeholder ?? "Text"),
        showController: Boolean(value.showController),
        maxLength: Number.parseInt(String(value.maxLength ?? "200"), 10) || 200,
        value: String(value.value ?? ""),
      }),
    },
    {
      debugId: "textarea.left-icon",
      label: "Left icon",
      parent: "textarea",
      knobs: iconRoleKnobs("leftIcon", false, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "leftIcon"),
    },
    {
      debugId: "textarea.field",
      label: "Field",
      parent: "textarea",
      knobs: [],
      applyOverride: (state) => state,
    },
    {
      debugId: "textarea.right-icon",
      label: "Right icon",
      parent: "textarea",
      knobs: iconRoleKnobs("rightIcon", false, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "rightIcon"),
    },
    {
      debugId: "textarea.controller",
      label: "Controller",
      parent: "textarea",
      knobs: [],
      description: "Character counter and resize affordance.",
      applyOverride: (state) => state,
    },
  ],
  renderPreview: (state) => {
    const left = readIconRoleFromState(state, "leftIcon", false);
    const right = readIconRoleFromState(state, "rightIcon", false);

    return (
      <div {...spiralDebugProps("textarea")}>
        <Textarea
          className="max-w-sm"
          size={state.size}
          disabled={state.disabled}
          error={state.error}
          placeholder={state.placeholder}
          showController={state.showController}
          maxLength={state.maxLength}
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
      </div>
    );
  },
};
