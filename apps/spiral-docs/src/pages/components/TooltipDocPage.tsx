import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import { buildTooltipCode, tooltipKnobs, tooltipLiveCode } from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const tooltipScope = {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Button,
};

export function TooltipDocPage() {
  const doc = getComponentProps("Tooltip");

  return (
    <>
      <DocPageHeader
        title="Tooltip 工具提示"
        description="Figma System Composition → Tooltip。用于悬停时的轻量说明。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          需在 TooltipProvider 内使用，支持四向 placement 与可选箭头。
        </Typography>
      </div>
      <DemoBlock
        initialCode={tooltipLiveCode}
        scope={tooltipScope}
        knobs={tooltipKnobs}
        buildCode={buildTooltipCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
