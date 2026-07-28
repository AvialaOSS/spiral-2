import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ScrollPicker, ScrollPickerColumn } from "./scroll-picker";

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const meta: Meta<typeof ScrollPicker> = {
  title: "Information Collect/ScrollPicker",
  component: ScrollPicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollPicker>;

export const DualColumn: Story = {
  render: () => {
    const [hour, setHour] = useState("09");
    const [minute, setMinute] = useState("30");
    return (
      <ScrollPicker>
        <ScrollPickerColumn
          aria-label="Hour"
          values={hours}
          value={hour}
          onChange={setHour}
        />
        <ScrollPickerColumn
          aria-label="Minute"
          values={minutes}
          value={minute}
          onChange={setMinute}
        />
      </ScrollPicker>
    );
  },
};

export const SingleColumn: Story = {
  render: () => {
    const [value, setValue] = useState("Apple");
    return (
      <ScrollPicker style={{ width: 160 }}>
        <ScrollPickerColumn
          aria-label="Fruit"
          values={["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"]}
          value={value}
          onChange={setValue}
          loop={false}
        />
      </ScrollPicker>
    );
  },
};
