import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
export const uiRoot = path.resolve(dirname, "..");
export const changelogsDir = path.join(uiRoot, "changelogs");

const SECTION_ALIASES = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
  removed: "Removed",
  deprecated: "Deprecated",
};

/**
 * @typedef {{ version: string, sections: Record<string, string[]> }} ChangelogRelease
 * @typedef {Record<string, ChangelogRelease[]>} ComponentChangelogs
 */

/**
 * @param {string} markdown
 * @returns {ChangelogRelease[]}
 */
export function parseComponentChangelog(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  /** @type {ChangelogRelease[]} */
  const releases = [];
  /** @type {ChangelogRelease | null} */
  let current = null;
  /** @type {string | null} */
  let section = null;

  for (const raw of lines) {
    const line = raw.trimEnd();
    const versionMatch = line.match(/^##\s+\[?([^\]]+)\]?\s*$/);
    if (versionMatch) {
      const version = versionMatch[1].trim();
      current = { version, sections: {} };
      releases.push(current);
      section = null;
      continue;
    }

    if (!current) continue;

    const sectionMatch = line.match(/^###\s+(.+)\s*$/);
    if (sectionMatch) {
      const key = sectionMatch[1].trim();
      const normalized = SECTION_ALIASES[key.toLowerCase()] ?? key;
      section = normalized;
      if (!current.sections[section]) current.sections[section] = [];
      continue;
    }

    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet && section) {
      current.sections[section].push(bullet[1].trim());
    }
  }

  return releases.filter((release) =>
    Object.values(release.sections).some((items) => items.length > 0),
  );
}

/**
 * @returns {ComponentChangelogs}
 */
export function loadAllComponentChangelogs() {
  /** @type {ComponentChangelogs} */
  const out = {};
  if (!existsSync(changelogsDir)) return out;

  for (const file of readdirSync(changelogsDir)) {
    if (!file.endsWith(".md")) continue;
    const name = file.slice(0, -3);
    const markdown = readFileSync(path.join(changelogsDir, file), "utf8");
    out[name] = parseComponentChangelog(markdown);
  }

  return out;
}

/**
 * @param {ComponentChangelogs} registry
 * @param {string} outFile
 */
export function writeComponentChangelogsJson(registry, outFile) {
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(registry, null, 2)}\n`);
}

/**
 * Stamp all non-empty `## [Unreleased]` blocks to `## {version}`.
 * @param {string} version
 * @returns {number} files updated
 */
export function stampUnreleased(version) {
  if (!existsSync(changelogsDir)) return 0;

  let updated = 0;
  for (const file of readdirSync(changelogsDir)) {
    if (!file.endsWith(".md")) continue;
    const filePath = path.join(changelogsDir, file);
    const before = readFileSync(filePath, "utf8");
    if (!/^##\s+\[Unreleased\]\s*$/m.test(before)) continue;

    // Only stamp when Unreleased has at least one bullet before the next ## heading.
    const unreleasedBlock = before.match(
      /^##\s+\[Unreleased\]\s*\n([\s\S]*?)(?=^##\s|\Z)/m,
    );
    if (!unreleasedBlock) continue;
    if (!/^\s*-\s+\S/m.test(unreleasedBlock[1])) continue;

    const after = before.replace(/^##\s+\[Unreleased\]\s*$/m, `## ${version}`);
    if (after === before) continue;
    writeFileSync(filePath, after);
    updated += 1;
  }

  return updated;
}
