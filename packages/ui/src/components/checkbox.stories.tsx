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

export const Huge: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-huge-checked" defaultChecked size="huge" />
        <Typography level="text" as="label" htmlFor="cb-huge-checked">
          Huge checked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-huge-unchecked" size="huge" />
        <Typography level="text" as="label" htmlFor="cb-huge-unchecked">
          Huge unchecked
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-huge-half" checked="indeterminate" size="huge" />
        <Typography level="text" as="label" htmlFor="cb-huge-half">
          Huge indeterminate
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-huge-round" defaultChecked size="huge" round />
        <Typography level="text" as="label" htmlFor="cb-huge-round">
          Huge round
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
        <p className="mb-3 text-sm text-muted-foreground">Default · Square</p>
        <div className="flex flex-col gap-3">
          <Checkbox defaultChecked aria-label="Checked" />
          <Checkbox defaultChecked disabled aria-label="Checked disabled" />
          <Checkbox aria-label="Unchecked" />
          <Checkbox disabled aria-label="Unchecked disabled" />
          <Checkbox checked="indeterminate" aria-label="Indeterminate" />
          <Checkbox
            checked="indeterminate"
            disabled
            aria-label="Indeterminate disabled"
          />
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Huge · Square</p>
        <div className="flex flex-col gap-3">
          <Checkbox defaultChecked size="huge" aria-label="Huge checked" />
          <Checkbox
            defaultChecked
            size="huge"
            disabled
            aria-label="Huge checked disabled"
          />
          <Checkbox size="huge" aria-label="Huge unchecked" />
          <Checkbox size="huge" disabled aria-label="Huge unchecked disabled" />
          <Checkbox
            checked="indeterminate"
            size="huge"
            aria-label="Huge indeterminate"
          />
          <Checkbox
            checked="indeterminate"
            size="huge"
            disabled
            aria-label="Huge indeterminate disabled"
          />
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Default · Round</p>
        <div className="flex flex-col gap-3">
          <Checkbox defaultChecked round aria-label="Round checked" />
          <Checkbox
            defaultChecked
            round
            disabled
            aria-label="Round checked disabled"
          />
          <Checkbox round aria-label="Round unchecked" />
          <Checkbox round disabled aria-label="Round unchecked disabled" />
          <Checkbox
            checked="indeterminate"
            round
            aria-label="Round indeterminate"
          />
          <Checkbox
            checked="indeterminate"
            round
            disabled
            aria-label="Round indeterminate disabled"
          />
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Huge · Round</p>
        <div className="flex flex-col gap-3">
          <Checkbox
            defaultChecked
            size="huge"
            round
            aria-label="Huge round checked"
          />
          <Checkbox
            defaultChecked
            size="huge"
            round
            disabled
            aria-label="Huge round checked disabled"
          />
          <Checkbox size="huge" round aria-label="Huge round unchecked" />
          <Checkbox
            size="huge"
            round
            disabled
            aria-label="Huge round unchecked disabled"
          />
          <Checkbox
            checked="indeterminate"
            size="huge"
            round
            aria-label="Huge round indeterminate"
          />
          <Checkbox
            checked="indeterminate"
            size="huge"
            round
            disabled
            aria-label="Huge round indeterminate disabled"
          />
        </div>
      </div>
    </div>
  ),
};

export const NormalInput: Story = {
  render: () => (
    <CheckboxGroup direction="vertical" className="w-[200px]">
      <CheckboxInput
        id="cb-input-a"
        title="Text"
        description="Text"
        defaultChecked
      />
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
      <CheckboxInput
        id="cb-h-a"
        title="Text"
        description="Text"
        defaultChecked
      />
      <CheckboxInput id="cb-h-b" title="Text" description="Text" />
    </CheckboxGroup>
  ),
};

export const InputDisabled: Story = {
  render: () => (
    <CheckboxGroup direction="vertical" className="w-[200px]">
      <CheckboxInput
        id="cb-dis-a"
        title="Text"
        description="Text"
        defaultChecked
        disabled
      />
      <CheckboxInput id="cb-dis-b" title="Text" description="Text" />
    </CheckboxGroup>
  ),
};
