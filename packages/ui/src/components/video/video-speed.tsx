import { SymbolRight } from "@aviala-design/icons";
import { useState, type ReactNode } from "react";
import { interpolate } from "../../locale";
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
              className="aviala-select-group__slot"
              role="listbox"
              aria-label={label}
            >
              {playbackRates.map((rate) => {
                const selected = rate === playbackRate;
                return (
                  <button
                    key={rate}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    data-function="radio"
                    data-state={selected ? "checked" : undefined}
                    className="aviala-select-item aviala-focus-ring"
                    onClick={() => {
                      onPlaybackRateChange(rate);
                      setOpen(false);
                    }}
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
