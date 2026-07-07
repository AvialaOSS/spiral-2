import { GeneralSetting } from "@aviala-design/icons";
import {
  Button,
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SegmentatorGroup,
  SegmentatorItem,
  Stack,
  Typography,
  useTheme,
} from "@aviala-design/spiral";
import { PaletteConfigPanel } from "./PaletteConfigPanel";

export function ThemeToolbar() {
  const {
    mode,
    setMode,
    primaryColor,
    setPrimaryColor,
    presets,
    presetId,
    applyPreset,
    isStaticTheme,
    density,
    setDensity,
  } = useTheme();

  return (
    <Stack direction="row" gap="component" className="docs-theme-toolbar">
      <Typography level="caption" as="span" className="docs-theme-toolbar-label">
        文档预览
      </Typography>

      <SegmentatorGroup
        value={mode}
        onValueChange={(v) => setMode(v as "light" | "dark")}
        mode="nested"
        aria-label="Color mode"
      >
        <SegmentatorItem value="light">浅色</SegmentatorItem>
        <SegmentatorItem value="dark">深色</SegmentatorItem>
      </SegmentatorGroup>

      <SegmentatorGroup
        value={density}
        onValueChange={(v) => setDensity(v as "default" | "mobile-friendly")}
        mode="nested"
        aria-label="Base numbers density"
      >
        <SegmentatorItem value="default">Default</SegmentatorItem>
        <SegmentatorItem value="mobile-friendly">Mobile Friendly</SegmentatorItem>
      </SegmentatorGroup>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            mode="noBackgroundCustom"
            size="regular"
            leftIcon={<GeneralSetting aria-hidden />}
          >
            主题设置
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="docs-theme-settings-panel">
          <Stack gap="component">
            <Typography level="subtitle" as="h2">
              主题设置
            </Typography>

            <div>
              <Typography level="caption" className="mb-2 text-muted-foreground">
                预设
              </Typography>
              <div className="docs-theme-toolbar-group">
                {presets.map((preset) => (
                  <Button
                    key={preset.id}
                    mode={presetId === preset.id ? "primary" : "second"}
                    size="small"
                    onClick={() => applyPreset(preset.id)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {isStaticTheme ? (
              <Typography level="caption" className="text-muted-foreground">
                冻结的 ALD 主题 — 颜色直接来自 Figma token 导出。选择其他预设以启用调色板生成。
              </Typography>
            ) : (
              <>
                <label className="flex flex-col gap-2">
                  <Typography level="caption">主色</Typography>
                  <div className="flex flex-wrap items-center gap-2">
                    <ColorPicker value={primaryColor} onChange={setPrimaryColor}>
                      <ColorPickerTrigger size="regular" className="w-[120px]" />
                      <ColorPickerContent />
                    </ColorPicker>
                    <code className="text-xs text-muted-foreground">{primaryColor}</code>
                  </div>
                </label>
                <PaletteConfigPanel />
              </>
            )}
          </Stack>
        </PopoverContent>
      </Popover>
    </Stack>
  );
}
