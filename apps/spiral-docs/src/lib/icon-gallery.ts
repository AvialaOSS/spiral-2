import type { IconCatalogEntry, IconMode, IconThickness } from "@aviala-design/icons";

export type CategoryGroup = {
  id: string;
  label: string;
  icons: IconCatalogEntry[];
};

export function formatCategoryLabel(category: string): string {
  if (category === "timeAndDate") return "Time & Date";
  if (category === "AI") return "AI";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function iconShortLabel(entry: IconCatalogEntry): string {
  const underscore = entry.iconName.indexOf("_");
  return underscore >= 0 ? entry.iconName.slice(underscore + 1) : entry.iconName;
}

export function groupIconsByCategory(
  icons: readonly IconCatalogEntry[],
  query: string,
  thickness?: IconThickness | "all"
): CategoryGroup[] {
  const normalized = query.trim().toLowerCase();
  let filtered = normalized
    ? icons.filter(
        (entry) =>
          entry.name.toLowerCase().includes(normalized) ||
          entry.iconName.toLowerCase().includes(normalized) ||
          (entry.category ?? "").toLowerCase().includes(normalized)
      )
    : [...icons];

  if (thickness && thickness !== "all") {
    filtered = filtered.filter((entry) => entry.thicknesses.includes(thickness));
  }

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

export function buildImportSnippet(
  entry: IconCatalogEntry,
  thickness: IconThickness,
  mode: IconMode,
  options?: { level?: string; biggerSize?: boolean }
): string {
  const props = [
    `thickness="${thickness}"`,
    `mode="${mode}"`,
    options?.level ? `level="${options.level}"` : null,
    options?.biggerSize ? "biggerSize" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return `import { ${entry.name} } from "@aviala-design/icons";

<${entry.name} ${props} />`;
}

const PREVIEW_ATTRS_TO_STRIP = new Set([
  "width",
  "height",
  "class",
  "style",
  "aria-hidden",
  "aria-label",
  "role",
  "focusable",
  "tabindex",
]);

/** Serialize a rendered preview `<svg>` into standalone markup (no fixed size / React attrs). */
export function serializePreviewSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  for (const attr of [...clone.attributes]) {
    const name = attr.name.toLowerCase();
    if (PREVIEW_ATTRS_TO_STRIP.has(name) || name.startsWith("data-")) {
      clone.removeAttribute(attr.name);
    }
  }

  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  return new XMLSerializer().serializeToString(clone);
}

export function buildSvgFilename(
  entry: IconCatalogEntry,
  thickness: IconThickness,
  mode: IconMode
): string {
  return `${entry.iconName}-${thickness.toLowerCase()}-${mode.toLowerCase()}.svg`;
}

export function downloadSvgFile(markup: string, filename: string): void {
  const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function readPreviewSvgMarkup(stage: HTMLElement | null): string | null {
  const svg = stage?.querySelector("svg");
  if (!svg) return null;
  return serializePreviewSvg(svg);
}
