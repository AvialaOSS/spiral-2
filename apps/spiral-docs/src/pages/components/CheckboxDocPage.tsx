import { Checkbox, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildCheckboxCode,
  checkboxKnobs,
  checkboxLiveCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const checkboxScope = { Checkbox };

export function CheckboxDocPage() {
  const doc = getComponentProps("Checkbox");

  return (
    <>
      <DocPageHeader
        title="Checkbox 复选框"
        description="Figma Information Collect → Checkbox。用于多选或布尔开关。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          支持方形 / 圆形（round）外观、indeterminate 状态，以及 CheckboxGroup / CheckboxInput 组合。
        </Typography>
      </div>
      <DemoBlock
        initialCode={checkboxLiveCode}
        scope={checkboxScope}
        knobs={checkboxKnobs}
        buildCode={buildCheckboxCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
