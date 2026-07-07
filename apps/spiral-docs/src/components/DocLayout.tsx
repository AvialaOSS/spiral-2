import { GeneralExpandSidebar } from "@aviala/icons";
import { Button, Typography } from "@aviala/spiral";
import { useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { flattenNavItems, navPathToHref } from "../nav";
import { getAdjacentPages, Sidebar } from "./Sidebar";
import { TableOfContents } from "./TableOfContents";
import { ThemeToolbar } from "./ThemeToolbar";

export function DocLayout() {
  const contentRef = useRef<HTMLElement>(null);
  const location = useLocation();
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
            <footer className="docs-pager">
              {prev ? (
                <NavLink to={navPathToHref(prev.path)} className="docs-nav-link">
                  <Typography level="text" as="span">
                    ← {prev.label}
                  </Typography>
                </NavLink>
              ) : (
                <span />
              )}
              {next ? (
                <NavLink to={navPathToHref(next.path)} className="docs-nav-link">
                  <Typography level="text" as="span">
                    {next.label} →
                  </Typography>
                </NavLink>
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
