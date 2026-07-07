import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeaderText,
  ModalTrigger,
  Typography,
} from "@aviala-design/spiral";
import { SymbolInformationCircle } from "@aviala-design/icons";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import { buildModalCode, modalKnobs, modalLiveCode } from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const modalScope = {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeaderText,
  ModalBody,
  ModalFooter,
  Button,
  SymbolInformationCircle,
};

export function ModalDocPage() {
  const doc = getComponentProps("Modal");

  return (
    <>
      <DocPageHeader
        title="Modal 模态框"
        description="Figma Information Display → Modal。用于需要用户确认或输入的阻断式对话框。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          基于 Radix Dialog，包含 Header、Body、Footer 分区，支持默认与 large 宽度。
        </Typography>
      </div>
      <DemoBlock
        initialCode={modalLiveCode}
        scope={modalScope}
        knobs={modalKnobs}
        buildCode={buildModalCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
