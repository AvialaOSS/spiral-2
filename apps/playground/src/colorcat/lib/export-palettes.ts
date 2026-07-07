import { aliasToCssVar } from "@aviala/tokens";
import type { ColorEntry, ColorEntryPalettes } from "./types";

export type ExportPayload = Record<
  string,
  {
    name: string;
    subtitle: string;
    baseColor: string;
    light: ColorEntryPalettes["light"];
    dark: ColorEntryPalettes["dark"];
  }
>;

export function buildExportPayload(
  entries: ColorEntry[],
  palettesById: Record<string, ColorEntryPalettes>
): ExportPayload {
  const payload: ExportPayload = {};
  for (const entry of entries) {
    const palettes = palettesById[entry.id];
    if (!palettes) continue;
    payload[entry.id] = {
      name: entry.name,
      subtitle: entry.subtitle,
      baseColor: entry.baseColor,
      light: palettes.light,
      dark: palettes.dark,
    };
  }
  return payload;
}

export function exportAsJson(payload: ExportPayload): string {
  return JSON.stringify(payload, null, 2);
}

export function exportAsCssVariables(payload: ExportPayload): string {
  const lines: string[] = [":root {"];

  for (const [familyId, family] of Object.entries(payload)) {
    for (const step of family.light) {
      lines.push(
        `  ${aliasToCssVar(`${familyId}/${familyId}-${step.step}`)}: ${step.color};`
      );
    }
  }

  lines.push("}", "", '[data-theme-mode="dark"] {');

  for (const [familyId, family] of Object.entries(payload)) {
    for (const step of family.dark) {
      lines.push(
        `  ${aliasToCssVar(`${familyId}/${familyId}-${step.step}`)}: ${step.color};`
      );
    }
  }

  lines.push("}");
  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
