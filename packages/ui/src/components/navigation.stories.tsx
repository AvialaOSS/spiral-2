import {
  DirectionArrowDownLight,
  DirectionArrowRightLight,
  GeneralCollapseSidebar,
  GeneralFilter,
  GeneralHome,
  GeneralJumpOut,
  GeneralSetting,
  SymbolApps,
} from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "./button";
import {
  Navigation,
  NavigationActions,
  NavigationActionsSlot,
  NavigationBrand,
  NavigationBrandTitle,
  NavigationGroup,
  NavigationItem,
  NavigationItemGroup,
  NavigationItemMenu,
  NavigationItemMenuContent,
  NavigationItemMenuItem,
  NavigationItemMenuTrigger,
  NavigationSection,
} from "./navigation";
import { Typography } from "./typography";

const meta: Meta<typeof Navigation> = {
  title: "Structure Navigation/Navigation",
  component: Navigation,
  tags: ["autodocs"],
  argTypes: {
    background: { control: "radio", options: ["none", "default"] },
    direction: { control: "radio", options: ["vertical", "horizontal"] },
    dividingLine: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Navigation>;

function VerticalNavContent({
  activeId = "overview",
  onSelect,
}: {
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  const selectProps = (id: string) =>
    onSelect
      ? {
          href: "#",
          onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            onSelect(id);
          },
        }
      : {};

  return (
    <>
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem
          active={activeId === "overview"}
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<DirectionArrowDownLight aria-hidden />}
          {...selectProps("overview")}
        >
          Overview
        </NavigationItem>
        <NavigationItemGroup>
          <NavigationItem
            itemType="child"
            active={activeId === "child-1"}
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<DirectionArrowDownLight aria-hidden />}
            {...selectProps("child-1")}
          >
            Child item
          </NavigationItem>
          <NavigationItem
            itemType="child"
            active={activeId === "child-2"}
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<DirectionArrowDownLight aria-hidden />}
            {...selectProps("child-2")}
          >
            Active child
          </NavigationItem>
          <NavigationItem
            itemType="child"
            active={activeId === "child-3"}
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<DirectionArrowDownLight aria-hidden />}
            {...selectProps("child-3")}
          >
            Child item
          </NavigationItem>
        </NavigationItemGroup>
        <NavigationItem
          active={activeId === "settings"}
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<DirectionArrowDownLight aria-hidden />}
          {...selectProps("settings")}
        >
          Settings
        </NavigationItem>
        <NavigationItem
          active={activeId === "billing"}
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<DirectionArrowDownLight aria-hidden />}
          {...selectProps("billing")}
        >
          Billing
        </NavigationItem>
      </NavigationGroup>
      <NavigationActions>
        <Button mode="noBackgroundCustom" size="regular" leftIcon={<GeneralCollapseSidebar aria-hidden />}>
          Collapse Sidebar
        </Button>
        <NavigationActionsSlot>
          <Button
            mode="noBackgroundCustom"
            size="regular"
            iconOnly
            aria-label="Settings"
            leftIcon={<GeneralSetting aria-hidden />}
          />
        </NavigationActionsSlot>
      </NavigationActions>
    </>
  );
}

function HorizontalNavContent({
  activeId = "overview",
  onSelect,
}: {
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  const selectProps = (id: string) =>
    onSelect
      ? {
          href: "#",
          onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            onSelect(id);
          },
        }
      : {};

  return (
    <>
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem
          active={activeId === "overview"}
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<DirectionArrowDownLight aria-hidden />}
          {...selectProps("overview")}
        >
          Overview
        </NavigationItem>
        <NavigationItem
          active={activeId === "settings"}
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<DirectionArrowDownLight aria-hidden />}
          {...selectProps("settings")}
        >
          Settings
        </NavigationItem>
        <NavigationItem
          active={activeId === "billing"}
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<DirectionArrowDownLight aria-hidden />}
          {...selectProps("billing")}
        >
          Billing
        </NavigationItem>
        <NavigationItem
          active={activeId === "team"}
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<DirectionArrowDownLight aria-hidden />}
          {...selectProps("team")}
        >
          Team
        </NavigationItem>
      </NavigationGroup>
      <NavigationActions>
        <NavigationActionsSlot>
          <Button
            mode="noBackgroundCustom"
            size="regular"
            iconOnly
            aria-label="Settings"
            leftIcon={<GeneralSetting aria-hidden />}
          />
          <Button
            mode="noBackgroundCustom"
            size="regular"
            iconOnly
            aria-label="More"
            leftIcon={<GeneralSetting aria-hidden />}
          />
        </NavigationActionsSlot>
      </NavigationActions>
    </>
  );
}

/** Figma 624:92194 — Vertical, Background=Default, Dividing line=OFF */
export const VerticalDefault: Story = {
  render: () => (
    <Navigation direction="vertical" background="default" className="w-[260px]" aria-label="Sidebar">
      <VerticalNavContent />
    </Navigation>
  ),
};

/** Figma 624:92190 — Vertical, Background=None */
export const VerticalNone: Story = {
  render: () => (
    <Navigation direction="vertical" background="none" className="w-[260px]" aria-label="Sidebar">
      <VerticalNavContent />
    </Navigation>
  ),
};

/** Figma 624:92198 — Vertical, Background=None, Dividing line=ON */
export const VerticalDividingLine: Story = {
  render: () => (
    <Navigation
      direction="vertical"
      background="none"
      dividingLine
      className="w-[260px]"
      aria-label="Sidebar"
    >
      <VerticalNavContent />
    </Navigation>
  ),
};

/** Figma 624:92202 — Vertical, Background=Default, Dividing line=ON */
export const VerticalDefaultDividingLine: Story = {
  render: () => (
    <Navigation
      direction="vertical"
      background="default"
      dividingLine
      className="w-[260px]"
      aria-label="Sidebar"
    >
      <VerticalNavContent />
    </Navigation>
  ),
};

/** Figma 624:61778 — Horizontal, Background=Default */
export const HorizontalDefault: Story = {
  render: () => (
    <Navigation direction="horizontal" background="default" className="w-full max-w-[1076px]" aria-label="Top bar">
      <HorizontalNavContent />
    </Navigation>
  ),
};

/** Figma 624:61776 — Horizontal, Background=None */
export const HorizontalNone: Story = {
  render: () => (
    <Navigation direction="horizontal" background="none" className="w-full max-w-[1076px]" aria-label="Top bar">
      <HorizontalNavContent />
    </Navigation>
  ),
};

/** Figma 624:61840 — Horizontal, Background=None, Dividing line=ON */
export const HorizontalDividingLine: Story = {
  render: () => (
    <Navigation
      direction="horizontal"
      background="none"
      dividingLine
      className="w-full max-w-[1076px]"
      aria-label="Top bar"
    >
      <HorizontalNavContent />
    </Navigation>
  ),
};

/** Docs sidebar — same structure as spiral-docs (Figma VerticalDefault) */
export const DocsPattern: Story = {
  render: function DocsPatternStory() {
    const [activeId, setActiveId] = useState("intro");
    const [expandedStart, setExpandedStart] = useState(true);

    const selectProps = (id: string) => ({
      href: "#",
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setActiveId(id);
      },
    });

    const startChildIds = new Set(["intro", "install", "theme"]);
    const startHasActiveChild = startChildIds.has(activeId);

    return (
      <Navigation direction="vertical" background="default" className="w-[260px]" aria-label="Docs">
        <NavigationBrand>
          <NavigationBrandTitle href="#">Spiral 2</NavigationBrandTitle>
          <Typography level="caption" as="p">
            Aviala Design React 组件库
          </Typography>
        </NavigationBrand>
        <NavigationGroup>
          <NavigationItem
            active={startHasActiveChild && !expandedStart}
            leftIcon={<GeneralHome aria-hidden />}
            rightIcon={<DirectionArrowDownLight aria-hidden />}
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setExpandedStart((value) => !value);
            }}
          >
            开始
          </NavigationItem>
          <NavigationItemGroup expanded={expandedStart}>
            <NavigationItem itemType="child" active={activeId === "intro"} {...selectProps("intro")}>
              介绍
            </NavigationItem>
            <NavigationItem itemType="child" active={activeId === "install"} {...selectProps("install")}>
              安装
            </NavigationItem>
            <NavigationItem itemType="child" active={activeId === "theme"} {...selectProps("theme")}>
              主题
            </NavigationItem>
          </NavigationItemGroup>
          <NavigationItem
            active={activeId === "basic"}
            leftIcon={<SymbolApps aria-hidden />}
            rightIcon={<DirectionArrowDownLight aria-hidden />}
            {...selectProps("basic")}
          >
            基础输入
          </NavigationItem>
          <NavigationItem
            active={activeId === "forms"}
            leftIcon={<GeneralFilter aria-hidden />}
            rightIcon={<DirectionArrowDownLight aria-hidden />}
            {...selectProps("forms")}
          >
            信息采集
          </NavigationItem>
        </NavigationGroup>
        <NavigationActions>
          <Button mode="noBackgroundCustom" size="regular" leftIcon={<GeneralCollapseSidebar aria-hidden />}>
            Collapse Sidebar
          </Button>
          <NavigationActionsSlot>
            <Button
              mode="noBackgroundCustom"
              size="regular"
              iconOnly
              aria-label="打开 Storybook"
              leftIcon={<GeneralJumpOut aria-hidden />}
            />
            <Button
              mode="noBackgroundCustom"
              size="regular"
              iconOnly
              aria-label="设置"
              leftIcon={<GeneralSetting aria-hidden />}
            />
          </NavigationActionsSlot>
        </NavigationActions>
      </Navigation>
    );
  },
};

/** Figma Navigation Items inactive vs active — label uses Button `noBackgroundCustom` / `second`. */
export const ItemStates: Story = {
  render: () => (
    <div className="flex w-[280px] flex-col gap-3">
      <NavigationItem
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<DirectionArrowDownLight aria-hidden />}
      >
        Default tab item
      </NavigationItem>
      <NavigationItem
        active
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<DirectionArrowDownLight aria-hidden />}
      >
        Active tab item
      </NavigationItem>
      <NavigationItem itemType="child">Default child item</NavigationItem>
      <NavigationItem itemType="child" active>
        Active child item
      </NavigationItem>
    </div>
  ),
};

/** Click section headers to animate child groups open and closed. */
export const ExpandableSections: Story = {
  render: function ExpandableSectionsStory() {
    const [activeId, setActiveId] = useState("child-1");
    const [expandedOverview, setExpandedOverview] = useState(true);
    const [expandedSettings, setExpandedSettings] = useState(false);

    const selectProps = (id: string) => ({
      href: "#",
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setActiveId(id);
      },
    });

    const overviewChildIds = new Set(["child-1", "child-2", "child-3"]);
    const settingsChildIds = new Set(["settings-general", "settings-billing"]);
    const overviewHasActiveChild = overviewChildIds.has(activeId);
    const settingsHasActiveChild = settingsChildIds.has(activeId);

    return (
      <Navigation direction="vertical" background="default" className="w-[260px]" aria-label="Sidebar">
        <NavigationBrand>
          <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
        </NavigationBrand>
        <NavigationGroup>
          <NavigationItem
            active={overviewHasActiveChild && !expandedOverview}
            leftIcon={<GeneralHome aria-hidden />}
            rightIcon={<DirectionArrowDownLight aria-hidden />}
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setExpandedOverview((value) => !value);
            }}
          >
            Overview
          </NavigationItem>
          <NavigationItemGroup expanded={expandedOverview}>
            <NavigationItem itemType="child" active={activeId === "child-1"} {...selectProps("child-1")}>
              Child item
            </NavigationItem>
            <NavigationItem itemType="child" active={activeId === "child-2"} {...selectProps("child-2")}>
              Active child
            </NavigationItem>
            <NavigationItem itemType="child" active={activeId === "child-3"} {...selectProps("child-3")}>
              Child item
            </NavigationItem>
          </NavigationItemGroup>
          <NavigationItem
            active={settingsHasActiveChild && !expandedSettings}
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<DirectionArrowDownLight aria-hidden />}
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setExpandedSettings((value) => !value);
            }}
          >
            Settings
          </NavigationItem>
          <NavigationItemGroup expanded={expandedSettings}>
            <NavigationItem
              itemType="child"
              active={activeId === "settings-general"}
              {...selectProps("settings-general")}
            >
              General
            </NavigationItem>
            <NavigationItem
              itemType="child"
              active={activeId === "settings-billing"}
              {...selectProps("settings-billing")}
            >
              Billing
            </NavigationItem>
          </NavigationItemGroup>
        </NavigationGroup>
      </Navigation>
    );
  },
};

/** Click items to see the active indicator slide between parent and child tabs. */
export const AnimatedVertical: Story = {
  render: function AnimatedVerticalStory() {
    const [activeId, setActiveId] = useState("overview");

    return (
      <Navigation direction="vertical" background="default" className="w-[260px]" aria-label="Sidebar">
        <VerticalNavContent activeId={activeId} onSelect={setActiveId} />
      </Navigation>
    );
  },
};

/** Horizontal expandable group — the bottom indicator tracks siblings while the group animates open/closed. */
export const HorizontalExpandable: Story = {
  render: function HorizontalExpandableStory() {
    const [activeId, setActiveId] = useState("team");
    const [expanded, setExpanded] = useState(true);

    const selectProps = (id: string) => ({
      href: "#",
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setActiveId(id);
      },
    });

    return (
      <Navigation
        direction="horizontal"
        background="default"
        className="w-full max-w-[1076px]"
        aria-label="Top bar"
      >
        <NavigationBrand>
          <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
        </NavigationBrand>
        <NavigationGroup>
          <NavigationItem active={activeId === "overview"} {...selectProps("overview")}>
            Overview
          </NavigationItem>
          <NavigationItem
            leftIcon={<GeneralSetting aria-hidden />}
            rightIcon={<DirectionArrowDownLight aria-hidden />}
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setExpanded((value) => !value);
            }}
          >
            Settings
          </NavigationItem>
          <NavigationItemGroup expanded={expanded}>
            <NavigationItem
              itemType="child"
              active={activeId === "settings-general"}
              {...selectProps("settings-general")}
            >
              General
            </NavigationItem>
            <NavigationItem
              itemType="child"
              active={activeId === "settings-billing"}
              {...selectProps("settings-billing")}
            >
              Billing
            </NavigationItem>
          </NavigationItemGroup>
          <NavigationItem active={activeId === "team"} {...selectProps("team")}>
            Team
          </NavigationItem>
        </NavigationGroup>
      </Navigation>
    );
  },
};

/** Hover a parent to reveal its child items in a flyout menu (Select-like API). */
export const HoverMenuVertical: Story = {
  render: function HoverMenuVerticalStory() {
    const [startValue, setStartValue] = useState<string | undefined>("intro");
    const [formsValue, setFormsValue] = useState<string | undefined>();
    const [activeId, setActiveId] = useState("start");

    const selectProps = (id: string) => ({
      href: "#",
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setActiveId(id);
      },
    });

    return (
      <Navigation direction="vertical" background="default" className="w-[260px]" aria-label="Sidebar">
        <NavigationGroup>
          <NavigationItemMenu
            value={startValue}
            onValueChange={(value) => {
              setStartValue(value);
              setActiveId("start");
            }}
          >
            <NavigationItemMenuTrigger
              active={activeId === "start"}
              leftIcon={<GeneralHome aria-hidden />}
              rightIcon={<DirectionArrowRightLight aria-hidden />}
            >
              开始
            </NavigationItemMenuTrigger>
            <NavigationItemMenuContent>
              <NavigationItemMenuItem value="intro">介绍</NavigationItemMenuItem>
              <NavigationItemMenuItem value="install">安装</NavigationItemMenuItem>
              <NavigationItemMenuItem value="theme" rightIcon={<GeneralSetting aria-hidden />}>
                主题
              </NavigationItemMenuItem>
            </NavigationItemMenuContent>
          </NavigationItemMenu>
          <NavigationItem
            active={activeId === "basic"}
            leftIcon={<SymbolApps aria-hidden />}
            {...selectProps("basic")}
          >
            基础输入
          </NavigationItem>
          <NavigationItemMenu
            value={formsValue}
            onValueChange={(value) => {
              setFormsValue(value);
              setActiveId("forms");
            }}
          >
            <NavigationItemMenuTrigger
              active={activeId === "forms"}
              leftIcon={<GeneralFilter aria-hidden />}
              rightIcon={<DirectionArrowRightLight aria-hidden />}
            >
              信息采集
            </NavigationItemMenuTrigger>
            <NavigationItemMenuContent>
              <NavigationItemMenuItem value="select" leftIcon={<GeneralSetting aria-hidden />}>
                Select
              </NavigationItemMenuItem>
              <NavigationItemMenuItem value="checkbox" leftIcon={<GeneralSetting aria-hidden />}>
                Checkbox
              </NavigationItemMenuItem>
              <NavigationItemMenuItem value="radio" leftIcon={<GeneralSetting aria-hidden />} disabled>
                Radio（禁用）
              </NavigationItemMenuItem>
            </NavigationItemMenuContent>
          </NavigationItemMenu>
        </NavigationGroup>
      </Navigation>
    );
  },
};

/** Horizontal variant — the flyout opens below the parent item. */
export const HoverMenuHorizontal: Story = {
  render: function HoverMenuHorizontalStory() {
    const [value, setValue] = useState<string | undefined>();
    const [activeId, setActiveId] = useState("overview");

    const selectProps = (id: string) => ({
      href: "#",
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setActiveId(id);
      },
    });

    return (
      <Navigation
        direction="horizontal"
        background="default"
        className="w-full max-w-[1076px]"
        aria-label="Top bar"
      >
        <NavigationBrand>
          <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
        </NavigationBrand>
        <NavigationGroup>
          <NavigationItem active={activeId === "overview"} {...selectProps("overview")}>
            Overview
          </NavigationItem>
          <NavigationItemMenu
            value={value}
            onValueChange={(next) => {
              setValue(next);
              setActiveId("settings");
            }}
          >
            <NavigationItemMenuTrigger
              active={activeId === "settings"}
              rightIcon={<DirectionArrowDownLight aria-hidden />}
            >
              Settings
            </NavigationItemMenuTrigger>
            <NavigationItemMenuContent>
              <NavigationItemMenuItem value="general">General</NavigationItemMenuItem>
              <NavigationItemMenuItem value="billing">Billing</NavigationItemMenuItem>
            </NavigationItemMenuContent>
          </NavigationItemMenu>
          <NavigationItem active={activeId === "team"} {...selectProps("team")}>
            Team
          </NavigationItem>
        </NavigationGroup>
      </Navigation>
    );
  },
};

/** Click items to see the bottom indicator slide between horizontal tabs. */
export const AnimatedHorizontal: Story = {
  render: function AnimatedHorizontalStory() {
    const [activeId, setActiveId] = useState("overview");

    return (
      <Navigation
        direction="horizontal"
        background="default"
        className="w-full max-w-[1076px]"
        aria-label="Top bar"
      >
        <HorizontalNavContent activeId={activeId} onSelect={setActiveId} />
      </Navigation>
    );
  },
};

/** Figma variant matrix — Background × Dividing line × direction */
export const VariantMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Typography level="caption" as="p">
          Horizontal variants (624:61777)
        </Typography>
        <Navigation direction="horizontal" background="none" className="max-w-[1076px]" aria-label="H none">
          <HorizontalNavContent />
        </Navigation>
        <Navigation
          direction="horizontal"
          background="default"
          className="max-w-[1076px]"
          aria-label="H default"
        >
          <HorizontalNavContent />
        </Navigation>
        <Navigation
          direction="horizontal"
          background="none"
          dividingLine
          className="max-w-[1076px]"
          aria-label="H none divider"
        >
          <HorizontalNavContent />
        </Navigation>
        <Navigation
          direction="horizontal"
          background="default"
          dividingLine
          className="max-w-[1076px]"
          aria-label="H default divider"
        >
          <HorizontalNavContent />
        </Navigation>
      </div>
      <div className="flex flex-wrap gap-4">
        <Navigation direction="vertical" background="none" className="h-[500px] w-[260px]" aria-label="V none">
          <VerticalNavContent />
        </Navigation>
        <Navigation direction="vertical" background="default" className="h-[500px] w-[260px]" aria-label="V default">
          <VerticalNavContent />
        </Navigation>
        <Navigation
          direction="vertical"
          background="none"
          dividingLine
          className="h-[500px] w-[260px]"
          aria-label="V none divider"
        >
          <VerticalNavContent />
        </Navigation>
        <Navigation
          direction="vertical"
          background="default"
          dividingLine
          className="h-[500px] w-[260px]"
          aria-label="V default divider"
        >
          <VerticalNavContent />
        </Navigation>
      </div>
    </div>
  ),
};
