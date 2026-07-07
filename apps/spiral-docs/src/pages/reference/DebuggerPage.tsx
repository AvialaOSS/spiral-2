import { Typography } from "@aviala-design/spiral";

import { ComponentDebugger } from "../../components/ComponentDebugger";

import { DocPageHeader } from "../../components/TableOfContents";



export function DebuggerPage() {

  return (

    <>

      <DocPageHeader

        title="Component Debugger"

        description="通用组件 API 调试器 — 点选预览子部件，查看组件树并实时调整 props。"

      />

      <div className="docs-prose">

        <Typography level="text" as="p">

          从工具栏选择任意已注册组件，在预览区开启点选模式后点击子部件（Trigger、Content、Label

          等）。右侧面板显示面包屑路径与对应 API 旋钮，变更会立即反映到预览。新增组件只需在{" "}

          <code>debug/registry.ts</code> 注册条目并为 DOM 节点添加{" "}

          <code>data-spiral-debug-id</code>。

        </Typography>

      </div>

      <ComponentDebugger />

    </>

  );

}


