import {
  DirectionArrowDown,
  GeneralSearch,
  ICON_MODES,
  ICON_THICKNESSES,
  Icon,
  iconCatalog,
  type IconCatalogEntry,
  type IconMode,
  type IconThickness,
} from "@aviala/icons";
import {
  Button,
  cn,
  Input,
  Link,
  SegmentatorGroup,
  SegmentatorItem,
  Stack,
  useTheme,
} from "@aviala/spiral";
import { useEffect, useMemo, useState } from "react";

type PreviewColorMode = "theme" | "black" | "white" | "inherit";

type CategoryGroup = {
  id: string;
  label: string;
  icons: IconCatalogEntry[];
};

const PREVIEW_COLOR_MODES: { value: PreviewColorMode; label: string }[] = [
  { value: "theme", label: "Theme" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "inherit", label: "Inherit" },
];

function formatCategoryLabel(category: string): string {
  if (category === "timeAndDate") return "Time & Date";
  if (category === "AI") return "AI";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function iconShortLabel(entry: IconCatalogEntry): string {
  const underscore = entry.iconName.indexOf("_");
  return underscore >= 0 ? entry.iconName.slice(underscore + 1) : entry.iconName;
}

function groupIconsByCategory(
  icons: readonly IconCatalogEntry[],
  query: string
): CategoryGroup[] {
  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? icons.filter(
        (entry) =>
          entry.name.toLowerCase().includes(normalized) ||
          entry.iconName.toLowerCase().includes(normalized) ||
          (entry.category ?? "").toLowerCase().includes(normalized)
      )
    : icons;

  const map = new Map<string, IconCatalogEntry[]>();
  for (const entry of filtered) {
    const id = entry.category ?? "other";
    const list = map.get(id);
    if (list) list.push(entry);
    else map.set(id, [entry]);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, categoryIcons]) => ({
      id,
      label: formatCategoryLabel(id),
      icons: [...categoryIcons].sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

function previewColorClass(mode: PreviewColorMode): string {
  switch (mode) {
    case "theme":
      return "text-[var(--text-text-theme-primary-black,var(--primary))]";
    case "black":
      return "text-foreground";
    case "white":
      return "text-[var(--text-text-normal-text-white,#fefcfc)]";
    case "inherit":
      return "text-inherit";
  }
}

function previewSurfaceClass(mode: PreviewColorMode): string {
  switch (mode) {
    case "white":
      return "bg-[var(--text-text-normal-text-black,#343333)]";
    case "inherit":
      return "bg-muted";
    default:
      return "bg-muted";
  }
}

function buildImportSnippet(
  entry: IconCatalogEntry,
  thickness: IconThickness,
  mode: IconMode
): string {
  return `import { ${entry.name} } from "@aviala/icons";

<${entry.name} thickness="${thickness}" mode="${mode}" width={24} height={24} />`;
}

function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <SegmentatorGroup value={mode} onValueChange={(value) => setMode(value as "light" | "dark")}>
      <SegmentatorItem value="light">Light</SegmentatorItem>
      <SegmentatorItem value="dark">Dark</SegmentatorItem>
    </SegmentatorGroup>
  );
}

function CategoryAccordion({
  group,
  forceOpen,
  defaultOpen = false,
  selectedName,
  onSelect,
}: {
  group: CategoryGroup;
  forceOpen: boolean;
  defaultOpen?: boolean;
  selectedName?: string;
  onSelect: (entry: IconCatalogEntry) => void;
}) {
  const [open, setOpen] = useState(forceOpen || defaultOpen);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
      >
        <DirectionArrowDown
          aria-hidden
          width={18}
          height={18}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
        <span className="flex-1 font-medium text-foreground">{group.label}</span>
        <span className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
          {group.icons.length}
        </span>
      </button>
      {open ? (
        <div className="border-t border-border p-4">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-4">
            {group.icons.map((entry) => {
              const selected = entry.name === selectedName;
              return (
                <button
                  key={entry.name}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(entry)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-md border px-2 py-3 text-center transition-colors",
                    selected
                      ? "border-primary bg-accent/40"
                      : "border-border bg-background hover:border-border hover:bg-muted/50"
                  )}
                >
                  <Icon icon={entry.component} size={24} className="text-foreground" />
                  <span className="w-full truncate font-mono text-[10px] leading-tight text-muted-foreground">
                    {iconShortLabel(entry)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PreviewPanel({
  entry,
  thickness,
  mode,
  colorMode,
  onThicknessChange,
  onModeChange,
  onColorModeChange,
}: {
  entry: IconCatalogEntry;
  thickness: IconThickness;
  mode: IconMode;
  colorMode: PreviewColorMode;
  onThicknessChange: (value: IconThickness) => void;
  onModeChange: (value: IconMode) => void;
  onColorModeChange: (value: PreviewColorMode) => void;
}) {
  const [copied, setCopied] = useState(false);
  const snippet = buildImportSnippet(entry, thickness, mode);

  const copySnippet = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <aside className="rounded-lg border border-border bg-card p-5 lg:sticky lg:top-6 lg:self-start">
      <Stack gap="block">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Preview
          </p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">{entry.name}</h2>
          <p className="font-mono text-xs text-muted-foreground">{entry.iconName}</p>
        </div>

        <div
          className={cn(
            "flex min-h-[140px] items-center justify-center rounded-lg border border-border",
            previewSurfaceClass(colorMode),
            colorMode === "inherit" && "text-foreground"
          )}
        >
          <Icon
            icon={entry.component}
            size={64}
            thickness={thickness}
            mode={mode}
            className={previewColorClass(colorMode)}
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-muted-foreground">Thickness</p>
          <SegmentatorGroup
            value={thickness}
            onValueChange={(value) => onThicknessChange(value as IconThickness)}
          >
            {ICON_THICKNESSES.map((value) => (
              <SegmentatorItem
                key={value}
                value={value}
                disabled={!entry.thicknesses.includes(value)}
              >
                {value}
              </SegmentatorItem>
            ))}
          </SegmentatorGroup>
        </div>

        <div>
          <p className="mb-2 text-sm text-muted-foreground">Mode</p>
          <SegmentatorGroup value={mode} onValueChange={(value) => onModeChange(value as IconMode)}>
            {ICON_MODES.map((value) => (
              <SegmentatorItem key={value} value={value} disabled={!entry.modes.includes(value)}>
                {value}
              </SegmentatorItem>
            ))}
          </SegmentatorGroup>
        </div>

        <div>
          <p className="mb-2 text-sm text-muted-foreground">Color</p>
          <SegmentatorGroup
            value={colorMode}
            onValueChange={(value) => onColorModeChange(value as PreviewColorMode)}
          >
            {PREVIEW_COLOR_MODES.map(({ value, label }) => (
              <SegmentatorItem key={value} value={value}>
                {label}
              </SegmentatorItem>
            ))}
          </SegmentatorGroup>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Import</p>
            <Button mode="second" size="small" onClick={copySnippet}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-md border border-border bg-background p-3 font-mono text-xs leading-relaxed text-foreground">
            {snippet}
          </pre>
        </div>
      </Stack>
    </aside>
  );
}

export function IconGalleryPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<IconCatalogEntry>(iconCatalog[0]!);
  const [thickness, setThickness] = useState<IconThickness>("Regular");
  const [mode, setMode] = useState<IconMode>("default");
  const [colorMode, setColorMode] = useState<PreviewColorMode>("black");

  const categories = useMemo(() => groupIconsByCategory(iconCatalog, search), [search]);
  const totalVisible = useMemo(
    () => categories.reduce((sum, group) => sum + group.icons.length, 0),
    [categories]
  );
  const searching = search.trim().length > 0;

  const selectIcon = (entry: IconCatalogEntry) => {
    setSelected(entry);
    if (!entry.thicknesses.includes(thickness)) setThickness("Regular");
    if (!entry.modes.includes(mode)) setMode("default");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Aviala Design
              </p>
              <h1 className="text-2xl font-bold text-foreground">Icon Gallery</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse {iconCatalog.length} icons by category with live variant preview.
              </p>
            </div>
            <Stack direction="row" gap="component" className="items-center">
              <ThemeToggle />
              <Link href="/icon-sync" level="text" mode="noBackgroundCustom">
                Sync Console
              </Link>
              <Link href="/" level="text" mode="noBackgroundCustom">
                Playground
              </Link>
            </Stack>
          </div>
        </header>

        <main className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Stack gap="block">
            <div className="rounded-lg border border-border bg-card p-4">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or category…"
                leftIcon={<GeneralSearch aria-hidden />}
                aria-label="Search icons"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {searching
                  ? `${totalVisible} matching icon${totalVisible === 1 ? "" : "s"}`
                  : `${categories.length} categories`}
              </p>
            </div>

            {categories.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
                <p className="text-sm text-muted-foreground">No icons match your search.</p>
              </div>
            ) : (
              categories.map((group, index) => (
                <CategoryAccordion
                  key={group.id}
                  group={group}
                  forceOpen={searching}
                  defaultOpen={index === 0}
                  selectedName={selected.name}
                  onSelect={selectIcon}
                />
              ))
            )}
          </Stack>

          <PreviewPanel
            entry={selected}
            thickness={thickness}
            mode={mode}
            colorMode={colorMode}
            onThicknessChange={setThickness}
            onModeChange={setMode}
            onColorModeChange={setColorMode}
          />
      </main>
    </div>
  );
}
