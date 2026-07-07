import { useState } from "react";

import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
  Typography,
} from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildColorPickerCode,
  colorPickerKnobs,
  colorPickerLiveCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const colorPickerScope = {
  ColorPicker,
  ColorPickerTrigger,
  ColorPickerContent,
  useState,
};

export function ColorPickerDocPage() {
  const doc = getComponentProps("ColorPicker");

  return (
    <>
      <DocPageHeader
        title="ColorPicker 颜色选择"
        description="Figma Information Collect → ColorPicker。用于颜色选取与预设管理。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          组合式 API：ColorPicker + Trigger + Content。支持透明度、预设色板与 allRound 外观。
        </Typography>
      </div>
      <DemoBlock
        initialCode={colorPickerLiveCode}
        scope={colorPickerScope}
        knobs={colorPickerKnobs}
        buildCode={buildColorPickerCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
