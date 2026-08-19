import type { Meta, StoryObj } from "@storybook/react";
import { Video } from "./video";

const SAMPLE_SRC =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const meta: Meta<typeof Video> = {
  title: "Information Display/Video",
  component: Video,
  tags: ["autodocs"],
  argTypes: {
    appearance: { control: "select", options: ["default", "light"] },
    objectFit: {
      control: "select",
      options: ["original", "stretch", "fill"],
    },
    autoHideControls: { control: "boolean" },
    muted: { control: "boolean" },
    volume: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
    volumeBalance: { control: "boolean" },
  },
  args: {
    src: SAMPLE_SRC,
    appearance: "default",
    objectFit: "original",
  },
};

export default meta;
type Story = StoryObj<typeof Video>;

export const Default: Story = {
  args: { appearance: "default" },
};

export const Light: Story = {
  args: { appearance: "light" },
};

export const AutoHideControls: Story = {
  args: { appearance: "default", autoHideControls: true },
};

/** Figma Video matrix (1958:1400) — Style=Default / Style=Light */
export const FigmaMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        alignItems: "flex-start",
      }}
    >
      <Video appearance="default" src={SAMPLE_SRC} />
      <Video appearance="light" src={SAMPLE_SRC} />
    </div>
  ),
};
