import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@aviala/spiral";
import { AppRoutes } from "./App";
import "./index.css";
import "@aviala/tokens/ald-theme.css";
import "@aviala/tokens/input-effects.css";
import "@aviala/tokens/basic-input-effects.css";
import "@aviala/tokens/cascader-effects.css";
import "@aviala/tokens/popover-effects.css";
import "@aviala/tokens/modal-effects.css";
import "@aviala/tokens/tooltip-effects.css";
import "@aviala/tokens/color-picker-effects.css";
import "@aviala/tokens/loading-effects.css";
import "@aviala/tokens/typeface-effects.css";
import "@aviala/tokens/button-effects.css";
import "@aviala/tokens/focus-effects.css";
import "@aviala/tokens/list-effects.css";
import "@aviala/tokens/navigation-effects.css";
import "@aviala/tokens/feedback-effects.css";
import "@aviala/tokens/alert-effects.css";
import "@aviala/tokens/datepicker-effects.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultMode="light" defaultPresetId="ald" storageKey="aviala-spiral-docs">
      <BrowserRouter basename="/docs/spiral">
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
