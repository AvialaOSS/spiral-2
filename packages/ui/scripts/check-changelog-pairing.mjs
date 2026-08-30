import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadAllComponentChangelogs, uiRoot } from "./changelog-lib.mjs";

/**
 * Warns when the two changelog tracks drift apart:
 *
 * - `.changeset/*.md` drives the npm version bump and the aggregated package
 *   CHANGELOG.md.
 * - `packages/ui/changelogs/{DisplayName}.md` drives the per-component history
 *   shown on the docs site.
 *
 * A user-visible change needs both. Warn-only by default so it can run in a
 * pre-commit prompt without blocking work; pass `--strict` to fail instead.
 */

const SPIRAL_PACKAGE = "@aviala-design/spiral";
const strict = process.argv.includes("--strict");
const changesetDir = path.resolve(uiRoot, "..", "..", ".changeset");

function readChangesets() {
  if (!existsSync(changesetDir)) return [];

  return readdirSync(changesetDir)
    .filter(
      (file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md"
    )
    .map((file) => {
      const raw = readFileSync(path.join(changesetDir, file), "utf8").replace(
        /\r\n/g,
        "\n"
      );
      const frontmatter = /^---\n([\s\S]*?)\n---/.exec(raw);
      const packages = frontmatter
        ? [...frontmatter[1].matchAll(/^["']?([^"':]+)["']?\s*:/gm)].map((m) =>
            m[1].trim()
          )
        : [];
      return { file, packages };
    });
}

function componentsWithUnreleasedNotes() {
  return Object.entries(loadAllComponentChangelogs())
    .filter(([, releases]) =>
      releases.some((release) => /^\[?Unreleased\]?$/i.test(release.version))
    )
    .map(([name]) => name);
}

const spiralChangesets = readChangesets().filter((entry) =>
  entry.packages.includes(SPIRAL_PACKAGE)
);
const componentNotes = componentsWithUnreleasedNotes();

const warnings = [];

if (spiralChangesets.length > 0 && componentNotes.length === 0) {
  warnings.push(
    `${spiralChangesets.length} changeset(s) bump ${SPIRAL_PACKAGE} ` +
      `(${spiralChangesets.map((entry) => entry.file).join(", ")}) but no ` +
      "packages/ui/changelogs/*.md has content under [Unreleased]. Docs-site " +
      "component history will miss this release."
  );
}

if (spiralChangesets.length === 0 && componentNotes.length > 0) {
  warnings.push(
    `packages/ui/changelogs has [Unreleased] notes (${componentNotes.join(", ")}) ` +
      `but no changeset bumps ${SPIRAL_PACKAGE}, so version:packages will never ` +
      "stamp them. Run pnpm changeset."
  );
}

if (warnings.length === 0) {
  console.log("changelog tracks look paired.");
  process.exit(0);
}

for (const warning of warnings) {
  console.warn(`${strict ? "error" : "warning"}: ${warning}`);
}

process.exit(strict ? 1 : 0);
