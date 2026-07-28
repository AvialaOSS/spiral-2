import {
  DirectionArrowLeftLight,
  DirectionArrowRightLight,
  GeneralExpandSidebar,
} from "@aviala-design/icons";
import { Button } from "@aviala-design/spiral";
import { useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { flattenNavItems, navPathToHref } from "../nav";
import { getAdjacentPages, Sidebar } from "./Sidebar";
import { TableOfContents } from "./TableOfContents";
import { ThemeToolbar } from "./ThemeToolbar";

export function DocLayout() {
  const contentRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const docPath =
    flattenNavItems().find((item) => item.path === location.pathname)?.path ??
    "/start/introduction";
  const { prev, next } = getAdjacentPages(docPath);

  return (
    <div className={`docs-shell${sidebarCollapsed ? " docs-shell--sidebar-collapsed" : ""}`}>
      <Sidebar
        onNavigate={() => setMobileOpen(false)}
        onCollapse={() => setSidebarCollapsed(true)}
      />
      <div className={`docs-mobile-drawer${mobileOpen ? " is-open" : ""}`}>
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>
      {mobileOpen ? (
        <button
          type="button"
          className="docs-mobile-backdrop"
          aria-label="关闭导航"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="docs-main">
        <div className="docs-topbar">
          {sidebarCollapsed ? (
            <Button
              type="button"
              mode="noBackgroundCustom"
              size="regular"
              iconOnly
              className="docs-sidebar-expand-btn"
              aria-label="展开侧边栏"
              leftIcon={<GeneralExpandSidebar aria-hidden />}
              onClick={() => setSidebarCollapsed(false)}
            />
          ) : null}
          <Button
            type="button"
            mode="noBackground"
            size="small"
            className="docs-mobile-menu-btn"
            aria-label="打开导航"
            onClick={() => setMobileOpen(true)}
          >
            菜单
          </Button>
          <ThemeToolbar />
        </div>

        <div className="docs-body">
          <article ref={contentRef} className="docs-content">
            <Outlet key={location.pathname} context={{ contentRef }} />
            <footer className="docs-pager" aria-label="相邻文档">
              {prev ? (
                <Button
                  type="button"
                  mode="secondary"
                  size="regular"
                  leftIcon={<DirectionArrowLeftLight aria-hidden />}
                  onClick={() => navigate(navPathToHref(prev.path))}
                >
                  {prev.label}
                </Button>
              ) : (
                <span />
              )}
              {next ? (
                <Button
                  type="button"
                  mode="secondary"
                  size="regular"
                  rightIcon={<DirectionArrowRightLight aria-hidden />}
                  onClick={() => navigate(navPathToHref(next.path))}
                >
                  {next.label}
                </Button>
              ) : (
                <span />
              )}
            </footer>
          </article>
          <TableOfContents containerRef={contentRef} />
        </div>
      </div>
    </div>
  );
}
