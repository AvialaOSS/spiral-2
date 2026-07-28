import { GeneralCollapseSidebar, GeneralSetting } from "@aviala-design/icons";

import {
  Button,
  Navigation,
  NavigationActions,
  NavigationActionsSlot,
  NavigationBrand,
  NavigationBrandTitle,
  NavigationGroup,
  NavigationItem,
  NavigationItemGroup,
  Typography,
} from "@aviala-design/spiral";

import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildNavigationCode,
  navigationKnobs,
  navigationLiveCode,
} from "../../demos/component-demos";
import { getComponentProps } from "../../props-registry";

const navigationScope = {
  Navigation,
  NavigationBrand,
  NavigationBrandTitle,
  NavigationGroup,
  NavigationItem,
  NavigationItemGroup,
  NavigationActions,
  NavigationActionsSlot,
  Button,
  GeneralSetting,
  GeneralCollapseSidebar,
};

export function NavigationDocPage() {
  const doc = getComponentProps("Navigation");

  return (
    <>
      <DocPageHeader
        title="Navigation 导航"
        description="Figma Structure Navigation → Navigation。用于侧边栏或顶栏导航结构。"
      />
      <div className="docs-prose">
        <Typography level="text" as="p">
          支持 vertical / horizontal、default / none 背景与 dividingLine。调参可编辑 Brand、Group
          items（vertical 下连续 child 会包进 NavigationItemGroup；horizontal 会展平为顶栏
          Tab）与 Actions。
        </Typography>
      </div>
      <DemoBlock
        initialCode={navigationLiveCode}
        scope={navigationScope}
        knobs={navigationKnobs}
        buildCode={buildNavigationCode}
      />
      {doc ? <PropsTable props={doc.props} /> : null}
    </>
  );
}
