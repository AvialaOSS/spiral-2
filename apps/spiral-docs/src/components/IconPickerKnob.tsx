import type { IconCatalogEntry } from "@aviala-design/icons";
import { DirectionArrowDownLight, GeneralSearch, Icon } from "@aviala-design/icons";
import {
  cn,
  FormField,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
  typographyVariants,
} from "@aviala-design/spiral";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_ICON_NAME,
  getIconCatalogEntries,
  isIconCatalogLoaded,
  loadIconCatalog,
  resolveIconComponent,
} from "../demos/demo-icons";
import { groupIconsByCategory, iconShortLabel } from "../lib/icon-gallery";

type IconPickerKnobProps = {
  id: string;
  label: string;
  value: string;
  onChange: (name: string) => void;
};

function IconPreview({
  name,
  className,
  size = 18,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const component = resolveIconComponent(name);
  if (!component) return null;

  return (
    <Icon
      icon={component}
      size={size}
      thickness="Regular"
      mode="default"
      className={cn("shrink-0 text-foreground", className)}
    />
  );
}

function IconPickerList({
  entries,
  selectedName,
  onSelect,
}: {
  entries: readonly IconCatalogEntry[];
  selectedName: string;
  onSelect: (name: string) => void;
}) {
  const [search, setSearch] = useState("");
  const categories = useMemo(
    () => groupIconsByCategory(entries, search),
    [entries, search]
  );
  const searching = search.trim().length > 0;

  if (entries.length === 0) {
    return (
      <Typography level="caption" as="p" className="docs-icon-picker-empty">
        加载图标库…
      </Typography>
    );
  }

  if (categories.length === 0) {
    return (
      <Typography level="caption" as="p" className="docs-icon-picker-empty">
        没有匹配的图标
      </Typography>
    );
  }

  return (
    <>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="搜索名称或分类…"
        leftIcon={<GeneralSearch aria-hidden />}
        aria-label="搜索图标"
        className="docs-icon-picker-search"
      />

      <div className="docs-icon-picker-list" role="listbox" aria-label="图标列表">
        {categories.map((group) => (
          <section key={group.id} className="docs-icon-picker-group">
            <Typography
              level="caption"
              as="p"
              className="docs-icon-picker-group-label"
            >
              {group.label}
              <span className="docs-icon-picker-group-count">{group.icons.length}</span>
            </Typography>

            <div className="docs-icon-picker-options">
              {group.icons.map((entry) => {
                const selected = entry.name === selectedName;
                return (
                  <button
                    key={entry.name}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    title={entry.name}
                    onClick={() => onSelect(entry.name)}
                    className={cn(
                      "docs-icon-picker-option",
                      selected && "is-selected"
                    )}
                  >
                    <Icon
                      icon={entry.component}
                      size={20}
                      thickness="Regular"
                      mode="default"
                      className="shrink-0 text-foreground"
                    />
                    <span className="docs-icon-picker-option-text">
                      <span className="docs-icon-picker-option-label">
                        {iconShortLabel(entry)}
                      </span>
                      <span className="docs-icon-picker-option-name">{entry.name}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {searching ? (
          <Typography level="caption" as="p" className="docs-icon-picker-meta">
            {categories.reduce((sum, group) => sum + group.icons.length, 0)} 个匹配图标
          </Typography>
        ) : null}
      </div>
    </>
  );
}

export function IconPickerKnob({ id, label, value, onChange }: IconPickerKnobProps) {
  const [open, setOpen] = useState(false);
  const [catalogReady, setCatalogReady] = useState(isIconCatalogLoaded());
  const selectedName = value || DEFAULT_ICON_NAME;
  const entries = getIconCatalogEntries();

  useEffect(() => {
    if (!open || catalogReady) return;
    void loadIconCatalog().then(() => setCatalogReady(true));
  }, [open, catalogReady]);

  return (
    <FormField label={label} htmlFor={id}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            className={cn("aviala-select-trigger docs-icon-picker-trigger")}
            data-size="regular"
            aria-label={`${label}: ${selectedName}`}
            aria-haspopup="listbox"
          >
            <span className="aviala-select-trigger__slot">
              <IconPreview name={selectedName} />
            </span>
            <span className="aviala-select-trigger__field">
              <span
                className={cn(
                  "aviala-select-trigger__value",
                  typographyVariants({ level: "text" })
                )}
              >
                {selectedName}
              </span>
            </span>
            <span className="aviala-select-trigger__expand" aria-hidden>
              <DirectionArrowDownLight
                className="aviala-select-trigger__expand-icon"
                thickness="Regular"
                mode="default"
                aria-hidden
              />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="docs-icon-picker-panel" portalled={false}>
          <IconPickerList
            entries={entries}
            selectedName={selectedName}
            onSelect={(name) => {
              onChange(name);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </FormField>
  );
}
