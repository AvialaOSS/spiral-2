import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
      "@aviala/spiral": path.resolve(dirname, "../../packages/ui/src/index.ts"),
      "@aviala/tokens/basic-input-effects.css": path.resolve(
        dirname,
        "../../packages/tokens/src/semantic/basic-input-effects.css"
      ),
    },
  },
  server: { port: 5173 },
});
