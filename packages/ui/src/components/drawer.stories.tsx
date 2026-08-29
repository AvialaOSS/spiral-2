import { SymbolInformationCircle } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeaderText,
  DrawerTrigger,
  type DrawerPosition,
} from "./drawer";
import { Stack } from "./stack";

const meta: Meta<typeof Drawer> = {
  title: "Information Display/Drawer",
  component: Drawer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

function DrawerDemo({
  position = "right",
  triggerLabel,
}: {
  position?: DrawerPosition;
  triggerLabel: string;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button mode="default">{triggerLabel}</Button>
      </DrawerTrigger>
      <DrawerContent position={position}>
        <DrawerHeaderText
          showIcon
          icon={<SymbolInformationCircle thickness="Regular" mode="fill" aria-hidden />}
          title="Drawer title"
          description="Supporting caption in the header."
        />
        <DrawerBody layout="text" title="Section title" description="Body copy for the drawer." />
        <DrawerFooter>
          <Button mode="second">Cancel</Button>
          <Button mode="primary">Confirm</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const Default: Story = {
  render: () => <DrawerDemo triggerLabel="Open drawer" />,
};

export const Left: Story = {
  render: () => <DrawerDemo position="left" triggerLabel="Open left" />,
};

export const Top: Story = {
  render: () => <DrawerDemo position="top" triggerLabel="Open top" />,
};

export const Bottom: Story = {
  render: () => <DrawerDemo position="bottom" triggerLabel="Open bottom" />,
};

export const CustomBodySlot: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button mode="second">Custom body slot</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeaderText title="Custom content" />
        <DrawerBody>
          <Stack gap="content">
            <p>Figma `Content=Default` slot — compose any children here.</p>
            <Button mode="default" size="small">
              Inline action
            </Button>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button mode="noBackground">No footer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeaderText title="Read only" description="Dismiss with the header close control." />
        <DrawerBody layout="text" description="Informational drawer without action buttons." />
      </DrawerContent>
    </Drawer>
  ),
};
