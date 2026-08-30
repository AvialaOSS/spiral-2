import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardBody, CardBottom, CardHead } from "./card";

const meta: Meta<typeof Card> = {
  title: "Structure Navigation/Card",
  component: Card,
  tags: ["autodocs"],
};
export default meta;

/** Matches Figma Card composite (738:145715): head title + body + bottom actions */
export const Default: StoryObj<typeof Card> = {
  render: () => (
    <Card style={{ width: 387 }}>
      <CardHead title="Card title" description="Caption" trailing={null} />
      <CardBody>Body content for this card.</CardBody>
      <CardBottom slotType="action" />
    </Card>
  ),
};

export const HeadAction: StoryObj<typeof CardHead> = {
  render: () => (
    <Card style={{ width: 387 }}>
      <CardHead slotType="action" title="Card title" description="Caption" />
    </Card>
  ),
};
