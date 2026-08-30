import { EditColorPicker } from "@aviala-design/icons";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  SelectValue,
} from "../select";
import { spiralDebugId } from "../../lib/spiral-debug";
import { cn } from "../../lib/utils";
import { useLocaleMessages } from "../../locale";
import { typographyVariants } from "../typography";
import {
  alphaPercent,
  fromHexInput,
  fromHslComponents,
  fromRgbComponents,
  parseColor,
  setAlphaPercent,
  toHexInput,
  toHslComponents,
  toRgbComponents,
  type ColorFormat,
} from "./color-utils";
import { useOptionalColorPickerContext } from "./color-picker-context";
import {
  useColorPickerState,
  type UseColorPickerStateOptions,
} from "./use-color-picker-state";

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
  }
}

export type ColorPickerInputsProps = {
  className?: string;
  disabled?: boolean;
  showEyedropper?: boolean;
} & Pick<
  UseColorPickerStateOptions,
  "value" | "defaultValue" | "onChange" | "format" | "onFormatChange"
>;

export function ColorPickerInputs({
  className,
  disabled,
  showEyedropper = true,
  value: valueProp,
  defaultValue,
  onChange,
  format: formatProp,
  onFormatChange,
}: ColorPickerInputsProps) {
  const locale = useLocaleMessages("ColorPicker");
  const ctx = useOptionalColorPickerContext();
  const local = useColorPickerState({
    value: ctx ? undefined : valueProp,
    defaultValue: ctx?.value ?? defaultValue,
    onChange: ctx ? undefined : onChange,
    format: ctx ? undefined : formatProp,
    onFormatChange: ctx ? undefined : onFormatChange,
  });

  const { value, setValue, format, setFormat, hsva } = ctx ?? local;
  const isDisabled = disabled ?? ctx?.disabled;
  const eyeDropperSupported =
    typeof window !== "undefined" && "EyeDropper" in window;

  const [hexDraft, setHexDraft] = useState(() => toHexInput(value));
  const [alphaDraft, setAlphaDraft] = useState(() =>
    String(alphaPercent(value))
  );
  const [componentDraft, setComponentDraft] = useState(() =>
    buildComponentDraft(value, format)
  );

  useEffect(() => {
    setHexDraft(toHexInput(value));
    setAlphaDraft(String(alphaPercent(value)));
    setComponentDraft(buildComponentDraft(value, format));
  }, [value, format]);

  const commitHex = useCallback(() => {
    setValue(fromHexInput(hexDraft, hsva.a), { source: "hex-input" });
  }, [hexDraft, hsva.a, setValue]);

  const commitAlpha = useCallback(() => {
    const parsed = Number.parseInt(alphaDraft, 10);
    if (Number.isNaN(parsed)) return;
    setValue(setAlphaPercent(value, parsed), { source: "alpha-input" });
  }, [alphaDraft, setValue, value]);

  const commitComponents = useCallback(() => {
    const parts = componentDraft
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);
    if (parts.some((n) => Number.isNaN(n))) return;
    if (format === "rgb") {
      setValue(
        fromRgbComponents(parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, hsva.a),
        {
          source: "rgb-input",
        }
      );
    } else if (format === "hsl") {
      setValue(
        fromHslComponents(parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, hsva.a),
        {
          source: "hsl-input",
        }
      );
    }
  }, [componentDraft, format, hsva.a, setValue]);

  const handleEyedropper = useCallback(async () => {
    if (!eyeDropperSupported || isDisabled) return;
    try {
      const dropper = new window.EyeDropper!();
      const result = await dropper.open();
      setValue(parseColor(result.sRGBHex).toHex(), { source: "eyedropper" });
    } catch {
      /* user cancelled */
    }
  }, [eyeDropperSupported, isDisabled, setValue]);

  return (
    <div
      className={cn("aviala-color-picker-inputs", className)}
      {...spiralDebugId("color-picker.content.inputs")}
    >
      {showEyedropper ? (
        <Button
          type="button"
          mode="defaultCustom"
          size="regular"
          iconOnly
          disabled={isDisabled}
          aria-label={locale.pickFromScreen}
          {...spiralDebugId("color-picker.content.inputs.eyedropper")}
          title={
            eyeDropperSupported
              ? locale.pickFromScreen
              : "EyeDropper not supported in this browser"
          }
          onClick={handleEyedropper}
        >
          <EditColorPicker aria-hidden />
        </Button>
      ) : null}

      {format === "hex" ? (
        <div className="aviala-color-picker-field">
          <span className="aviala-color-picker-field__badge-area">
            <Badge style="normal">#</Badge>
          </span>
          <input
            className={cn(
              "aviala-color-picker-field__input",
              typographyVariants({ level: "text" })
            )}
            value={hexDraft}
            disabled={isDisabled}
            aria-label={locale.hex}
            onChange={(e) => setHexDraft(e.target.value.toUpperCase())}
            onBlur={commitHex}
            onKeyDown={(e) => e.key === "Enter" && commitHex()}
          />
        </div>
      ) : (
        <div className="aviala-color-picker-field">
          <input
            className={cn(
              "aviala-color-picker-field__input",
              typographyVariants({ level: "text" })
            )}
            value={componentDraft}
            disabled={isDisabled}
            aria-label={format === "rgb" ? locale.rgb : locale.hsl}
            onChange={(e) => setComponentDraft(e.target.value)}
            onBlur={commitComponents}
            onKeyDown={(e) => e.key === "Enter" && commitComponents()}
          />
        </div>
      )}

      <div className="aviala-color-picker-field aviala-color-picker-field--alpha">
        <input
          className={cn(
            "aviala-color-picker-field__input",
            typographyVariants({ level: "text" })
          )}
          value={alphaDraft}
          disabled={isDisabled}
          aria-label={locale.opacityPercent}
          inputMode="numeric"
          onChange={(e) => setAlphaDraft(e.target.value)}
          onBlur={commitAlpha}
          onKeyDown={(e) => e.key === "Enter" && commitAlpha()}
        />
        <span className="aviala-color-picker-field__badge-area">
          <Badge style="normal">%</Badge>
        </span>
      </div>

      <Select
        value={format}
        onValueChange={(next) => setFormat(next as ColorFormat)}
        disabled={isDisabled}
      >
        <SelectTrigger
          className="aviala-color-picker-format-select w-[76px] shrink-0"
          size="regular"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent onCloseAutoFocus={(event) => event.preventDefault()}>
          <SelectItemGroup>
            <SelectItem value="hex" itemFunction="radio">
              HEX
            </SelectItem>
            <SelectItem value="rgb" itemFunction="radio">
              RGB
            </SelectItem>
            <SelectItem value="hsl" itemFunction="radio">
              HSL
            </SelectItem>
          </SelectItemGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function buildComponentDraft(value: string, format: ColorFormat): string {
  if (format === "rgb") {
    const { r, g, b } = toRgbComponents(value);
    return `${r}, ${g}, ${b}`;
  }
  if (format === "hsl") {
    const { h, s, l } = toHslComponents(value);
    return `${h}, ${s}, ${l}`;
  }
  return toHexInput(value);
}
