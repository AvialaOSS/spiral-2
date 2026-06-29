import { transform } from "@svgr/core";
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rawDir = join(__dirname, "../raw");
const outDir = join(__dirname, "../src/components");

mkdirSync(outDir, { recursive: true });

function toPascalCase(name) {
  return name
    .replace(/\.svg$/i, "")
    .replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (m) => m.toUpperCase());
}

const svgs = existsSync(rawDir)
  ? readdirSync(rawDir).filter((f) => f.endsWith(".svg"))
  : [];

const exportLines = [];

for (const file of svgs) {
  const svg = readFileSync(join(rawDir, file), "utf8");
  const componentName = toPascalCase(file);
  const tsx = await transform(
    svg,
    {
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
      typescript: true,
      exportType: "named",
      namedExport: componentName,
      jsxRuntime: "automatic",
      svgoConfig: {
        plugins: [{ name: "removeViewBox", active: false }],
      },
    },
    { componentName }
  );

  writeFileSync(join(outDir, `${componentName}.tsx`), tsx);
  exportLines.push(`export { ${componentName} } from "./components/${componentName}";`);
}

if (exportLines.length === 0) {
  writeFileSync(
    join(outDir, "Placeholder.tsx"),
    `import type { SVGProps } from "react";

export const Placeholder = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10" />
  </svg>
);
`
  );
  exportLines.push('export { Placeholder } from "./components/Placeholder";');
}

writeFileSync(
  join(__dirname, "../src/index.ts"),
  `export type { SVGProps } from "react";
export { Icon, type IconProps } from "./icon";
${exportLines.join("\n")}
`
);

console.log(`Built ${svgs.length || 1} icon component(s)`);
