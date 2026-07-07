import {
  DirectionArrowDownLight,
  GeneralCollapseSidebar,
  GeneralFilter,
  GeneralHome,
  GeneralJumpOut,
  GeneralSetting,
  SymbolApps,
  SymbolMindmap,
  SymbolWarningCircle,
  type AvialaIconProps,
} from "@aviala-design/icons";
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
import { type ComponentType, useCallback, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { flattenNavItems, nav, navPathToHref, type NavSection } from "../nav";

type SidebarProps = {
  onNavigate?: () => void;
  onCollapse?: () => void;
};

type SectionConfig = {
  icon: ComponentType<AvialaIconProps>;
};

const SECTION_CONFIG: Record<string, SectionConfig> = {
  开始: { icon: GeneralHome },
  基础输入: { icon: SymbolApps },
  信息采集: { icon: GeneralFilter },
  结构导航: { icon: SymbolMindmap },
  系统组合: { icon: GeneralSetting },
  反馈: { icon: SymbolWarningCircle },
};

function findSectionForPath(pathname: string): NavSection | undefined {
  return nav.find((section) => section.items.some((item) => item.path === pathname));
}

function getInitialExpandedSections(pathname: string): Set<string> {
  const activeSection = findSectionForPath(pathname);
  return new Set(activeSection ? [activeSection.section] : [nav[0]?.section].filter(Boolean));
}

function DocsNavSection({
  section,
  expanded,
  onToggle,
  onNavigate,
  pathname,
}: {
  section: NavSection;
  expanded: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  pathname: string;
}) {
  const Icon = SECTION_CONFIG[section.section]?.icon ?? GeneralSetting;
  const sectionHasActiveChild = section.items.some((item) => item.path === pathname);

  return (
    <>
      <NavigationItem
        leftIcon={<Icon aria-hidden />}
        rightIcon={<DirectionArrowDownLight aria-hidden />}
        active={sectionHasActiveChild && !expanded}
        href="#"
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
          onToggle();
        }}
      >
        {section.section}
      </NavigationItem>
      <NavigationItemGroup expanded={expanded}>
        {section.items.map((item) => {
          const href = navPathToHref(item.path);
          const isActive = pathname === item.path;

          return (
            <NavigationItem key={item.path} itemType="child" asChild active={isActive}>
              <NavLink to={href} onClick={onNavigate}>
                <Typography level="text" as="span" className="aviala-navigation-item__label">
                  {item.label}
                </Typography>
              </NavLink>
            </NavigationItem>
          );
        })}
      </NavigationItemGroup>
    </>
  );
}

export function Sidebar({ onNavigate, onCollapse }: SidebarProps) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState(() =>
    getInitialExpandedSections(location.pathname)
  );

  useEffect(() => {
    const activeSection = findSectionForPath(location.pathname);
    if (!activeSection) return;

    setExpandedSections((current) => {
      if (current.has(activeSection.section)) return current;
      return new Set([...current, activeSection.section]);
    });
  }, [location.pathname]);

  const toggleSection = useCallback((sectionName: string) => {
    setExpandedSections((current) => {
      const next = new Set(current);
      if (next.has(sectionName)) {
        next.delete(sectionName);
      } else {
        next.add(sectionName);
      }
      return next;
    });
  }, []);

  return (
    <aside className="docs-sidebar">
      <Navigation
        direction="vertical"
        background="default"
        className="docs-sidebar-nav"
        aria-label="文档导航"
      >
        <NavigationBrand>
          <NavigationBrandTitle asChild>
            <NavLink to="/start/introduction" onClick={onNavigate}>
              Spiral 2
            </NavLink>
          </NavigationBrandTitle>
          <Typography level="caption" as="p" className="docs-sidebar-tagline">
            Aviala Design React 组件库
          </Typography>
        </NavigationBrand>

        <NavigationGroup>
          {nav.map((section) => (
            <DocsNavSection
              key={section.section}
              section={section}
              expanded={expandedSections.has(section.section)}
              onToggle={() => toggleSection(section.section)}
              onNavigate={onNavigate}
              pathname={location.pathname}
            />
          ))}
        </NavigationGroup>

        <NavigationActions>
          {onCollapse ? (
            <Button
              type="button"
              mode="noBackgroundCustom"
              size="regular"
              leftIcon={<GeneralCollapseSidebar aria-hidden />}
              onClick={onCollapse}
            >
              Collapse Sidebar
            </Button>
          ) : null}
          <NavigationActionsSlot>
            <Button
              type="button"
              mode="noBackgroundCustom"
              size="regular"
              iconOnly
              aria-label="打开 Storybook"
              leftIcon={<GeneralJumpOut aria-hidden />}
              onClick={() => window.open("http://localhost:6006", "_blank", "noopener,noreferrer")}
            />
            <Button
              type="button"
              mode="noBackgroundCustom"
              size="regular"
              iconOnly
              aria-label="设置"
              leftIcon={<GeneralSetting aria-hidden />}
            />
          </NavigationActionsSlot>
        </NavigationActions>
      </Navigation>
    </aside>
  );
}

export function getAdjacentPages(currentPath: string) {
  const items = flattenNavItems();
  const index = items.findIndex((item) => item.path === currentPath);
  return {
    prev: index > 0 ? items[index - 1] : undefined,
    next: index >= 0 && index < items.length - 1 ? items[index + 1] : undefined,
  };
}
