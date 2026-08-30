import {
  DirectionArrowLeft,
  DirectionArrowRight,
  GeneralSetting,
} from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "./button";
import { Tab, TabItem, type TabBackground, type TabStyle } from "./tab";

const meta: Meta<typeof Tab> = {
  title: "Structure Navigation/Tab",
  component: Tab,
  tags: ["autodocs"],
  argTypes: {
    style: {
      control: "select",
      options: ["default", "card", "tiled"] satisfies TabStyle[],
    },
    background: {
      control: "select",
      options: ["none", "default"] satisfies TabBackground[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tab>;

function DemoTab({
  style = "default",
  background = "none",
  withSlots = false,
}: {
  style?: TabStyle;
  background?: TabBackground;
  withSlots?: boolean;
}) {
  const [value, setValue] = useState("a");
  const slots = withSlots
    ? {
        startSlot: (
          <Button
            mode="outlineCustom"
            size="regular"
            allRound
            iconOnly
            leftIcon={<DirectionArrowLeft aria-hidden />}
            aria-label="Previous"
          />
        ),
        endSlot: (
          <Button
            mode="outlineCustom"
            size="regular"
            allRound
            iconOnly
            leftIcon={<DirectionArrowRight aria-hidden />}
            aria-label="Next"
          />
        ),
      }
    : {};

  return (
    <Tab
      style={style}
      background={background}
      value={value}
      onValueChange={setValue}
      {...slots}
    >
      <TabItem value="a" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
      <TabItem value="b" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
      <TabItem value="c" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
      <TabItem value="d" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
    </Tab>
  );
}

export const DefaultStyle: Story = {
  render: () => <DemoTab style="default" />,
};

export const Tiled: Story = {
  render: () => <DemoTab style="tiled" />,
};

export const Card: Story = {
  render: () => (
    <div className="rounded-md bg-[var(--box-box-theme-secondarybackground,#ffe9e5)] p-4">
      <DemoTab style="card" />
    </div>
  ),
};

export const WithBackground: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["default", "tiled", "card"] as TabStyle[]).map((style) => (
        <DemoTab key={style} style={style} background="default" withSlots />
      ))}
    </div>
  ),
};

export const WithSlots: Story = {
  render: () => <DemoTab style="default" withSlots />,
};

export const StyleMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["default", "tiled", "card"] as TabStyle[]).map((style) => (
        <div key={style} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {style}
          </span>
          <div
            className={
              style === "card"
                ? "rounded-md bg-[var(--box-box-theme-secondarybackground,#ffe9e5)] p-3"
                : undefined
            }
          >
            <DemoTab style={style} withSlots />
          </div>
        </div>
      ))}
    </div>
  ),
};
