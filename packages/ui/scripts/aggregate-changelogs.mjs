import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadAllComponentChangelogs,
  uiRoot,
  writeComponentChangelogsJson,
} from "./changelog-lib.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.resolve(dirname, "../dist/component-changelogs.json");

const registry = loadAllComponentChangelogs();
writeComponentChangelogsJson(registry, outFile);

const count = Object.keys(registry).length;
const entries = Object.values(registry).reduce((sum, releases) => sum + releases.length, 0);
console.log(
  `Aggregated ${count} component changelogs (${entries} version blocks) → ${path.relative(uiRoot, outFile)}`,
);
