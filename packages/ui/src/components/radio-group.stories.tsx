import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem, RadioInput } from "./radio-group";

const meta: Meta<typeof RadioGroup> = {
  title: "Information Collect/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Control: Story = {
  render: () => (
    <RadioGroup defaultValue="on">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="on" id="radio-on" />
        <label htmlFor="radio-on">Selected</label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="off" id="radio-off" />
        <label htmlFor="radio-off">Unselected</label>
      </div>
    </RadioGroup>
  ),
};

export const NormalInput: Story = {
  render: () => (
    <RadioGroup defaultValue="a" direction="vertical" className="w-[200px]">
      <RadioInput value="a" id="radio-a" title="Text" description="Text" />
      <RadioInput value="b" id="radio-b" title="Text" description="Text" />
    </RadioGroup>
  ),
};

export const NormalInputWithIcon: Story = {
  render: () => (
    <RadioGroup defaultValue="a" direction="vertical" className="w-[200px]">
      <RadioInput
        value="a"
        id="radio-icon-a"
        title="Text"
        description="Text"
        icon={<GeneralSetting aria-hidden />}
      />
      <RadioInput
        value="b"
        id="radio-icon-b"
        title="Text"
        description="Text"
        icon={<GeneralSetting aria-hidden />}
      />
    </RadioGroup>
  ),
};

export const CardInput: Story = {
  render: () => (
    <RadioGroup defaultValue="a" direction="vertical" className="w-[200px]">
      <RadioInput value="a" id="radio-card-a" title="Text" description="Text" variant="card" />
      <RadioInput value="b" id="radio-card-b" title="Text" description="Text" variant="card" />
    </RadioGroup>
  ),
};

export const HorizontalGroup: Story = {
  render: () => (
    <RadioGroup defaultValue="a" direction="horizontal" className="w-[200px]">
      <RadioInput value="a" id="radio-h-a" title="Text" description="Text" />
      <RadioInput value="b" id="radio-h-b" title="Text" description="Text" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="a" direction="vertical" className="w-[200px]">
      <RadioInput value="a" id="radio-dis-a" title="Text" description="Text" disabled />
      <RadioInput value="b" id="radio-dis-b" title="Text" description="Text" />
    </RadioGroup>
  ),
};
