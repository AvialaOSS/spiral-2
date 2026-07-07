import { GeneralSetting } from "@aviala-design/icons";
import { useState } from "react";

import { CascaderField, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildCascaderCode,
  cascaderKnobs,
  cascaderLiveCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const cascaderScope = { CascaderField, GeneralSetting, useState };

export function CascaderDocPage() {
  const doc = getComponentProps("CascaderField");

  return (
    <>
      <DocPageHeader
        title="Cascader 级联选择"
        description="Figma Information Collect → Cascader。用于多级选项选择。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          提供 CascaderField 便捷封装，也可使用 Cascader + Trigger + Content 组合式 API。
        </Typography>
      </div>
      <DemoBlock
        initialCode={cascaderLiveCode}
        scope={cascaderScope}
        knobs={cascaderKnobs}
        buildCode={buildCascaderCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
