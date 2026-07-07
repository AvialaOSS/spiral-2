import { GeneralSetting } from "@aviala/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, CheckboxGroup, CheckboxInput } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Information Collect/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Control: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Checkbox id="cb-checked" defaultChecked />
        <label htmlFor="cb-checked">Checked</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="cb-unchecked" />
        <label htmlFor="cb-unchecked">Unchecked</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="cb-indeterminate" checked="indeterminate" />
        <label htmlFor="cb-indeterminate">Indeterminate</label>
      </div>
    </div>
  ),
};

export const Round: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Checkbox id="cb-round-checked" defaultChecked round />
        <label htmlFor="cb-round-checked">Round checked</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="cb-round-unchecked" round />
        <label htmlFor="cb-round-unchecked">Round unchecked</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="cb-round-half" checked="indeterminate" round />
        <label htmlFor="cb-round-half">Round indeterminate</label>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Checkbox id="cb-dis-checked" defaultChecked disabled />
        <label htmlFor="cb-dis-checked">Checked disabled</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="cb-dis-unchecked" disabled />
        <label htmlFor="cb-dis-unchecked">Unchecked disabled</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="cb-dis-half" checked="indeterminate" disabled />
        <label htmlFor="cb-dis-half">Indeterminate disabled</label>
      </div>
    </div>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Square (Round=OFF)</p>
        <div className="flex flex-col gap-3">
          <Checkbox defaultChecked aria-label="Checked" />
          <Checkbox defaultChecked disabled aria-label="Checked disabled" />
          <Checkbox aria-label="Unchecked" />
          <Checkbox disabled aria-label="Unchecked disabled" />
          <Checkbox checked="indeterminate" aria-label="Indeterminate" />
          <Checkbox checked="indeterminate" disabled aria-label="Indeterminate disabled" />
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Round (Round=ON)</p>
        <div className="flex flex-col gap-3">
          <Checkbox defaultChecked round aria-label="Round checked" />
          <Checkbox defaultChecked round disabled aria-label="Round checked disabled" />
          <Checkbox round aria-label="Round unchecked" />
          <Checkbox round disabled aria-label="Round unchecked disabled" />
          <Checkbox checked="indeterminate" round aria-label="Round indeterminate" />
          <Checkbox checked="indeterminate" round disabled aria-label="Round indeterminate disabled" />
        </div>
      </div>
    </div>
  ),
};

export const NormalInput: Story = {
  render: () => (
    <CheckboxGroup direction="vertical" className="w-[200px]">
      <CheckboxInput id="cb-input-a" title="Text" description="Text" defaultChecked />
      <CheckboxInput id="cb-input-b" title="Text" description="Text" />
    </CheckboxGroup>
  ),
};

export const NormalInputWithIcon: Story = {
  render: () => (
    <CheckboxGroup direction="vertical" className="w-[200px]">
      <CheckboxInput
        id="cb-icon-a"
        title="Text"
        description="Text"
        defaultChecked
        icon={<GeneralSetting aria-hidden />}
      />
      <CheckboxInput
        id="cb-icon-b"
        title="Text"
        description="Text"
        icon={<GeneralSetting aria-hidden />}
      />
    </CheckboxGroup>
  ),
};

export const HorizontalGroup: Story = {
  render: () => (
    <CheckboxGroup direction="horizontal" className="w-[420px]">
      <CheckboxInput id="cb-h-a" title="Text" description="Text" defaultChecked />
      <CheckboxInput id="cb-h-b" title="Text" description="Text" />
    </CheckboxGroup>
  ),
};

export const InputDisabled: Story = {
  render: () => (
    <CheckboxGroup direction="vertical" className="w-[200px]">
      <CheckboxInput id="cb-dis-a" title="Text" description="Text" defaultChecked disabled />
      <CheckboxInput id="cb-dis-b" title="Text" description="Text" />
    </CheckboxGroup>
  ),
};
