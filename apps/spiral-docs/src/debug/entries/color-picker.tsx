import { useState } from "react";
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
  type ColorFormat,
} from "@aviala-design/spiral";
import type { KnobValues } from "../../components/DemoKnobs";
import type { DebugComponentEntry } from "../types";

export type ColorPickerDebugState = {
  color: string;
  presets: string[];
  disabled: boolean;
  defaultOpen: boolean;
  defaultFormat: ColorFormat;
  maxPresets: number;
  triggerSize: "regular" | "big";
  triggerAllRound: boolean;
  triggerPlaceholder: string;
  contentAlign: "start" | "center" | "end";
  contentSideOffset: number;
  showEyedropper: boolean;
  showPresets: boolean;
};

const initialState: ColorPickerDebugState = {
  color: "#165DFF",
  presets: ["#165DFF", "#14C9C9", "#F7BA1E"],
  disabled: false,
  defaultOpen: true,
  defaultFormat: "hex",
  maxPresets: 8,
  triggerSize: "regular",
  triggerAllRound: false,
  triggerPlaceholder: "Select color",
  contentAlign: "start",
  contentSideOffset: 8,
  showEyedropper: true,
  showPresets: true,
};

function ColorPickerPreview({ state }: { state: ColorPickerDebugState }) {
  const [color, setColor] = useState(state.color);
  const [presets, setPresets] = useState(state.presets);

  return (
    <ColorPicker
      key={`${state.defaultOpen}-${state.defaultFormat}`}
      value={color}
      onChange={setColor}
      disabled={state.disabled}
      defaultOpen={state.defaultOpen}
      defaultFormat={state.defaultFormat}
      presets={presets}
      onPresetsChange={setPresets}
      maxPresets={state.maxPresets}
    >
      <ColorPickerTrigger
        size={state.triggerSize}
        allRound={state.triggerAllRound}
        placeholder={state.triggerPlaceholder}
        className="w-[120px]"
      />
      <ColorPickerContent
        align={state.contentAlign}
        sideOffset={state.contentSideOffset}
        showEyedropper={state.showEyedropper}
        showPresets={state.showPresets}
      />
    </ColorPicker>
  );
}

export const colorPickerEntry: DebugComponentEntry<ColorPickerDebugState> = {
  id: "color-picker",
  label: "ColorPicker",
  description: "Figma Information Collect → ColorPicker",
  initialState,
  nodes: [
    {
      debugId: "color-picker",
      label: "ColorPicker",
      knobs: [
        { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
        { kind: "boolean", name: "defaultOpen", label: "defaultOpen", defaultValue: true },
        {
          kind: "select",
          name: "defaultFormat",
          label: "defaultFormat",
          options: ["hex", "rgb", "hsl"],
          defaultValue: "hex",
        },
        { kind: "string", name: "maxPresets", label: "maxPresets", defaultValue: "8" },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        disabled: Boolean(value.disabled),
        defaultOpen: Boolean(value.defaultOpen),
        defaultFormat: String(value.defaultFormat ?? "hex") as ColorFormat,
        maxPresets: Number.parseInt(String(value.maxPresets ?? "8"), 10) || 8,
      }),
    },
    {
      debugId: "color-picker.trigger",
      label: "Trigger",
      parent: "color-picker",
      knobs: [
        {
          kind: "select",
          name: "size",
          label: "size",
          options: ["regular", "big"],
          defaultValue: "regular",
        },
        { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
        {
          kind: "string",
          name: "placeholder",
          label: "placeholder",
          defaultValue: "Select color",
        },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        triggerSize: String(value.size ?? "regular") as "regular" | "big",
        triggerAllRound: Boolean(value.allRound),
        triggerPlaceholder: String(value.placeholder ?? "Select color"),
      }),
    },
    {
      debugId: "color-picker.trigger.swatch",
      label: "Swatch",
      parent: "color-picker.trigger",
      knobs: [],
      description: "Color preview chip — inherits Trigger and root ColorPicker state.",
      applyOverride: (state) => state,
    },
    {
      debugId: "color-picker.trigger.value",
      label: "Value text",
      parent: "color-picker.trigger",
      knobs: [],
      description: "Hex label typography — controlled by current color value and placeholder.",
      applyOverride: (state) => state,
    },
    {
      debugId: "color-picker.content",
      label: "Content",
      parent: "color-picker",
      knobs: [
        {
          kind: "select",
          name: "align",
          label: "align",
          options: ["start", "center", "end"],
          defaultValue: "start",
        },
        { kind: "string", name: "sideOffset", label: "sideOffset", defaultValue: "8" },
        { kind: "boolean", name: "showEyedropper", label: "showEyedropper", defaultValue: true },
        { kind: "boolean", name: "showPresets", label: "showPresets", defaultValue: true },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        contentAlign: String(value.align ?? "start") as "start" | "center" | "end",
        contentSideOffset: Number.parseInt(String(value.sideOffset ?? "8"), 10) || 8,
        showEyedropper: Boolean(value.showEyedropper ?? true),
        showPresets: Boolean(value.showPresets ?? true),
      }),
    },
    {
      debugId: "color-picker.content.area",
      label: "Area",
      parent: "color-picker.content",
      knobs: [],
      description: "Saturation / brightness surface — reads shared picker context.",
      applyOverride: (state) => state,
    },
    {
      debugId: "color-picker.content.hue-slider",
      label: "Hue slider",
      parent: "color-picker.content",
      knobs: [],
      description: "Hue track — reads shared picker context.",
      applyOverride: (state) => state,
    },
    {
      debugId: "color-picker.content.alpha-slider",
      label: "Alpha slider",
      parent: "color-picker.content",
      knobs: [],
      description: "Opacity track — reads shared picker context.",
      applyOverride: (state) => state,
    },
    {
      debugId: "color-picker.content.inputs",
      label: "Inputs",
      parent: "color-picker.content",
      knobs: [],
      description: "Hex / RGB / HSL inputs and format select — inherits showEyedropper from Content.",
      applyOverride: (state) => state,
    },
    {
      debugId: "color-picker.content.inputs.eyedropper",
      label: "Eyedropper",
      parent: "color-picker.content.inputs",
      knobs: [],
      description: "Screen color pick button — visibility controlled by Content showEyedropper.",
      applyOverride: (state) => state,
    },
    {
      debugId: "color-picker.content.presets",
      label: "Presets",
      parent: "color-picker.content",
      knobs: [],
      description: "Preset swatches and add button — visibility controlled by Content showPresets.",
      applyOverride: (state) => state,
    },
  ],
  renderPreview: (state) => <ColorPickerPreview state={state} />,
};
