import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const OverlayContainerContext = createContext<HTMLElement | null>(null);

export type OverlayContainerProviderProps = {
  container: HTMLElement | null;
  children: ReactNode;
};

/** Nest overlays (Popover / Select / Tooltip) inside a stacking context such as Modal. */
export function OverlayContainerProvider({
  container,
  children,
}: OverlayContainerProviderProps) {
  return (
    <OverlayContainerContext.Provider value={container}>
      {children}
    </OverlayContainerContext.Provider>
  );
}

function readFullscreenElement(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null;
  };
  const el = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
  return el instanceof HTMLElement ? el : null;
}

/**
 * Portal target for floating layers.
 * Fullscreen element wins (browser only paints that subtree), then a nested
 * overlay container (Modal), otherwise `document.body`.
 */
export function useOverlayPortalContainer(): HTMLElement | undefined {
  const nested = useContext(OverlayContainerContext);
  const [fullscreen, setFullscreen] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const sync = () => setFullscreen(readFullscreenElement());
    sync();
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  return fullscreen ?? nested ?? undefined;
}
