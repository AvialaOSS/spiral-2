import {
  SegmentatorGroup,
  SegmentatorItem,
  type SegmentatorMode,
} from "@aviala-design/spiral";

import type { KnobValues } from "../../components/DemoKnobs";
import {
  applyIconRoleOverride,
  iconRoleKnobs,
  readIconRoleFromState,
  renderDebugIcon,
} from "../icon-knobs";
import { spiralDebugProps, type DebugComponentEntry } from "../types";

export type SegmentatorDebugState = {
  value: string;
  mode: SegmentatorMode;
  allRound: boolean;
  disabled: boolean;
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

const initialState: SegmentatorDebugState = {
  value: "a",
  mode: "nested",
  allRound: false,
  disabled: false,
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

export const segmentatorEntry: DebugComponentEntry<SegmentatorDebugState> = {
  id: "segmentator",
  label: "Segmentator",
  description: "Figma Basic Input → Segmentator",
  initialState,
  nodes: [
    {
      debugId: "segmentator",
      label: "Segmentator",
      knobs: [
        {
          kind: "select",
          name: "value",
          label: "value",
          options: ["a", "b", "c"],
          defaultValue: "a",
        },
        {
          kind: "select",
          name: "mode",
          label: "mode",
          options: ["nested", "tiled"],
          defaultValue: "nested",
        },
        { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
        { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        value: String(value.value ?? "a"),
        mode: String(value.mode ?? "nested") as SegmentatorMode,
        allRound: Boolean(value.allRound),
        disabled: Boolean(value.disabled),
      }),
    },
    {
      debugId: "segmentator.item",
      label: "Item",
      parent: "segmentator",
      knobs: iconRoleKnobs("leftIcon", true, "GeneralSetting").concat(
        iconRoleKnobs("rightIcon", false, "GeneralSetting")
      ),
      description: "Icon knobs apply to the first segment item in preview.",
      applyOverride: (state, value) =>
        applyIconRoleOverride(applyIconRoleOverride(state, value, "leftIcon"), value, "rightIcon"),
    },
  ],
  renderPreview: (state) => {
    const left = readIconRoleFromState(state, "leftIcon", true);
    const right = readIconRoleFromState(state, "rightIcon", false);

    const itemIconProps = {
      leftIcon: renderDebugIcon(
        left.visible,
        left.iconName,
        left.thickness,
        left.mode,
        left.biggerSize,
        left.level
      ),
      rightIcon: renderDebugIcon(
        right.visible,
        right.iconName,
        right.thickness,
        right.mode,
        right.biggerSize,
        right.level
      ),
    };

    return (
      <div {...spiralDebugProps("segmentator")}>
        <SegmentatorGroup
          value={state.value}
          mode={state.mode}
          allRound={state.allRound}
          disabled={state.disabled}
          onValueChange={() => undefined}
        >
          <SegmentatorItem value="a" {...itemIconProps}>
            Option A
          </SegmentatorItem>
          <SegmentatorItem value="b">Option B</SegmentatorItem>
          <SegmentatorItem value="c">Option C</SegmentatorItem>
        </SegmentatorGroup>
      </div>
    );
  },
};
