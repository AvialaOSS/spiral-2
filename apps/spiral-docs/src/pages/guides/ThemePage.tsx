import ThemeMdx from "../../content/start/theme.mdx";
import { DocPageHeader } from "../../components/TableOfContents";
import { PropsTable } from "../../components/PropsTable";
import { getComponentProps } from "../../props-registry";
import { mdxComponents } from "../../mdx-components";

export function ThemePage() {
  const themeProps = getComponentProps("ThemeProvider");

  return (
    <>
      <DocPageHeader title="主题" description="ThemeProvider、模式与 base-numbers 密度" />
      <div className="docs-prose">
        <ThemeMdx components={mdxComponents} />
      </div>
      {themeProps ? <PropsTable props={themeProps.props} /> : null}
    </>
  );
}
