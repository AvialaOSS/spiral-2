import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stampUnreleased, uiRoot } from "./changelog-lib.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(uiRoot, "package.json"), "utf8"));
const version = process.argv[2] ?? pkg.version;

if (!version || version === "0.0.0") {
  console.error("changelog:stamp requires a version (arg or package.json).");
  process.exit(1);
}

const updated = stampUnreleased(version);
console.log(
  updated > 0
    ? `Stamped [Unreleased] → ${version} in ${updated} component changelog(s).`
    : `No non-empty [Unreleased] sections to stamp for ${version}.`
);
