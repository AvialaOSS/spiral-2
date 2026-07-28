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
} from "@aviala-design/icons";
import {
  Button,
  cn,
  Feedback,
  Input,
  SegmentatorGroup,
  SegmentatorItem,
  Stack,
  Typography,
  type FeedbackType,
} from "@aviala-design/spiral";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DocsLink } from "../../components/DocsLink";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildImportSnippet,
  buildSvgFilename,
  downloadSvgFile,
  groupIconsByCategory,
  iconShortLabel,
  readPreviewSvgMarkup,
  type CategoryGroup,
} from "../../lib/icon-gallery";

type CopyToast = {
  message: string;
  type: FeedbackType;
  key: number;
};

function CategoryAccordion({
  group,
  forceOpen,
  defaultOpen = false,
  selectedName,
  copiedName,
  onSelect,
}: {
  group: CategoryGroup;
  forceOpen: boolean;
  defaultOpen?: boolean;
  selectedName?: string;
  copiedName?: string;
  onSelect: (entry: IconCatalogEntry) => void;
}) {
  const [open, setOpen] = useState(forceOpen || defaultOpen);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  return (
    <section className="docs-icons-category">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="docs-icons-category-header"
      >
        <DirectionArrowDown
          aria-hidden
          width={18}
          height={18}
          className={cn("docs-icons-category-chevron", open && "is-open")}
        />
        <Typography level="text" as="span" className="flex-1 font-medium">
          {group.label}
        </Typography>
        <span className="docs-icons-category-count">{group.icons.length}</span>
      </button>
      {open ? (
        <div className="docs-icons-category-body">
          <div className="docs-icons-grid">
            {group.icons.map((entry) => {
              const selected = entry.name === selectedName;
              const copied = entry.name === copiedName;
              return (
                <button
                  key={entry.name}
                  type="button"
                  title={`选择并复制 ${entry.name}`}
                  aria-pressed={selected}
                  onClick={() => onSelect(entry)}
                  className={cn(
                    "docs-icons-tile",
                    selected && "is-selected",
                    copied && "is-copied"
                  )}
                >
                  <Icon
                    icon={entry.component}
                    size={24}
                    thickness="Regular"
                    mode="default"
                    className="text-foreground"
                  />
                  <span className="docs-icons-tile-label">{iconShortLabel(entry)}</span>
                  {copied ? (
                    <span className="docs-icons-tile-badge" aria-live="polite">
                      已复制
                    </span>
                  ) : null}
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
  onThicknessChange,
  onModeChange,
  onCopy,
  copied,
  svgCopied,
  onCopySvg,
  onDownloadSvg,
}: {
  entry: IconCatalogEntry;
  thickness: IconThickness;
  mode: IconMode;
  onThicknessChange: (value: IconThickness) => void;
  onModeChange: (value: IconMode) => void;
  onCopy: () => void;
  copied: boolean;
  svgCopied: boolean;
  onCopySvg: (stage: HTMLElement | null) => void;
  onDownloadSvg: (stage: HTMLElement | null) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const snippet = buildImportSnippet(entry, thickness, mode);

  return (
    <aside className="docs-icons-preview">
      <Stack gap="block">
        <div>
          <Typography level="caption" as="p" className="text-[var(--muted-foreground)]">
            预览
          </Typography>
          <Typography level="headline2" as="h2" className="mt-1">
            {entry.name}
          </Typography>
          <Typography level="caption" as="p" className="font-mono text-[var(--muted-foreground)]">
            {entry.iconName}
          </Typography>
        </div>

        <div ref={stageRef} className="docs-icons-preview-stage">
          <Icon icon={entry.component} size={64} thickness={thickness} mode={mode} />
        </div>

        <div className="docs-icons-preview-actions">
          <Button mode="second" size="small" onClick={() => onCopySvg(stageRef.current)}>
            {svgCopied ? "已复制 SVG" : "复制 SVG"}
          </Button>
          <Button mode="second" size="small" onClick={() => onDownloadSvg(stageRef.current)}>
            下载 SVG
          </Button>
        </div>

        <div>
          <Typography level="text" as="p" className="mb-2 text-[var(--muted-foreground)]">
            预览粗细
          </Typography>
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
          <Typography level="text" as="p" className="mb-2 text-[var(--muted-foreground)]">
            模式
          </Typography>
          <SegmentatorGroup value={mode} onValueChange={(value) => onModeChange(value as IconMode)}>
            {ICON_MODES.map((value) => (
              <SegmentatorItem key={value} value={value} disabled={!entry.modes.includes(value)}>
                {value}
              </SegmentatorItem>
            ))}
          </SegmentatorGroup>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <Typography level="text" as="p" className="text-[var(--muted-foreground)]">
              导入代码
            </Typography>
            <Button mode="second" size="small" onClick={onCopy}>
              {copied ? "已复制" : "复制"}
            </Button>
          </div>
          <pre className="docs-icons-snippet">{snippet}</pre>
        </div>

        <Typography level="caption" as="p" className="text-[var(--muted-foreground)]">
          需要预览 level / BiggerSize 尺寸？请前往{" "}
          <DocsLink to="/reference/icons/playground" level="caption" mode="noBackgroundCustom">
            Icons Playground
          </DocsLink>
          。
        </Typography>
      </Stack>
    </aside>
  );
}

export function IconsDocPage() {
  const [search, setSearch] = useState("");
  const [thicknessFilter, setThicknessFilter] = useState<IconThickness | "all">("all");
  const [selected, setSelected] = useState<IconCatalogEntry>(iconCatalog[0]!);
  const [thickness, setThickness] = useState<IconThickness>("Regular");
  const [mode, setMode] = useState<IconMode>("default");
  const [copiedName, setCopiedName] = useState<string>();
  const [panelCopied, setPanelCopied] = useState(false);
  const [svgCopied, setSvgCopied] = useState(false);
  const [toast, setToast] = useState<CopyToast | null>(null);

  const showToast = useCallback((message: string, type: FeedbackType = "success") => {
    setToast({ message, type, key: Date.now() });
    window.setTimeout(() => setToast(null), 2000);
  }, []);

  const categories = useMemo(
    () => groupIconsByCategory(iconCatalog, search, thicknessFilter),
    [search, thicknessFilter]
  );
  const totalVisible = useMemo(
    () => categories.reduce((sum, group) => sum + group.icons.length, 0),
    [categories]
  );
  const searching = search.trim().length > 0;

  const copySnippet = useCallback(
    async (entry: IconCatalogEntry, copyThickness: IconThickness, copyMode: IconMode) => {
      const snippet = buildImportSnippet(entry, copyThickness, copyMode);
      await navigator.clipboard.writeText(snippet);
      setCopiedName(entry.name);
      showToast(`已复制 ${entry.name}`);
      window.setTimeout(() => setCopiedName(undefined), 1500);
    },
    [showToast]
  );

  const selectIcon = useCallback(
    (entry: IconCatalogEntry, shouldCopy: boolean) => {
      let nextThickness = thickness;
      let nextMode = mode;

      if (!entry.thicknesses.includes(nextThickness)) {
        nextThickness = entry.thicknesses.includes("Regular") ? "Regular" : entry.thicknesses[0]!;
      }
      if (!entry.modes.includes(nextMode)) {
        nextMode = entry.modes[0] ?? "default";
      }

      setSelected(entry);
      setThickness(nextThickness);
      setMode(nextMode);

      if (shouldCopy) {
        void copySnippet(entry, nextThickness, nextMode);
      }
    },
    [copySnippet, mode, thickness]
  );

  const copyFromPanel = useCallback(async () => {
    await copySnippet(selected, thickness, mode);
    setPanelCopied(true);
    window.setTimeout(() => setPanelCopied(false), 1500);
  }, [copySnippet, mode, selected, thickness]);

  const copySvgFromPanel = useCallback(
    async (stage: HTMLElement | null) => {
      const markup = readPreviewSvgMarkup(stage);
      if (!markup) {
        showToast("未找到可复制的 SVG", "wrong");
        return;
      }
      await navigator.clipboard.writeText(markup);
      setSvgCopied(true);
      showToast("已复制 SVG");
      window.setTimeout(() => setSvgCopied(false), 1500);
    },
    [showToast]
  );

  const downloadSvgFromPanel = useCallback(
    (stage: HTMLElement | null) => {
      const markup = readPreviewSvgMarkup(stage);
      if (!markup) {
        showToast("未找到可下载的 SVG", "wrong");
        return;
      }
      const filename = buildSvgFilename(selected, thickness, mode);
      downloadSvgFile(markup, filename);
      showToast(`已下载 ${filename}`);
    },
    [mode, selected, showToast, thickness]
  );

  return (
    <div className="docs-icons-page">
      <DocPageHeader
        title="Icons 图标"
        description={`浏览 ${iconCatalog.length} 个 Aviala 图标，按分类搜索、复制导入代码，或复制/下载纯 SVG。`}
      />

      <div className="docs-icons-layout">
        <Stack gap="block">
          <div className="docs-icons-toolbar">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="搜索名称或分类…"
              leftIcon={<GeneralSearch aria-hidden />}
              aria-label="搜索图标"
            />

            <div className="docs-icons-filters">
              <Typography level="caption" as="span" className="text-[var(--muted-foreground)]">
                筛选粗细
              </Typography>
              <SegmentatorGroup
                value={thicknessFilter}
                onValueChange={(value) => setThicknessFilter(value as IconThickness | "all")}
              >
                <SegmentatorItem value="all">全部</SegmentatorItem>
                {ICON_THICKNESSES.map((value) => (
                  <SegmentatorItem key={value} value={value}>
                    {value}
                  </SegmentatorItem>
                ))}
              </SegmentatorGroup>
            </div>

            <Typography level="caption" as="p" className="text-[var(--muted-foreground)]">
              {searching || thicknessFilter !== "all"
                ? `${totalVisible} 个匹配图标`
                : `${categories.length} 个分类 · ${iconCatalog.length} 个图标`}
              {" · "}
              点击图标选择并复制导入代码
            </Typography>
          </div>

          {categories.length === 0 ? (
            <div className="docs-icons-empty">
              <Typography level="text" as="p" className="text-[var(--muted-foreground)]">
                没有匹配的图标，请调整搜索或筛选条件。
              </Typography>
            </div>
          ) : (
            categories.map((group, index) => (
              <CategoryAccordion
                key={group.id}
                group={group}
                forceOpen={searching || thicknessFilter !== "all"}
                defaultOpen={index === 0}
                selectedName={selected.name}
                copiedName={copiedName}
                onSelect={(entry) => selectIcon(entry, true)}
              />
            ))
          )}
        </Stack>

        <PreviewPanel
          entry={selected}
          thickness={thickness}
          mode={mode}
          onThicknessChange={setThickness}
          onModeChange={setMode}
          onCopy={() => void copyFromPanel()}
          copied={panelCopied}
          svgCopied={svgCopied}
          onCopySvg={(stage) => void copySvgFromPanel(stage)}
          onDownloadSvg={downloadSvgFromPanel}
        />
      </div>

      {toast ? (
        <Feedback
          key={toast.key}
          className="docs-icons-toast"
          type={toast.type}
          size="small"
          mode="primary"
          title={toast.message}
          showClose={false}
        />
      ) : null}
    </div>
  );
}
