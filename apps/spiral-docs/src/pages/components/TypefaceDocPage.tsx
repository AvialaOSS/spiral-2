import { Typeface, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildTypefaceCode,
  typefaceKnobs,
  typefaceLiveCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const typefaceScope = { Typeface };

export function TypefaceDocPage() {
  const doc = getComponentProps("Typeface");

  return (
    <>
      <DocPageHeader
        title="Typeface 字体组合"
        description="Figma System Composition → Typeface。用于多行文字层级组合。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          通过 content 预设控制主 / 副 / 辅助文字组合，也可使用 TypefacePair 快捷封装。
        </Typography>
      </div>
      <DemoBlock
        initialCode={typefaceLiveCode}
        scope={typefaceScope}
        knobs={typefaceKnobs}
        buildCode={buildTypefaceCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
