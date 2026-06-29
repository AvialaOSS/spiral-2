import React from "react";
import type { Preview } from "@storybook/react";
import "@aviala/spiral/styles.css";
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
