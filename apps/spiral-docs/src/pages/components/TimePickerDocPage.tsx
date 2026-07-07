import { useState } from "react";

import { FormField, TimePicker, TimePickerContent, TimePickerField, TimePickerPanel, TimePickerTrigger, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildTimePickerCode,
  timePickerCompoundCode,
  timePickerKnobs,
  timePickerLiveCode,
  timePickerWithFormFieldCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const timePickerScope = {
  TimePicker,
  TimePickerTrigger,
  TimePickerContent,
  TimePickerPanel,
  TimePickerField,
  FormField,
  useState,
};

export function TimePickerDocPage() {
  const doc = getComponentProps("TimePickerField");

  return (
    <>
      <DocPageHeader
        title="TimePicker 时间选择"
        description="Figma Information Collect → TimePicker。仅选择小时与分钟，采用滚轮交互。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          提供 TimePickerField 便捷封装，也可使用 TimePicker + Trigger + Content 组合式 API。分钟步长为
          5 分钟，滚轮支持拖拽、滚轮与触摸滚动，选中项居中高亮。
        </Typography>
      </div>
      <DemoBlock
        initialCode={timePickerLiveCode}
        scope={timePickerScope}
        knobs={timePickerKnobs}
        buildCode={buildTimePickerCode}
      />
      <DemoBlock
        title="表单字段"
        initialCode={timePickerWithFormFieldCode}
        scope={timePickerScope}
      />
      <DemoBlock title="组合式 API" initialCode={timePickerCompoundCode} scope={timePickerScope} />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
