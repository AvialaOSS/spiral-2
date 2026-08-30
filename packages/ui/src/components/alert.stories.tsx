import type { Meta, StoryObj } from "@storybook/react";
import {
  Alert,
  type AlertAppearance,
  type AlertSize,
  type AlertType,
} from "./alert";

const meta: Meta<typeof Alert> = {
  title: "Response And Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "info",
        "warning",
        "error",
        "success",
        "neutral",
      ] satisfies AlertType[],
    },
    size: {
      control: "select",
      options: ["default", "small"] satisfies AlertSize[],
    },
    appearance: {
      control: "select",
      options: ["default", "light"] satisfies AlertAppearance[],
    },
    showIcon: { control: "boolean" },
    dismissible: { control: "boolean" },
    showActions: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    type: "info",
    size: "default",
    appearance: "default",
    title: "Information",
    description: "Supporting details for this alert message.",
    dismissible: true,
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    size: "default",
    appearance: "default",
    title: "Warning",
    description: "Please review before continuing.",
    dismissible: true,
  },
};

export const Error: Story = {
  args: {
    type: "error",
    size: "default",
    appearance: "default",
    title: "Something went wrong",
    description: "We could not complete your request.",
    dismissible: true,
  },
};

export const Success: Story = {
  args: {
    type: "success",
    size: "default",
    appearance: "default",
    title: "Success",
    description: "Your changes were saved.",
    dismissible: true,
  },
};

export const Neutral: Story = {
  args: {
    type: "neutral",
    size: "default",
    appearance: "default",
    title: "Neutral",
    description: "General notice without semantic emphasis.",
    dismissible: true,
  },
};

export const LightAppearance: Story = {
  args: {
    type: "info",
    size: "default",
    appearance: "light",
    title: "Light style",
    description: "Filled secondary background without border.",
    dismissible: true,
  },
};

export const Small: Story = {
  args: {
    type: "warning",
    size: "small",
    appearance: "default",
    title: "Compact alert",
    dismissible: true,
  },
};

export const WithQuickAction: Story = {
  args: {
    type: "info",
    size: "default",
    appearance: "default",
    title: "Update available",
    description: "A new version is ready to install.",
    quickAction: "Update now",
    dismissible: true,
  },
};

export const WithFooterActions: Story = {
  args: {
    type: "error",
    size: "default",
    appearance: "default",
    title: "Upload failed",
    description: "The file could not be uploaded.",
    showActions: true,
    action: "Retry",
    secondaryAction: "Cancel",
    dismissible: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    type: "success",
    size: "default",
    appearance: "light",
    title: "No icon",
    description: "Icon hidden via showIcon={false}.",
    showIcon: false,
    dismissible: true,
  },
};

export const NotDismissible: Story = {
  args: {
    type: "info",
    size: "small",
    appearance: "light",
    title: "Persistent notice",
    dismissible: false,
  },
};

const semanticTypes: AlertType[] = [
  "info",
  "warning",
  "error",
  "success",
  "neutral",
];

export const TypeMatrixDefault: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-3">
      {semanticTypes.map((type) => (
        <Alert
          key={type}
          type={type}
          size="default"
          appearance="default"
          title={`${type.charAt(0).toUpperCase()}${type.slice(1)}`}
          description="Secondary caption text"
        />
      ))}
    </div>
  ),
};

export const TypeMatrixLight: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-3">
      {semanticTypes.map((type) => (
        <Alert
          key={type}
          type={type}
          size="default"
          appearance="light"
          title={`${type.charAt(0).toUpperCase()}${type.slice(1)}`}
          description="Secondary caption text"
        />
      ))}
    </div>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-4">
      <Alert
        type="info"
        size="default"
        appearance="default"
        title="Default size"
        description="Two-line typeface layout with icon and close"
      />
      <Alert type="info" size="small" appearance="default" title="Small size" />
      <Alert
        type="info"
        size="small"
        appearance="light"
        title="Small light style"
      />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-6">
      {semanticTypes.flatMap((type) =>
        (["default", "light"] as AlertAppearance[]).flatMap((appearance) =>
          (["default", "small"] as AlertSize[]).map((size) => (
            <Alert
              key={`${type}-${appearance}-${size}`}
              type={type}
              size={size}
              appearance={appearance}
              title={`${type} / ${appearance} / ${size}`}
              description={size === "default" ? "Description line" : undefined}
            />
          ))
        )
      )}
    </div>
  ),
};
