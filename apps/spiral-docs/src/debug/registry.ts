/**

 * Component API Debugger — registry

 *

 * EXTENSIBILITY

 * -------------

 * To add a new component to the debugger:

 *

 * 1. Register a `DebugComponentEntry` in `componentDebugRegistry` below (or import

 *    from `entries/<name>.tsx`).

 * 2. Define `initialState`, `nodes` (with `applyOverride` per node), and `renderPreview`.

 * 3. Expose inspect targets on DOM nodes via either:

 *    - `spiralDebugId("your-component.part")` in `packages/ui` (preferred for real subparts), or

 *    - `spiralDebugProps("your-component")` on a wrapper in `renderPreview`.

 * 4. Each `debugId` in `nodes` must match a `data-spiral-debug-id` attribute on a preview element.

 *

 * No changes to `ComponentDebugger.tsx` are required — the page reads this registry generically.

 */

import { buttonEntry } from "./entries/button";
import { cascaderEntry } from "./entries/cascader";
import { colorPickerEntry } from "./entries/color-picker";
import { datePickerEntry } from "./entries/date-picker";
import { inputEntry } from "./entries/input";
import { linkEntry } from "./entries/link";
import { navigationEntry } from "./entries/navigation";
import { segmentatorEntry } from "./entries/segmentator";
import { selectEntry } from "./entries/select";
import { textareaEntry } from "./entries/textarea";

import type { DebugComponentEntry } from "./types";

export const componentDebugRegistry: DebugComponentEntry[] = [
  colorPickerEntry,
  buttonEntry,
  selectEntry,
  inputEntry,
  linkEntry,
  cascaderEntry,
  segmentatorEntry,
  navigationEntry,
  textareaEntry,
  datePickerEntry,
];



export const componentDebugById = Object.fromEntries(

  componentDebugRegistry.map((entry) => [entry.id, entry])

) as Record<string, DebugComponentEntry>;



export const defaultComponentDebugId = componentDebugRegistry[0]?.id ?? "color-picker";



export type { DebugComponentEntry, DebugNodeSchema } from "./types";


