import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FormField } from "../form-field";
import {
  TimePicker,
  TimePickerContent,
  TimePickerField,
  TimePickerPanel,
  TimePickerTrigger,
  type TimePickerSize,
  type TimePickerValue,
} from "./time-picker";

const meta: Meta<typeof TimePickerField> = {
  title: "Information Collect/TimePicker",
  component: TimePickerField,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "big"] satisfies TimePickerSize[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePickerField>;

function FieldDemo({
  size = "regular",
  allRound = false,
  disabled = false,
  error = false,
  defaultOpen = false,
  defaultValue,
}: {
  size?: TimePickerSize;
  allRound?: boolean;
  disabled?: boolean;
  error?: boolean;
  defaultOpen?: boolean;
  defaultValue?: TimePickerValue;
}) {
  const [value, setValue] = useState<TimePickerValue>(defaultValue ?? { hours: 9, minutes: 30 });

  return (
    <TimePickerField
      size={size}
      allRound={allRound}
      disabled={disabled}
      error={error}
      defaultOpen={defaultOpen}
      value={value}
      onValueChange={setValue}
      className="w-[160px]"
    />
  );
}

export const Default: Story = {
  render: () => <FieldDemo defaultOpen />,
};

export const WithFormField: Story = {
  render: () => (
    <FormField label="预约时间" className="w-[200px]">
      <FieldDemo />
    </FormField>
  ),
};

export const Big: Story = {
  render: () => <FieldDemo size="big" />,
};

export const AllRound: Story = {
  render: () => <FieldDemo allRound />,
};

export const Disabled: Story = {
  render: () => <FieldDemo disabled defaultValue={{ hours: 14, minutes: 0 }} />,
};

export const Error: Story = {
  render: () => <FieldDemo error />,
};

export const Compound: Story = {
  render: () => {
    const [value, setValue] = useState<TimePickerValue>({ hours: 17, minutes: 0 });

    return (
      <TimePicker value={value} onValueChange={setValue} defaultOpen>
        <TimePickerTrigger className="w-[160px]" />
        <TimePickerContent>
          <TimePickerPanel />
        </TimePickerContent>
      </TimePicker>
    );
  },
};
