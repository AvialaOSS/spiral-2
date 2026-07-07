import {
  CascaderField,
  type CascaderItemFunction,
  type CascaderSize,
} from "@aviala-design/spiral";

import type { KnobValues } from "../../components/DemoKnobs";
import {
  applyIconRoleOverride,
  iconRoleKnobs,
  readIconRoleFromState,
  renderDebugIcon,
} from "../icon-knobs";
import type { DebugComponentEntry } from "../types";

const DEMO_OPTIONS = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      { value: "hangzhou", label: "Hangzhou", children: [{ value: "xihu", label: "West Lake" }] },
      { value: "ningbo", label: "Ningbo" },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      { value: "nanjing", label: "Nanjing" },
      { value: "suzhou", label: "Suzhou" },
    ],
  },
];

export type CascaderDebugState = {
  value: string[];
  defaultOpen: boolean;
  disabled: boolean;
  triggerSize: CascaderSize;
  triggerAllRound: boolean;
  triggerPlaceholder: string;
  triggerError: boolean;
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
  showExpandIcon: boolean;
  expandIconName: string;
  expandIconThickness: string;
  expandIconMode: string;
  expandIconBiggerSize: boolean;
  expandIconLevel: string;
  itemFunction: CascaderItemFunction;
};

const initialState: CascaderDebugState = {
  value: [],
  defaultOpen: true,
  disabled: false,
  triggerSize: "regular",
  triggerAllRound: false,
  triggerPlaceholder: "Text",
  triggerError: false,
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
  showExpandIcon: true,
  expandIconName: "DirectionArrowDownLight",
  expandIconThickness: "Light",
  expandIconMode: "default",
  expandIconBiggerSize: true,
  expandIconLevel: "text",
  itemFunction: "simple",
};

export const cascaderEntry: DebugComponentEntry<CascaderDebugState> = {
  id: "cascader",
  label: "Cascader",
  description: "Figma Information Collect → Cascader Input",
  initialState,
  nodes: [
    {
      debugId: "cascader",
      label: "Cascader",
      knobs: [
        { kind: "boolean", name: "defaultOpen", label: "defaultOpen", defaultValue: true },
        { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        defaultOpen: Boolean(value.defaultOpen),
        disabled: Boolean(value.disabled),
      }),
    },
    {
      debugId: "cascader.trigger",
      label: "Trigger",
      parent: "cascader",
      knobs: [
        {
          kind: "select",
          name: "size",
          label: "size",
          options: ["regular", "big"],
          defaultValue: "regular",
        },
        { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
        { kind: "string", name: "placeholder", label: "placeholder", defaultValue: "Text" },
        { kind: "boolean", name: "error", label: "error", defaultValue: false },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        triggerSize: String(value.size ?? "regular") as CascaderSize,
        triggerAllRound: Boolean(value.allRound),
        triggerPlaceholder: String(value.placeholder ?? "Text"),
        triggerError: Boolean(value.error),
      }),
    },
    {
      debugId: "cascader.trigger.icon-left",
      label: "Left icon",
      parent: "cascader.trigger",
      knobs: iconRoleKnobs("leftIcon", true, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "leftIcon"),
    },
    {
      debugId: "cascader.trigger.value",
      label: "Value",
      parent: "cascader.trigger",
      knobs: [],
      applyOverride: (state) => state,
    },
    {
      debugId: "cascader.trigger.icon-right",
      label: "Right icon",
      parent: "cascader.trigger",
      knobs: iconRoleKnobs("rightIcon", false, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "rightIcon"),
    },
    {
      debugId: "cascader.trigger.expand",
      label: "Expand icon",
      parent: "cascader.trigger",
      knobs: iconRoleKnobs("expandIcon", true, "DirectionArrowDownLight"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "expandIcon"),
    },
    {
      debugId: "cascader.content",
      label: "Content",
      parent: "cascader",
      knobs: [],
      applyOverride: (state) => state,
    },
    {
      debugId: "cascader.content.item",
      label: "Item",
      parent: "cascader.content",
      knobs: [
        {
          kind: "select",
          name: "itemFunction",
          label: "itemFunction",
          options: ["simple", "checkbox", "form-checkbox", "radio", "form-radio", "search", "custom"],
          defaultValue: "simple",
        },
      ],
      description: "Menu item function variant — options-driven menu in preview.",
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        itemFunction: String(value.itemFunction ?? "simple") as CascaderItemFunction,
      }),
    },
  ],
  renderPreview: (state) => {
    const left = readIconRoleFromState(state, "leftIcon", true);
    const right = readIconRoleFromState(state, "rightIcon", false);
    const expand = readIconRoleFromState(state, "expandIcon", true);

    return (
      <CascaderField
        options={DEMO_OPTIONS}
        value={state.value}
        defaultOpen={state.defaultOpen}
        disabled={state.disabled}
        size={state.triggerSize}
        allRound={state.triggerAllRound}
        placeholder={state.triggerPlaceholder}
        error={state.triggerError}
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
        expandIcon={
          expand.visible
            ? renderDebugIcon(
                true,
                expand.iconName,
                expand.thickness,
                expand.mode,
                expand.biggerSize,
                expand.level
              )
            : undefined
        }
        onValueChange={() => undefined}
        className="w-[290px]"
      />
    );
  },
};
