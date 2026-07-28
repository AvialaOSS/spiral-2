import {
  GeneralSearch,
  ICON_LEVELS,
  ICON_MODES,
  ICON_THICKNESSES,
  Icon,
  iconCatalog,
  resolveIconSizeToken,
  type IconCatalogEntry,
  type IconLevel,
  type IconMode,
  type IconThickness,
} from "@aviala-design/icons";
import {
  Button,
  Input,
  SegmentatorGroup,
  SegmentatorItem,
  Stack,
  Typography,
} from "@aviala-design/spiral";
import { useCallback, useMemo, useState } from "react";
import { DocsLink } from "../../components/DocsLink";
import { DocPageHeader } from "../../components/TableOfContents";
import { buildImportSnippet, groupIconsByCategory, iconShortLabel } from "../../lib/icon-gallery";

export function IconsPlaygroundPage() {
  const [pickerSearch, setPickerSearch] = useState("");
  const [selected, setSelected] = useState<IconCatalogEntry>(iconCatalog[0]!);
  const [level, setLevel] = useState<IconLevel>("title");
  const [biggerSize, setBiggerSize] = useState(false);
  const [thickness, setThickness] = useState<IconThickness>("Regular");
  const [mode, setMode] = useState<IconMode>("default");
  const [copied, setCopied] = useState(false);

  const pickerGroups = useMemo(
    () => groupIconsByCategory(iconCatalog, pickerSearch),
    [pickerSearch]
  );

  const pickerTotal = useMemo(
    () => pickerGroups.reduce((sum, group) => sum + group.icons.length, 0),
    [pickerGroups]
  );

  const sizeToken = resolveIconSizeToken(level, biggerSize);
  const snippet = buildImportSnippet(selected, thickness, mode, { level, biggerSize });

  const selectIcon = (entry: IconCatalogEntry) => {
    setSelected(entry);
    if (!entry.thicknesses.includes(thickness)) {
      setThickness(entry.thicknesses.includes("Regular") ? "Regular" : entry.thicknesses[0]!);
    }
    if (!entry.modes.includes(mode)) {
      setMode(entry.modes[0] ?? "default");
    }
  };

  const copySnippet = useCallback(async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }, [snippet]);

  return (
    <div className="docs-icons-page">
      <DocPageHeader
        title="Icons Playground"
        description="实验 Icon 的 level 与 BiggerSize 尺寸映射，预览 token 解析后的实际大小并复制带 props 的代码片段。"
      />

      <div className="docs-icons-playground">
        <Stack gap="block" className="docs-icons-playground-controls">
          <section className="docs-icons-toolbar">
            <Typography level="text" as="p" className="font-medium">
              选择图标
            </Typography>
            <Input
              value={pickerSearch}
              onChange={(event) => setPickerSearch(event.target.value)}
              placeholder="搜索名称或分类…"
              leftIcon={<GeneralSearch aria-hidden />}
              aria-label="搜索图标"
            />
            <Typography level="caption" as="p" className="text-[var(--muted-foreground)]">
              {pickerSearch.trim()
                ? `${pickerTotal} 个匹配 · 当前 ${selected.name}`
                : `当前 ${selected.name}`}
            </Typography>

            <div className="docs-icons-playground-picker" role="listbox" aria-label="图标列表">
              {pickerGroups.map((group) => (
                <section key={group.id} className="docs-icons-playground-picker-group">
                  <Typography level="caption" as="p" className="docs-icons-playground-picker-label">
                    {group.label}
                  </Typography>
                  <div className="docs-icons-playground-picker-grid">
                    {group.icons.map((entry) => (
                      <button
                        key={entry.name}
                        type="button"
                        role="option"
                        aria-selected={entry.name === selected.name}
                        title={entry.name}
                        onClick={() => selectIcon(entry)}
                        className={
                          entry.name === selected.name
                            ? "docs-icons-playground-picker-tile is-selected"
                            : "docs-icons-playground-picker-tile"
                        }
                      >
                        <Icon
                          icon={entry.component}
                          size={20}
                          thickness="Regular"
                          mode="default"
                          className="text-foreground"
                        />
                        <span className="docs-icons-tile-label">{iconShortLabel(entry)}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="docs-icons-toolbar">
            <Typography level="text" as="p" className="font-medium">
              尺寸级别
            </Typography>
            <SegmentatorGroup value={level} onValueChange={(value) => setLevel(value as IconLevel)}>
              {ICON_LEVELS.map((value) => (
                <SegmentatorItem key={value} value={value}>
                  {value}
                </SegmentatorItem>
              ))}
            </SegmentatorGroup>
          </section>

          <section className="docs-icons-toolbar">
            <Typography level="text" as="p" className="font-medium">
              BiggerSize
            </Typography>
            <SegmentatorGroup
              value={biggerSize ? "yes" : "no"}
              onValueChange={(value) => setBiggerSize(value === "yes")}
            >
              <SegmentatorItem value="no">默认</SegmentatorItem>
              <SegmentatorItem value="yes">更大</SegmentatorItem>
            </SegmentatorGroup>
          </section>

          <section className="docs-icons-toolbar">
            <Typography level="text" as="p" className="font-medium">
              粗细
            </Typography>
            <SegmentatorGroup
              value={thickness}
              onValueChange={(value) => setThickness(value as IconThickness)}
            >
              {ICON_THICKNESSES.map((value) => (
                <SegmentatorItem
                  key={value}
                  value={value}
                  disabled={!selected.thicknesses.includes(value)}
                >
                  {value}
                </SegmentatorItem>
              ))}
            </SegmentatorGroup>
          </section>

          <section className="docs-icons-toolbar">
            <Typography level="text" as="p" className="font-medium">
              模式
            </Typography>
            <SegmentatorGroup value={mode} onValueChange={(value) => setMode(value as IconMode)}>
              {ICON_MODES.map((value) => (
                <SegmentatorItem
                  key={value}
                  value={value}
                  disabled={!selected.modes.includes(value)}
                >
                  {value}
                </SegmentatorItem>
              ))}
            </SegmentatorGroup>
          </section>
        </Stack>

        <aside className="docs-icons-preview docs-icons-playground-preview">
          <Stack gap="block">
            <div>
              <Typography level="caption" as="p" className="text-[var(--muted-foreground)]">
                预览
              </Typography>
              <Typography level="headline2" as="h2" className="mt-1">
                {selected.name}
              </Typography>
              <Typography level="caption" as="p" className="font-mono text-[var(--muted-foreground)]">
                {selected.iconName}
              </Typography>
            </div>

            <div
              className="docs-icons-preview-stage docs-icons-playground-stage"
              style={{ ["--aviala-icon-size" as string]: sizeToken }}
            >
              <Icon
                icon={selected.component}
                level={level}
                biggerSize={biggerSize}
                thickness={thickness}
                mode={mode}
              />
            </div>

            <div className="docs-icons-playground-meta">
              <Typography level="caption" as="p" className="text-[var(--muted-foreground)]">
                Token 尺寸
              </Typography>
              <Typography level="text" as="p" className="font-mono">
                {sizeToken}
              </Typography>
              <Typography level="caption" as="p" className="text-[var(--muted-foreground)]">
                level="{level}"{biggerSize ? " biggerSize" : ""}
              </Typography>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <Typography level="text" as="p" className="text-[var(--muted-foreground)]">
                  导入代码
                </Typography>
                <Button mode="second" size="small" onClick={() => void copySnippet()}>
                  {copied ? "已复制" : "复制"}
                </Button>
              </div>
              <pre className="docs-icons-snippet">{snippet}</pre>
            </div>

            <Typography level="caption" as="p" className="text-[var(--muted-foreground)]">
              浏览完整图标库请前往{" "}
              <DocsLink to="/reference/icons" level="caption" mode="noBackgroundCustom">
                Icons 图标
              </DocsLink>
              。
            </Typography>
          </Stack>
        </aside>
      </div>
    </div>
  );
}
