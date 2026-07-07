import type { AvialaIconProps, IconLevel } from "@aviala-design/icons";
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "./utils";

export type CloneAvialaIconDefaults = {
  level?: IconLevel;
  biggerSize?: boolean;
  className?: string;
};

/** Clone an Aviala icon element, applying defaults only for unset level/biggerSize. */
export function cloneAvialaIconElement(
  node: ReactNode,
  defaults: CloneAvialaIconDefaults = {}
): ReactNode {
  if (!node) return null;
  if (!isValidElement(node) || typeof node.type === "string") return node;

  const element = node as ReactElement<AvialaIconProps>;
  const { level, biggerSize, className } = element.props;

  return cloneElement(element, {
    level: level !== undefined ? level : defaults.level,
    biggerSize: biggerSize !== undefined ? biggerSize : defaults.biggerSize,
    width: undefined,
    height: undefined,
    className: cn(className, defaults.className, "shrink-0"),
  });
}
