import { Button, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";

import { PropsTable } from "../../components/PropsTable";

import { DocPageHeader } from "../../components/TableOfContents";

import {
  buildButtonCode,
  buttonKnobs,
  buttonLiveCode,
} from "../../demos/component-demos";

import { getComponentProps } from "../../props-registry";

const buttonScope = {
  Button,
};

export function ButtonDocPage() {
  const doc = getComponentProps("Button");

  return (
    <>
      <DocPageHeader
        title="Button 按钮"
        description="Figma Basic Input → Button。支持多种 mode、尺寸与图标组合。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          用于触发操作的主交互控件。可在下方实时编辑代码，或通过 API 调参面板切换 props、左右图标与 iconOnly。
        </Typography>
      </div>
      <DemoBlock
        initialCode={buttonLiveCode}
        scope={buttonScope}
        knobs={buttonKnobs}
        buildCode={buildButtonCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
