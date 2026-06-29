import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "@aviala/icons", "@aviala/tokens"],
  splitting: false,
  sourcemap: true,
  banner: {
    js: '"use client";',
  },
});
