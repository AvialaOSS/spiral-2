import { Anchor, AnchorItem, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import { buildAnchorCode, anchorKnobs, anchorLiveCode } from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const anchorScope = { Anchor, AnchorItem };

export function AnchorDocPage() {
  const doc = getComponentProps("Anchor");

  return (
    <>
      <DocPageHeader
        title="Anchor 锚点"
        description="Figma System Composition → Anchor。用于页面内章节导航。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          支持 0–3 级缩进与 activated 激活态，常用于文档目录或 TOC 侧栏。
        </Typography>
      </div>
      <DemoBlock
        initialCode={anchorLiveCode}
        scope={anchorScope}
        knobs={anchorKnobs}
        buildCode={buildAnchorCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
