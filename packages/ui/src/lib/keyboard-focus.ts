/**
 * @deprecated Focus rings now use native `:focus-visible` via `.aviala-focus-ring`
 * in `@aviala-design/tokens/focus-effects.css` (also bundled in `styles.css`).
 * This function is a no-op kept for backward compatibility.
 */
export function initKeyboardFocus(): void {
  // no-op — keyboard focus rings are CSS-only via :focus-visible
}
