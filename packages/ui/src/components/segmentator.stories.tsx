import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SegmentatorGroup, SegmentatorItem, type SegmentatorMode } from "./segmentator";

const meta: Meta<typeof SegmentatorGroup> = {
  title: "Basic Input/Segmentator",
  component: SegmentatorGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SegmentatorGroup>;

export const Nested: Story = {
  render: () => (
    <SegmentatorGroup defaultValue="a">
      <SegmentatorItem value="a" leftIcon={<GeneralSetting aria-hidden />} rightIcon={<GeneralSetting aria-hidden />}>
        Text
      </SegmentatorItem>
      <SegmentatorItem value="b" leftIcon={<GeneralSetting aria-hidden />} rightIcon={<GeneralSetting aria-hidden />}>
        Text
      </SegmentatorItem>
    </SegmentatorGroup>
  ),
};

export const Tiled: Story = {
  render: () => (
    <SegmentatorGroup mode="tiled" defaultValue="a">
      <SegmentatorItem value="a" leftIcon={<GeneralSetting aria-hidden />} rightIcon={<GeneralSetting aria-hidden />}>
        Text
      </SegmentatorItem>
      <SegmentatorItem value="b" leftIcon={<GeneralSetting aria-hidden />} rightIcon={<GeneralSetting aria-hidden />}>
        Text
      </SegmentatorItem>
    </SegmentatorGroup>
  ),
};

export const AllRound: Story = {
  render: () => (
    <SegmentatorGroup allRound defaultValue="a">
      <SegmentatorItem value="a">Text</SegmentatorItem>
      <SegmentatorItem value="b">Text</SegmentatorItem>
    </SegmentatorGroup>
  ),
};

export const EqualWidth: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-4">
      <SegmentatorGroup equalWidth defaultValue="a">
        <SegmentatorItem value="a">Date</SegmentatorItem>
        <SegmentatorItem value="b">Time</SegmentatorItem>
      </SegmentatorGroup>
      <SegmentatorGroup equalWidth mode="tiled" defaultValue="a">
        <SegmentatorItem value="a">Short</SegmentatorItem>
        <SegmentatorItem value="b">Much longer label</SegmentatorItem>
        <SegmentatorItem value="c">Mid</SegmentatorItem>
      </SegmentatorGroup>
    </div>
  ),
};

/** Narrow container — swipe / trackpad to scroll when items would otherwise clip. */
export const HorizontalScroll: Story = {
  render: () => (
    <div className="flex w-[220px] flex-col gap-4">
      <SegmentatorGroup defaultValue="all">
        <SegmentatorItem value="all">全部</SegmentatorItem>
        <SegmentatorItem value="light">Light</SegmentatorItem>
        <SegmentatorItem value="regular">Regular</SegmentatorItem>
        <SegmentatorItem value="medium">Medium</SegmentatorItem>
        <SegmentatorItem value="bold">Bold</SegmentatorItem>
        <SegmentatorItem value="black">Black</SegmentatorItem>
      </SegmentatorGroup>
      <SegmentatorGroup equalWidth defaultValue="a">
        <SegmentatorItem value="a">很长的选项标签甲</SegmentatorItem>
        <SegmentatorItem value="b">很长的选项标签乙</SegmentatorItem>
        <SegmentatorItem value="c">很长的选项标签丙</SegmentatorItem>
      </SegmentatorGroup>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <SegmentatorGroup defaultValue="a">
      <SegmentatorItem value="a" iconOnly leftIcon={<GeneralSetting aria-hidden />} aria-label="A" />
      <SegmentatorItem value="b" iconOnly leftIcon={<GeneralSetting aria-hidden />} aria-label="B" />
    </SegmentatorGroup>
  ),
};

const modes: SegmentatorMode[] = ["nested", "tiled"];

export const ModeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {modes.map((mode) => (
        <div key={mode} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">{mode}</span>
          <SegmentatorGroup mode={mode} defaultValue="a">
            <SegmentatorItem value="a" leftIcon={<GeneralSetting aria-hidden />} rightIcon={<GeneralSetting aria-hidden />}>
              Text
            </SegmentatorItem>
            <SegmentatorItem value="b" leftIcon={<GeneralSetting aria-hidden />} rightIcon={<GeneralSetting aria-hidden />}>
              Text
            </SegmentatorItem>
            <SegmentatorItem value="c" leftIcon={<GeneralSetting aria-hidden />} rightIcon={<GeneralSetting aria-hidden />}>
              Text
            </SegmentatorItem>
          </SegmentatorGroup>
        </div>
      ))}
    </div>
  ),
};

export const SlidingIndicator: Story = {
  render: () => {
    const [value, setValue] = useState("a");

    return (
      <div className="flex max-w-sm flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          Click segments to see the selected thumb slide between items (520ms soft ease-out with a light overshoot).
        </p>
        <SegmentatorGroup value={value} onValueChange={setValue}>
          <SegmentatorItem value="a" leftIcon={<GeneralSetting aria-hidden />}>
            Option A
          </SegmentatorItem>
          <SegmentatorItem value="b" leftIcon={<GeneralSetting aria-hidden />}>
            Option B
          </SegmentatorItem>
          <SegmentatorItem value="c" leftIcon={<GeneralSetting aria-hidden />}>
            Option C
          </SegmentatorItem>
        </SegmentatorGroup>
        <SegmentatorGroup mode="tiled" value={value} onValueChange={setValue}>
          <SegmentatorItem value="a">Tiled A</SegmentatorItem>
          <SegmentatorItem value="b">Tiled B</SegmentatorItem>
          <SegmentatorItem value="c">Tiled C</SegmentatorItem>
        </SegmentatorGroup>
        <SegmentatorGroup allRound value={value} onValueChange={setValue}>
          <SegmentatorItem value="a" iconOnly leftIcon={<GeneralSetting aria-hidden />} aria-label="A" />
          <SegmentatorItem value="b" iconOnly leftIcon={<GeneralSetting aria-hidden />} aria-label="B" />
          <SegmentatorItem value="c" iconOnly leftIcon={<GeneralSetting aria-hidden />} aria-label="C" />
        </SegmentatorGroup>
      </div>
    );
  },
};
