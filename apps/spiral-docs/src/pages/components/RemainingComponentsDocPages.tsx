import { DirectionArrowLeft, UsersUserCircle } from "@aviala-design/icons";
import {
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbEllipsisItem,
  BreadcrumbItem,
  BreadcrumbSeparator,
  Button,
  Card,
  CardBody,
  CardBottom,
  CardHead,
  Pagehead,
  Pagination,
  Progress,
  Scroll,
  ScrollPicker,
  ScrollPickerColumn,
  Slider,
  Steps,
  StepsItem,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Tag,
  Typography,
  Upload,
} from "@aviala-design/spiral";
import { useState } from "react";

import { DemoBlock } from "../../components/DemoBlock";
import type { KnobDef, KnobValues } from "../../components/DemoKnobs";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  avatarKnobs,
  avatarLiveCode,
  badgeKnobs,
  badgeLiveCode,
  breadcrumbKnobs,
  breadcrumbLiveCode,
  buildAvatarCode,
  buildBadgeCode,
  buildBreadcrumbCode,
  buildCardCode,
  buildPageheadCode,
  buildPaginationCode,
  buildProgressCode,
  buildScrollCode,
  buildScrollPickerCode,
  buildSliderCode,
  buildStepsCode,
  buildTableCode,
  buildTagCode,
  buildUploadCode,
  cardKnobs,
  cardLiveCode,
  pageheadKnobs,
  pageheadLiveCode,
  paginationKnobs,
  paginationLiveCode,
  progressKnobs,
  progressLiveCode,
  scrollKnobs,
  scrollLiveCode,
  scrollPickerKnobs,
  scrollPickerLiveCode,
  sliderKnobs,
  sliderLiveCode,
  stepsKnobs,
  stepsLiveCode,
  tableKnobs,
  tableLiveCode,
  tagKnobs,
  tagLiveCode,
  uploadKnobs,
  uploadLiveCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

function DocShell({
  title,
  description,
  prose,
  componentKey,
  scope,
  knobs,
  buildCode,
  liveCode,
}: {
  title: string;
  description: string;
  prose: string;
  componentKey: string;
  scope: Record<string, unknown>;
  knobs: KnobDef[];
  buildCode: (values: KnobValues) => string;
  liveCode: string;
}) {
  const doc = getComponentProps(componentKey);
  return (
    <>
      <DocPageHeader title={title} description={description} />
      <div className="docs-prose">
        <Typography level="text" as="p">
          {prose}
        </Typography>
      </div>
      <DemoBlock
        initialCode={liveCode}
        scope={scope}
        knobs={knobs}
        buildCode={buildCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}

export function BadgeDocPage() {
  return (
    <DocShell
      title="Badge 徽章"
      description="Figma Information Display → Badge。"
      prose="支持 Style / Level / Primary / LineHeightFix 变体。"
      componentKey="Badge"
      scope={{ Badge }}
      knobs={badgeKnobs}
      buildCode={buildBadgeCode}
      liveCode={badgeLiveCode}
    />
  );
}

export function AvatarDocPage() {
  return (
    <DocShell
      title="Avatar 头像"
      description="Figma Information Display → Avata。"
      prose="支持 Text / Picture / Icon，以及与 Typography 对齐的 Level。"
      componentKey="Avatar"
      scope={{ Avatar, UsersUserCircle }}
      knobs={avatarKnobs}
      buildCode={buildAvatarCode}
      liveCode={avatarLiveCode}
    />
  );
}

export function TagDocPage() {
  return (
    <DocShell
      title="Tag 标签"
      description="Figma Information Display → Tag。"
      prose="支持 Text / People 内容与 closable / disabled。"
      componentKey="Tag"
      scope={{ Tag }}
      knobs={tagKnobs}
      buildCode={buildTagCode}
      liveCode={tagLiveCode}
    />
  );
}

export function ProgressDocPage() {
  return (
    <DocShell
      title="Progress 进度"
      description="Figma Response And Feedback → Progress。"
      prose="支持 Bar / Ring，Default / Success / Fail，以及百分比标签。"
      componentKey="Progress"
      scope={{ Progress }}
      knobs={progressKnobs}
      buildCode={buildProgressCode}
      liveCode={progressLiveCode}
    />
  );
}

export function ScrollDocPage() {
  return (
    <DocShell
      title="Scroll 滚动条"
      description="Figma System Composition → Scroll。"
      prose="自定义滚动条外观，支持 default / small 与垂直 / 水平。"
      componentKey="Scroll"
      scope={{ Scroll }}
      knobs={scrollKnobs}
      buildCode={buildScrollCode}
      liveCode={scrollLiveCode}
    />
  );
}

export function SliderDocPage() {
  return (
    <DocShell
      title="Slider 滑块"
      description="Figma Information Collect → Slider。"
      prose="支持 Default / Range 类型与 Default / Big 尺寸。"
      componentKey="Slider"
      scope={{ Slider }}
      knobs={sliderKnobs}
      buildCode={buildSliderCode}
      liveCode={sliderLiveCode}
    />
  );
}

export function UploadDocPage() {
  return (
    <DocShell
      title="Upload 上传"
      description="Figma Information Collect → Upload。"
      prose="Default / Large 触发区，支持 multiple 与 disabled。"
      componentKey="Upload"
      scope={{ Upload }}
      knobs={uploadKnobs}
      buildCode={buildUploadCode}
      liveCode={uploadLiveCode}
    />
  );
}

export function ScrollPickerDocPage() {
  return (
    <DocShell
      title="ScrollPicker 滚轮选择"
      description="Figma Information Collect → ScrollPicker。"
      prose="多列滚轮选择器，可开关循环滚动。"
      componentKey="ScrollPicker"
      scope={{ ScrollPicker, ScrollPickerColumn, useState }}
      knobs={scrollPickerKnobs}
      buildCode={buildScrollPickerCode}
      liveCode={scrollPickerLiveCode}
    />
  );
}

export function BreadcrumbDocPage() {
  return (
    <DocShell
      title="Breadcrumb 面包屑"
      description="Figma Structure Navigation → Breadcrumb。"
      prose="支持 default / small；中间省略为 Storage item button，可用 activated 展开 Select Menu。"
      componentKey="Breadcrumb"
      scope={{
        Breadcrumb,
        BreadcrumbItem,
        BreadcrumbSeparator,
        BreadcrumbEllipsis,
        BreadcrumbEllipsisItem,
        useState,
      }}
      knobs={breadcrumbKnobs}
      buildCode={buildBreadcrumbCode}
      liveCode={breadcrumbLiveCode}
    />
  );
}

export function PageheadDocPage() {
  return (
    <DocShell
      title="Pagehead 页头"
      description="Figma Structure Navigation → Pagehead。"
      prose="组合标题、描述、面包屑与操作区。"
      componentKey="Pagehead"
      scope={{
        Pagehead,
        Breadcrumb,
        BreadcrumbItem,
        BreadcrumbSeparator,
        Button,
        DirectionArrowLeft,
      }}
      knobs={pageheadKnobs}
      buildCode={buildPageheadCode}
      liveCode={pageheadLiveCode}
    />
  );
}

export function StepsDocPage() {
  return (
    <DocShell
      title="Steps 步骤条"
      description="Figma Structure Navigation → Steps。"
      prose="支持水平 / 垂直方向，以及 done / fail / warning / waiting / inProgress / default 状态。"
      componentKey="Steps"
      scope={{ Steps, StepsItem }}
      knobs={stepsKnobs}
      buildCode={buildStepsCode}
      liveCode={stepsLiveCode}
    />
  );
}

export function PaginationDocPage() {
  return (
    <DocShell
      title="Pagination 分页"
      description="Figma Structure Navigation → Pagination。"
      prose="受控页码切换，可选跳转输入。"
      componentKey="Pagination"
      scope={{ Pagination, useState }}
      knobs={paginationKnobs}
      buildCode={buildPaginationCode}
      liveCode={paginationLiveCode}
    />
  );
}

export function CardDocPage() {
  return (
    <DocShell
      title="Card 卡片"
      description="Figma Structure Navigation → Card。"
      prose="Head / Body / Bottom 组合。演示对齐 Figma Card 整卡：标题区 + 内容区 + 底部操作；Head 单项也可单独用 action / switch / select。"
      componentKey="Card"
      scope={{ Card, CardHead, CardBody, CardBottom }}
      knobs={cardKnobs}
      buildCode={buildCardCode}
      liveCode={cardLiveCode}
    />
  );
}

export function TableDocPage() {
  return (
    <DocShell
      title="Table 表格"
      description="Figma Information Display → Table。"
      prose="组合式表头与单元格，支持 checkbox / people / badge 等内容类型。"
      componentKey="Table"
      scope={{ Table, TableRow, TableHead, TableCell, Avatar }}
      knobs={tableKnobs}
      buildCode={buildTableCode}
      liveCode={tableLiveCode}
    />
  );
}
