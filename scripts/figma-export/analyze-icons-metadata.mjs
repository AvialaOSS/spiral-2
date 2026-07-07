import { readFileSync } from "node:fs";

const path = process.argv[2];
const text = readFileSync(path, "utf8");
const names = [...text.matchAll(/name="([^"]+)"/g)].map((m) => m[1]);

const iconFrames = names.filter(
  (n) => n.includes("&Standard") || n.includes("&Light") || /^[a-zA-Z0-9]+_/.test(n)
);

const categories = new Map();
const weights = new Map();
const styles = { default: 0, fill: 0, other: 0 };

for (const n of iconFrames) {
  const cat = n.match(/^([A-Za-z0-9]+)_/)?.[1] ?? "(other)";
  categories.set(cat, (categories.get(cat) ?? 0) + 1);

  const weight = n.match(/&([^&]+)$/)?.[1] ?? "(unknown)";
  weights.set(weight, (weights.get(weight) ?? 0) + 1);

  if (n.includes("-default")) styles.default += 1;
  else if (n.includes("-fill")) styles.fill += 1;
  else styles.other += 1;
}

console.log(JSON.stringify({
  totalNameAttrs: names.length,
  iconLikeFrames: iconFrames.length,
  categories: Object.fromEntries([...categories.entries()].sort((a, b) => b[1] - a[1])),
  weights: Object.fromEntries([...weights.entries()].sort((a, b) => b[1] - a[1])),
  styles,
}, null, 2));
