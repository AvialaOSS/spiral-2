import {
  GeneralSearch,
  ICON_MODES,
  ICON_THICKNESSES,
  Icon,
  iconCatalog,
  type IconCatalogEntry,
  type IconMode,
  type IconThickness,
} from "@aviala-design/icons";
import {
  Button,
  cn,
  Input,
  SegmentatorGroup,
  SegmentatorItem,
  Stack,
  Typography,
} from "@aviala-design/spiral";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { DocPageHeader } from "../../components/TableOfContents";
import { formatCategoryLabel } from "../../lib/icon-gallery";

type VariantKey = `${IconThickness}:${IconMode}`;
type Severity = "critical" | "warning" | "info";
type FilterMode = "all" | Severity | "no-fill" | "metadata";
type SyncMode = "sync" | "dry-run";

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
  title: string;
  detail: string;
  action: string;
};

type IconDiagnostic = {
  entry: IconCatalogEntry;
  rows: RawIconManifestEntry[];
  variants: Set<VariantKey>;
  issues: DiagnosticIssue[];
  severity: Severity | "ok";
};

type SyncStatus = {
  id: number;
  running: boolean;
  mode: SyncMode;
  startedAt?: string;
  finishedAt?: string;
  exitCode?: number | null;
  currentStep?: string;
  error?: string;
  logs: string[];
};

type ManifestResponse = {
  available: boolean;
  manifest: RawIconManifest | null;
  error?: string;
};

const filters: { value: FilterMode; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "critical", label: "严重" },
  { value: "warning", label: "警告" },
  { value: "info", label: "提示" },
  { value: "no-fill", label: "缺少 fill" },
  { value: "metadata", label: "元数据" },
];

const expectedVariants = ICON_THICKNESSES.flatMap((thickness) =>
  ICON_MODES.map((mode) => variantKey(thickness, mode))
);

function variantKey(thickness: IconThickness, mode: IconMode): VariantKey {
  return `${thickness}:${mode}`;
}

function isIconThickness(value: string): value is IconThickness {
  return (ICON_THICKNESSES as readonly string[]).includes(value);
}

function isIconMode(value: string): value is IconMode {
  return (ICON_MODES as readonly string[]).includes(value);
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

function rowsToVariants(rows: RawIconManifestEntry[]): Set<VariantKey> {
  const variants = new Set<VariantKey>();
  for (const row of rows) {
    if (isIconThickness(row.thickness) && isIconMode(row.mode)) {
      variants.add(variantKey(row.thickness, row.mode));
    }
  }
  return variants;
}

function catalogToVariants(entry: IconCatalogEntry): Set<VariantKey> {
  const variants = new Set<VariantKey>();
  for (const thickness of entry.thicknesses) {
    for (const mode of entry.modes) {
      variants.add(variantKey(thickness, mode));
    }
  }
  return variants;
}

function buildRowsByIconName(manifestRows: RawIconManifestEntry[]) {
  return manifestRows.reduce((map, row) => {
    const rows = map.get(row.name);
    if (rows) rows.push(row);
    else map.set(row.name, [row]);
    return map;
  }, new Map<string, RawIconManifestEntry[]>());
}

function analyzeIcon(
  entry: IconCatalogEntry,
  rowsByIconName: Map<string, RawIconManifestEntry[]>,
  hasManifest: boolean
): IconDiagnostic {
  const rows = rowsByIconName.get(entry.iconName) ?? [];
  const variants = rows.length > 0 ? rowsToVariants(rows) : catalogToVariants(entry);
  const issues: DiagnosticIssue[] = [];

  if (hasManifest && rows.length === 0) {
    issues.push({
      code: "MANIFEST_MISSING",
      severity: "critical",
      title: "Manifest 缺失",
      detail: "catalog 中有这个图标，但 raw manifest 中没有对应导出记录。",
      action: "先执行图标同步，再重新生成图标 catalog。",
    });
  }

  if (!variants.has("Regular:default")) {
    issues.push({
      code: "REGULAR_DEFAULT_MISSING",
      severity: "critical",
      title: "缺少 Regular/default",
      detail: "Icon 包装组件默认会请求 Regular/default。",
      action: "补齐该变体，或统一 Icon 包装组件与生成组件的默认粗细。",
    });
  }

  if (!variants.has("Bold:default")) {
    issues.push({
      code: "BOLD_DEFAULT_MISSING",
      severity: "critical",
      title: "缺少 Bold/default",
      detail: "生成的图标组件会把 Bold/default 作为主要兜底目标。",
      action: "补齐该变体，或调整生成组件的兜底策略。",
    });
  }

  const missingMediumModes = ICON_MODES.filter((mode) => !variants.has(variantKey("Medium", mode)));
  if (missingMediumModes.length > 0) {
    issues.push({
      code: "MEDIUM_MISSING",
      severity: "warning",
      title: "Medium 不完整",
      detail: `缺少 Medium ${missingMediumModes.join(" 和 ")}。`,
      action: "从 Figma 导出 Medium 变体，或暂时不要把 Medium 作为稳定公开选项。",
    });
  }

  const hasFill = ICON_THICKNESSES.some((thickness) => variants.has(variantKey(thickness, "fill")));
  if (!hasFill) {
    issues.push({
      code: "FILL_MODE_MISSING",
      severity: "warning",
      title: "缺少 fill 模式",
      detail: "请求 fill 时会静默降级到其他视觉变体。",
      action: "补齐 fill 变体，或在工具和文档里禁用该图标的 fill 控制。",
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
      title: "元数据不同步",
      detail: `${metadataRows.length} 条 raw 记录存在命名、组件集合或输出路径异常。`,
      action: "发布前检查 Figma component set 名称、variant name 字段和导出路径。",
    });
  }

  const missingCount = expectedVariants.filter((key) => !variants.has(key)).length;
  if (missingCount > 0) {
    issues.push({
      code: "INCOMPLETE_MATRIX",
      severity: "info",
      title: "变体矩阵不完整",
      detail: `${missingCount} 个公开变体当前不可用。`,
      action: "在界面里禁用不可用变体，并在开发环境提示真实兜底结果。",
    });
  }

  const severity = issues.some((issue) => issue.severity === "critical")
    ? "critical"
    : issues.some((issue) => issue.severity === "warning")
      ? "warning"
      : issues.some((issue) => issue.severity === "info")
        ? "info"
        : "ok";

  return { entry, rows, variants, issues, severity };
}

function buildDiagnostics(manifest: RawIconManifest | null): IconDiagnostic[] {
  const manifestRows = manifest?.icons ?? [];
  const rowsByIconName = buildRowsByIconName(manifestRows);

  return iconCatalog
    .map((entry) => analyzeIcon(entry, rowsByIconName, manifest !== null))
    .sort((a, b) => {
      const rank = severityRank(a.severity) - severityRank(b.severity);
      return rank || a.entry.name.localeCompare(b.entry.name);
    });
}

function severityRank(severity: IconDiagnostic["severity"]): number {
  if (severity === "critical") return 0;
  if (severity === "warning") return 1;
  if (severity === "info") return 2;
  return 3;
}

function severityLabel(severity: IconDiagnostic["severity"]): string {
  if (severity === "critical") return "严重";
  if (severity === "warning") return "警告";
  if (severity === "info") return "提示";
  return "正常";
}

function severityClass(severity: IconDiagnostic["severity"]): string {
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

function issueMatchesFilter(diagnostic: IconDiagnostic, filter: FilterMode): boolean {
  if (filter === "all") return true;
  if (filter === "no-fill") {
    return diagnostic.issues.some((issue) => issue.code === "FILL_MODE_MISSING");
  }
  if (filter === "metadata") {
    return diagnostic.issues.some((issue) =>
      ["MANIFEST_MISSING", "METADATA_SYNC"].includes(issue.code)
    );
  }
  return diagnostic.severity === filter;
}

function formatDateTime(value?: string): string {
  if (!value) return "暂无";
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

function IssueBadge({ issue }: { issue: DiagnosticIssue }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs", severityClass(issue.severity))}>
      {issue.title}
    </span>
  );
}

function VariantMatrix({ diagnostic }: { diagnostic: IconDiagnostic }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-[96px_repeat(2,minmax(0,1fr))] border-b border-border bg-muted/40 text-sm font-medium">
        <div className="p-2">变体</div>
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
              <div
                key={key}
                className="flex min-h-14 items-center justify-center border-r border-border p-2 last:border-r-0"
              >
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
                    缺失
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
  return (
    <aside className="docs-icons-preview">
      <Stack gap="block">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <Typography level="headline3" as="h2">
                {diagnostic.entry.name}
              </Typography>
              <Typography level="caption" as="p" className="font-mono text-[var(--muted-foreground)]">
                {diagnostic.entry.iconName}
              </Typography>
            </div>
            <span className={cn("rounded-full border px-2 py-0.5 text-xs", severityClass(diagnostic.severity))}>
              {severityLabel(diagnostic.severity)}
            </span>
          </div>
          <Typography level="caption" as="p" className="mt-2 text-[var(--muted-foreground)]">
            {formatCategoryLabel(diagnostic.entry.category ?? "other")} / {diagnostic.rows.length} 条 raw 记录
          </Typography>
        </div>

        <VariantMatrix diagnostic={diagnostic} />

        <div>
          <Typography level="text" as="h3" className="mb-2 font-semibold">
            异常提示
          </Typography>
          <Stack gap="content">
            {diagnostic.issues.map((issue) => (
              <div key={issue.code} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <IssueBadge issue={issue} />
                  <span className="font-mono text-xs text-muted-foreground">{issue.code}</span>
                </div>
                <Typography level="text" as="p" className="mt-2">
                  {issue.detail}
                </Typography>
                <Typography level="caption" as="p" className="mt-1 text-[var(--muted-foreground)]">
                  {issue.action}
                </Typography>
              </div>
            ))}
          </Stack>
        </div>
      </Stack>
    </aside>
  );
}

function MetricCard({
  label,
  value,
  severity,
}: {
  label: string;
  value: number | string;
  severity: IconDiagnostic["severity"];
}) {
  return (
    <div className={cn("rounded-lg border p-4", severityClass(severity))}>
      <div className="text-2xl font-semibold">{value}</div>
      <Typography level="caption" as="div" className="mt-1">
        {label}
      </Typography>
    </div>
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
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "grid w-full grid-cols-[44px_minmax(0,1fr)] gap-3 border-b border-border p-3 text-left transition-colors last:border-b-0 md:grid-cols-[44px_minmax(0,1fr)_150px_220px]",
        selected ? "bg-accent/40" : "hover:bg-muted/40"
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
        <Icon icon={diagnostic.entry.component} size={22} />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-medium">{diagnostic.entry.name}</span>
        <span className="block truncate font-mono text-xs text-muted-foreground">
          {diagnostic.entry.iconName}
        </span>
        <span className="mt-2 flex flex-wrap gap-1 md:hidden">
          {topIssues.map((issue) => (
            <IssueBadge key={issue.code} issue={issue} />
          ))}
        </span>
      </span>
      <span className="hidden text-sm text-muted-foreground md:block">
        {formatCategoryLabel(diagnostic.entry.category ?? "other")}
      </span>
      <span className="hidden flex-wrap gap-1 md:flex">
        {topIssues.map((issue) => (
          <IssueBadge key={issue.code} issue={issue} />
        ))}
      </span>
    </button>
  );
}

function SyncControlPanel({
  status,
  apiError,
  onStart,
  onRefresh,
}: {
  status: SyncStatus | null;
  apiError?: string;
  onStart: (mode: SyncMode) => void;
  onRefresh: () => void;
}) {
  const running = status?.running ?? false;
  const modeLabel = status?.mode === "dry-run" ? "预检" : "同步";
  const result =
    status?.running
      ? "运行中"
      : status?.exitCode === 0
        ? "已完成"
        : status?.exitCode === 1
          ? "失败"
          : "未开始";

  return (
    <section className="docs-icons-toolbar">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography level="headline3" as="h2">
            同步操作
          </Typography>
          <Typography level="text" as="p" className="mt-1 text-[var(--muted-foreground)]">
            这里会调用当前 dev server 内置接口，在仓库根目录执行 Figma 图标导出和组件生成。
            正式同步会覆盖 `packages/icons/raw` 并更新 `packages/icons/src`。
          </Typography>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button mode="second" size="small" disabled={running} onClick={() => onStart("dry-run")}>
            预检
          </Button>
          <Button mode="primary" size="small" disabled={running} onClick={() => onStart("sync")}>
            开始同步
          </Button>
          <Button mode="default" size="small" onClick={onRefresh}>
            刷新状态
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="当前状态" value={result} severity={status?.exitCode === 1 ? "critical" : running ? "info" : "ok"} />
        <MetricCard label="运行模式" value={modeLabel} severity="info" />
        <MetricCard label="当前步骤" value={status?.currentStep ?? "空闲"} severity="info" />
      </div>

      <div className="rounded-lg border border-border bg-background p-3">
        <Typography level="caption" as="p" className="text-[var(--muted-foreground)]">
          开始：{formatDateTime(status?.startedAt)} / 结束：{formatDateTime(status?.finishedAt)}
        </Typography>
        {apiError ? (
          <Typography level="text" as="p" className="mt-2 text-red-700 dark:text-red-300">
            {apiError}
          </Typography>
        ) : null}
        {status?.error ? (
          <Typography level="text" as="p" className="mt-2 text-red-700 dark:text-red-300">
            {status.error}
          </Typography>
        ) : null}
        <pre className="docs-icons-snippet mt-3 max-h-[260px] overflow-auto">
          {(status?.logs.length ? status.logs.join("\n") : "暂无日志。若按钮返回 404，请重启 docs dev server 让新的同步接口生效。")}
        </pre>
      </div>
    </section>
  );
}

export function IconSyncDocPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [selectedName, setSelectedName] = useState(iconCatalog[0]?.name ?? "");
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [syncError, setSyncError] = useState<string>();
  const [manifest, setManifest] = useState<RawIconManifest | null>(null);
  const [manifestError, setManifestError] = useState<string>();

  const diagnostics = useMemo(() => buildDiagnostics(manifest), [manifest]);
  const manifestRows = manifest?.icons ?? [];

  const refreshManifest = async () => {
    try {
      const response = await fetch("/__spiral/icon-sync/manifest", { cache: "no-store" });
      if (!response.ok) throw new Error(`读取 manifest 失败：HTTP ${response.status}`);
      const payload = (await response.json()) as ManifestResponse;
      setManifest(payload.manifest);
      setManifestError(payload.error);
    } catch (error) {
      setManifest(null);
      setManifestError(
        error instanceof Error
          ? `${error.message}。如果你已经开着 docs 服务器，需要重启一次以加载新的 Vite middleware。`
          : "无法读取 manifest。"
      );
    }
  };

  const refreshSyncStatus = async () => {
    try {
      const response = await fetch("/__spiral/icon-sync/status", { cache: "no-store" });
      if (!response.ok) throw new Error(`同步接口不可用：HTTP ${response.status}`);
      setSyncStatus((await response.json()) as SyncStatus);
      setSyncError(undefined);
      void refreshManifest();
    } catch (error) {
      setSyncError(
        error instanceof Error
          ? `${error.message}。如果你已经开着 docs 服务器，需要重启一次以加载新的 Vite middleware。`
          : "同步接口不可用。"
      );
    }
  };

  const startSync = async (mode: SyncMode) => {
    try {
      const response = await fetch(`/__spiral/icon-sync/start?mode=${mode}`, {
        method: "POST",
      });
      if (!response.ok && response.status !== 409) {
        throw new Error(`启动失败：HTTP ${response.status}`);
      }
      setSyncStatus((await response.json()) as SyncStatus);
      setSyncError(undefined);
    } catch (error) {
      setSyncError(
        error instanceof Error
          ? `${error.message}。如果你已经开着 docs 服务器，需要重启一次以加载新的 Vite middleware。`
          : "启动同步失败。"
      );
    }
  };

  useEffect(() => {
    void refreshManifest();
    void refreshSyncStatus();
    const timer = window.setInterval(() => void refreshSyncStatus(), 2000);
    return () => window.clearInterval(timer);
  }, []);

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

  const counts = useMemo(
    () => ({
      critical: diagnostics.filter((item) => item.severity === "critical").length,
      warning: diagnostics.filter((item) => item.severity === "warning").length,
      info: diagnostics.filter((item) => item.severity === "info").length,
      noFill: diagnostics.filter((item) =>
        item.issues.some((issue) => issue.code === "FILL_MODE_MISSING")
      ).length,
    }),
    [diagnostics]
  );

  return (
    <div className="docs-icons-page">
      <DocPageHeader
        title="图标同步控制台"
        description={`检查 ${iconCatalog.length} 个图标组件与 ${manifest?.count ?? manifestRows.length} 个 raw 导出变体，并在界面中提示兜底、缺失和元数据异常。`}
      />

      <div className="docs-icons-layout">
        <Stack gap="block" className="docs-icons-main">
          {!manifest ? (
            <section className="rounded-lg border border-sky-500/40 bg-sky-500/10 p-4 text-sky-900 dark:text-sky-200">
              <Typography level="text" as="h2" className="font-semibold">
                暂未读取到 raw manifest
              </Typography>
              <Typography level="text" as="p" className="mt-1">
                当前页面先使用 icon catalog 进行诊断。执行“预检”或“开始同步”后，如果导出流程生成
                `packages/icons/raw/manifest.json`，这里会自动切换到 manifest 数据。
              </Typography>
              {manifestError ? (
                <Typography level="caption" as="p" className="mt-2">
                  {manifestError}
                </Typography>
              ) : null}
            </section>
          ) : null}

          <SyncControlPanel
            status={syncStatus}
            apiError={syncError}
            onStart={(mode) => void startSync(mode)}
            onRefresh={() => void refreshSyncStatus()}
          />

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="严重同步问题" value={counts.critical} severity="critical" />
            <MetricCard label="警告图标组" value={counts.warning} severity="warning" />
            <MetricCard label="变体矩阵不完整" value={counts.info} severity="info" />
            <MetricCard label="仅 default 图标" value={counts.noFill} severity="warning" />
          </section>

          <section className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
            <Typography level="text" as="h2" className="font-semibold">
              默认值不一致
            </Typography>
            <Typography level="text" as="p" className="mt-1">
              Icon 包装组件默认使用 Regular/default，生成图标组件默认使用 Bold/default。
              直接使用组件和通过 Icon 包装使用时，默认视觉可能不同。
            </Typography>
          </section>

          <section className="docs-icons-toolbar">
            <Input
              value={search}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
              placeholder="搜索名称、iconName 或分类"
              leftIcon={<GeneralSearch aria-hidden />}
              aria-label="搜索图标同步诊断"
            />
            <div className="docs-icons-filters">
              <Typography level="caption" as="span" className="text-[var(--muted-foreground)]">
                筛选
              </Typography>
              <SegmentatorGroup value={filter} onValueChange={(value: string) => setFilter(value as FilterMode)}>
                {filters.map((item) => (
                  <SegmentatorItem key={item.value} value={item.value}>
                    {item.label}
                  </SegmentatorItem>
                ))}
              </SegmentatorGroup>
            </div>
            <Typography level="caption" as="p" className="text-[var(--muted-foreground)]">
              当前显示 {filtered.length} 项
            </Typography>
          </section>

          <section className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="hidden grid-cols-[44px_minmax(0,1fr)_150px_220px] gap-3 border-b border-border bg-muted/40 p-3 text-sm font-medium text-muted-foreground md:grid">
              <span />
              <span>图标</span>
              <span>分类</span>
              <span>主要异常</span>
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
                当前筛选下没有匹配的诊断项。
              </div>
            )}
          </section>
        </Stack>

        <DetailPanel diagnostic={selected} />
      </div>
    </div>
  );
}
