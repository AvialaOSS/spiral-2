import type { Plugin } from "vite";

export interface AvialaTokensCssOptions {
  /** Directory for generated CSS files. Defaults to `<cwd>/node_modules/.cache/aviala-tokens-css`. */
  cacheDir?: string;
}

declare function avialaTokensCss(options?: AvialaTokensCssOptions): Plugin;

export default avialaTokensCss;
