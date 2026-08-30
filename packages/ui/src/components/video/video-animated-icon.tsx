import { memo, useId, useLayoutEffect, useRef } from "react";
import { VIDEO_ANIMATED_ICON_MARKUP } from "./video-animated-icon-markup";

export type VideoAnimatedIconName = keyof typeof VIDEO_ANIMATED_ICON_MARKUP;

/** Morph finishes around 25% of the 2s delivered timeline. */
export const VIDEO_TRANSPORT_ANIMATION_MS = 550;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function animationsIn(root: Element): Animation[] {
  return [root, ...root.querySelectorAll("*")].flatMap((node) =>
    node.getAnimations()
  );
}

function freezeAtEnd(root: Element) {
  for (const animation of animationsIn(root)) {
    try {
      animation.finish();
    } catch {
      /* already finished */
    }
    animation.pause();
  }
}

function playFromStart(root: Element) {
  for (const animation of animationsIn(root)) {
    animation.cancel();
    animation.play();
    animation.currentTime = 0;
  }
}

const SVG_NS = "http://www.w3.org/2000/svg";

/** Flip previous chevrons in place so a layer-level scaleX keeps them pointing left. */
function mirrorSkipGlyphs(layer: HTMLElement) {
  for (const path of [...layer.querySelectorAll("path")]) {
    if (!path.id) continue;
    const group = document.createElementNS(SVG_NS, "g");
    group.id = path.id;
    path.removeAttribute("id");
    path.removeAttribute("transform");
    path.parentNode?.insertBefore(group, path);
    group.appendChild(path);
    const box = path.getBBox();
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    path.setAttribute(
      "transform",
      `translate(${cx} ${cy}) scale(-1 1) translate(${-cx} ${-cy})`
    );
  }
}

function injectMarkup(
  layer: HTMLElement,
  name: VideoAnimatedIconName,
  uid: string
) {
  layer.innerHTML = VIDEO_ANIMATED_ICON_MARKUP[name].replaceAll(
    "__UID__",
    `${uid}-${name}`
  );
  if (name === "previous") {
    mirrorSkipGlyphs(layer);
  }
}

function setLayerActive(layer: HTMLElement, active: boolean) {
  layer.dataset.active = active ? "true" : "false";
}

function setLayerRest(layer: HTMLElement, rest: boolean) {
  layer.dataset.rest = rest ? "true" : "false";
}

export const VideoAnimatedIcon = memo(function VideoAnimatedIcon({
  name,
  playToken = 0,
}: {
  name: VideoAnimatedIconName;
  /** Increment to play the morph once; ignored while an animation lock is held. */
  playToken?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const hostRef = useRef<HTMLSpanElement>(null);
  const playLayerRef = useRef<HTMLSpanElement>(null);
  const pauseLayerRef = useRef<HTMLSpanElement>(null);
  const singleLayerRef = useRef<HTMLSpanElement>(null);
  const lockRef = useRef(false);
  const shownRef = useRef(name);
  const nameRef = useRef(name);
  nameRef.current = name;

  const isPlayPause = name === "play" || name === "pause";

  // Inject once per instance. Transport buttons keep a stable kind
  // (play/pause pair vs skip); later name flips are handled below.
  useLayoutEffect(() => {
    const currentName = nameRef.current;
    if (currentName === "play" || currentName === "pause") {
      const playLayer = playLayerRef.current;
      const pauseLayer = pauseLayerRef.current;
      if (!playLayer || !pauseLayer) return;
      injectMarkup(playLayer, "play", uid);
      injectMarkup(pauseLayer, "pause", uid);
      freezeAtEnd(playLayer);
      freezeAtEnd(pauseLayer);
      setLayerRest(playLayer, true);
      setLayerRest(pauseLayer, true);
      const initial = currentName === "pause" ? "pause" : "play";
      shownRef.current = initial;
      setLayerActive(playLayer, initial === "play");
      setLayerActive(pauseLayer, initial === "pause");
      return;
    }
    const layer = singleLayerRef.current;
    if (!layer) return;
    injectMarkup(layer, currentName, uid);
    freezeAtEnd(layer);
    setLayerRest(layer, true);
    shownRef.current = currentName;
  }, [uid]);

  useLayoutEffect(() => {
    if (playToken === 0) return;
    if (prefersReducedMotion()) {
      const target = nameRef.current;
      if (target === "play" || target === "pause") {
        const incoming =
          target === "pause" ? pauseLayerRef.current : playLayerRef.current;
        const outgoing =
          target === "pause" ? playLayerRef.current : pauseLayerRef.current;
        if (!incoming || !outgoing) return;
        freezeAtEnd(incoming);
        setLayerActive(incoming, true);
        setLayerActive(outgoing, false);
        shownRef.current = target;
      }
      return;
    }

    const target = nameRef.current;
    lockRef.current = true;

    if (target === "play" || target === "pause") {
      // Resting play icon = paused; resting pause icon = playing.
      // Morph toward the icon we are switching TO, based on what is on screen —
      // not `name`, which can still be the previous state when the token fires.
      const from = shownRef.current === "pause" ? "pause" : "play";
      const to: "play" | "pause" = from === "play" ? "pause" : "play";
      const incoming =
        to === "pause" ? pauseLayerRef.current : playLayerRef.current;
      const outgoing =
        to === "pause" ? playLayerRef.current : pauseLayerRef.current;
      if (!incoming || !outgoing) {
        lockRef.current = false;
        return;
      }

      setLayerRest(incoming, false);
      playFromStart(incoming);
      setLayerActive(incoming, true);
      setLayerActive(outgoing, false);
      shownRef.current = to;

      const timer = window.setTimeout(() => {
        freezeAtEnd(incoming);
        setLayerRest(incoming, true);
        lockRef.current = false;
      }, VIDEO_TRANSPORT_ANIMATION_MS);
      return () => window.clearTimeout(timer);
    }

    const layer = singleLayerRef.current;
    if (!layer) {
      lockRef.current = false;
      return;
    }
    setLayerRest(layer, false);
    playFromStart(layer);
    const timer = window.setTimeout(() => {
      freezeAtEnd(layer);
      setLayerRest(layer, true);
      lockRef.current = false;
    }, VIDEO_TRANSPORT_ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [playToken]);

  useLayoutEffect(() => {
    if (lockRef.current) return;
    if (shownRef.current === name) return;
    if (name !== "play" && name !== "pause") return;

    const incoming =
      name === "pause" ? pauseLayerRef.current : playLayerRef.current;
    const outgoing =
      name === "pause" ? playLayerRef.current : pauseLayerRef.current;
    if (!incoming || !outgoing) return;
    freezeAtEnd(incoming);
    setLayerActive(incoming, true);
    setLayerActive(outgoing, false);
    shownRef.current = name;
  }, [name]);

  if (isPlayPause) {
    return (
      <span ref={hostRef} className="aviala-video__animated-icon" aria-hidden>
        <span
          ref={playLayerRef}
          className="aviala-video__animated-icon-layer"
          data-active="true"
        />
        <span
          ref={pauseLayerRef}
          className="aviala-video__animated-icon-layer"
          data-active="false"
        />
      </span>
    );
  }

  return (
    <span
      ref={hostRef}
      className="aviala-video__animated-icon"
      data-flip={name === "next" ? "true" : undefined}
      data-mirror-motion={name === "previous" ? "true" : undefined}
      aria-hidden
    >
      <span
        ref={singleLayerRef}
        className="aviala-video__animated-icon-layer"
        data-active="true"
        data-rest="true"
      />
    </span>
  );
});
