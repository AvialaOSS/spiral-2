import {
  DEFAULT_ICON_MODE,
  DEFAULT_ICON_THICKNESS,
  Icon,
  iconCatalog,
  ICON_LEVELS,
  ICON_MODES,
  ICON_THICKNESSES,
  type IconLevel,
} from "@aviala/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const LEVEL_LABELS: Record<IconLevel, string> = {
  display: "Display",
  headline1: "Headline1",
  headline2: "Headline2",
  title: "Title",
  subtitle: "Subtitle",
  text: "Text",
  caption: "Caption",
};

const meta: Meta = {
  title: "Foundation/Icons",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-6">
      {iconCatalog.map(({ name, component }) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-md border border-border p-3"
        >
          <Icon icon={component} level="text" className="text-primary" />
          <code className="text-xs">{name}</code>
        </div>
      ))}
    </div>
  ),
};

export const BiggerSize: Story = {
  render: () => {
    const entry = iconCatalog.find((item) => !item.legacy && item.thicknesses.length > 0);
    if (!entry) return <p>No multi-variant icons exported yet. Run pnpm icons:sync.</p>;

    const [level, setLevel] = useState<IconLevel>("text");

    return (
      <div className="flex max-w-md flex-col gap-4">
        <div className="flex items-end gap-8">
          <div className="flex flex-col items-center gap-2">
            <Icon icon={entry.component} level={level} className="text-primary" />
            <span className="text-xs text-muted-foreground">default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon icon={entry.component} level={level} biggerSize className="text-primary" />
            <span className="text-xs text-muted-foreground">biggerSize</span>
          </div>
        </div>
        <code className="text-sm">{entry.name}</code>
        <label className="flex flex-col gap-1 text-sm">
          level
          <select value={level} onChange={(e) => setLevel(e.target.value as IconLevel)}>
            {ICON_LEVELS.map((value) => (
              <option key={value} value={value}>
                {LEVEL_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  },
};

export const VariantSwitching: Story = {
  render: () => {
    const entry = iconCatalog.find((item) => !item.legacy && item.thicknesses.length > 0);
    if (!entry) return <p>No multi-variant icons exported yet. Run pnpm icons:sync.</p>;

    const [thickness, setThickness] = useState(
      entry.thicknesses.includes(DEFAULT_ICON_THICKNESS)
        ? DEFAULT_ICON_THICKNESS
        : (entry.thicknesses[0] ?? DEFAULT_ICON_THICKNESS)
    );
    const [mode, setMode] = useState(
      entry.modes.includes(DEFAULT_ICON_MODE) ? DEFAULT_ICON_MODE : (entry.modes[0] ?? DEFAULT_ICON_MODE)
    );

    return (
      <div className="flex max-w-sm flex-col gap-4">
        <Icon icon={entry.component} size={48} className="text-primary" thickness={thickness} mode={mode} />
        <code className="text-sm">{entry.name}</code>
        <label className="flex flex-col gap-1 text-sm">
          thickness
          <select value={thickness} onChange={(e) => setThickness(e.target.value as typeof thickness)}>
            {(entry.thicknesses.length ? entry.thicknesses : ICON_THICKNESSES).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          mode
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
            {(entry.modes.length ? entry.modes : ICON_MODES).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  },
};
