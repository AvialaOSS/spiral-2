import { EditNormalEdit, GeneralDelete } from "@aviala-design/icons";
import { Button, Typeface } from "@aviala-design/spiral";
import { useMemo } from "react";
import { generatePaletteSteps } from "../lib/palette";
import type { ColorEntry, ColorFormat } from "../lib/types";
import { SwatchModeRow } from "./SwatchGrid";

type ColorCardProps = {
  entry: ColorEntry;
  format: ColorFormat;
  onEdit: (entry: ColorEntry) => void;
  onDelete: (entry: ColorEntry) => void;
};

function tintBackground(hex: string): string {
  return `color-mix(in srgb, ${hex} 12%, var(--card))`;
}

export function ColorCard({ entry, format, onEdit, onDelete }: ColorCardProps) {
  const lightSteps = useMemo(
    () => generatePaletteSteps(entry.baseColor, "light"),
    [entry.baseColor]
  );
  const darkSteps = useMemo(
    () => generatePaletteSteps(entry.baseColor, "dark"),
    [entry.baseColor]
  );

  const pillHex = entry.baseColor.replace(/^#/, "").slice(0, 6).toUpperCase();

  return (
    <article className="colorcat-card">
      <div className="colorcat-card__header">
        <div className="colorcat-card__header-main">
          <div className="colorcat-card__pill">
            <div
              className="colorcat-card__pill-swatch"
              style={{ backgroundColor: entry.baseColor }}
            />
            <div
              className="colorcat-card__pill-label"
              style={{ backgroundColor: tintBackground(entry.baseColor) }}
            >
              {pillHex}
            </div>
          </div>
          <Typeface
            content="textCaption"
            primary={entry.name}
            secondary={entry.subtitle}
          />
        </div>
        <div className="colorcat-card__actions">
          <Button
            mode="noBackground"
            size="small"
            iconOnly
            leftIcon={<EditNormalEdit aria-hidden />}
            aria-label={`Edit ${entry.name}`}
            onClick={() => onEdit(entry)}
          />
          <Button
            mode="noBackground"
            size="small"
            iconOnly
            leftIcon={<GeneralDelete aria-hidden />}
            aria-label={`Delete ${entry.name}`}
            disabled={entry.isDefault}
            onClick={() => onDelete(entry)}
          />
        </div>
      </div>
      <SwatchModeRow label="亮色模式" steps={lightSteps} format={format} />
      <SwatchModeRow label="暗色模式" steps={darkSteps} format={format} />
    </article>
  );
}
