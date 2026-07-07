import type { AvialaIconProps, IconLevel } from "@aviala-design/icons";
import { resolveIconSizeToken } from "@aviala-design/icons";
import { isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";

export function resolveIconSlotSizing(
  node: ReactNode,
  defaultLevel: IconLevel,
  defaultBiggerSize = true
): { level: IconLevel; biggerSize: boolean } {
  if (!isValidElement(node) || typeof node.type === "string") {
    return { level: defaultLevel, biggerSize: defaultBiggerSize };
  }

  const props = (node as ReactElement<AvialaIconProps>).props;
  return {
    level: props.level ?? defaultLevel,
    biggerSize: props.biggerSize ?? defaultBiggerSize,
  };
}

export function iconSlotCssVarStyle(
  node: ReactNode,
  cssVarName: string,
  defaultLevel: IconLevel,
  defaultBiggerSize = true
): CSSProperties {
  const slotSizing = resolveIconSlotSizing(node, defaultLevel, defaultBiggerSize);
  return {
    [cssVarName]: resolveIconSizeToken(slotSizing.level, slotSizing.biggerSize),
  } as CSSProperties;
}

export function iconLevelCssVarStyle(
  level: IconLevel,
  biggerSize: boolean,
  cssVarName: string
): CSSProperties {
  return {
    [cssVarName]: resolveIconSizeToken(level, biggerSize),
  } as CSSProperties;
}
