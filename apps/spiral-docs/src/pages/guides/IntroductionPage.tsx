import IntroductionMdx from "../../content/start/introduction.mdx";
import { DocPageHeader } from "../../components/TableOfContents";
import { mdxComponents } from "../../mdx-components";

export function IntroductionPage() {
  return (
    <>
      <DocPageHeader
        title="介绍"
        description="Spiral 2 — 与 Aviala Design 对齐的 React 组件库"
      />
      <div className="docs-prose">
        <IntroductionMdx components={mdxComponents} />
      </div>
    </>
  );
}
