import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Textarea, type TextareaSize } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Information Collect/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "big"] satisfies TextareaSize[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Empty: Story = {
  args: {
    placeholder: "Text",
    maxLength: 200,
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Filled: Story = {
  args: {
    defaultValue:
      "Excellent experience improves efficiency and stimulates potential. Bring excellent experience, help users improve efficiency, and stimulate potential",
    maxLength: 200,
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Big: Story = {
  args: {
    size: "big",
    placeholder: "Text",
    maxLength: 200,
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Text",
    maxLength: 200,
    disabled: true,
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Error: Story = {
  args: {
    placeholder: "Text",
    maxLength: 200,
    error: true,
    leftIcon: <GeneralSetting aria-hidden />,
  },
};

export const Plain: Story = {
  args: {
    placeholder: "Tell us about yourself",
  },
};

const sizes: TextareaSize[] = ["regular", "big"];

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">{size}</span>
          <Textarea
            size={size}
            placeholder="Empty"
            maxLength={200}
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<GeneralSetting aria-hidden />}
          />
          <Textarea
            size={size}
            defaultValue="Filled text area content"
            maxLength={200}
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<GeneralSetting aria-hidden />}
          />
        </div>
      ))}
    </div>
  ),
};
