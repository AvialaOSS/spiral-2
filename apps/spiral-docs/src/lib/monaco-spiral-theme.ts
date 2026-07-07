import type { Monaco } from "@monaco-editor/react";
import type { ThemeMode } from "@aviala-design/tokens";

function readCssVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function spiralOverlayColors() {
  return {
    "menu.background": readCssVar("--select-menu-bg", "#fefcfc"),
    "menu.foreground": readCssVar("--select-item-fg", "#343333"),
    "menu.selectionBackground": readCssVar("--select-item-highlight-bg", "#f5f3f3"),
    "menu.selectionForeground": readCssVar("--select-item-fg", "#343333"),
    "menu.selectionBorder": readCssVar("--select-menu-border", "#f5f3f3"),
    "menu.border": readCssVar("--select-menu-border", "#f5f3f3"),
    "menu.separatorBackground": readCssVar("--select-menu-border", "#f5f3f3"),

    "editorSuggestWidget.background": readCssVar("--select-menu-bg", "#fefcfc"),
    "editorSuggestWidget.border": readCssVar("--select-menu-border", "#f5f3f3"),
    "editorSuggestWidget.foreground": readCssVar("--select-item-fg", "#343333"),
    "editorSuggestWidget.selectedBackground": readCssVar("--select-item-highlight-bg", "#f5f3f3"),
    "editorSuggestWidget.selectedForeground": readCssVar("--select-item-fg", "#343333"),
    "editorSuggestWidget.highlightForeground": readCssVar("--primary", "#ff5532"),

    "editorHoverWidget.background": readCssVar("--select-menu-bg", "#fefcfc"),
    "editorHoverWidget.border": readCssVar("--select-menu-border", "#f5f3f3"),
    "editorHoverWidget.foreground": readCssVar("--select-item-fg", "#343333"),

    "editorWidget.background": readCssVar("--select-menu-bg", "#fefcfc"),
    "editorWidget.border": readCssVar("--select-menu-border", "#f5f3f3"),
    "editorWidget.foreground": readCssVar("--select-item-fg", "#343333"),

    "list.hoverBackground": readCssVar("--select-item-highlight-bg", "#f5f3f3"),
    "list.focusBackground": readCssVar("--select-item-highlight-bg", "#f5f3f3"),
    "list.activeSelectionBackground": readCssVar("--select-item-selected-bg", "#ffdad2"),
    "list.activeSelectionForeground": readCssVar("--select-item-selected-fg", "#bf2300"),
    "list.inactiveSelectionBackground": readCssVar("--select-item-highlight-bg", "#f5f3f3"),
    "list.highlightForeground": readCssVar("--primary", "#ff5532"),
  };
}

export function applySpiralMonacoThemes(monaco: Monaco) {
  const overlays = spiralOverlayColors();

  monaco.editor.defineTheme("spiral-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": readCssVar("--background", "#ffffff"),
      "editor.foreground": readCssVar("--foreground", "#343333"),
      "editorLineNumber.foreground": readCssVar("--muted-foreground", "#858484"),
      "editorLineNumber.activeForeground": readCssVar("--foreground", "#343333"),
      "editor.selectionBackground": readCssVar("--select-item-selected-bg", "#ffdad2"),
      "editor.inactiveSelectionBackground": readCssVar("--select-item-checked-bg", "#fff3f0"),
      "editorCursor.foreground": readCssVar("--primary", "#ff5532"),
      "editorWidget.resizeBorder": readCssVar("--primary", "#ff5532"),
      ...overlays,
    },
  });

  monaco.editor.defineTheme("spiral-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": readCssVar("--background", "#1e1e1e"),
      "editor.foreground": readCssVar("--foreground", "#f5f5f5"),
      "editorLineNumber.foreground": readCssVar("--muted-foreground", "#a0a0a0"),
      "editorLineNumber.activeForeground": readCssVar("--foreground", "#f5f5f5"),
      "editor.selectionBackground": readCssVar("--select-item-selected-bg", "#5a3a32"),
      "editor.inactiveSelectionBackground": readCssVar("--select-item-checked-bg", "#3d2a26"),
      "editorCursor.foreground": readCssVar("--primary", "#ff5532"),
      "editorWidget.resizeBorder": readCssVar("--primary", "#ff5532"),
      ...overlays,
    },
  });
}

export function spiralMonacoThemeId(mode: ThemeMode): "spiral-light" | "spiral-dark" {
  return mode === "dark" ? "spiral-dark" : "spiral-light";
}
