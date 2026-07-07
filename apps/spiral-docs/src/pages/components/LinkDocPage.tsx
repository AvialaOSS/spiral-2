import { GeneralSetting } from "@aviala-design/icons";

import { Link, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import { buildLinkCode, linkKnobs, linkLiveCode } from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const linkScope = { Link, GeneralSetting };

export function LinkDocPage() {
  const doc = getComponentProps("Link");

  return (
    <>
      <DocPageHeader
        title="Link 链接"
        description="Figma Basic Input → Link。用于导航或内联操作链接。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          支持 caption / text 层级、noBackground 模式，以及左右图标与 iconOnly 变体。
        </Typography>
      </div>
      <DemoBlock
        initialCode={linkLiveCode}
        scope={linkScope}
        knobs={linkKnobs}
        buildCode={buildLinkCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
