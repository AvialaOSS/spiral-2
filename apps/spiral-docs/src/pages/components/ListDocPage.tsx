import { GeneralSetting } from "@aviala-design/icons";

import {
  List,
  ListItem,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  Typography,
} from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import { buildListCode, listKnobs, listLiveCode } from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const listScope = {
  List,
  ListItem,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItemGroup,
  SelectItem,
  GeneralSetting,
};

export function ListDocPage() {
  const doc = getComponentProps("List");

  return (
    <>
      <DocPageHeader
        title="List 列表"
        description="Figma Structure Navigation → List。用于设置项或表单分组列表。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          支持 select / action / switch 尾部类型，以及 shaped / default / none 前置图标样式。
        </Typography>
      </div>
      <DemoBlock
        initialCode={listLiveCode}
        scope={listScope}
        knobs={listKnobs}
        buildCode={buildListCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
