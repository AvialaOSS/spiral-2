import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Input, type InputSize } from "./input";

const meta: Meta<typeof Input> = {
  title: "Information Collect/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "big"] satisfies InputSize[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Empty: Story = {
  args: {
    placeholder: "Text",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Filled: Story = {
  args: {
    defaultValue: "Text",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const EmptyVsFilled: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-muted-foreground">Empty (placeholder 60%)</span>
        <Input
          placeholder="Text"
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<GeneralSetting aria-hidden />}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-muted-foreground">Filled (100%)</span>
        <Input
          defaultValue="Text"
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<GeneralSetting aria-hidden />}
        />
      </div>
    </div>
  ),
};

export const Big: Story = {
  args: {
    size: "big",
    placeholder: "Text",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const AllRound: Story = {
  args: {
    allRound: true,
    placeholder: "Text",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Text",
    disabled: true,
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Error: Story = {
  args: {
    placeholder: "Text",
    error: true,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Plain: Story = {
  args: { placeholder: "Email" },
};

const sizes: InputSize[] = ["regular", "big"];

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">{size}</span>
          <Input
            size={size}
            placeholder="Empty"
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<GeneralSetting aria-hidden />}
          />
          <Input
            size={size}
            defaultValue="Filled"
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<GeneralSetting aria-hidden />}
          />
        </div>
      ))}
    </div>
  ),
};
