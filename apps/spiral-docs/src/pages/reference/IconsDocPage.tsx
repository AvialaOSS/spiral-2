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
  Input,
  Link,
  SegmentatorGroup,
  SegmentatorItem,
  Stack,
  Typography,
} from "@aviala-design/spiral";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DocPageHeader } from "../../components/TableOfContents";
import {
  buildImportSnippet,
  groupIconsByCategory,
  iconShortLabel,
  type CategoryGroup,
} from "../../lib/icon-gallery";

type CopyToast = {
  message: string;
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
}: {
  entry: IconCatalogEntry;
  thickness: IconThickness;
  mode: IconMode;
  onThicknessChange: (value: IconThickness) => void;
  onModeChange: (value: IconMode) => void;
  onCopy: () => void;
  copied: boolean;
}) {
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

        <div className="docs-icons-preview-stage">
          <Icon icon={entry.component} size={64} thickness={thickness} mode={mode} />
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
          <Link href="/reference/icons/playground" level="caption" mode="noBackgroundCustom">
            Icons Playground
          </Link>
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
  const [toast, setToast] = useState<CopyToast | null>(null);

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
      setToast({ message: `已复制 ${entry.name}`, key: Date.now() });
      window.setTimeout(() => setCopiedName(undefined), 1500);
      window.setTimeout(() => setToast(null), 2000);
    },
    []
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

  return (
    <div className="docs-icons-page">
      <DocPageHeader
        title="Icons 图标"
        description={`浏览 ${iconCatalog.length} 个 Aviala 图标，按分类搜索并一键复制导入代码。`}
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
        />
      </div>

      {toast ? (
        <div key={toast.key} className="docs-icons-toast" role="status" aria-live="polite">
          <Typography level="text" as="span">
            {toast.message}
          </Typography>
        </div>
      ) : null}
    </div>
  );
}
