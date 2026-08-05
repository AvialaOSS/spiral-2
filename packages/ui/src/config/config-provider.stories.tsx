import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Pagination } from "../components/pagination";
import { Stack } from "../components/stack";
import { Switch } from "../components/switch";
import { Typography } from "../components/typography";
import { ConfigProvider, type Direction } from "./index";
import { enUS } from "../locale";

const meta: Meta = {
  title: "Theme/ConfigProvider",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Writing direction (`ltr` | `rtl`) for layout mirroring. Orthogonal to LocaleProvider. Optionally nest a locale pack via the `locale` prop.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function DirectionDemo() {
  const [direction, setDirection] = useState<Direction>("ltr");

  return (
    <ConfigProvider direction={direction}>
      <Stack gap="content">
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            mode={direction === "ltr" ? "primary" : "default"}
            onClick={() => setDirection("ltr")}
          >
            LTR
          </Button>
          <Button
            mode={direction === "rtl" ? "primary" : "default"}
            onClick={() => setDirection("rtl")}
          >
            RTL
          </Button>
        </div>
        <Typography level="body">
          Direction: <code>{direction}</code>
        </Typography>
        <Input placeholder="Input" />
        <Switch defaultChecked />
        <Pagination pageCount={12} defaultPage={3} />
      </Stack>
    </ConfigProvider>
  );
}

export const SwitchDirection: Story = {
  render: () => <DirectionDemo />,
};

export const RtlWithEnglishLocale: Story = {
  render: () => (
    <ConfigProvider direction="rtl" locale={enUS}>
      <Stack gap="content">
        <Input placeholder="Name" />
        <Pagination pageCount={20} defaultPage={5} />
      </Stack>
    </ConfigProvider>
  ),
};
