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
    placeholder: "请输入项目名称",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Filled: Story = {
  args: {
    defaultValue: "季度经营分析报告",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const EmptyVsFilled: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-muted-foreground">
          Empty (placeholder 60%)
        </span>
        <Input
          placeholder="请输入项目名称"
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<GeneralSetting aria-hidden />}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-muted-foreground">
          Filled (100%)
        </span>
        <Input
          defaultValue="季度经营分析报告"
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
    placeholder: "请输入项目名称",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const AllRound: Story = {
  args: {
    allRound: true,
    placeholder: "搜索文档",
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "当前不可编辑",
    disabled: true,
    leftIcon: <GeneralSetting aria-hidden />,
    rightIcon: <GeneralSetting aria-hidden />,
  },
};

export const Error: Story = {
  args: {
    placeholder: "请输入有效的邮箱地址",
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
          <span className="font-mono text-xs text-muted-foreground">
            {size}
          </span>
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
