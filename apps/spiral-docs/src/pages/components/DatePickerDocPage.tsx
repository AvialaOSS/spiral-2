import { useState } from "react";

import { DatePickerField, Typography } from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildDatePickerCode,
  datePickerDateOnlyCode,
  datePickerKnobs,
  datePickerLiveCode,
  datePickerWithTimeCode,
  datePickerWithTimeRangeCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const datePickerScope = { DatePickerField, useState };

export function DatePickerDocPage() {
  const doc = getComponentProps("DatePickerField");

  return (
    <>
      <DocPageHeader
        title="DatePicker 日期选择"
        description="Figma Information Collect → DatePicker。支持单选、区间选择与日期时间。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          提供 DatePickerField 便捷封装，也可使用 DatePicker + Trigger + Content 组合式 API。默认启用时间（
          <code>enableTime</code>
          ），触发器显示 YYYY-MM-DD HH:mm；设为 false 时仅选择日期。时间面板采用 iOS 风格的滚轮选择器，支持拖拽、滚轮与触摸滚动，选中项居中高亮。
        </Typography>
      </div>
      <DemoBlock
        initialCode={datePickerLiveCode}
        scope={datePickerScope}
        knobs={datePickerKnobs}
        buildCode={buildDatePickerCode}
      />
      <DemoBlock
        title="日期与时间（单选）"
        initialCode={datePickerWithTimeCode}
        scope={datePickerScope}
      />
      <DemoBlock
        title="日期与时间（区间）"
        initialCode={datePickerWithTimeRangeCode}
        scope={datePickerScope}
      />
      <DemoBlock
        title="仅日期"
        initialCode={datePickerDateOnlyCode}
        scope={datePickerScope}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
