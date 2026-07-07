import {

  Select,

  SelectContent,

  SelectItem,

  SelectItemGroup,

  SelectTrigger,

  SelectValue,

  Typography,

} from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";

import { PropsTable } from "../../components/PropsTable";

import { DocPageHeader } from "../../components/TableOfContents";

import { buildSelectCode, selectKnobs, selectLiveCode } from "../../demos/component-demos";

import { getComponentProps } from "../../props-registry";



const selectScope = {

  Select,

  SelectTrigger,

  SelectValue,

  SelectContent,

  SelectItemGroup,

  SelectItem,

};



export function SelectDocPage() {

  const doc = getComponentProps("Select");



  return (

    <>

      <DocPageHeader

        title="Select 选择器"

        description="下拉选择，支持分组、多种 item 功能变体（radio、form-radio 等）。"

      />

      <div className="docs-prose">

        <Typography level="text" as="p">

          基于 Radix Select 的组合式 API。可在 Monaco 编辑器中调整组合式 JSX 结构。

        </Typography>

      </div>

      <DemoBlock

        initialCode={selectLiveCode}

        scope={selectScope}

        knobs={selectKnobs}

        buildCode={buildSelectCode}

      />

      {doc ? <PropsTable props={doc.props} /> : null}

    </>

  );

}


