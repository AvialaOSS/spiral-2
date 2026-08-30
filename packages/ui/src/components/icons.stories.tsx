import {
  DEFAULT_ICON_MODE,
  DEFAULT_ICON_THICKNESS,
  Icon,
  ICON_LEVELS,
  ICON_MODES,
  ICON_THICKNESSES,
  type IconCatalogEntry,
  type IconLevel,
} from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

const LEVEL_LABELS: Record<IconLevel, string> = {
  display: "Display",
  headline1: "Headline1",
  headline2: "Headline2",
  title: "Title",
  subtitle: "Subtitle",
  text: "Text",
  caption: "Caption",
};

type CatalogState =
  | { status: "loading" }
  | { status: "ready"; icons: readonly IconCatalogEntry[] }
  | { status: "error" };

/**
 * `iconCatalog` references every generated icon component, so a static import
 * pulls the whole set (~350 modules, a few MB) into the chunk that imports it.
 * Loading it through a dynamic import keeps this story's chunk small and moves
 * the icon payload into a separate chunk that is only fetched once a reader
 * actually opens one of these stories.
 */
function useIconCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    import("@aviala-design/icons")
      .then((mod) => {
        if (active) setState({ status: "ready", icons: mod.iconCatalog });
      })
      .catch(() => {
        if (active) setState({ status: "error" });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

function CatalogGate({
  children,
}: {
  children: (icons: readonly IconCatalogEntry[]) => ReactNode;
}) {
  const state = useIconCatalog();

  if (state.status === "loading") {
    return (
      <p className="text-sm text-muted-foreground">Loading icon catalog…</p>
    );
  }
  if (state.status === "error") {
    return (
      <p className="text-sm text-destructive">
        Could not load the icon catalog. Run pnpm icons:sync and reload.
      </p>
    );
  }
  if (state.icons.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No icons exported yet. Run pnpm icons:sync.
      </p>
    );
  }
  return <>{children(state.icons)}</>;
}

/** First icon with more than one variant — used by the variant demos. */
function pickVariantIcon(
  icons: readonly IconCatalogEntry[]
): IconCatalogEntry | undefined {
  return icons.find((item) => !item.legacy && item.thicknesses.length > 0);
}

const meta: Meta = {
  title: "Foundation/Icons",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

type GalleryArgs = {
  /** Initial search term — also editable inside the story. */
  query: string;
  /** How many icons render at once. Keeps large result sets cheap to paint. */
  pageSize: number;
  level: IconLevel;
};

const selectClassName =
  "rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground";

function IconGallery({
  icons,
  query,
  pageSize,
  level,
}: GalleryArgs & { icons: readonly IconCatalogEntry[] }) {
  const [search, setSearch] = useState(query);
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(0);

  useEffect(() => setSearch(query), [query]);

  const categories = useMemo(
    () =>
      [...new Set(icons.map((entry) => entry.category ?? "other"))].sort(
        (a, b) => a.localeCompare(b)
      ),
    [icons]
  );

  const matches = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return icons.filter((entry) => {
      if (category !== "all" && (entry.category ?? "other") !== category)
        return false;
      if (!needle) return true;
      return (
        entry.name.toLowerCase().includes(needle) ||
        entry.iconName.toLowerCase().includes(needle) ||
        (entry.category ?? "").toLowerCase().includes(needle)
      );
    });
  }, [icons, search, category]);

  const size = Math.max(1, Math.floor(pageSize));
  const pageCount = Math.max(1, Math.ceil(matches.length / size));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = matches.slice(currentPage * size, currentPage * size + size);

  useEffect(() => {
    setPage(0);
  }, [search, category, size]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Search
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, iconName or category…"
            className="min-w-48 rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={selectClassName}
          >
            <option value="all">All ({icons.length})</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>
          {matches.length} match{matches.length === 1 ? "" : "es"}
        </span>
        {pageCount > 1 ? (
          <span className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
              className={selectClassName}
            >
              Previous
            </button>
            <span>
              Page {currentPage + 1} / {pageCount}
            </span>
            <button
              type="button"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage(currentPage + 1)}
              className={selectClassName}
            >
              Next
            </button>
          </span>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No icons match this filter.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6">
          {visible.map(({ name, component }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 rounded-md border border-border p-3"
            >
              <Icon icon={component} level={level} className="text-primary" />
              <code
                className="w-full truncate text-center text-xs"
                title={name}
              >
                {name}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Gallery: StoryObj<GalleryArgs> = {
  args: {
    query: "",
    pageSize: 48,
    level: "text",
  },
  argTypes: {
    query: { control: "text" },
    pageSize: { control: { type: "number", min: 12, max: 240, step: 12 } },
    level: { control: "select", options: ICON_LEVELS },
  },
  render: (args) => (
    <CatalogGate>
      {(icons) => <IconGallery {...args} icons={icons} />}
    </CatalogGate>
  ),
};

function BiggerSizeDemo({ entry }: { entry: IconCatalogEntry }) {
  const [level, setLevel] = useState<IconLevel>("text");

  return (
    <div className="flex max-w-md flex-col gap-4">
      <div className="flex items-end gap-8">
        <div className="flex flex-col items-center gap-2">
          <Icon icon={entry.component} level={level} className="text-primary" />
          <span className="text-xs text-muted-foreground">default</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon
            icon={entry.component}
            level={level}
            biggerSize
            className="text-primary"
          />
          <span className="text-xs text-muted-foreground">biggerSize</span>
        </div>
      </div>
      <code className="text-sm">{entry.name}</code>
      <label className="flex flex-col gap-1 text-sm">
        level
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as IconLevel)}
          className={selectClassName}
        >
          {ICON_LEVELS.map((value) => (
            <option key={value} value={value}>
              {LEVEL_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export const BiggerSize: Story = {
  render: () => (
    <CatalogGate>
      {(icons) => {
        const entry = pickVariantIcon(icons);
        if (!entry)
          return (
            <p>No multi-variant icons exported yet. Run pnpm icons:sync.</p>
          );
        return <BiggerSizeDemo entry={entry} />;
      }}
    </CatalogGate>
  ),
};

function VariantSwitchingDemo({ entry }: { entry: IconCatalogEntry }) {
  const [thickness, setThickness] = useState(
    entry.thicknesses.includes(DEFAULT_ICON_THICKNESS)
      ? DEFAULT_ICON_THICKNESS
      : (entry.thicknesses[0] ?? DEFAULT_ICON_THICKNESS)
  );
  const [mode, setMode] = useState(
    entry.modes.includes(DEFAULT_ICON_MODE)
      ? DEFAULT_ICON_MODE
      : (entry.modes[0] ?? DEFAULT_ICON_MODE)
  );

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <Icon
        icon={entry.component}
        size={48}
        className="text-primary"
        thickness={thickness}
        mode={mode}
      />
      <code className="text-sm">{entry.name}</code>
      <label className="flex flex-col gap-1 text-sm">
        thickness
        <select
          value={thickness}
          onChange={(e) => setThickness(e.target.value as typeof thickness)}
          className={selectClassName}
        >
          {(entry.thicknesses.length
            ? entry.thicknesses
            : ICON_THICKNESSES
          ).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        mode
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as typeof mode)}
          className={selectClassName}
        >
          {(entry.modes.length ? entry.modes : ICON_MODES).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export const VariantSwitching: Story = {
  render: () => (
    <CatalogGate>
      {(icons) => {
        const entry = pickVariantIcon(icons);
        if (!entry)
          return (
            <p>No multi-variant icons exported yet. Run pnpm icons:sync.</p>
          );
        return <VariantSwitchingDemo entry={entry} />;
      }}
    </CatalogGate>
  ),
};
