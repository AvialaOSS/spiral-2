import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { type InputSize } from "./input";
import { NumberInput, type NumberInputStyle } from "./number-input";

const meta: Meta<typeof NumberInput> = {
  title: "Information Collect/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "big"] satisfies InputSize[],
    },
    inputStyle: {
      control: "select",
      options: ["default", "monospaced"] satisfies NumberInputStyle[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Empty: Story = {
  args: {
    placeholder: "Text",
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Filled: Story = {
  args: {
    defaultValue: 12,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Monospaced: Story = {
  args: {
    defaultValue: 5,
    inputStyle: "monospaced",
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Big: Story = {
  args: {
    size: "big",
    defaultValue: 12,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const AllRound: Story = {
  args: {
    allRound: true,
    defaultValue: 12,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Text",
    disabled: true,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const DisabledFilled: Story = {
  args: {
    defaultValue: 12,
    disabled: true,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Error: Story = {
  args: {
    defaultValue: 12,
    error: true,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const WithoutControls: Story = {
  args: {
    defaultValue: 42,
    showControls: false,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const MinMaxStep: Story = {
  args: {
    defaultValue: 0,
    min: 0,
    max: 10,
    step: 0.5,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Controlled: Story = {
  render: function ControlledNumberInput() {
    const [value, setValue] = useState<number | "">(3);
    return (
      <div className="flex w-full max-w-sm flex-col gap-2">
        <NumberInput
          value={value}
          leftIcon={<GeneralSetting aria-hidden />}
          onValueChange={(next) => setValue(next ?? "")}
        />
        <span className="font-mono text-xs text-muted-foreground">
          value: {value === "" ? "(empty)" : value}
        </span>
      </div>
    );
  },
};

const sizes: InputSize[] = ["regular", "big"];
const styles: NumberInputStyle[] = ["default", "monospaced"];

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
      {styles.map((inputStyle) => (
        <div key={inputStyle} className="flex flex-col gap-3">
          <span className="font-mono text-xs text-muted-foreground">{inputStyle}</span>
          {sizes.map((size) => (
            <div key={`${inputStyle}-${size}`} className="flex flex-col gap-2">
              <span className="font-mono text-xs text-muted-foreground">{size}</span>
              <NumberInput
                size={size}
                inputStyle={inputStyle}
                placeholder="Empty"
                leftIcon={<GeneralSetting aria-hidden />}
              />
              <NumberInput
                size={size}
                inputStyle={inputStyle}
                defaultValue={12}
                leftIcon={<GeneralSetting aria-hidden />}
              />
              <NumberInput
                size={size}
                inputStyle={inputStyle}
                allRound
                defaultValue={12}
                leftIcon={<GeneralSetting aria-hidden />}
              />
              <NumberInput
                size={size}
                inputStyle={inputStyle}
                defaultValue={12}
                disabled
                leftIcon={<GeneralSetting aria-hidden />}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
