/**
 * Dev-verification crawler: BFS over Storybook's dev-served module graph.
 * For every story file, fetch its transformed JS, extract root-relative
 * import specifiers, and follow them — reporting any non-200 fetch.
 *
 * Usage: node scripts/crawl-storybook.mjs [baseUrl]
 * Requires a running Storybook dev server (default http://localhost:6006).
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:6006";
const ROOT = "C:/Users/kailunlark/Documents/GitHub/Spiral2";
const COMPONENTS_DIR = join(process.cwd(), "packages/ui/src/components");

function collectStories(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectStories(p));
    else if (entry.name.endsWith(".stories.tsx")) out.push(p);
  }
  return out;
}

const IMPORT_RE = /(?:from|import)\s*\(?\s*["'](\/[^"']+)["']/g;

const visited = new Set();
const failures = [];
let fetched = 0;

async function crawl(url, referrer) {
  const clean = url.split("#")[0];
  if (visited.has(clean)) return;
  visited.add(clean);
  let res;
  try {
    res = await fetch(BASE + clean);
  } catch (err) {
    failures.push({ url: clean, referrer, error: String(err) });
    return;
  }
  fetched++;
  if (!res.ok) {
    failures.push({ url: clean, referrer, error: `HTTP ${res.status}` });
    return;
  }
  const body = await res.text();
  for (const m of body.matchAll(IMPORT_RE)) {
    const spec = m[1];
    if (spec.startsWith("//")) continue;
    await crawl(spec, clean);
  }
}

const stories = collectStories(COMPONENTS_DIR);
console.log(`crawling ${stories.length} stories from ${BASE} ...`);
for (const abs of stories) {
  const rel = "/" + abs.replace(/\\/g, "/").replace(/^C:\//, "C:/");
  await crawl(`/@fs/${rel.replace(/^\//, "")}`, "(story)");
}
console.log(`modules fetched: ${fetched}`);
if (failures.length === 0) {
  console.log("ALL MODULES OK — no fetch failures in any story graph.");
} else {
  console.log(`FAILURES: ${failures.length}`);
  for (const f of failures.slice(0, 30)) {
    console.log(`  ${f.error}  ${f.url}\n    ← ${f.referrer}`);
  }
  process.exitCode = 1;
}
