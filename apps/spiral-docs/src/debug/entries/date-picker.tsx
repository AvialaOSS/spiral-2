import { DatePickerField, type DatePickerSize } from "@aviala-design/spiral";

import type { KnobValues } from "../../components/DemoKnobs";
import {
  applyIconRoleOverride,
  iconRoleKnobs,
  readIconRoleFromState,
  renderDebugIcon,
} from "../icon-knobs";
import { spiralDebugProps, type DebugComponentEntry } from "../types";

export type DatePickerDebugState = {
  defaultOpen: boolean;
  disabled: boolean;
  size: DatePickerSize;
  allRound: boolean;
  placeholder: string;
  error: boolean;
  enableTime: boolean;
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

const initialState: DatePickerDebugState = {
  defaultOpen: true,
  disabled: false,
  size: "regular",
  allRound: false,
  placeholder: "YYYY/MM/DD",
  error: false,
  enableTime: false,
  showLeftIcon: true,
  leftIconName: "TimeAndDateDate",
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

export const datePickerEntry: DebugComponentEntry<DatePickerDebugState> = {
  id: "date-picker",
  label: "DatePicker",
  description: "Figma Information Collect → DatePicker",
  initialState,
  nodes: [
    {
      debugId: "date-picker",
      label: "DatePicker",
      knobs: [
        { kind: "boolean", name: "defaultOpen", label: "defaultOpen", defaultValue: true },
        { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
        { kind: "boolean", name: "enableTime", label: "enableTime", defaultValue: false },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        defaultOpen: Boolean(value.defaultOpen),
        disabled: Boolean(value.disabled),
        enableTime: Boolean(value.enableTime),
      }),
    },
    {
      debugId: "date-picker.trigger",
      label: "Trigger",
      parent: "date-picker",
      knobs: [
        {
          kind: "select",
          name: "size",
          label: "size",
          options: ["regular", "big"],
          defaultValue: "regular",
        },
        { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
        { kind: "string", name: "placeholder", label: "placeholder", defaultValue: "YYYY/MM/DD" },
        { kind: "boolean", name: "error", label: "error", defaultValue: false },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        size: String(value.size ?? "regular") as DatePickerSize,
        allRound: Boolean(value.allRound),
        placeholder: String(value.placeholder ?? "YYYY/MM/DD"),
        error: Boolean(value.error),
      }),
    },
    {
      debugId: "date-picker.trigger.icon-left",
      label: "Left icon",
      parent: "date-picker.trigger",
      knobs: iconRoleKnobs("leftIcon", true, "TimeAndDateDate"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "leftIcon"),
    },
    {
      debugId: "date-picker.trigger.value",
      label: "Value",
      parent: "date-picker.trigger",
      knobs: [],
      applyOverride: (state) => state,
    },
    {
      debugId: "date-picker.trigger.icon-right",
      label: "Right icon",
      parent: "date-picker.trigger",
      knobs: iconRoleKnobs("rightIcon", false, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "rightIcon"),
    },
    {
      debugId: "date-picker.content",
      label: "Content",
      parent: "date-picker",
      knobs: [],
      description: "Calendar popover — open via defaultOpen or trigger click.",
      applyOverride: (state) => state,
    },
  ],
  renderPreview: (state) => {
    const left = readIconRoleFromState(state, "leftIcon", true);
    const right = readIconRoleFromState(state, "rightIcon", false);

    return (
      <div {...spiralDebugProps("date-picker")}>
        <DatePickerField
          key={`${state.defaultOpen}-${state.enableTime}`}
          mode="single"
          defaultOpen={state.defaultOpen}
          disabled={state.disabled}
          size={state.size}
          allRound={state.allRound}
          placeholder={state.placeholder}
          error={state.error}
          enableTime={state.enableTime}
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
          className="w-[200px]"
        />
      </div>
    );
  },
};
