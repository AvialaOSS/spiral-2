import { FormField, Input, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildFormFieldCode,
  formFieldKnobs,
  formFieldLiveCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const formFieldScope = { FormField, Input };

export function FormFieldDocPage() {
  const doc = getComponentProps("FormField");

  return (
    <>
      <DocPageHeader
        title="FormField 表单字段"
        description="Figma System Composition → FormField。用于标签、描述与控件组合。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          将 label、description 与任意输入控件组合，配合 Stack / Fieldset 构建表单布局。
        </Typography>
      </div>
      <DemoBlock
        initialCode={formFieldLiveCode}
        scope={formFieldScope}
        knobs={formFieldKnobs}
        buildCode={buildFormFieldCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
