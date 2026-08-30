import React, { useLayoutEffect } from "react";
import type { Preview } from "@storybook/react";
import { ThemeProvider, useTheme } from "@aviala-design/spiral";
import type { ThemeMode } from "@aviala-design/tokens";
import "@aviala-design/spiral/styles.css";
import "@aviala-design/tokens/ald-theme.css";
import "@aviala-design/tokens/input-effects.css";
import "@aviala-design/tokens/basic-input-effects.css";
import "@aviala-design/tokens/color-picker-effects.css";
import "@aviala-design/tokens/loading-effects.css";
import "@aviala-design/tokens/typeface-effects.css";
import "@aviala-design/tokens/cascader-effects.css";
import "@aviala-design/tokens/popover-effects.css";
import "@aviala-design/tokens/modal-effects.css";
import "@aviala-design/tokens/drawer-effects.css";
import "@aviala-design/tokens/tooltip-effects.css";
import "@aviala-design/tokens/list-effects.css";
import "@aviala-design/tokens/navigation-effects.css";
import "@aviala-design/tokens/tab-effects.css";
import "@aviala-design/tokens/datepicker-effects.css";
import "@aviala-design/tokens/feedback-effects.css";
import "@aviala-design/tokens/alert-effects.css";
import "@aviala-design/tokens/button-effects.css";
import "@aviala-design/tokens/badge-effects.css";
import "@aviala-design/tokens/progress-effects.css";
import "@aviala-design/tokens/layout-effects.css";
import "@aviala-design/tokens/information-display-extras.css";
import "@aviala-design/tokens/information-collect-extras.css";
import "@aviala-design/tokens/structure-navigation-extras.css";
import "@aviala-design/tokens/video-effects.css";
import "tailwindcss";
import "./preview.css";

/** Keep ThemeProvider in sync with Storybook toolbar globals. */
function StorybookThemeSync({
  presetId,
  mode,
}: {
  presetId: string;
  mode: ThemeMode;
}) {
  const {
    applyPreset,
    setMode,
    presetId: currentPreset,
    mode: currentMode,
  } = useTheme();

  useLayoutEffect(() => {
    if (currentPreset !== presetId) {
      applyPreset(presetId);
    }
    if (currentMode !== mode) {
      setMode(mode);
    }
  }, [applyPreset, currentMode, currentPreset, mode, presetId, setMode]);

  return null;
}

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "centered",
  },
  globalTypes: {
    themePreset: {
      description: "Aviala theme preset",
      defaultValue: "ald",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "ald", title: "ALD (Figma)" },
          { value: "default", title: "Aviala Default" },
          { value: "blue", title: "Brand Blue" },
          { value: "red", title: "Brand Red" },
        ],
        dynamicTitle: true,
      },
    },
    themeMode: {
      description: "Color mode",
      defaultValue: "light",
      toolbar: {
        title: "Mode",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const presetId = (context.globals.themePreset as string) || "ald";
      const mode = ((context.globals.themeMode as ThemeMode) ||
        "light") as ThemeMode;

      return (
        <ThemeProvider
          defaultMode={mode}
          defaultPresetId={presetId}
          storageKey="aviala-storybook-theme"
        >
          <StorybookThemeSync presetId={presetId} mode={mode} />
          <div
            className="bg-background text-foreground p-4 font-sans"
            data-storybook-theme={presetId}
          >
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
