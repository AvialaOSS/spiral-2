import InstallationMdx from "../../content/start/installation.mdx";
import { DocPageHeader } from "../../components/TableOfContents";
import { mdxComponents } from "../../mdx-components";

export function InstallationPage() {
  return (
    <>
      <DocPageHeader title="安装" description="在项目中接入 Spiral 2" />
      <div className="docs-prose">
        <InstallationMdx components={mdxComponents} />
      </div>
    </>
  );
}
