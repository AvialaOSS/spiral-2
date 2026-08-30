import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import avialaTokensCss from "@aviala-design/tokens/vite-plugin";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** Existing aliases (object or array form) normalized to array entries. */
function toAliasArray(
  alias: unknown
): Array<{ find: string | RegExp; replacement: string }> {
  if (!alias) return [];
  if (Array.isArray(alias)) return alias as never;
  return Object.entries(alias as Record<string, string>).map(
    ([find, replacement]) => ({ find, replacement })
  );
}

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/**/*.stories.@(tsx|mdx)"],
  staticDirs: ["../public"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // avialaTokensCss serves tokens CSS/JS straight from source: no build
    // needed before dev, and edits to tokens/src/semantic/*.css hot-reload.
    config.plugins = [
      avialaTokensCss(),
      ...(config.plugins ?? []),
      tailwindcss(),
    ];
    config.resolve = {
      ...config.resolve,
      alias: [
        ...toAliasArray(config.resolve?.alias),
        // Exact-match only: object-form aliases also swallow subpaths
        // ("@aviala-design/spiral/styles.css" -> src/index.ts/styles.css),
        // which breaks the tokens plugin's CSS interception.
        {
          find: /^@aviala-design\/spiral$/,
          replacement: path.resolve(
            dirname,
            "../../../packages/ui/src/index.ts"
          ),
        },
        {
          find: /^@aviala-design\/icons$/,
          replacement: path.resolve(
            dirname,
            "../../../packages/icons/src/index.ts"
          ),
        },
      ],
    };
    return config;
  },
  docs: {},
};

export default config;
