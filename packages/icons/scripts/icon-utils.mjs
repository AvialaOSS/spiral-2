/**
 * Shared naming helpers for Figma icon variants ↔ raw SVG paths ↔ React component names.
 */

export const ICON_THICKNESSES = ["Light", "Regular", "Medium", "Bold", "Black"];
export const ICON_MODES = ["default", "fill"];

/** Figma thickness → canonical React/catalog thickness. */
const THICKNESS_ALIASES = {
  light: "Light",
  regular: "Regular",
  medium: "Medium",
  bold: "Bold",
  black: "Black",
  /** @deprecated legacy Figma names — mapped during migration */
  standard: "Regular",
  semilight: "Medium",
};

/** File slug → canonical thickness (longest keys matched first when parsing). */
const THICKNESS_FROM_FILE = {
  regular: "Regular",
  medium: "Medium",
  semilight: "Medium",
  standard: "Regular",
  light: "Light",
  bold: "Bold",
  black: "Black",
};

const FILE_THICKNESS_ENTRIES = Object.entries(THICKNESS_FROM_FILE).sort(
  (a, b) => b[0].length - a[0].length
);

function normalizeToken(value) {
  return value.trim().replace(/\s+/g, "-").toLowerCase();
}

/** Normalize Figma `thickness=` values (Regular, Medium, Semi Light, …). */
export function normalizeThickness(value) {
  if (!value) return undefined;
  const key = normalizeToken(value).replace(/-/g, "");
  return THICKNESS_ALIASES[key] ?? value;
}

/** Parse Figma variant name — property order is not guaranteed. */
export function parseVariantName(variantName) {
  const props = {};
  for (const segment of variantName.split(",")) {
    const eq = segment.indexOf("=");
    if (eq === -1) continue;
    const key = segment.slice(0, eq).trim();
    const value = segment.slice(eq + 1).trim();
    if (!key) continue;
    props[key] = key === "thickness" ? normalizeThickness(value) : value;
  }
  return props;
}

/** Component set name → category folder (first path segment). */
export function componentSetToCategory(setName) {
  const category = setName.split(/[/\\]/)[0]?.trim();
  return category || "uncategorized";
}

/** Component set `category/leaf` → icon name `category_leaf`. */
export function componentSetToIconName(setName) {
  if (!setName) return null;
  const leaf = setName.split(/[/\\]/).pop()?.trim() ?? setName;
  const category = componentSetToCategory(setName);
  return `${category}_${leaf.replace(/[/\\-]+/g, "_")}`.replace(/_+/g, "_");
}

/** Build SVG basename from variant properties. */
export function variantToSvgBaseName({ name, thickness, mode }) {
  if (!name || !thickness || !mode) return null;
  return `${name}-${normalizeToken(thickness)}-${normalizeToken(mode)}`;
}

/** Full relative path under raw/ (no .svg). */
export function variantToRelativePath(category, variant) {
  const base = variantToSvgBaseName(variant);
  if (!base || !category) return null;
  return `${category}/${base}`;
}

/**
 * Parse exported SVG basename: direction_arrowLeft-light-default
 * Strips export dedupe suffixes (-2, -3, …) when present.
 * Returns null for legacy flat names (arrow-right, settings, …).
 */
export function parseSvgVariantFileName(baseName) {
  let candidate = baseName;
  while (candidate) {
    const parsed = parseSvgVariantFileNameOnce(candidate);
    if (parsed) return parsed;

    const deduped = candidate.match(/^(.+)-(\d+)$/);
    if (!deduped || Number(deduped[2]) < 2) return null;
    candidate = deduped[1];
  }
  return null;
}

function parseSvgVariantFileNameOnce(baseName) {
  for (const mode of ICON_MODES) {
    for (const [fileThickness, figmaThickness] of FILE_THICKNESS_ENTRIES) {
      const suffix = `-${fileThickness}-${mode}`;
      if (!baseName.endsWith(suffix)) continue;
      return {
        iconName: baseName.slice(0, -suffix.length),
        thickness: figmaThickness,
        mode,
      };
    }
  }
  return null;
}

export function toPascalCase(name) {
  const leaf = name.split(/[/\\]/).pop() ?? name;
  return leaf
    .replace(/\.svg$/i, "")
    .replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (m) => m.toUpperCase());
}

export function iconNameToComponentName(iconName) {
  return toPascalCase(iconName);
}

export function variantInnerComponentName(thickness, mode) {
  const modeSuffix = mode === "fill" ? "Fill" : "Default";
  return `${thickness}${modeSuffix}`;
}

export function dedupeRelativePath(relativePath, used) {
  if (!used.has(relativePath)) {
    used.add(relativePath);
    return relativePath;
  }

  let index = 2;
  while (used.has(`${relativePath}-${index}`)) index += 1;
  const next = `${relativePath}-${index}`;
  used.add(next);
  return next;
}

/** @deprecated legacy flat export helper */
export function figmaNameToFileName(name) {
  const leaf = name.split(/[/\\]/).pop()?.trim() ?? name;
  return leaf
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}
