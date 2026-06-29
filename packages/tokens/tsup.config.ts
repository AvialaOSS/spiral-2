import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    node: "src/node.ts",
    "tailwind.preset": "src/tailwind.preset.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
});
