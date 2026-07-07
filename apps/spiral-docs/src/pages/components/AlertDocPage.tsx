import { Alert, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import { alertKnobs, alertLiveCode, buildAlertCode } from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const alertScope = { Alert };

export function AlertDocPage() {
  const doc = getComponentProps("Alert");

  return (
    <>
      <DocPageHeader
        title="Alert 提示"
        description="Figma Response And Feedback → Alert。用于页面级或区块级状态提示。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          支持 info、warning、error、success、neutral 等类型，以及 default / light 外观与可选操作区。
        </Typography>
      </div>
      <DemoBlock
        initialCode={alertLiveCode}
        scope={alertScope}
        knobs={alertKnobs}
        buildCode={buildAlertCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
