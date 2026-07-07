import React from "react";
import type { Preview } from "@storybook/react";
import { initKeyboardFocus } from "@aviala/spiral";
import "@aviala/spiral/styles.css";

initKeyboardFocus();
import "@aviala/tokens/ald-theme.css";
import "@aviala/tokens/input-effects.css";
import "@aviala/tokens/basic-input-effects.css";
import "@aviala/tokens/color-picker-effects.css";
import "@aviala/tokens/loading-effects.css";
import "@aviala/tokens/typeface-effects.css";
import "@aviala/tokens/cascader-effects.css";
import "@aviala/tokens/popover-effects.css";
import "@aviala/tokens/tooltip-effects.css";
import "@aviala/tokens/list-effects.css";
import "@aviala/tokens/navigation-effects.css";
import "@aviala/tokens/datepicker-effects.css";
import "@aviala/tokens/feedback-effects.css";
import "@aviala/tokens/alert-effects.css";
import "@aviala/tokens/button-effects.css";
import "@aviala/tokens/focus-effects.css";
import "tailwindcss";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="bg-background text-foreground p-4 font-sans">
        <Story />
      </div>
    ),
  ],
};

export default preview;
