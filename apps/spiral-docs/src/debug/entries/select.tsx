import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  type SelectItemFunction,
  type SelectSize,
} from "@aviala-design/spiral";

import type { KnobValues } from "../../components/DemoKnobs";
import {
  applyIconRoleOverride,
  iconRoleKnobs,
  readIconRoleFromState,
  renderDebugIcon,
} from "../icon-knobs";
import { spiralDebugProps, type DebugComponentEntry } from "../types";

export type SelectDebugState = {
  value: string;
  defaultOpen: boolean;
  disabled: boolean;
  triggerSize: SelectSize;
  triggerAllRound: boolean;
  triggerPlaceholder: string;
  triggerError: boolean;
  contentSideOffset: number;
  itemFunction: SelectItemFunction;
  showFunctionIcon: boolean;
  useCustomFunctionIcon: boolean;
  showItemLeftIcon: boolean;
  itemLeftIconName: string;
  itemLeftIconThickness: string;
  itemLeftIconMode: string;
  itemLeftIconBiggerSize: boolean;
  itemLeftIconLevel: string;
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
  itemFunctionIconName: string;
  itemFunctionIconThickness: string;
  itemFunctionIconMode: string;
  itemFunctionIconBiggerSize: boolean;
  itemFunctionIconLevel: string;
};

const initialState: SelectDebugState = {
  value: "a",
  defaultOpen: true,
  disabled: false,
  triggerSize: "regular",
  triggerAllRound: false,
  triggerPlaceholder: "Text",
  triggerError: false,
  contentSideOffset: 8,
  itemFunction: "action",
  showFunctionIcon: true,
  useCustomFunctionIcon: false,
  showItemLeftIcon: true,
  itemLeftIconName: "GeneralSetting",
  itemLeftIconThickness: "Light",
  itemLeftIconMode: "default",
  itemLeftIconBiggerSize: true,
  itemLeftIconLevel: "text",
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
  itemFunctionIconName: "SymbolRight",
  itemFunctionIconThickness: "Light",
  itemFunctionIconMode: "default",
  itemFunctionIconBiggerSize: true,
  itemFunctionIconLevel: "text",
};

function renderItemFromState(state: SelectDebugState, value: string, label: string) {
  const itemLeft = readIconRoleFromState(state, "itemLeftIcon", true);

  return (
    <SelectItem
      key={value}
      value={value}
      itemFunction={state.itemFunction}
      showFunctionIcon={state.showFunctionIcon}
      showLeftIcon={itemLeft.visible}
      leftIcon={renderDebugIcon(
        itemLeft.visible,
        itemLeft.iconName,
        itemLeft.thickness,
        itemLeft.mode,
        itemLeft.biggerSize,
        itemLeft.level
      )}
      icon={
        state.useCustomFunctionIcon
          ? renderDebugIcon(
              true,
              state.itemFunctionIconName,
              state.itemFunctionIconThickness as never,
              state.itemFunctionIconMode as never,
              state.itemFunctionIconBiggerSize,
              state.itemFunctionIconLevel as never
            )
          : undefined
      }
    >
      {label}
    </SelectItem>
  );
}

export const selectEntry: DebugComponentEntry<SelectDebugState> = {
  id: "select",
  label: "Select",
  description: "Figma Information Collect → Select",
  initialState,
  nodes: [
    {
      debugId: "select",
      label: "Select",
      knobs: [
        {
          kind: "select",
          name: "value",
          label: "value",
          options: ["a", "b", "c", "d"],
          defaultValue: "a",
        },
        { kind: "boolean", name: "defaultOpen", label: "defaultOpen", defaultValue: true },
        { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        value: String(value.value ?? "a"),
        defaultOpen: Boolean(value.defaultOpen),
        disabled: Boolean(value.disabled),
      }),
    },
    {
      debugId: "select.trigger",
      label: "Trigger",
      parent: "select",
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
        triggerSize: String(value.size ?? "regular") as SelectSize,
        triggerAllRound: Boolean(value.allRound),
        triggerPlaceholder: String(value.placeholder ?? "Text"),
        triggerError: Boolean(value.error),
      }),
    },
    {
      debugId: "select.trigger.icon-left",
      label: "Left icon",
      parent: "select.trigger",
      knobs: iconRoleKnobs("leftIcon", true, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "leftIcon"),
    },
    {
      debugId: "select.trigger.value",
      label: "Value",
      parent: "select.trigger",
      knobs: [],
      description: "Selected value typography — controlled by root value and placeholder.",
      applyOverride: (state) => state,
    },
    {
      debugId: "select.trigger.icon-right",
      label: "Right icon",
      parent: "select.trigger",
      knobs: iconRoleKnobs("rightIcon", false, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "rightIcon"),
    },
    {
      debugId: "select.trigger.expand",
      label: "Expand icon",
      parent: "select.trigger",
      knobs: iconRoleKnobs("expandIcon", true, "DirectionArrowDownLight"),
      description: "Chevron affordance on the trigger.",
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "expandIcon"),
    },
    {
      debugId: "select.content",
      label: "Content",
      parent: "select",
      knobs: [{ kind: "string", name: "sideOffset", label: "sideOffset", defaultValue: "8" }],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        contentSideOffset: Number.parseInt(String(value.sideOffset ?? "8"), 10) || 8,
      }),
    },
    {
      debugId: "select.content.viewport",
      label: "Viewport",
      parent: "select.content",
      knobs: [],
      description: "Scrollable menu list — item groups rendered inside Viewport.",
      applyOverride: (state) => state,
    },
    {
      debugId: "select.content.item",
      label: "Item",
      parent: "select.content.viewport",
      knobs: [
        {
          kind: "select",
          name: "itemFunction",
          label: "itemFunction",
          options: ["action", "simple", "checkbox", "form-checkbox", "radio", "form-radio"],
          defaultValue: "action",
        },
        { kind: "boolean", name: "showFunctionIcon", label: "showFunctionIcon", defaultValue: true },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        itemFunction: String(value.itemFunction ?? "action") as SelectItemFunction,
        showFunctionIcon: Boolean(value.showFunctionIcon),
      }),
    },
    {
      debugId: "select.content.item.icon-left",
      label: "Item left icon",
      parent: "select.content.item",
      knobs: iconRoleKnobs("itemLeftIcon", true, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "itemLeftIcon"),
    },
    {
      debugId: "select.content.item.function",
      label: "Function icon",
      parent: "select.content.item",
      knobs: [
        { kind: "boolean", name: "useCustomFunctionIcon", label: "custom icon", defaultValue: false },
        ...iconRoleKnobs("itemFunctionIcon", true, "SymbolRight"),
      ],
      description: "Trailing function slot — radio/checkbox use SymbolRight by default; enable custom to override.",
      applyOverride: (state, value) => applyIconRoleOverride(
        {
          ...state,
          useCustomFunctionIcon: Boolean(value.useCustomFunctionIcon),
        },
        value,
        "itemFunctionIcon"
      ),
    },
  ],
  renderPreview: (state) => {
    const left = readIconRoleFromState(state, "leftIcon", true);
    const right = readIconRoleFromState(state, "rightIcon", false);
    const expand = readIconRoleFromState(state, "expandIcon", true);

    return (
      <div {...spiralDebugProps("select")}>
        <Select
          value={state.value}
          defaultOpen={state.defaultOpen}
          disabled={state.disabled}
          onValueChange={() => undefined}
        >
          <SelectTrigger
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
            className="w-[290px]"
          />
          <SelectContent sideOffset={state.contentSideOffset}>
            <SelectItemGroup label="Title" showDivider>
              {renderItemFromState(state, "a", "Option A")}
              {renderItemFromState(state, "b", "Option B")}
            </SelectItemGroup>
            <SelectItemGroup label="Title">
              {renderItemFromState(state, "c", "Option C")}
              {renderItemFromState(state, "d", "Option D")}
            </SelectItemGroup>
          </SelectContent>
        </Select>
      </div>
    );
  },
};
