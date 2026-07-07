import { Loading, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import { buildLoadingCode, loadingKnobs, loadingLiveCode } from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const loadingScope = { Loading };

export function LoadingDocPage() {
  const doc = getComponentProps("Loading");

  return (
    <>
      <DocPageHeader
        title="Loading 加载"
        description="Figma System Composition → Loading Icon。用于加载状态指示。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          提供 7 级尺寸与 theme / themeText / black / white 模式，可选 lineHeightFix 对齐修正。
        </Typography>
      </div>
      <DemoBlock
        initialCode={loadingLiveCode}
        scope={loadingScope}
        knobs={loadingKnobs}
        buildCode={buildLoadingCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
