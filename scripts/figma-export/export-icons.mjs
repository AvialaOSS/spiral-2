/**
 * Export icon SVGs from Figma published library catalog into packages/icons/raw/{category}/
 *
 * Discovery uses published components/sets of FIGMA_FILE_ICONS (Publish library required
 * for new icons). SVG render uses the live file via /images.
 *
 * Figma model:
 *   Component set name:  direction/arrowLeft
 *   Variant (unordered): thickness=Regular, mode=default, name=direction_arrowLeft
 *   Output path:         raw/direction/direction_arrowLeft-regular-default.svg
 *
 * Env (auto-loaded from .env.local):
 *   FIGMA_ACCESS_TOKEN  — required
 *   FIGMA_FILE_ICONS    — optional
 *   ICONS_THICKNESS / ICONS_MODE / ICONS_CATEGORY / ICONS_NAME — optional filters
 *   ICONS_NON_INTERACTIVE=1 — same as --non-interactive (CI)
 *
 * Usage:
 *   pnpm icons:export
 *   pnpm icons:export:dry
 *   node scripts/figma-export/export-icons.mjs --thickness=Regular --mode=default
 *   node scripts/figma-export/export-icons.mjs --name=direction_arrowLeft
 *   node scripts/figma-export/export-icons.mjs --no-clean
 *   node scripts/figma-export/export-icons.mjs --non-interactive
 *   node scripts/figma-export/export-icons.mjs --max-retries=8
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
  cpSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./lib/load-env.mjs";
import {
  createFigmaClient,
  RateLimitExhaustedError,
} from "./lib/figma-api.mjs";
import {
  componentSetToCategory,
  componentSetToIconName,
  dedupeRelativePath,
  parseVariantName,
  variantToRelativePath,
} from "../../packages/icons/scripts/icon-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../..");
const outDir = join(rootDir, "packages/icons/raw");
const stagingDir = join(outDir, ".staging");
const dryRun = process.argv.includes("--dry-run");
const cleanRaw = !process.argv.includes("--no-clean");

function readArg(name) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

function readFilter(name) {
  const fromArg = readArg(name);
  const fromEnv = process.env[`ICONS_${name.toUpperCase()}`];
  const raw = fromArg ?? fromEnv;
  if (!raw) return null;
  return new Set(
    raw
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
  );
}

/** Case-insensitive set membership for category / icon name filters. */
function filterHas(filter, value) {
  if (!filter || !value) return false;
  const needle = value.toLowerCase();
  for (const entry of filter) {
    if (entry.toLowerCase() === needle) return true;
  }
  return false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isNonInteractive() {
  if (process.argv.includes("--non-interactive")) return true;
  if (
    process.env.ICONS_NON_INTERACTIVE === "1" ||
    process.env.ICONS_NON_INTERACTIVE === "true"
  ) {
    return true;
  }
  if (process.env.CI === "true" || process.env.CI === "1") return true;
  return !process.stdin.isTTY;
}

function parseMaxRetries() {
  const fromArg = readArg("max-retries");
  const fromEnv = process.env.ICONS_MAX_RETRIES;
  const raw = fromArg ?? fromEnv;
  if (!raw) return 6;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 6;
}

function cleanDirectoryContents(dir, { keepNames = [] } = {}) {
  if (!existsSync(dir)) return 0;
  const keep = new Set(keepNames);
  let removed = 0;
  for (const entry of readdirSync(dir)) {
    if (keep.has(entry)) continue;
    rmSync(join(dir, entry), { recursive: true, force: true });
    removed += 1;
  }
  return removed;
}

function resetStaging() {
  rmSync(stagingDir, { recursive: true, force: true });
  mkdirSync(stagingDir, { recursive: true });
}

function discardStaging() {
  rmSync(stagingDir, { recursive: true, force: true });
}

/**
 * Promote staging into raw/.
 * - cleanRaw: wipe raw (except .staging) then move staging children in
 * - --no-clean: merge staging SVGs into raw, overwrite on conflict
 */
function promoteStaging() {
  if (!existsSync(stagingDir)) {
    throw new Error("Staging directory missing; nothing to promote.");
  }

  mkdirSync(outDir, { recursive: true });

  if (cleanRaw) {
    cleanDirectoryContents(outDir, { keepNames: [".staging"] });
  }

  for (const entry of readdirSync(stagingDir)) {
    const from = join(stagingDir, entry);
    const to = join(outDir, entry);
    if (existsSync(to)) {
      rmSync(to, { recursive: true, force: true });
    }
    try {
      renameSync(from, to);
    } catch {
      cpSync(from, to, { recursive: true });
      rmSync(from, { recursive: true, force: true });
    }
  }

  discardStaging();
}

function promptChoice(question) {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function askRecoveryAction(failed, total) {
  console.error(
    `\nExport finished with ${failed.length} failure(s) (of ${total}).`
  );
  for (const item of failed.slice(0, 20)) {
    console.error(`  ${item.relativePath}.svg  [${item.reason}]`);
  }
  if (failed.length > 20) {
    console.error(`  … and ${failed.length - 20} more`);
  }

  if (isNonInteractive()) {
    console.error(
      "Non-interactive mode: treating remaining failures as abort."
    );
    return "a";
  }

  for (;;) {
    const answer = await promptChoice(
      "(r)etry failed  (s)kip failed and promote rest  (a)bort: "
    );
    if (answer === "r" || answer === "retry") return "r";
    if (answer === "s" || answer === "skip") return "s";
    if (answer === "a" || answer === "abort") return "a";
    console.error("Please enter r, s, or a.");
  }
}

async function downloadSvg(url, maxRetries, attempt = 0) {
  const res = await fetch(url);
  if (res.status === 429) {
    if (attempt >= maxRetries) {
      throw new RateLimitExhaustedError(url, attempt);
    }
    const header = res.headers.get("retry-after");
    const seconds = header ? Number(header) : NaN;
    const wait =
      Number.isFinite(seconds) && seconds >= 0
        ? Math.min(60_000, Math.max(1_000, seconds * 1_000))
        : Math.min(30_000, 2_000 * 2 ** (attempt + 1));
    await sleep(wait);
    return downloadSvg(url, maxRetries, attempt + 1);
  }
  return res;
}

/**
 * Fetch SVG URLs and download into staging for the given plan items.
 * Mutates `results` Map: nodeId → { ok, reason?, status? }
 * @returns {{ exportedDelta: number, failed: Array<{ item, reason, status? }> }}
 */
async function exportItems(client, fileKey, items, maxRetries, results) {
  const failed = [];
  let exportedDelta = 0;

  if (items.length === 0) {
    return { exportedDelta, failed };
  }

  const { urls, missingNodeIds } = await client.fetchSvgUrls(
    fileKey,
    items.map((item) => item.nodeId)
  );

  const missing = new Set(missingNodeIds);

  for (const item of items) {
    if (missing.has(item.nodeId) || !urls.has(item.nodeId)) {
      const entry = { item, reason: "no-url" };
      failed.push(entry);
      results.set(item.nodeId, { ok: false, reason: "no-url" });
      console.warn(`  fail (no SVG URL): ${item.relativePath}`);
      continue;
    }

    const url = urls.get(item.nodeId);
    const svgRes = await downloadSvg(url, maxRetries);
    if (!svgRes.ok) {
      const entry = { item, reason: "download-status", status: svgRes.status };
      failed.push(entry);
      results.set(item.nodeId, {
        ok: false,
        reason: "download-status",
        status: svgRes.status,
      });
      console.warn(`  fail (download ${svgRes.status}): ${item.relativePath}`);
      continue;
    }

    const svg = await svgRes.text();
    const target = join(stagingDir, `${item.relativePath}.svg`);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, svg);
    results.set(item.nodeId, { ok: true });
    exportedDelta += 1;
  }

  return { exportedDelta, failed };
}

loadEnv(rootDir);

const token = process.env.FIGMA_ACCESS_TOKEN;
const fileKey = process.env.FIGMA_FILE_ICONS || "kLrxJHsDob2VoX7PfkD5PW";
const thicknessFilter = readFilter("thickness");
const modeFilter = readFilter("mode");
const categoryFilter = readFilter("category");
const nameFilter = readFilter("name") ?? readFilter("only");
const maxRetries = parseMaxRetries();
const nonInteractive = isNonInteractive();

if (!token) {
  console.error("FIGMA_ACCESS_TOKEN is missing.");
  console.error("Copy .env.example → .env.local and set your token.");
  process.exit(1);
}

const client = createFigmaClient(token, { maxRetries });

console.log(`Figma icons file: ${fileKey}`);
console.log(
  "Source: published library catalog of this file (Publish library for new icons); SVG from live file."
);
if (thicknessFilter)
  console.log(`Filter thickness: ${[...thicknessFilter].join(", ")}`);
if (modeFilter) console.log(`Filter mode: ${[...modeFilter].join(", ")}`);
if (categoryFilter)
  console.log(`Filter category: ${[...categoryFilter].join(", ")}`);
if (nameFilter) console.log(`Filter name: ${[...nameFilter].join(", ")}`);
if (nonInteractive)
  console.log(
    "Mode: non-interactive (failures after export abort without promoting)."
  );
console.log(
  dryRun
    ? "Dry run — no files will be written."
    : `Output: ${outDir} (via .staging)`
);

let componentSets;
let components;
try {
  [componentSets, components] = await Promise.all([
    client.listComponentSets(fileKey),
    client.listComponents(fileKey),
  ]);
} catch (err) {
  if (err instanceof RateLimitExhaustedError) {
    console.error(err.message);
    process.exit(1);
  }
  throw err;
}

const exportableSets = componentSets.filter((set) => {
  const name = set.name?.trim() ?? "";
  return name.length > 0 && !name.startsWith("_") && !name.startsWith(".");
});

console.log(
  `Found ${exportableSets.length} published component set(s), ${components.length} published component(s).`
);

/** node_id → { setName, category } from component-set children */
const nodeToSet = new Map();

if (exportableSets.length > 0) {
  try {
    const setNodes = await client.fetchNodes(
      fileKey,
      exportableSets.map((set) => set.node_id),
      2
    );

    for (const set of exportableSets) {
      const category = componentSetToCategory(set.name);
      const document = setNodes[set.node_id]?.document;
      const children = document?.children ?? [];

      for (const child of children) {
        if (child.type === "COMPONENT") {
          nodeToSet.set(child.id, { setName: set.name, category });
        }
      }
    }
  } catch (err) {
    if (err instanceof RateLimitExhaustedError) {
      console.error(err.message);
      process.exit(1);
    }
    throw err;
  }
}

const usedPaths = new Set();
const plan = [];

for (const component of components) {
  const variant = parseVariantName(component.name ?? "");
  if (!variant.name || !variant.thickness || !variant.mode) continue;

  if (thicknessFilter && !thicknessFilter.has(variant.thickness)) continue;
  if (modeFilter && !modeFilter.has(variant.mode)) continue;

  const setInfo = nodeToSet.get(component.node_id);
  const category =
    setInfo?.category ?? (variant.name.split("_")[0] || "uncategorized");
  const iconName = setInfo?.setName
    ? (componentSetToIconName(setInfo.setName) ?? variant.name)
    : variant.name;

  if (categoryFilter && !filterHas(categoryFilter, category)) continue;
  if (
    nameFilter &&
    !filterHas(nameFilter, iconName) &&
    !filterHas(nameFilter, variant.name)
  ) {
    continue;
  }

  const relativePath = dedupeRelativePath(
    variantToRelativePath(category, { ...variant, name: iconName }) ??
      `${category}/${iconName}-${variant.thickness}-${variant.mode}`.toLowerCase(),
    usedPaths
  );

  plan.push({
    nodeId: component.node_id,
    setName: setInfo?.setName ?? null,
    category,
    iconName,
    variant,
    relativePath,
  });
}

plan.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

if (plan.length === 0) {
  console.log("No matching icon variants found.");
  process.exit(0);
}

console.log(`Prepared ${plan.length} variant(s) for export.`);

if (dryRun) {
  for (const item of plan.slice(0, 20)) {
    console.log(
      `  ${item.setName ?? "(no set)"} → ${item.relativePath}.svg  [${item.variant.thickness}, ${item.variant.mode}]`
    );
  }
  if (plan.length > 20) console.log(`  … and ${plan.length - 20} more`);
  process.exit(0);
}

resetStaging();

/** @type {Map<string, { ok: boolean, reason?: string, status?: number }>} */
const results = new Map();
let pending = [...plan];
let exported = 0;
/** @type {Array<{ item: typeof plan[0], reason: string, status?: number }>} */
let failed = [];

try {
  while (pending.length > 0) {
    const round = await exportItems(
      client,
      fileKey,
      pending,
      maxRetries,
      results
    );
    exported += round.exportedDelta;
    failed = round.failed.map((f) => ({
      item: f.item,
      relativePath: f.item.relativePath,
      reason: f.reason,
      status: f.status,
    }));

    if (failed.length === 0) break;

    const action = await askRecoveryAction(failed, plan.length);
    if (action === "r") {
      console.log(`Retrying ${failed.length} failed variant(s)…`);
      pending = failed.map((f) => f.item);
      continue;
    }
    if (action === "s") {
      console.warn(
        `Skipping ${failed.length} failed variant(s) and promoting successful exports.`
      );
      break;
    }

    // abort
    discardStaging();
    console.error("Aborted. Existing packages/icons/raw/ was left unchanged.");
    process.exit(1);
  }
} catch (err) {
  discardStaging();
  if (err instanceof RateLimitExhaustedError) {
    console.error(err.message);
    console.error(
      `Rate limit exhausted. Exported this run (staging discarded): ${exported}; pending failures: ${failed.length}.`
    );
    console.error("Existing packages/icons/raw/ was left unchanged.");
    process.exit(1);
  }
  throw err;
}

const skippedEntries = failed.map((f) => ({
  file: `${f.relativePath}.svg`,
  reason: f.reason,
  status: f.status ?? null,
  nodeId: f.item.nodeId,
  componentSet: f.item.setName,
  name: f.item.iconName,
}));

const manifest = {
  exportedAt: new Date().toISOString(),
  fileKey,
  source: "published-library-catalog",
  filters: {
    thickness: thicknessFilter ? [...thicknessFilter] : null,
    mode: modeFilter ? [...modeFilter] : null,
    category: categoryFilter ? [...categoryFilter] : null,
    name: nameFilter ? [...nameFilter] : null,
  },
  count: 0,
  skippedCount: skippedEntries.length,
  skipped: skippedEntries,
  icons: [],
};

for (const item of plan) {
  const result = results.get(item.nodeId);
  if (!result?.ok) continue;
  manifest.icons.push({
    file: `${item.relativePath}.svg`,
    componentSet: item.setName,
    category: item.category,
    name: item.iconName,
    variantName: item.variant.name,
    thickness: item.variant.thickness,
    mode: item.variant.mode,
    nodeId: item.nodeId,
  });
}

manifest.count = manifest.icons.length;
writeFileSync(
  join(stagingDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
);

promoteStaging();

console.log(`Exported ${manifest.count} icon variant(s) to ${outDir}`);
if (skippedEntries.length > 0) {
  console.warn(
    `Skipped ${skippedEntries.length} variant(s) (see manifest.skipped).`
  );
}
console.log("Next: pnpm icons:build");
