import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, CheckboxGroup, CheckboxInput } from "./checkbox";
import { Typography } from "./typography";

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
      <div className="flex items-center gap-2">
        <Checkbox id="cb-checked" defaultChecked />
        <Typography level="text" as="label" htmlFor="cb-checked">
          Checked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-unchecked" />
        <Typography level="text" as="label" htmlFor="cb-unchecked">
          Unchecked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-indeterminate" checked="indeterminate" />
        <Typography level="text" as="label" htmlFor="cb-indeterminate">
          Indeterminate
        </Typography>
      </div>
    </div>
  ),
};

export const Round: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-round-checked" defaultChecked round />
        <Typography level="text" as="label" htmlFor="cb-round-checked">
          Round checked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-round-unchecked" round />
        <Typography level="text" as="label" htmlFor="cb-round-unchecked">
          Round unchecked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-round-half" checked="indeterminate" round />
        <Typography level="text" as="label" htmlFor="cb-round-half">
          Round indeterminate
        </Typography>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-dis-checked" defaultChecked disabled />
        <Typography level="text" as="label" htmlFor="cb-dis-checked">
          Checked disabled
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-dis-unchecked" disabled />
        <Typography level="text" as="label" htmlFor="cb-dis-unchecked">
          Unchecked disabled
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-dis-half" checked="indeterminate" disabled />
        <Typography level="text" as="label" htmlFor="cb-dis-half">
          Indeterminate disabled
        </Typography>
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
