import type { Meta, StoryObj } from "@storybook/react";
import { Steps, StepsItem } from "./steps";

const meta: Meta<typeof Steps> = {
  title: "Structure Navigation/Steps",
  component: Steps,
  tags: ["autodocs"],
};
export default meta;

export const Horizontal: StoryObj<typeof Steps> = {
  render: () => (
    <Steps direction="horizontal" style={{ width: 388 }}>
      <StepsItem state="done" title="Done" description="Completed" index={1} />
      <StepsItem state="inProgress" title="In progress" description="Working" index={2} />
      <StepsItem state="default" title="Next" description="Waiting" index={3} />
    </Steps>
  ),
};

export const Vertical: StoryObj<typeof Steps> = {
  render: () => (
    <Steps direction="vertical">
      <StepsItem state="done" title="Done" index={1} />
      <StepsItem state="fail" title="Failed" index={2} />
      <StepsItem state="warning" title="Warning" index={3} />
      <StepsItem state="waiting" title="Waiting" index={4} />
      <StepsItem state="inProgress" title="In progress" index={5} />
      <StepsItem state="default" title="Default" index={6} />
    </Steps>
  ),
};
