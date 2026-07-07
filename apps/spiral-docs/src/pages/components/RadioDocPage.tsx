import { RadioGroup, RadioInput, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import { buildRadioCode, radioKnobs, radioLiveCode } from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const radioScope = { RadioGroup, RadioInput };

export function RadioDocPage() {
  const doc = getComponentProps("RadioGroup");

  return (
    <>
      <DocPageHeader
        title="RadioGroup 单选组"
        description="Figma Information Collect → Radio。用于互斥选项选择。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          提供 RadioGroupItem 基础控件与 RadioInput 卡片式选项，支持 vertical / horizontal 布局。
        </Typography>
      </div>
      <DemoBlock
        initialCode={radioLiveCode}
        scope={radioScope}
        knobs={radioKnobs}
        buildCode={buildRadioCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
