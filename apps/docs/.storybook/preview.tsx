import React from "react";
import type { Preview } from "@storybook/react";
import { initKeyboardFocus } from "@aviala-design/spiral";
import "@aviala-design/spiral/styles.css";

initKeyboardFocus();
import "@aviala-design/tokens/ald-theme.css";
import "@aviala-design/tokens/input-effects.css";
import "@aviala-design/tokens/basic-input-effects.css";
import "@aviala-design/tokens/color-picker-effects.css";
import "@aviala-design/tokens/loading-effects.css";
import "@aviala-design/tokens/typeface-effects.css";
import "@aviala-design/tokens/cascader-effects.css";
import "@aviala-design/tokens/popover-effects.css";
import "@aviala-design/tokens/tooltip-effects.css";
import "@aviala-design/tokens/list-effects.css";
import "@aviala-design/tokens/navigation-effects.css";
import "@aviala-design/tokens/datepicker-effects.css";
import "@aviala-design/tokens/feedback-effects.css";
import "@aviala-design/tokens/alert-effects.css";
import "@aviala-design/tokens/button-effects.css";
import "@aviala-design/tokens/focus-effects.css";
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
