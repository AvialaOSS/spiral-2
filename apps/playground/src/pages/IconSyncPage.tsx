import rawIconManifest from "../../../../packages/icons/raw/manifest.json";
import {
  DirectionArrowRight,
  GeneralSearch,
  ICON_MODES,
  ICON_THICKNESSES,
  Icon,
  iconCatalog,
  type IconCatalogEntry,
  type IconMode,
  type IconThickness,
} from "@aviala/icons";
import { Button, cn, Input, Link, SegmentatorGroup, SegmentatorItem, Stack } from "@aviala/spiral";
import { useMemo, useState } from "react";

type VariantKey = `${IconThickness}:${IconMode}`;
type Severity = "critical" | "warning" | "info";
type FilterMode = "all" | "critical" | "warning" | "info" | "no-fill" | "metadata";

type RawIconManifestEntry = {
  file: string;
  componentSet: string | null;
  category: string;
  name: string;
  variantName: string;
  thickness: string;
  mode: string;
  nodeId: string;
};

type RawIconManifest = {
  exportedAt?: string;
  count?: number;
  icons?: RawIconManifestEntry[];
};

type DiagnosticIssue = {
  code: string;
  severity: Severity;
  label: string;
  detail: string;
  fix: string;
};

type IconDiagnostic = {
  entry: IconCatalogEntry;
  rows: RawIconManifestEntry[];
  variants: Set<VariantKey>;
  missingVariants: VariantKey[];
  issues: DiagnosticIssue[];
  severity: Severity | "ok";
};

const manifest = rawIconManifest as RawIconManifest;
const manifestRows = manifest.icons ?? [];

const EXPECTED_VARIANTS = ICON_THICKNESSES.flatMap((thickness) =>
  ICON_MODES.map((mode) => variantKey(thickness, mode))
);

const FILTERS: { value: FilterMode; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
  { value: "info", label: "Info" },
  { value: "no-fill", label: "No fill" },
  { value: "metadata", label: "Metadata" },
];

const SEVERITY_RANK: Record<Severity | "ok", number> = {
  critical: 0,
  warning: 1,
  info: 2,
  ok: 3,
};

function variantKey(thickness: IconThickness, mode: IconMode): VariantKey {
  return `${thickness}:${mode}`;
}

function isIconThickness(value: string): value is IconThickness {
  return (ICON_THICKNESSES as readonly string[]).includes(value);
}

function isIconMode(value: string): value is IconMode {
  return (ICON_MODES as readonly string[]).includes(value);
}

function formatCategory(category?: string): string {
  if (!category) return "Other";
  if (category === "timeAndDate") return "Time & Date";
  if (category === "AI") return "AI";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function componentSetToCategory(setName: string): string {
  return setName.split(/[/\\]/)[0]?.trim() || "uncategorized";
}

function expectedIconNameFromSet(setName: string | null): string | null {
  if (!setName) return null;
  const leaf = setName.split(/[/\\]/).pop()?.trim() ?? setName;
  const category = componentSetToCategory(setName);
  return `${category}_${leaf.replace(/[/\\-]+/g, "_")}`.replace(/_+/g, "_");
}

function hasDedupeSuffix(file: string): boolean {
  return /-\d+\.svg$/i.test(file);
}

function toVariantsFromCatalog(entry: IconCatalogEntry): Set<VariantKey> {
  const variants = new Set<VariantKey>();
  for (const thickness of entry.thicknesses) {
    for (const mode of entry.modes) {
      variants.add(variantKey(thickness, mode));
    }
  }
  return variants;
}

function rowsToVariants(rows: RawIconManifestEntry[]): Set<VariantKey> {
  const variants = new Set<VariantKey>();
  for (const row of rows) {
    if (isIconThickness(row.thickness) && isIconMode(row.mode)) {
      variants.add(variantKey(row.thickness, row.mode));
    }
  }
  return variants;
}

function uniqueSorted<T extends string>(values: Iterable<T>): T[] {
  return [...new Set(values)].sort();
}

function sameArray(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

const rowsByIconName = manifestRows.reduce((map, row) => {
  const list = map.get(row.name);
  if (list) list.push(row);
  else map.set(row.name, [row]);
  return map;
}, new Map<string, RawIconManifestEntry[]>());

function analyzeIcon(entry: IconCatalogEntry): IconDiagnostic {
  const rows = rowsByIconName.get(entry.iconName) ?? [];
  const variants = rows.length > 0 ? rowsToVariants(rows) : toVariantsFromCatalog(entry);
  const missingVariants = EXPECTED_VARIANTS.filter((key) => !variants.has(key));
  const issues: DiagnosticIssue[] = [];

  if (rows.length === 0) {
    issues.push({
      code: "MANIFEST_MISSING",
      severity: "critical",
      label: "Manifest missing",
      detail: "No raw manifest row maps to this catalog entry.",
      fix: "Run the icon export before building, then rebuild the icon package.",
    });
  }

  if (!variants.has("Regular:default")) {
    issues.push({
      code: "REGULAR_DEFAULT_MISSING",
      severity: "critical",
      label: "Regular default missing",
      detail: "The Icon wrapper defaults to Regular/default.",
      fix: "Add the Regular/default variant or align the wrapper default with the generated icon default.",
    });
  }

  if (!variants.has("Bold:default")) {
    issues.push({
      code: "BOLD_DEFAULT_MISSING",
      severity: "critical",
      label: "Bold default missing",
      detail: "Generated icon components fall back to Bold/default.",
      fix: "Add the Bold/default variant or update the generated fallback policy.",
    });
  }

  const missingMedium = ICON_MODES.filter((mode) => !variants.has(variantKey("Medium", mode)));
  if (missingMedium.length > 0) {
    issues.push({
      code: "MEDIUM_MISSING",
      severity: "warning",
      label: "Medium gap",
      detail: `Missing Medium ${missingMedium.join(" and ")}.`,
      fix: "Either export Medium from Figma or remove Medium from the public stable options.",
    });
  }

  const fillAvailable = ICON_THICKNESSES.some((thickness) =>
    variants.has(variantKey(thickness, "fill"))
  );
  if (!fillAvailable) {
    issues.push({
      code: "FILL_MODE_MISSING",
      severity: "warning",
      label: "No fill mode",
      detail: "Requests for fill mode will fall back to another variant.",
      fix: "Add fill variants or hide fill controls for this icon.",
    });
  }

  const metadataRows = rows.filter((row) => {
    const expectedName = expectedIconNameFromSet(row.componentSet);
    return (
      !row.componentSet ||
      hasDedupeSuffix(row.file) ||
      row.variantName !== row.name ||
      (expectedName !== null && row.name !== expectedName)
    );
  });
  if (metadataRows.length > 0) {
    issues.push({
      code: "METADATA_SYNC",
      severity: "critical",
      label: "Metadata sync",
      detail: `${metadataRows.length} manifest row${metadataRows.length === 1 ? "" : "s"} have naming or path anomalies.`,
      fix: "Check component set names, variant name properties, and deduped output paths before publishing.",
    });
  }

  if (rows.length > 0) {
    const manifestThicknesses = uniqueSorted(
      rows.map((row) => row.thickness).filter(isIconThickness)
    );
    const manifestModes = uniqueSorted(rows.map((row) => row.mode).filter(isIconMode));
    const catalogThicknesses = uniqueSorted(entry.thicknesses);
    const catalogModes = uniqueSorted(entry.modes);

    if (
      !sameArray(manifestThicknesses, catalogThicknesses) ||
      !sameArray(manifestModes, catalogModes)
    ) {
      issues.push({
        code: "CATALOG_MISMATCH",
        severity: "warning",
        label: "Catalog mismatch",
        detail: "Catalog support lists do not match the raw manifest.",
        fix: "Rebuild the icon package after export and commit generated catalog output together.",
      });
    }
  }

  if (missingVariants.length > 0) {
    issues.push({
      code: "INCOMPLETE_MATRIX",
      severity: "info",
      label: "Incomplete matrix",
      detail: `${missingVariants.length} public variant${missingVariants.length === 1 ? "" : "s"} are unavailable.`,
      fix: "Keep missing variants disabled in tools, or make the resolver warn before fallback.",
    });
  }

  const severity = issues.some((issue) => issue.severity === "critical")
    ? "critical"
    : issues.some((issue) => issue.severity === "warning")
      ? "warning"
      : issues.some((issue) => issue.severity === "info")
        ? "info"
        : "ok";

  return { entry, rows, variants, missingVariants, issues, severity };
}

const diagnostics = iconCatalog.map(analyzeIcon).sort((a, b) => {
  const rank = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
  return rank || a.entry.name.localeCompare(b.entry.name);
});

function severityClass(severity: Severity | "ok"): string {
  switch (severity) {
    case "critical":
      return "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300";
    case "warning":
      return "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300";
    case "info":
      return "border-sky-500/40 bg-sky-500/10 text-sky-800 dark:text-sky-300";
    case "ok":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300";
  }
}

function issueBadgeClass(severity: Severity): string {
  return cn("inline-flex rounded-full border px-2 py-0.5 text-xs", severityClass(severity));
}

function issueMatchesFilter(diagnostic: IconDiagnostic, filter: FilterMode): boolean {
  if (filter === "all") return true;
  if (filter === "no-fill") {
    return diagnostic.issues.some((issue) => issue.code === "FILL_MODE_MISSING");
  }
  if (filter === "metadata") {
    return diagnostic.issues.some((issue) =>
      ["METADATA_SYNC", "CATALOG_MISMATCH", "MANIFEST_MISSING"].includes(issue.code)
    );
  }
  return diagnostic.severity === filter;
}

function MetricTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: Severity | "ok";
}) {
  return (
    <div className={cn("rounded-lg border p-4", severityClass(tone))}>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm">{label}</div>
    </div>
  );
}

function GlobalNotice() {
  return (
    <section className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold">Default mismatch</h2>
          <p className="mt-1 text-sm">
            The Icon wrapper defaults to Regular/default, while generated icon components default
            to Bold/default. Wrapper usage and direct component usage can render different weights.
          </p>
        </div>
        <Link href="/icons" level="text" mode="noBackgroundCustom" rightIcon={<DirectionArrowRight aria-hidden />}>
          Gallery
        </Link>
      </div>
    </section>
  );
}

function VariantMatrix({ diagnostic }: { diagnostic: IconDiagnostic }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-[96px_repeat(2,minmax(0,1fr))] border-b border-border bg-muted/40 text-sm font-medium">
        <div className="p-2">Variant</div>
        {ICON_MODES.map((mode) => (
          <div key={mode} className="p-2 text-center">
            {mode}
          </div>
        ))}
      </div>
      {ICON_THICKNESSES.map((thickness) => (
        <div
          key={thickness}
          className="grid grid-cols-[96px_repeat(2,minmax(0,1fr))] border-b border-border last:border-b-0"
        >
          <div className="flex items-center border-r border-border p-2 text-sm font-medium">
            {thickness}
          </div>
          {ICON_MODES.map((mode) => {
            const key = variantKey(thickness, mode);
            const available = diagnostic.variants.has(key);
            return (
              <div key={key} className="flex min-h-16 items-center justify-center border-r border-border p-2 last:border-r-0">
                {available ? (
                  <Icon
                    icon={diagnostic.entry.component}
                    size={24}
                    thickness={thickness}
                    mode={mode}
                    className="text-foreground"
                  />
                ) : (
                  <span className="rounded-full border border-dashed border-border px-2 py-1 text-xs text-muted-foreground">
                    Missing
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function DetailPanel({ diagnostic }: { diagnostic: IconDiagnostic }) {
  const metadataRows = diagnostic.rows.filter((row) => {
    const expectedName = expectedIconNameFromSet(row.componentSet);
    return (
      !row.componentSet ||
      hasDedupeSuffix(row.file) ||
      row.variantName !== row.name ||
      (expectedName !== null && row.name !== expectedName)
    );
  });

  return (
    <aside className="rounded-lg border border-border bg-card p-5 lg:sticky lg:top-6 lg:self-start">
      <Stack gap="block">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{diagnostic.entry.name}</h2>
              <p className="font-mono text-xs text-muted-foreground">{diagnostic.entry.iconName}</p>
            </div>
            <span className={cn("rounded-full border px-2 py-0.5 text-xs", severityClass(diagnostic.severity))}>
              {diagnostic.severity}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatCategory(diagnostic.entry.category)} / {diagnostic.rows.length} raw rows
          </p>
        </div>

        <VariantMatrix diagnostic={diagnostic} />

        <div>
          <h3 className="mb-2 text-sm font-semibold">Issues</h3>
          <Stack gap="content">
            {diagnostic.issues.map((issue) => (
              <div key={issue.code} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={issueBadgeClass(issue.severity)}>{issue.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{issue.code}</span>
                </div>
                <p className="mt-2 text-sm text-foreground">{issue.detail}</p>
                <p className="mt-1 text-xs text-muted-foreground">{issue.fix}</p>
              </div>
            ))}
          </Stack>
        </div>

        {metadataRows.length > 0 ? (
          <div>
            <h3 className="mb-2 text-sm font-semibold">Metadata rows</h3>
            <Stack gap="inside">
              {metadataRows.slice(0, 6).map((row) => (
                <div key={`${row.nodeId}-${row.file}`} className="rounded-md border border-border p-2">
                  <p className="break-all font-mono text-xs text-foreground">{row.file}</p>
                  <p className="mt-1 break-all text-xs text-muted-foreground">
                    {row.componentSet ?? "No component set"} / {row.nodeId}
                  </p>
                </div>
              ))}
            </Stack>
          </div>
        ) : null}
      </Stack>
    </aside>
  );
}

function DiagnosticRow({
  diagnostic,
  selected,
  onSelect,
}: {
  diagnostic: IconDiagnostic;
  selected: boolean;
  onSelect: () => void;
}) {
  const topIssues = diagnostic.issues.slice(0, 3);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "grid w-full grid-cols-[48px_minmax(0,1fr)] gap-3 border-b border-border p-3 text-left transition-colors last:border-b-0 md:grid-cols-[48px_minmax(0,1fr)_150px_220px]",
        selected ? "bg-accent/40" : "hover:bg-muted/40"
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
        <Icon icon={diagnostic.entry.component} size={22} className="text-foreground" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-medium text-foreground">{diagnostic.entry.name}</span>
        <span className="block truncate font-mono text-xs text-muted-foreground">
          {diagnostic.entry.iconName}
        </span>
        <span className="mt-2 flex flex-wrap gap-1 md:hidden">
          {topIssues.map((issue) => (
            <span key={issue.code} className={issueBadgeClass(issue.severity)}>
              {issue.label}
            </span>
          ))}
        </span>
      </span>
      <span className="hidden text-sm text-muted-foreground md:block">
        {formatCategory(diagnostic.entry.category)}
      </span>
      <span className="hidden flex-wrap gap-1 md:flex">
        {topIssues.map((issue) => (
          <span key={issue.code} className={issueBadgeClass(issue.severity)}>
            {issue.label}
          </span>
        ))}
      </span>
    </button>
  );
}

export function IconSyncPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [selectedName, setSelectedName] = useState(diagnostics[0]?.entry.name ?? "");

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return diagnostics.filter((diagnostic) => {
      const entry = diagnostic.entry;
      const matchesSearch =
        !normalized ||
        entry.name.toLowerCase().includes(normalized) ||
        entry.iconName.toLowerCase().includes(normalized) ||
        (entry.category ?? "").toLowerCase().includes(normalized);

      return matchesSearch && issueMatchesFilter(diagnostic, filter);
    });
  }, [filter, search]);

  const selected =
    diagnostics.find((diagnostic) => diagnostic.entry.name === selectedName) ??
    filtered[0] ??
    diagnostics[0]!;

  const counts = useMemo(() => {
    const critical = diagnostics.filter((item) => item.severity === "critical").length;
    const warning = diagnostics.filter((item) => item.severity === "warning").length;
    const info = diagnostics.filter((item) => item.severity === "info").length;
    const noFill = diagnostics.filter((item) =>
      item.issues.some((issue) => issue.code === "FILL_MODE_MISSING")
    ).length;
    return { critical, warning, info, noFill };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Aviala Icons</p>
            <h1 className="text-2xl font-bold text-foreground">Icon Sync Console</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {iconCatalog.length} catalog entries / {manifest.count ?? manifestRows.length} raw variants
            </p>
          </div>
          <Stack direction="row" gap="component" className="items-center">
            <Link href="/icons" level="text" mode="noBackgroundCustom">
              Icon Gallery
            </Link>
            <Link href="/" level="text" mode="noBackgroundCustom">
              Playground
            </Link>
          </Stack>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Stack gap="block">
          <GlobalNotice />

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricTile label="Critical sync issues" value={counts.critical} tone="critical" />
            <MetricTile label="Warning groups" value={counts.warning} tone="warning" />
            <MetricTile label="Incomplete matrices" value={counts.info} tone="info" />
            <MetricTile label="Default-only icons" value={counts.noFill} tone="warning" />
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <Stack gap="content">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, iconName, or category"
                  leftIcon={<GeneralSearch aria-hidden />}
                  aria-label="Search sync diagnostics"
                />
                <SegmentatorGroup value={filter} onValueChange={(value) => setFilter(value as FilterMode)}>
                  {FILTERS.map((item) => (
                    <SegmentatorItem key={item.value} value={item.value}>
                      {item.label}
                    </SegmentatorItem>
                  ))}
                </SegmentatorGroup>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <span>{filtered.length} visible</span>
                <Button
                  size="small"
                  mode="second"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                >
                  Reset
                </Button>
              </div>
            </Stack>
          </section>

          <section className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="hidden grid-cols-[48px_minmax(0,1fr)_150px_220px] gap-3 border-b border-border bg-muted/40 p-3 text-sm font-medium text-muted-foreground md:grid">
              <span />
              <span>Icon</span>
              <span>Category</span>
              <span>Top issues</span>
            </div>
            {filtered.length > 0 ? (
              filtered.map((diagnostic) => (
                <DiagnosticRow
                  key={diagnostic.entry.name}
                  diagnostic={diagnostic}
                  selected={diagnostic.entry.name === selected.entry.name}
                  onSelect={() => setSelectedName(diagnostic.entry.name)}
                />
              ))
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No diagnostics match the current filter.
              </div>
            )}
          </section>
        </Stack>

        <DetailPanel diagnostic={selected} />
      </main>
    </div>
  );
}
