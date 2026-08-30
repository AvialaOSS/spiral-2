import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import avialaTokensCss from "@aviala-design/tokens/vite-plugin";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // avialaTokensCss serves tokens CSS/JS straight from source: no build
  // needed before dev, and edits to tokens/src/semantic/*.css hot-reload.
  plugins: [avialaTokensCss(), react(), tailwindcss()],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    // Exact-match regex aliases: object-form aliases also swallow subpaths
    // ("@aviala-design/spiral/styles.css" -> src/index.ts/styles.css),
    // which breaks the tokens plugin's CSS interception.
    alias: [
      {
        find: /^@aviala-design\/spiral$/,
        replacement: path.resolve(dirname, "../../packages/ui/src/index.ts"),
      },
      {
        find: /^@aviala-design\/spiral\/form$/,
        replacement: path.resolve(dirname, "../../packages/ui/src/form.ts"),
      },
      {
        find: /^@aviala-design\/icons$/,
        replacement: path.resolve(dirname, "../../packages/icons/src/index.ts"),
      },
    ],
  },
  server: { port: 5173 },
});
