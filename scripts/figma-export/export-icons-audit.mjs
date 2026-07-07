/**
 * One-off: export all icon SVGs to a custom folder + write sync-issue report.
 *
 * Usage:
 *   node scripts/figma-export/export-icons-audit.mjs --out=C:\Users\...\icotest
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./lib/load-env.mjs";
import { createFigmaClient } from "./lib/figma-api.mjs";
import {
  componentSetToCategory,
  dedupeRelativePath,
  iconNameToComponentName,
  parseSvgVariantFileName,
  parseVariantName,
  variantToRelativePath,
} from "../../packages/icons/scripts/icon-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../..");

function readArg(name) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

/** component set leaf → expected icon name, e.g. symbol/add → symbol_add */
function expectedIconNameFromSet(setName) {
  if (!setName) return null;
  const leaf = setName.split(/[/\\]/).pop()?.trim() ?? setName;
  const category = componentSetToCategory(setName);
  return `${category}_${leaf.replace(/[/\\-]+/g, "_")}`.replace(/_+/g, "_");
}

function dedupeWasApplied(relativePath, variant, category) {
  const canonical =
    variantToRelativePath(category, variant) ??
    `${category}/${variant.name}-${variant.thickness}-${variant.mode}`.toLowerCase();
  return relativePath !== canonical;
}

function getDedupeSuffix(relativePath, variant, category) {
  const canonical =
    variantToRelativePath(category, variant) ??
    `${category}/${variant.name}-${variant.thickness}-${variant.mode}`.toLowerCase();
  if (relativePath === canonical) return null;
  if (relativePath.startsWith(`${canonical}-`)) {
    return relativePath.slice(canonical.length + 1);
  }
  return "unknown";
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSvgUrlsWithRetry(client, fileKey, nodeIds, batchSize = 20) {
  const urls = new Map();
  for (let i = 0; i < nodeIds.length; i += batchSize) {
    const batch = nodeIds.slice(i, i + batchSize);
    let attempt = 0;
    while (attempt < 6) {
      try {
        const batchUrls = await client.fetchSvgUrls(fileKey, batch, batchSize);
        for (const [id, url] of batchUrls.entries()) urls.set(id, url);
        break;
      } catch (err) {
        attempt += 1;
        const wait = Math.min(30_000, 2_000 * 2 ** attempt);
        console.warn(`  rate limited batch ${i / batchSize + 1}, retry in ${wait}ms (${attempt}/6)`);
        await sleep(wait);
        if (attempt >= 6) throw err;
      }
    }
    await sleep(350);
  }
  return urls;
}

async function downloadSvg(url, attempt = 0) {
  const res = await fetch(url);
  if (res.status === 429 && attempt < 6) {
    await sleep(Math.min(30_000, 2_000 * 2 ** attempt));
    return downloadSvg(url, attempt + 1);
  }
  return res;
}

loadEnv(rootDir);

const outDir = readArg("out");
if (!outDir) {
  console.error("Missing --out=<directory>");
  process.exit(1);
}

const token = process.env.FIGMA_ACCESS_TOKEN;
const fileKey = process.env.FIGMA_FILE_ICONS || "kLrxJHsDob2VoX7PfkD5PW";

if (!token) {
  console.error("FIGMA_ACCESS_TOKEN is missing (.env.local).");
  process.exit(1);
}

const client = createFigmaClient(token);
console.log(`Export → ${outDir}`);
console.log(`Figma file: ${fileKey}`);

const [componentSets, components] = await Promise.all([
  client.listComponentSets(fileKey),
  client.listComponents(fileKey),
]);

const exportableSets = componentSets.filter((set) => {
  const name = set.name?.trim() ?? "";
  return name.length > 0 && !name.startsWith("_") && !name.startsWith(".");
});

const nodeToSet = new Map();

if (exportableSets.length > 0) {
  const setNodes = await client.fetchNodes(
    fileKey,
    exportableSets.map((set) => set.node_id),
    2
  );

  for (const set of exportableSets) {
    const category = componentSetToCategory(set.name);
    const document = setNodes[set.node_id]?.document;
    for (const child of document?.children ?? []) {
      if (child.type === "COMPONENT") {
        nodeToSet.set(child.id, { setName: set.name, category });
      }
    }
  }
}

const usedPaths = new Set();
const canonicalOwners = new Map(); // canonicalPath → first { setName, nodeId }
const plan = [];

for (const component of components) {
  const variant = parseVariantName(component.name ?? "");
  if (!variant.name || !variant.thickness || !variant.mode) continue;

  const setInfo = nodeToSet.get(component.node_id);
  const category = setInfo?.category ?? (variant.name.split("_")[0] || "uncategorized");

  const canonicalPath =
    variantToRelativePath(category, variant) ??
    `${category}/${variant.name}-${variant.thickness}-${variant.mode}`.toLowerCase();

  const relativePath = dedupeRelativePath(canonicalPath, usedPaths);

  if (!canonicalOwners.has(canonicalPath)) {
    canonicalOwners.set(canonicalPath, {
      setName: setInfo?.setName ?? null,
      nodeId: component.node_id,
    });
  }

  plan.push({
    nodeId: component.node_id,
    setName: setInfo?.setName ?? null,
    category,
    variant,
    canonicalPath,
    relativePath,
    figmaVariantName: component.name ?? "",
  });
}

plan.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
console.log(`Prepared ${plan.length} variant(s). Analyzing sync issues…`);

const syncIssues = [];
const iconNameToSets = new Map();

for (const item of plan) {
  const { variant, setName, relativePath, canonicalPath } = item;
  const file = `${relativePath}.svg`;
  const fileBase = basename(relativePath);
  const expectedFromSet = expectedIconNameFromSet(setName);
  const parsed = parseSvgVariantFileName(fileBase);

  // Track which component sets contribute to same React component name
  const groupKey = parsed?.iconName ?? fileBase;
  if (!iconNameToSets.has(groupKey)) iconNameToSets.set(groupKey, new Set());
  if (setName) iconNameToSets.get(groupKey).add(setName);

  const issues = [];

  if (!setName) {
    issues.push("MISSING_COMPONENT_SET");
  }

  if (expectedFromSet && variant.name !== expectedFromSet) {
    issues.push("SET_NAME_MISMATCH");
  }

  if (dedupeWasApplied(relativePath, variant, item.category)) {
    issues.push("PATH_DEDUPED");
  }

  if (!parsed) {
    issues.push("BUILD_PARSE_FAIL");
  }

  if (issues.length > 0) {
    syncIssues.push({
      file,
      issues,
      componentSet: setName,
      variantName: variant.name,
      expectedIconName: expectedFromSet,
      canonicalPath: `${canonicalPath}.svg`,
      dedupeSuffix: getDedupeSuffix(relativePath, variant, item.category),
      reactComponent: iconNameToComponentName(parsed?.iconName ?? groupKey),
      figmaVariant: item.figmaVariantName,
      nodeId: item.nodeId,
      conflictWith: canonicalOwners.get(canonicalPath)?.setName ?? null,
    });
  }
}

// GROUP_COLLISION: multiple component sets → same iconName group
for (const [iconName, sets] of iconNameToSets.entries()) {
  if (sets.size <= 1) continue;
  for (const item of plan) {
    const fileBase = basename(item.relativePath);
    const parsed = parseSvgVariantFileName(fileBase);
    if ((parsed?.iconName ?? fileBase) !== iconName) continue;
    if (!item.setName || !sets.has(item.setName)) continue;

    const existing = syncIssues.find((s) => s.file === `${item.relativePath}.svg`);
    const entry = existing ?? {
      file: `${item.relativePath}.svg`,
      issues: [],
      componentSet: item.setName,
      variantName: item.variant.name,
      expectedIconName: expectedIconNameFromSet(item.setName),
      canonicalPath: `${item.canonicalPath}.svg`,
      dedupeSuffix: getDedupeSuffix(item.relativePath, item.variant, item.category),
      reactComponent: iconNameToComponentName(iconName),
      figmaVariant: item.figmaVariantName,
      nodeId: item.nodeId,
      conflictWith: null,
    };
    if (!entry.issues.includes("GROUP_COLLISION")) {
      entry.issues.push("GROUP_COLLISION");
    }
    entry.collidingSets = [...sets].sort();
    if (!existing) syncIssues.push(entry);
    else existing.collidingSets = entry.collidingSets;
  }
}

syncIssues.sort((a, b) => a.file.localeCompare(b.file));

mkdirSync(outDir, { recursive: true });

function buildSummary(exported, skipped) {
  const lines = [
    `# Icon export sync issues`,
    ``,
    `Exported: ${exported} SVG(s) → ${outDir}`,
    `Skipped: ${skipped}`,
    `Sync issues: ${syncIssues.length}`,
    ``,
    `## Issue types`,
    `- SET_NAME_MISMATCH — variant \`name=\` ≠ component set leaf (e.g. symbol/add + name=symbol_resize)`,
    `- PATH_DEDUPED — output path got -2/-3 suffix because another variant already claimed the canonical path`,
    `- BUILD_PARSE_FAIL — filename cannot be parsed by build-icons (often caused by PATH_DEDUPED)`,
    `- GROUP_COLLISION — multiple component sets merge into one React component (same iconName)`,
    `- MISSING_COMPONENT_SET — variant not linked to a component set in Figma`,
    ``,
    `## Files`,
    ``,
  ];

  for (const row of syncIssues) {
    lines.push(`### ${row.file}`);
    lines.push(`- Issues: ${row.issues.join(", ")}`);
    if (row.componentSet) lines.push(`- Component set: \`${row.componentSet}\``);
    lines.push(`- Variant name: \`${row.variantName}\``);
    if (row.expectedIconName) lines.push(`- Expected name: \`${row.expectedIconName}\``);
    if (row.canonicalPath !== row.file) {
      lines.push(`- Canonical path: \`${row.canonicalPath}\``);
      if (row.dedupeSuffix) lines.push(`- Dedupe suffix: \`${row.dedupeSuffix}\``);
    }
    if (row.conflictWith) lines.push(`- Conflicts with set: \`${row.conflictWith}\``);
    if (row.collidingSets) {
      lines.push(`- Colliding sets: ${row.collidingSets.map((s) => `\`${s}\``).join(", ")}`);
    }
    lines.push(`- React component: \`${row.reactComponent}\``);
    lines.push(`- Figma node: \`${row.nodeId}\``);
    lines.push(``);
  }

  return lines.join("\n");
}

writeFileSync(join(outDir, "sync-issues.json"), `${JSON.stringify(syncIssues, null, 2)}\n`);
writeFileSync(join(outDir, "sync-issues.md"), buildSummary(0, 0));
console.log(`Sync issues: ${syncIssues.length} → ${join(outDir, "sync-issues.md")}`);
console.log("Downloading SVGs…");

const svgUrls = await fetchSvgUrlsWithRetry(
  client,
  fileKey,
  plan.map((item) => item.nodeId)
);

let exported = 0;
let skipped = 0;
const manifest = {
  exportedAt: new Date().toISOString(),
  fileKey,
  outDir,
  count: 0,
  syncIssueCount: syncIssues.length,
  icons: [],
};

for (const item of plan) {
  const url = svgUrls.get(item.nodeId);
  if (!url) {
    skipped += 1;
    continue;
  }

  const svgRes = await downloadSvg(url);
  if (!svgRes.ok) {
    skipped += 1;
    continue;
  }

  const svg = await svgRes.text();
  const target = join(outDir, `${item.relativePath}.svg`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, svg);

  manifest.icons.push({
    file: `${item.relativePath}.svg`,
    componentSet: item.setName,
    name: item.variant.name,
    thickness: item.variant.thickness,
    mode: item.variant.mode,
    nodeId: item.nodeId,
    canonicalPath: `${item.canonicalPath}.svg`,
    deduped: item.relativePath !== item.canonicalPath,
  });
  exported += 1;
}

manifest.count = exported;
writeFileSync(join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(join(outDir, "sync-issues.md"), buildSummary(exported, skipped));

console.log(`Done. Exported ${exported}, skipped ${skipped}.`);
console.log(`Output: ${outDir}`);
