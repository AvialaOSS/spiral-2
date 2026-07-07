import { SymbolInformationCircle } from "@aviala/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeaderText,
  ModalTrigger,
} from "./modal";
import { Stack } from "./stack";

const meta: Meta<typeof Modal> = {
  title: "Information Display/Modal",
  component: Modal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button mode="default">Open modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeaderText
          showIcon
          icon={<SymbolInformationCircle thickness="Regular" mode="fill" aria-hidden />}
          title="Modal title"
          description="Supporting caption in the header."
        />
        <ModalBody layout="text" title="Section title" description="Body copy for the dialog." />
        <ModalFooter>
          <Button mode="second">Cancel</Button>
          <Button mode="primary">Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const Large: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button mode="primary">Open large modal</Button>
      </ModalTrigger>
      <ModalContent size="large">
        <ModalHeaderText title="Large modal" description="480px max content width." />
        <ModalBody>
          <p>Use the large size for forms or richer content panels.</p>
        </ModalBody>
        <ModalFooter>
          <Button mode="primary">Done</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const CustomBodySlot: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button mode="second">Custom body slot</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeaderText title="Custom content" />
        <ModalBody>
          <Stack gap="content">
            <p>Figma `Content=Default` slot — compose any children here.</p>
            <Button mode="default" size="small">
              Inline action
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button mode="noBackground">No footer</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeaderText title="Read only" description="Dismiss with the header close control." />
        <ModalBody layout="text" description="Informational modal without action buttons." />
      </ModalContent>
    </Modal>
  ),
};
