import type { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../popover";
import { Slider } from "../slider";
import { Typography } from "../typography";

export type VideoVolumeProps = {
  label: string;
  percent: number;
  onPercentChange: (percent: number) => void;
  trigger: ReactNode;
};

export function VideoVolume({
  label,
  percent,
  onPercentChange,
  trigger,
}: VideoVolumeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent side="top" align="center" showArrow flush sideOffset={8}>
        <div className="aviala-video__volume-body">
          <Slider
            className="aviala-video__volume-slider"
            orientation="vertical"
            size="default"
            min={0}
            max={100}
            step={1}
            value={[percent]}
            aria-label={label}
            onValueChange={(values) => onPercentChange(values[0] ?? 0)}
          />
          <Typography level="text">{`${percent}%`}</Typography>
        </div>
      </PopoverContent>
    </Popover>
  );
}
