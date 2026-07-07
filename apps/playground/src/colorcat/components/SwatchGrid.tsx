import { Typography } from "@aviala-design/spiral";
import { formatColor } from "../lib/palette";
import type { ColorFormat, PaletteStep } from "../lib/types";

type SwatchGridProps = {
  steps: PaletteStep[];
  format: ColorFormat;
};

export function SwatchGrid({ steps, format }: SwatchGridProps) {
  return (
    <div className="colorcat-swatch-grid">
      {steps.map((step) => (
        <div key={step.step} className="colorcat-swatch">
          <div
            className="colorcat-swatch__chip"
            style={{ backgroundColor: step.color }}
            title={formatColor(step.color, format)}
          />
          <div className="colorcat-swatch__meta">
            <span className="colorcat-swatch__value">{formatColor(step.color, format)}</span>
            <span className="colorcat-swatch__tc">
              T {step.tone.toFixed(2)} C {step.chroma.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

type SwatchModeRowProps = {
  label: string;
  steps: PaletteStep[];
  format: ColorFormat;
};

export function SwatchModeRow({ label, steps, format }: SwatchModeRowProps) {
  return (
    <div className="colorcat-card__section">
      <Typography level="caption" className="colorcat-card__mode-label">
        {label}
      </Typography>
      <SwatchGrid steps={steps} format={format} />
    </div>
  );
}
