/** Keys that indicate keyboard-driven focus (Tab + roving/menu navigation). */
const KEYBOARD_FOCUS_KEYS = new Set([
  "Tab",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);

let initialized = false;

/** Toggle `html[data-aviala-keyboard-focus]` for keyboard-only focus ring CSS. */
export function initKeyboardFocus(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const root = document.documentElement;

  const enable = () => {
    root.dataset.avialaKeyboardFocus = "";
  };

  const disable = () => {
    delete root.dataset.avialaKeyboardFocus;
  };

  window.addEventListener(
    "keydown",
    (event) => {
      if (KEYBOARD_FOCUS_KEYS.has(event.key)) {
        enable();
      }
    },
    true
  );

  window.addEventListener("mousedown", disable, true);
  window.addEventListener("pointerdown", disable, true);
}
