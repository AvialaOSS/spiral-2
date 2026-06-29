import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const aldSource = join(process.env.ALD_PATH || "C:/Users/kailunlark/Documents/ALD", ".");
const aldDest = join(root, "packages/tokens/source/ald");

if (!existsSync(aldSource)) {
  console.error(`ALD source not found: ${aldSource}`);
  console.error("Set ALD_PATH env var to your ALD directory.");
  process.exit(1);
}

if (existsSync(aldDest)) {
  rmSync(aldDest, { recursive: true, force: true });
}

mkdirSync(aldDest, { recursive: true });
cpSync(aldSource, aldDest, { recursive: true });
console.log(`Synced ALD → ${aldDest}`);
