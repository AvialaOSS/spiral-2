import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const replacements = [
  ["@aviala-design/tokens", "@aviala-design/tokens"],
  ["@aviala-design/icons", "@aviala-design/icons"],
  ["@aviala-design/spiral", "@aviala-design/spiral"],
];
const excludeDirs = new Set([
  "node_modules",
  "dist",
  ".git",
  ".pnpm-store",
  "storybook-static",
  ".turbo",
]);
const extensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mdx",
  ".yml",
  ".yaml",
  ".css",
  ".mjs",
]);

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (excludeDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, files);
    } else if (extensions.has(path.extname(entry.name))) {
      if (entry.name === "pnpm-lock.yaml") continue;
      files.push(fullPath);
    }
  }
  return files;
}

const files = await walk(root);
let changed = 0;

for (const file of files) {
  const original = await fs.readFile(file, "utf8");
  let next = original;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  if (next !== original) {
    await fs.writeFile(file, next, "utf8");
    changed += 1;
  }
}

console.log(`Updated ${changed} file(s).`);
