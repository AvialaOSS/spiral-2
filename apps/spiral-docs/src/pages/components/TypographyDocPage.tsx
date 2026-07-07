import { Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildTypographyCode,
  typographyKnobs,
  typographyLiveCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const typographyScope = { Typography };

export function TypographyDocPage() {
  const doc = getComponentProps("Typography");

  return (
    <>
      <DocPageHeader
        title="Typography 排版"
        description="Figma System Composition → Typography。用于语义化文字层级。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          提供 display 至 caption 共 7 级文字样式，支持 text / number 内容与 default / white 色调。
        </Typography>
      </div>
      <DemoBlock
        initialCode={typographyLiveCode}
        scope={typographyScope}
        knobs={typographyKnobs}
        buildCode={buildTypographyCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
