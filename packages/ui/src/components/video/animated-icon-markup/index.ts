import { NEXT_ICON_MARKUP } from "./next";
import { PAUSE_ICON_MARKUP } from "./pause";
import { PLAY_ICON_MARKUP } from "./play";
import { PREVIOUS_ICON_MARKUP } from "./previous";

/**
 * Static SVG assets for the video transport controls, one module per glyph.
 * Each string still carries `__UID__` placeholders that the consumer swaps for a
 * per-instance id before injection.
 */
export const VIDEO_ANIMATED_ICON_MARKUP = {
  play: PLAY_ICON_MARKUP,
  pause: PAUSE_ICON_MARKUP,
  next: NEXT_ICON_MARKUP,
  previous: PREVIOUS_ICON_MARKUP,
} as const;

export type VideoAnimatedIconName = keyof typeof VIDEO_ANIMATED_ICON_MARKUP;
