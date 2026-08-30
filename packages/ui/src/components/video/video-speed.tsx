import { SymbolRight } from "@aviala-design/icons";
import { useEffect, useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { interpolate } from "../../locale";
import { resolveRovingIndex, resolveRovingMove } from "../../lib/roving-focus";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { typographyVariants } from "../typography";

export type VideoSpeedProps = {
  label: string;
  title: string;
  rateTemplate: string;
  playbackRate: number;
  playbackRates: number[];
  onPlaybackRateChange: (rate: number) => void;
  trigger: ReactNode;
};

function formatSpeedRate(template: string, rate: number): string {
  return interpolate(template, { rate });
}

function videoSpeedOptionId(listId: string, rate: number) {
  return `${listId}-rate-${String(rate).replace(".", "-")}`;
}

export function VideoSpeed({
  label,
  title,
  rateTemplate,
  playbackRate,
  playbackRates,
  onPlaybackRateChange,
  trigger,
}: VideoSpeedProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const selectedIndex = playbackRates.indexOf(playbackRate);
  const fallbackIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const [activeIndex, setActiveIndex] = useState(fallbackIndex);
  const tabStopIndex = Math.min(Math.max(activeIndex, 0), Math.max(playbackRates.length - 1, 0));
  const activeRate = playbackRates[tabStopIndex];
  const activeOptionId = activeRate != null ? videoSpeedOptionId(listId, activeRate) : undefined;

  useEffect(() => {
    if (!open) return;
    const index = playbackRates.indexOf(playbackRate);
    setActiveIndex(index >= 0 ? index : 0);
  }, [open, playbackRate, playbackRates]);

  const commitRate = (rate: number) => {
    onPlaybackRateChange(rate);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = resolveRovingMove(event.key, "vertical");
    if (!move) return;

    const nextIndex = resolveRovingIndex(tabStopIndex, playbackRates.length, move);
    const nextRate = playbackRates[nextIndex];
    if (nextRate == null) return;

    event.preventDefault();
    setActiveIndex(nextIndex);
    document.getElementById(videoSpeedOptionId(listId, nextRate))?.focus();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent side="top" align="center" showArrow flush sideOffset={8}>
        <div className="aviala-video__speed-menu">
          <div className="aviala-select-group" role="none">
            <div
              className={cn(
                "aviala-select-label",
                typographyVariants({ level: "caption" })
              )}
            >
              {title}
            </div>
            <div
              id={listId}
              className="aviala-select-group__slot"
              role="listbox"
              aria-label={label}
              aria-activedescendant={activeOptionId}
              onKeyDown={handleKeyDown}
            >
              {playbackRates.map((rate, index) => {
                const selected = rate === playbackRate;
                return (
                  <button
                    key={rate}
                    id={videoSpeedOptionId(listId, rate)}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    tabIndex={index === tabStopIndex ? 0 : -1}
                    data-function="radio"
                    data-state={selected ? "checked" : undefined}
                    className="aviala-select-item aviala-focus-ring"
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => commitRate(rate)}
                  >
                    <span
                      className={cn(
                        "aviala-select-item__text",
                        typographyVariants({ level: "text" })
                      )}
                    >
                      {formatSpeedRate(rateTemplate, rate)}
                    </span>
                    {selected ? (
                      <span
                        className="aviala-select-item__trailing-radio"
                        aria-hidden
                      >
                        <SymbolRight level="text" biggerSize aria-hidden />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
