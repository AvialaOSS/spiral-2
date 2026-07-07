import { Input, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";

import { PropsTable } from "../../components/PropsTable";

import { DocPageHeader } from "../../components/TableOfContents";

import { buildInputCode, inputKnobs, inputLiveCode } from "../../demos/component-demos";

import { getComponentProps } from "../../props-registry";

const inputScope = { Input };

export function InputDocPage() {
  const doc = getComponentProps("Input");

  return (
    <>
      <DocPageHeader title="Input 输入框" description="单行文本输入，支持 regular / big 尺寸。" />
      <div className="docs-prose">
        <Typography level="text" as="p">
          用于采集短文本。可在编辑器中修改 JSX，或通过 API 调参切换 size、placeholder，以及左右图标的显示与图标选择。
        </Typography>
      </div>
      <DemoBlock
        initialCode={inputLiveCode}
        scope={inputScope}
        knobs={inputKnobs}
        buildCode={buildInputCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
