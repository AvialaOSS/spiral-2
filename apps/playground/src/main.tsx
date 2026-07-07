import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initKeyboardFocus } from "@aviala/spiral";
import { Routes } from "./Routes";

initKeyboardFocus();
import "./index.css";
import "@aviala/tokens/ald-theme.css";
import "@aviala/tokens/input-effects.css";
import "@aviala/tokens/basic-input-effects.css";
import "@aviala/tokens/cascader-effects.css";
import "@aviala/tokens/popover-effects.css";
import "@aviala/tokens/tooltip-effects.css";
import "@aviala/tokens/color-picker-effects.css";
import "@aviala/tokens/loading-effects.css";
import "@aviala/tokens/typeface-effects.css";
import "@aviala/tokens/button-effects.css";
import "@aviala/tokens/focus-effects.css";
import "@aviala/tokens/list-effects.css";
import "@aviala/tokens/feedback-effects.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Routes />
  </StrictMode>
);
