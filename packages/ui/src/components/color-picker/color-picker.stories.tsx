import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
  type ColorPickerTriggerProps,
} from "./color-picker";
import { ColorPickerPanel } from "./color-picker-panel";
import { ColorPickButton } from "./color-pick-button";
import { DEFAULT_COLOR } from "./color-utils";

const meta: Meta<typeof ColorPicker> = {
  title: "Information Collect/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

const DEFAULT_PRESETS = ["#FF0000", "#165DFF", "#00B42A", "#FF7D00", "#F53F3F", "#722ED1"];

function ColorPickerDemo({
  size = "regular",
  allRound = false,
  disabled = false,
  defaultOpen = false,
  defaultValue = DEFAULT_COLOR,
  presets = DEFAULT_PRESETS,
}: {
  size?: ColorPickerTriggerProps["size"];
  allRound?: boolean;
  disabled?: boolean;
  defaultOpen?: boolean;
  defaultValue?: string;
  presets?: string[];
}) {
  const [color, setColor] = useState(defaultValue);
  const [savedPresets, setSavedPresets] = useState(presets);

  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      presets={savedPresets}
      onPresetsChange={setSavedPresets}
      disabled={disabled}
      defaultOpen={defaultOpen}
    >
      <ColorPickerTrigger size={size} allRound={allRound} className="w-[120px]" />
      <ColorPickerContent />
    </ColorPicker>
  );
}

export const Default: Story = {
  render: () => <ColorPickerDemo />,
};

/** Open by default — panel enter/exit animation (150ms fade + translate). */
export const OpenByDefault: Story = {
  render: () => <ColorPickerDemo defaultOpen />,
};

export const WithAlpha: Story = {
  render: () => <ColorPickerDemo defaultValue="#FF000080" />,
};

export const Big: Story = {
  render: () => <ColorPickerDemo size="big" />,
};

export const AllRound: Story = {
  render: () => <ColorPickerDemo allRound />,
};

export const Disabled: Story = {
  render: () => <ColorPickerDemo disabled defaultValue="#FF0000" />,
};

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ColorPickerDemo size="regular" />
      <ColorPickerDemo size="big" />
      <ColorPickerDemo size="regular" allRound />
      <ColorPickerDemo size="big" allRound />
    </div>
  ),
};

export const PanelStandalone: Story = {
  render: function PanelStandaloneStory() {
    const [color, setColor] = useState(DEFAULT_COLOR);
    const [presets, setPresets] = useState(DEFAULT_PRESETS);

    return (
      <ColorPickerPanel
        value={color}
        onChange={setColor}
        presets={presets}
        onPresetsChange={setPresets}
      />
    );
  },
};

export const SwatchButton: Story = {
  render: function SwatchButtonStory() {
    const [selected, setSelected] = useState("#FF0000");
    return (
      <div className="flex flex-wrap gap-2">
        {DEFAULT_PRESETS.map((color) => (
          <ColorPickButton
            key={color}
            color={color}
            selected={selected === color}
            onClick={() => setSelected(color)}
          />
        ))}
      </div>
    );
  },
};
