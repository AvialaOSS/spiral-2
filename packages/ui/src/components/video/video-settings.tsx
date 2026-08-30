import type { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { SegmentatorGroup, SegmentatorItem } from "../segmentator";
import { Switch } from "../switch";
import { Typography } from "../typography";
import type { VideoObjectFit } from "./use-video-state";
import type { VideoControlsLocale } from "./video-controls";

export type VideoSettingsProps = {
  locale: VideoControlsLocale;
  objectFit: VideoObjectFit;
  volumeBalance: boolean;
  onObjectFitChange: (fit: VideoObjectFit) => void;
  onVolumeBalanceChange: (enabled: boolean) => void;
  trigger: ReactNode;
};

export function VideoSettings({
  locale,
  objectFit,
  volumeBalance,
  onObjectFitChange,
  onVolumeBalanceChange,
  trigger,
}: VideoSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent side="top" align="end" showArrow flush sideOffset={8}>
        <div className="aviala-video__settings-body">
          <Typography level="subtitle">{locale.settingsTitle}</Typography>

          <div className="aviala-video__settings-section">
            <Typography level="text">{locale.aspectRatio}</Typography>
            <SegmentatorGroup
              equalWidth
              value={objectFit}
              onValueChange={(value) =>
                onObjectFitChange(value as VideoObjectFit)
              }
            >
              <SegmentatorItem value="original">
                {locale.aspectOriginal}
              </SegmentatorItem>
              <SegmentatorItem value="stretch">
                {locale.aspectStretch}
              </SegmentatorItem>
              <SegmentatorItem value="fill">
                {locale.aspectFill}
              </SegmentatorItem>
            </SegmentatorGroup>
          </div>

          <div className="aviala-video__settings-row">
            <Typography level="text">{locale.volumeBalance}</Typography>
            <Switch
              size="small"
              checked={volumeBalance}
              onCheckedChange={(checked) =>
                onVolumeBalanceChange(checked === true)
              }
              aria-label={locale.volumeBalance}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
