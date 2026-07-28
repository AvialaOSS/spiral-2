import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "aviala-spiral-docs:root-font-size";
export const ROOT_FONT_SIZE_DEFAULT = 16;
export const ROOT_FONT_SIZE_MIN = 12;
export const ROOT_FONT_SIZE_MAX = 24;

type Listener = () => void;

let current = readStored();
const listeners = new Set<Listener>();

function readStored(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ROOT_FONT_SIZE_DEFAULT;
    const n = Number(raw);
    if (!Number.isFinite(n)) return ROOT_FONT_SIZE_DEFAULT;
    return Math.min(ROOT_FONT_SIZE_MAX, Math.max(ROOT_FONT_SIZE_MIN, n));
  } catch {
    return ROOT_FONT_SIZE_DEFAULT;
  }
}

function applyRootFontSize(px: number) {
  const root = document.documentElement;
  if (px === ROOT_FONT_SIZE_DEFAULT) {
    root.style.removeProperty("font-size");
  } else {
    root.style.fontSize = `${px}px`;
  }
}

function persist(px: number) {
  try {
    if (px === ROOT_FONT_SIZE_DEFAULT) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, String(px));
    }
  } catch {
    // ignore
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return current;
}

function setRootFontSizeValue(next: number) {
  const clamped = Math.min(
    ROOT_FONT_SIZE_MAX,
    Math.max(ROOT_FONT_SIZE_MIN, Math.round(next))
  );
  if (clamped === current) {
    applyRootFontSize(clamped);
    return;
  }
  current = clamped;
  persist(clamped);
  applyRootFontSize(clamped);
  emit();
}

if (typeof document !== "undefined") {
  applyRootFontSize(current);
}

/** Global html font-size control — rem type/size tokens scale with this. */
export function useRootFontSize() {
  const rootFontSize = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    applyRootFontSize(rootFontSize);
  }, [rootFontSize]);

  const setRootFontSize = useCallback((next: number) => {
    setRootFontSizeValue(next);
  }, []);

  const resetRootFontSize = useCallback(() => {
    setRootFontSizeValue(ROOT_FONT_SIZE_DEFAULT);
  }, []);

  return {
    rootFontSize,
    setRootFontSize,
    resetRootFontSize,
    isDefault: rootFontSize === ROOT_FONT_SIZE_DEFAULT,
  };
}
