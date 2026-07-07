import {
  Button,
  PALETTE_HUE_FAMILIES,
  useTheme,
  type HueFamily,
} from "@aviala-design/spiral";

export function PaletteConfigPanel() {
  const { paletteConfig, setPaletteConfig, resetPaletteConfig } = useTheme();
  const families = paletteConfig.protectHueFamilies ?? [];

  const toggleFamily = (family: HueFamily) => {
    const set = new Set(families);
    if (set.has(family)) set.delete(family);
    else set.add(family);
    setPaletteConfig({ protectHueFamilies: [...set] });
  };

  return (
    <details className="rounded-md border border-border bg-background/60 p-3 text-sm" open>
      <summary className="cursor-pointer font-medium">Color generation config</summary>
      <div className="mt-3 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="flex items-center justify-between">
            <span>Curve gamma</span>
            <code className="text-xs text-muted-foreground">
              {(paletteConfig.curveGamma ?? 1).toFixed(2)}
            </code>
          </span>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.05}
            value={paletteConfig.curveGamma ?? 1}
            onChange={(e) => setPaletteConfig({ curveGamma: Number(e.target.value) })}
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={paletteConfig.protectHues ?? true}
            onChange={(e) => setPaletteConfig({ protectHues: e.target.checked })}
          />
          <span>Protect hue families</span>
        </label>

        <fieldset
          className="flex flex-col gap-2"
          disabled={!(paletteConfig.protectHues ?? true)}
        >
          <div className="flex flex-wrap gap-1.5">
            {PALETTE_HUE_FAMILIES.map((family) => {
              const active = families.includes(family);
              return (
                <Button
                  key={family}
                  type="button"
                  size="small"
                  mode={active ? "primary" : "default"}
                  onClick={() => toggleFamily(family)}
                >
                  {family}
                </Button>
              );
            })}
          </div>
          <label className="flex flex-col gap-1">
            <span className="flex items-center justify-between">
              <span>Protect strength</span>
              <code className="text-xs text-muted-foreground">
                {(paletteConfig.protectHueStrength ?? 2).toFixed(1)}
              </code>
            </span>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={paletteConfig.protectHueStrength ?? 2}
              onChange={(e) =>
                setPaletteConfig({ protectHueStrength: Number(e.target.value) })
              }
            />
          </label>
        </fieldset>

        <label className="flex flex-col gap-1">
          <span className="flex items-center justify-between">
            <span>Theme mix ratio</span>
            <code className="text-xs text-muted-foreground">
              {(paletteConfig.mixRatio ?? 0).toFixed(2)}
            </code>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={paletteConfig.mixRatio ?? 0}
            onChange={(e) => setPaletteConfig({ mixRatio: Number(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Mix color e.g. #165DFF"
            value={paletteConfig.mixColor ?? ""}
            onChange={(e) => setPaletteConfig({ mixColor: e.target.value || undefined })}
            className="rounded border border-border bg-card px-2 py-1 text-xs"
          />
        </label>

        <Button type="button" size="small" mode="default" onClick={resetPaletteConfig}>
          Reset to design defaults
        </Button>
      </div>
    </details>
  );
}
