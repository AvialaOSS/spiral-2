import { GeneralSetting } from "@aviala-design/icons";

import { Textarea, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildTextareaCode,
  textareaKnobs,
  textareaLiveCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const textareaScope = { Textarea, GeneralSetting };

export function TextareaDocPage() {
  const doc = getComponentProps("Textarea");

  return (
    <>
      <DocPageHeader
        title="Textarea 多行输入"
        description="Figma Information Collect → Textarea。用于多行文本采集。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          支持 regular / big 尺寸、字符计数、图标装饰，以及 error / disabled 状态。
        </Typography>
      </div>
      <DemoBlock
        initialCode={textareaLiveCode}
        scope={textareaScope}
        knobs={textareaKnobs}
        buildCode={buildTextareaCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
