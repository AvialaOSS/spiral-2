import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@aviala-design/spiral";
import { AppRoutes } from "./App";
import "./index.css";
import "@aviala-design/tokens/ald-theme.css";
import "@aviala-design/tokens/input-effects.css";
import "@aviala-design/tokens/basic-input-effects.css";
import "@aviala-design/tokens/cascader-effects.css";
import "@aviala-design/tokens/popover-effects.css";
import "@aviala-design/tokens/modal-effects.css";
import "@aviala-design/tokens/tooltip-effects.css";
import "@aviala-design/tokens/color-picker-effects.css";
import "@aviala-design/tokens/loading-effects.css";
import "@aviala-design/tokens/typeface-effects.css";
import "@aviala-design/tokens/button-effects.css";
import "@aviala-design/tokens/focus-effects.css";
import "@aviala-design/tokens/list-effects.css";
import "@aviala-design/tokens/navigation-effects.css";
import "@aviala-design/tokens/feedback-effects.css";
import "@aviala-design/tokens/alert-effects.css";
import "@aviala-design/tokens/datepicker-effects.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultMode="light" defaultPresetId="ald" storageKey="aviala-spiral-docs">
      <BrowserRouter basename="/docs/spiral">
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
