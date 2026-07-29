const KBD_ATTR = "data-aviala-kbd";

let installed = false;

/**
 * Gate `.aviala-focus-ring` to true keyboard modality.
 *
 * `:focus-visible` alone is not enough for menus: mouse-opening Select/Cascader
 * programmatically focuses an item, and browsers treat that as focus-visible.
 * We clear the gate on pointer/touch and set it on non-modifier keydown.
 */
export function initKeyboardFocus(): void {
  if (typeof window === "undefined" || installed) return;
  installed = true;

  const root = document.documentElement;

  const setKeyboard = (on: boolean) => {
    if (on) root.setAttribute(KBD_ATTR, "");
    else root.removeAttribute(KBD_ATTR);
  };

  window.addEventListener(
    "keydown",
    (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      // Ignore pure modifier presses
      if (event.key === "Meta" || event.key === "Control" || event.key === "Alt" || event.key === "Shift") {
        return;
      }
      setKeyboard(true);
    },
    true
  );

  window.addEventListener("pointerdown", () => setKeyboard(false), true);
  window.addEventListener("touchstart", () => setKeyboard(false), { capture: true, passive: true });
}
