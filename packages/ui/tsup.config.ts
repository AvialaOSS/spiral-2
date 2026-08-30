import { createRequire } from "node:module";
import { defineConfig } from "tsup";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

/**
 * Every declared dependency and peer stays external — nothing is bundled in by
 * accident. This matters most for `react-hook-form`: it must never end up in
 * `dist/index.*`, which consumers without the peer installed have to be able to
 * import.
 */
const externalPackages = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default defineConfig({
  entry: ["src/index.ts", "src/form.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: [
    ...externalPackages,
    // Subpath imports of the same packages ("react-dom/client", …)
    new RegExp(`^(${externalPackages.map(escapeRegExp).join("|")})/`),
  ],
  // Shared modules go into one chunk, so the FormField control context stays a
  // single instance across the `.` and `./form` entries.
  splitting: true,
  sourcemap: true,
  banner: {
    js: '"use client";',
  },
});
