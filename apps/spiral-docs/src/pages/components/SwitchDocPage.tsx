import { Switch, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import { buildSwitchCode, switchKnobs, switchLiveCode } from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const switchScope = { Switch };

export function SwitchDocPage() {
  const doc = getComponentProps("Switch");

  return (
    <>
      <DocPageHeader
        title="Switch 开关"
        description="Figma Basic Input → Switch。用于二元状态切换。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          支持 regular / small 尺寸，以及 disabled 与受控 / 非受控用法。
        </Typography>
      </div>
      <DemoBlock
        initialCode={switchLiveCode}
        scope={switchScope}
        knobs={switchKnobs}
        buildCode={buildSwitchCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
