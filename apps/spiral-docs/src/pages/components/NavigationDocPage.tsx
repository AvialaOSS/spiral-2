import { GeneralCollapseSidebar, GeneralSetting } from "@aviala/icons";

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
} from "@aviala/spiral";

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
          支持 vertical / horizontal 方向、default / none 背景，以及 dividingLine 分隔线。
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
