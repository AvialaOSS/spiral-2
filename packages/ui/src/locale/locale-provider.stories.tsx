import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../components/button";
import { DatePickerField } from "../components/date-picker/date-picker";
import { Pagination } from "../components/pagination";
import { Stack } from "../components/stack";
import { LocaleProvider, enUS, zhCN, type Locale } from "./index";

const meta: Meta = {
  title: "Theme/LocaleProvider",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Semi-style locale packs for built-in Spiral copy. Wrap the app root; component props still override dictionary strings.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function LocaleDemo() {
  const [locale, setLocale] = useState<Locale>(zhCN);

  return (
    <LocaleProvider locale={locale}>
      <Stack gap="content">
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            mode={locale.code === "zh-CN" ? "primary" : "default"}
            onClick={() => setLocale(zhCN)}
          >
            zh-CN
          </Button>
          <Button
            mode={locale.code === "en-US" ? "primary" : "default"}
            onClick={() => setLocale(enUS)}
          >
            en-US
          </Button>
        </div>
        <DatePickerField mode="single" />
        <Pagination pageCount={12} defaultPage={3} />
      </Stack>
    </LocaleProvider>
  );
}

export const SwitchLanguage: Story = {
  render: () => <LocaleDemo />,
};

export const EnglishDefaults: Story = {
  render: () => (
    <LocaleProvider locale={enUS}>
      <Stack gap="content">
        <DatePickerField mode="range" enableTime />
        <Pagination pageCount={20} defaultPage={5} />
      </Stack>
    </LocaleProvider>
  ),
};
