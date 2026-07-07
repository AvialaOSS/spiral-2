import { ThemeProvider } from "@aviala/spiral";
import { App } from "./App";
import { IconGalleryPage } from "./pages/IconGalleryPage";
import { IconSyncPage } from "./pages/IconSyncPage";

function resolvePathname(): string {
  const path = window.location.pathname.replace(/\/+$/, "");
  return path || "/";
}

export function Routes() {
  const path = resolvePathname();

  return (
    <ThemeProvider defaultMode="light" defaultPresetId="ald">
      {path === "/icons" ? <IconGalleryPage /> : path === "/icon-sync" ? <IconSyncPage /> : <App />}
    </ThemeProvider>
  );
}
