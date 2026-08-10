import { transform } from "@svgr/core";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import {
  iconNameToComponentName,
  parseSvgVariantFileName,
  toPascalCase,
  variantInnerComponentName,
} from "./icon-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rawDir = join(__dirname, "../raw");
const outDir = join(__dirname, "../src/components");
const srcDir = join(__dirname, "../src");
/** When set, only regenerate icons present in raw/; keep other committed components. */
const mergeMode = process.argv.includes("--merge");

const SVGR_OPTIONS = {
  plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
  typescript: true,
  exportType: "named",
  jsxRuntime: "automatic",
  /** Drop Figma 120×120 dimensions; scale via viewBox + consumer width/height */
  dimensions: false,
  svgoConfig: {
    plugins: [
      { name: "removeViewBox", active: false },
      { name: "removeDimensions", active: true },
      {
        name: "convertColors",
        params: { currentColor: true },
      },
      // Unique clipPath/mask IDs per SVG so multiple instances don't collide in the DOM.
      {
        name: "prefixIds",
        params: {
          prefix: false,
          delim: "-",
          prefixIds: true,
          prefixClassNames: false,
        },
      },
    ],
  },
};

/**
 * Figma icon artboards are 120×120. Exports occasionally ship wrong height/width
 * (e.g. symbol_end at 120×260); force the canonical viewBox so size props scale correctly.
 * Only touch the root `<svg>` tag — never strip `stroke-width` etc. on child nodes.
 */
function normalizeIconSvg(svg) {
  return svg.replace(/<svg\b([^>]*)>/i, (_match, attrs) => {
    let nextAttrs = String(attrs)
      .replace(/\s*\bviewBox="[^"]*"/gi, "")
      .replace(/\s*\bwidth="[^"]*"/gi, "")
      .replace(/\s*\bheight="[^"]*"/gi, "")
      .trim();
    nextAttrs = nextAttrs ? ` ${nextAttrs}` : "";
    return `<svg viewBox="0 0 120 120"${nextAttrs}>`;
  });
}

mkdirSync(outDir, { recursive: true });

function collectSvgFiles(dir, relativeDir = "") {
  if (!existsSync(dir)) return [];

  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    // Export staging scratch — never treat as icon sources.
    if (entry.name === ".staging") continue;

    const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    const absolutePath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectSvgFiles(absolutePath, relativePath));
      continue;
    }

    if (entry.name.endsWith(".svg")) {
      files.push({
        absolutePath,
        relativePath: relativePath.replace(/\.svg$/i, ""),
      });
    }
  }

  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

async function svgToInnerComponent(svg, innerName) {
  const tsx = await transform(
    normalizeIconSvg(svg),
    {
      ...SVGR_OPTIONS,
      namedExport: innerName,
      svgoConfig: {
        ...SVGR_OPTIONS.svgoConfig,
        plugins: SVGR_OPTIONS.svgoConfig.plugins.map((plugin) => {
          if (typeof plugin === "object" && plugin.name === "prefixIds") {
            return {
              ...plugin,
              params: {
                ...plugin.params,
                // Stable per-variant prefix so multiple icon instances don't share clipPath IDs.
                prefix: `${innerName}-`,
              },
            };
          }
          return plugin;
        }),
      },
    },
    { componentName: innerName }
  );

  return tsx
    .replace(/^import type \{ SVGProps \} from "react";\n?/m, "")
    .replace(new RegExp(`export \\{ ${innerName} \\};?\\n?`, "m"), "")
    .trim();
}

function buildVariantsObjectLines(variantMap) {
  const thicknesses = [...variantMap.keys()].sort();
  const lines = ["const variants = {"];

  for (const thickness of thicknesses) {
    const modes = variantMap.get(thickness);
    lines.push(`  ${thickness}: {`);
    for (const [mode, innerName] of [...modes.entries()].sort()) {
      lines.push(`    ${mode}: ${innerName},`);
    }
    lines.push("  },");
  }

  lines.push("} as const;");
  return lines.join("\n");
}

function buildCatalogVariantFields(variantMap) {
  const thicknesses = [...variantMap.keys()].sort();
  const modes = [...new Set([...variantMap.values()].flatMap((m) => [...m.keys()]))].sort();
  return {
    thicknesses: JSON.stringify(thicknesses),
    modes: JSON.stringify(modes),
  };
}

function hasExportDedupeSuffix(relativePath) {
  const base = basename(relativePath);
  return /-\d+$/.test(base) && parseSvgVariantFileName(base) !== null;
}

function shouldReplaceVariantPath(currentPath, nextRelativePath) {
  if (!currentPath) return true;
  const currentDeduped = hasExportDedupeSuffix(currentPath);
  const nextDeduped = hasExportDedupeSuffix(nextRelativePath);
  if (currentDeduped && !nextDeduped) return true;
  return false;
}

const svgs = collectSvgFiles(rawDir);

if (svgs.length === 0) {
  console.warn(
    "No SVGs in packages/icons/raw — skipping icon codegen (keeping committed src/components)."
  );
  console.warn("To regenerate: pnpm icons:export && pnpm icons:build");
  process.exit(0);
}

/** @type {Map<string, { iconName: string, category?: string, fileStem: string, variants: Map<string, Map<string, string>> }>} */
const iconGroups = new Map();
/** @type {Array<{ absolutePath: string, relativePath: string }>} */
const legacySvgs = [];

for (const file of svgs) {
  const fileBase = basename(file.relativePath);
  const parsed = parseSvgVariantFileName(fileBase);

  if (!parsed) {
    legacySvgs.push(file);
    continue;
  }

  const category = file.relativePath.includes("/") ? file.relativePath.split("/")[0] : undefined;
  const groupKey = parsed.iconName;

  if (!iconGroups.has(groupKey)) {
    iconGroups.set(groupKey, {
      iconName: parsed.iconName,
      category,
      fileStem: parsed.iconName,
      variants: new Map(),
    });
  }

  const group = iconGroups.get(groupKey);
  if (!group.variants.has(parsed.thickness)) {
    group.variants.set(parsed.thickness, new Map());
  }

  const modeMap = group.variants.get(parsed.thickness);
  const existingPath = modeMap.get(parsed.mode);
  if (shouldReplaceVariantPath(existingPath, file.relativePath)) {
    modeMap.set(parsed.mode, file.absolutePath);
  }
}

const exportLines = [];
const catalogEntries = [];
const componentNames = new Set();

for (const group of iconGroups.values()) {
  const componentName = iconNameToComponentName(group.iconName);
  componentNames.add(componentName);

  const innerComponents = [];
  const innerNameByKey = new Map();

  for (const [thickness, modes] of group.variants.entries()) {
    for (const [mode, absolutePath] of modes.entries()) {
      const innerName = variantInnerComponentName(thickness, mode);
      innerNameByKey.set(`${thickness}:${mode}`, innerName);
      const svg = readFileSync(absolutePath, "utf8");
      innerComponents.push(await svgToInnerComponent(svg, innerName));
    }
  }

  const variantMapForCodegen = new Map();
  for (const [thickness, modes] of group.variants.entries()) {
    const modeMap = new Map();
    for (const mode of modes.keys()) {
      modeMap.set(mode, innerNameByKey.get(`${thickness}:${mode}`));
    }
    variantMapForCodegen.set(thickness, modeMap);
  }

  const { thicknesses, modes } = buildCatalogVariantFields(group.variants);

  const source = `/** Auto-generated by scripts/build-icons.mjs — do not edit manually */
import type { SVGProps } from "react";
import { applyAvialaIconProps } from "../icon-size";
import { resolveIconVariant } from "../resolve-variant";
import type { AvialaIconProps } from "../types";
import { DEFAULT_ICON_MODE, DEFAULT_ICON_THICKNESS } from "../types";

${innerComponents.join("\n\n")}

${buildVariantsObjectLines(variantMapForCodegen)}

export type ${componentName}Props = AvialaIconProps;

export function ${componentName}({
  thickness = DEFAULT_ICON_THICKNESS,
  mode = DEFAULT_ICON_MODE,
  ...props
}: ${componentName}Props) {
  const Variant = resolveIconVariant(variants, thickness, mode);
  return <Variant {...applyAvialaIconProps({ thickness, mode, ...props })} />;
}
`;

  writeFileSync(join(outDir, `${componentName}.tsx`), source);
  exportLines.push(`export { ${componentName}, type ${componentName}Props } from "./components/${componentName}";`);
  catalogEntries.push({
    name: componentName,
    iconName: group.iconName,
    category: group.category,
    fileStem: group.fileStem,
    thicknesses,
    modes,
  });
}

for (const file of legacySvgs) {
  const componentName = toPascalCase(file.relativePath);
  componentNames.add(componentName);
  const svg = readFileSync(file.absolutePath, "utf8");
  const innerName = `${componentName}Svg`;

  const inner = await svgToInnerComponent(svg, innerName);
  const source = `/** Auto-generated by scripts/build-icons.mjs — do not edit manually */
import type { SVGProps } from "react";
import { applyAvialaIconProps } from "../icon-size";
import type { AvialaIconProps } from "../types";

${inner}

export type ${componentName}Props = AvialaIconProps;

export function ${componentName}(props: ${componentName}Props) {
  return <${innerName} {...applyAvialaIconProps(props)} />;
}
`;

  writeFileSync(join(outDir, `${componentName}.tsx`), source);
  exportLines.push(
    `export { ${componentName}, type ${componentName}Props } from "./components/${componentName}";`
  );
  catalogEntries.push({
    name: componentName,
    iconName: basename(file.relativePath),
    category: file.relativePath.includes("/") ? file.relativePath.split("/")[0] : undefined,
    fileStem: file.relativePath,
    thicknesses: "[]",
    modes: "[]",
    legacy: true,
  });
}

/** Remove orphaned components and stale tsc artifacts that shadow .tsx during bundling. */
const COMPONENT_ARTIFACT = /\.(tsx|js|d\.ts(?:\.map)?|js\.map)$/;

if (!mergeMode) {
  for (const file of readdirSync(outDir)) {
    if (!COMPONENT_ARTIFACT.test(file)) continue;
    const name = file.replace(/\.(tsx|js|d\.ts(?:\.map)?|js\.map)$/, "");
    if (!componentNames.has(name) && name !== "Placeholder") {
      unlinkSync(join(outDir, file));
    }
  }
} else {
  console.log("Merge mode: keeping committed components not present in raw/.");
}

for (const file of readdirSync(outDir)) {
  if (/\.(js|d\.ts(?:\.map)?|js\.map)$/.test(file)) {
    unlinkSync(join(outDir, file));
  }
}

for (const file of ["index.js", "index.d.ts", "index.d.ts.map", "catalog.js", "catalog.d.ts", "catalog.d.ts.map", "icon.js", "icon.d.ts", "icon.d.ts.map", "icon-size.js", "icon-size.d.ts", "icon-size.d.ts.map", "types.js", "types.d.ts", "types.d.ts.map", "resolve-variant.js", "resolve-variant.d.ts", "resolve-variant.d.ts.map"]) {
  const artifact = join(srcDir, file);
  if (existsSync(artifact)) unlinkSync(artifact);
}

if (mergeMode) {
  const catalogPath = join(srcDir, "catalog.ts");
  if (existsSync(catalogPath)) {
    const prevSource = readFileSync(catalogPath, "utf8");
    const entryRe =
      /\{\s*name:\s*"([^"]+)",\s*iconName:\s*"([^"]+)",\s*file:\s*"([^"]+)",\s*thicknesses:\s*(\[[^\]]*\])\s*as IconThickness\[\],\s*modes:\s*(\[[^\]]*\])\s*as IconMode\[\](?:,\s*category:\s*"([^"]*)")?(?:,\s*legacy:\s*true)?,?\s*component:\s*\1\s*\}/g;
    const byName = new Map(catalogEntries.map((entry) => [entry.name, entry]));
    let match;
    while ((match = entryRe.exec(prevSource)) !== null) {
      const [, name, iconName, fileStem, thicknesses, modes, category] = match;
      if (byName.has(name)) continue;
      if (!existsSync(join(outDir, `${name}.tsx`))) continue;
      catalogEntries.push({
        name,
        iconName,
        category: category || undefined,
        fileStem,
        thicknesses,
        modes,
        legacy: /legacy:\s*true/.test(match[0]) || undefined,
      });
      exportLines.push(`export { ${name}, type ${name}Props } from "./components/${name}";`);
      componentNames.add(name);
    }
    catalogEntries.sort((a, b) => a.name.localeCompare(b.name));
    exportLines.sort((a, b) => a.localeCompare(b));
  }
}

if (exportLines.length === 0) {
  writeFileSync(
    join(outDir, "Placeholder.tsx"),
    `import type { SVGProps } from "react";
import { applyAvialaIconProps } from "../icon-size";
import type { AvialaIconProps } from "../types";

const PlaceholderSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export type PlaceholderProps = AvialaIconProps;

export function Placeholder(props: PlaceholderProps) {
  return <PlaceholderSvg {...applyAvialaIconProps(props)} />;
}
`
  );
  exportLines.push('export { Placeholder, type PlaceholderProps } from "./components/Placeholder";');
  catalogEntries.push({
    name: "Placeholder",
    iconName: "placeholder",
    category: undefined,
    fileStem: "placeholder",
    thicknesses: "[]",
    modes: "[]",
    legacy: true,
  });
}

const catalogImports = catalogEntries
  .map(({ name }) => `import { ${name}, type ${name}Props } from "./components/${name}";`)
  .join("\n");

const catalogArray = catalogEntries
  .map(({ name, iconName, category, fileStem, thicknesses, modes, legacy }) => {
    const categoryField = category ? `, category: "${category}"` : "";
    const legacyField = legacy ? `, legacy: true` : "";
    return `  { name: "${name}", iconName: "${iconName}", file: "${fileStem}", thicknesses: ${thicknesses} as IconThickness[], modes: ${modes} as IconMode[]${categoryField}${legacyField}, component: ${name} },`;
  })
  .join("\n");

writeFileSync(
  join(srcDir, "catalog.ts"),
  `/** Auto-generated by scripts/build-icons.mjs — do not edit manually */
import type { AvialaIconProps, IconMode, IconThickness } from "./types";
${catalogImports}

export type IconCatalogEntry = {
  name: string;
  iconName: string;
  file: string;
  category?: string;
  thicknesses: IconThickness[];
  modes: IconMode[];
  legacy?: boolean;
  component: import("react").ComponentType<AvialaIconProps>;
};

export const iconCatalog = [
${catalogArray}
] as const;

export type IconName = (typeof iconCatalog)[number]["name"];
`
);

writeFileSync(
  join(srcDir, "index.ts"),
  `export type { SVGProps } from "react";
export { Icon, type IconProps } from "./icon";
export {
  DEFAULT_ICON_MODE,
  DEFAULT_ICON_THICKNESS,
  ICON_LEVELS,
  ICON_MODES,
  ICON_THICKNESSES,
  type AvialaIconProps,
  type IconLevel,
  type IconMode,
  type IconThickness,
} from "./types";
export { resolveIconSizeToken } from "./icon-size";
export { iconCatalog, type IconCatalogEntry, type IconName } from "./catalog";
${exportLines.join("\n")}
`
);

console.log(
  `Built ${catalogEntries.length} icon component(s) from ${iconGroups.size} icon group(s) + ${legacySvgs.length} legacy SVG(s)`
);
