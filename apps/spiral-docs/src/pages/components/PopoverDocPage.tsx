import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
} from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import { buildPopoverCode, popoverKnobs, popoverLiveCode } from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const popoverScope = { Popover, PopoverTrigger, PopoverContent, Button };

export function PopoverDocPage() {
  const doc = getComponentProps("Popover");

  return (
    <>
      <DocPageHeader
        title="Popover 弹出层"
        description="Figma System Composition → Popover。用于富内容浮层面板。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          基于 Radix Popover，支持四向 placement、箭头与自定义 anchor 元素。
        </Typography>
      </div>
      <DemoBlock
        initialCode={popoverLiveCode}
        scope={popoverScope}
        knobs={popoverKnobs}
        buildCode={buildPopoverCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
