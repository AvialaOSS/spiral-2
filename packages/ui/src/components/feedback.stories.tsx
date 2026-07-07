import type { Meta, StoryObj } from "@storybook/react";
import {
  Feedback,
  type FeedbackMode,
  type FeedbackSize,
  type FeedbackType,
} from "./feedback";

const meta: Meta<typeof Feedback> = {
  title: "Response And Feedback/Feedback",
  component: Feedback,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "information",
        "warning",
        "wrong",
        "success",
        "normal",
      ] satisfies FeedbackType[],
    },
    size: {
      control: "select",
      options: ["default", "small"] satisfies FeedbackSize[],
    },
    mode: {
      control: "select",
      options: ["default", "primary"] satisfies FeedbackMode[],
    },
    showClose: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Feedback>;

export const Default: Story = {
  args: {
    type: "information",
    size: "default",
    mode: "default",
    title: "Information",
    description: "Supporting details for this message.",
    showClose: true,
  },
};

export const Primary: Story = {
  args: {
    type: "success",
    size: "default",
    mode: "primary",
    title: "Saved",
    description: "Your changes were saved successfully.",
    showClose: true,
  },
};

export const SmallPill: Story = {
  args: {
    type: "warning",
    size: "small",
    mode: "default",
    title: "Check your input",
    showClose: true,
  },
};

export const WithAction: Story = {
  args: {
    type: "wrong",
    size: "default",
    mode: "default",
    title: "Upload failed",
    description: "The file could not be uploaded.",
    action: "Retry",
    showClose: true,
  },
};

const semanticTypes: FeedbackType[] = [
  "information",
  "warning",
  "wrong",
  "success",
  "normal",
];

export const TypeMatrixDefault: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-4">
      {semanticTypes.map((type) => (
        <Feedback
          key={type}
          type={type}
          size="default"
          mode="default"
          title={`${type.charAt(0).toUpperCase()}${type.slice(1)}`}
          description="Secondary caption text"
        />
      ))}
    </div>
  ),
};

export const TypeMatrixPrimary: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-4">
      {(["information", "warning", "wrong", "success"] as FeedbackType[]).map((type) => (
        <Feedback
          key={type}
          type={type}
          size="default"
          mode="primary"
          title={`${type.charAt(0).toUpperCase()}${type.slice(1)}`}
          description="Secondary caption text"
        />
      ))}
    </div>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-6">
      <Feedback
        type="information"
        size="default"
        mode="default"
        title="Default size"
        description="Two-line typeface layout"
      />
      <Feedback type="information" size="small" mode="default" title="Small pill" />
      <Feedback type="information" size="small" mode="primary" title="Small primary pill" />
    </div>
  ),
};

export const WithoutClose: Story = {
  args: {
    type: "success",
    size: "small",
    mode: "primary",
    title: "Copied to clipboard",
    showClose: false,
  },
};
