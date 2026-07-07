import { Feedback, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildFeedbackCode,
  feedbackKnobs,
  feedbackLiveCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const feedbackScope = { Feedback };

export function FeedbackDocPage() {
  const doc = getComponentProps("Feedback");

  return (
    <>
      <DocPageHeader
        title="Feedback 反馈"
        description="Figma Response And Feedback → Feedback。用于轻量 inline 反馈条。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          支持 information、warning、wrong、success、normal 类型，以及 default / primary 模式。
        </Typography>
      </div>
      <DemoBlock
        initialCode={feedbackLiveCode}
        scope={feedbackScope}
        knobs={feedbackKnobs}
        buildCode={buildFeedbackCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
