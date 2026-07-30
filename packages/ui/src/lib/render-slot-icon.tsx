import { type ReactNode } from "react";
import { cloneAvialaIconElement } from "./clone-aviala-icon";
import { iconSlotCssVarStyle } from "./icon-slot-sizing";
import { spiralDebugId } from "./spiral-debug";

export function renderSlotIcon(
  node: ReactNode,
  className: string,
  debugId?: string
): ReactNode {
  if (!node) return null;
  const content = cloneAvialaIconElement(node, {
    level: "text",
    biggerSize: true,
  });

  return (
    <span
      className={className}
      style={iconSlotCssVarStyle(node, "--input-slot-icon-size", "text", true)}
      {...(debugId ? spiralDebugId(debugId) : undefined)}
    >
      {content}
    </span>
  );
}
