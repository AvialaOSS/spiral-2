import { SegmentatorGroup, SegmentatorItem, Typography } from "@aviala-design/spiral";

import { useState } from "react";

import { DemoBlock } from "../../components/DemoBlock";

import { PropsTable } from "../../components/PropsTable";

import { DocPageHeader } from "../../components/TableOfContents";

import {

  buildSegmentatorCode,

  segmentatorKnobs,

  segmentatorLiveCode,

} from "../../demos/component-demos";

import { getComponentProps } from "../../props-registry";



const segmentatorScope = {

  SegmentatorGroup,

  SegmentatorItem,

  useState,

};



export function SegmentatorDocPage() {

  const doc = getComponentProps("SegmentatorGroup");



  return (

    <>

      <DocPageHeader

        title="Segmentator 分段器"

        description="在互斥选项间切换，带滑动指示器动画。"

      />

      <div className="docs-prose">

        <Typography level="text" as="p">

          支持 nested / tiled 模式与 allRound。编辑器内可编写含 useState 的示例代码。

        </Typography>

      </div>

      <DemoBlock

        initialCode={segmentatorLiveCode}

        scope={segmentatorScope}

        knobs={segmentatorKnobs}

        buildCode={buildSegmentatorCode}

      />

      {doc ? <PropsTable props={doc.props} /> : null}

    </>

  );

}


