import { GeneralSetting, UsersUserCircle } from "@aviala-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Input,
  Stack,
  Tag,
  Typography,
} from "@aviala-design/spiral";
import { useEffect, useState } from "react";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  ROOT_FONT_SIZE_DEFAULT,
  ROOT_FONT_SIZE_MAX,
  ROOT_FONT_SIZE_MIN,
  useRootFontSize,
} from "../../hooks/useRootFontSize";

const TYPOGRAPHY_LEVELS = [
  "display",
  "headline1",
  "headline2",
  "title",
  "subtitle",
  "text",
  "caption",
] as const;

const TOKEN_PROBE_VARS = [
  "--size-regular",
  "--line-height-regular",
  "--typography-text-size",
  "--icon-size-text",
  "--gap-inside",
  "--padding-default",
  "--border-radius-small",
] as const;

type ProbeMap = Record<(typeof TOKEN_PROBE_VARS)[number], string>;

function readProbes(): ProbeMap {
  const styles = getComputedStyle(document.documentElement);
  const out = {} as ProbeMap;
  for (const name of TOKEN_PROBE_VARS) {
    out[name] = styles.getPropertyValue(name).trim() || "—";
  }
  return out;
}

function RemScaleControls() {
  const { rootFontSize, setRootFontSize, resetRootFontSize, isDefault } =
    useRootFontSize();

  return (
    <div className="docs-rem-scale-controls docs-demo-surface">
      <Stack gap="component">
        <Typography level="subtitle" as="h2">
          根字号 html font-size
        </Typography>
        <Typography level="caption" as="p" className="docs-page-description">
          rem 字号 / 行高 / 图标尺寸跟根字号缩放；gap、padding、radius 保持 px。
        </Typography>

        <label className="docs-rem-scale-slider">
          <span className="docs-rem-scale-slider-label">
            <Typography level="caption" as="span">
              {rootFontSize}px
            </Typography>
            <Typography level="caption" as="span" className="text-muted-foreground">
              {isDefault ? "浏览器默认" : `相对默认 ${(rootFontSize / ROOT_FONT_SIZE_DEFAULT).toFixed(2)}×`}
            </Typography>
          </span>
          <input
            type="range"
            min={ROOT_FONT_SIZE_MIN}
            max={ROOT_FONT_SIZE_MAX}
            step={1}
            value={rootFontSize}
            onChange={(e) => setRootFontSize(Number(e.target.value))}
            aria-label="Root font size in pixels"
          />
        </label>

        <div className="docs-theme-toolbar-group">
          {[12, 14, 16, 18, 20, 24].map((px) => (
            <Button
              key={px}
              size="small"
              mode={rootFontSize === px ? "primary" : "second"}
              onClick={() => setRootFontSize(px)}
            >
              {px}px
            </Button>
          ))}
          <Button size="small" mode="second" onClick={resetRootFontSize} disabled={isDefault}>
            重置
          </Button>
        </div>
      </Stack>
    </div>
  );
}

function TokenProbeTable({ probes }: { probes: ProbeMap }) {
  return (
    <div className="docs-rem-scale-probes docs-demo-surface">
      <Typography level="subtitle" as="h2">
        计算值探针
      </Typography>
      <table className="docs-rem-scale-table">
        <thead>
          <tr>
            <th>
              <Typography level="caption" as="span">
                Token
              </Typography>
            </th>
            <th>
              <Typography level="caption" as="span">
                Computed
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {TOKEN_PROBE_VARS.map((name) => (
            <tr key={name}>
              <td>
                <code>{name}</code>
              </td>
              <td>
                <code>{probes[name]}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RemScalePage() {
  const { rootFontSize } = useRootFontSize();
  const [probes, setProbes] = useState<ProbeMap>(() => readProbes());

  useEffect(() => {
    setProbes(readProbes());
  }, [rootFontSize]);

  return (
    <>
      <DocPageHeader
        title="Rem 字号调试"
        description="调节 html 根字号，观察 size / line-height 体系与组件如何同步缩放。"
      />

      <div className="docs-rem-scale">
        <RemScaleControls />
        <TokenProbeTable probes={probes} />

        <section className="docs-rem-scale-panel docs-demo-surface">
          <Typography level="subtitle" as="h2">
            Typography
          </Typography>
          <Stack gap="component">
            {TYPOGRAPHY_LEVELS.map((level) => (
              <Typography key={level} level={level} as="p">
                {level} — The quick brown fox
              </Typography>
            ))}
          </Stack>
        </section>

        <section className="docs-rem-scale-panel docs-demo-surface">
          <Typography level="subtitle" as="h2">
            使用同一套尺寸的组件
          </Typography>
          <Stack gap="content">
            <Stack direction="row" gap="component" className="docs-rem-scale-row">
              <Button size="tiny" leftIcon={<GeneralSetting />}>
                Tiny
              </Button>
              <Button size="small" leftIcon={<GeneralSetting />}>
                Small
              </Button>
              <Button size="regular" leftIcon={<GeneralSetting />}>
                Regular
              </Button>
              <Button size="big" leftIcon={<GeneralSetting />}>
                Big
              </Button>
            </Stack>

            <Stack direction="row" gap="component" className="docs-rem-scale-row">
              <Input placeholder="Input regular" size="regular" leftIcon={<GeneralSetting />} />
              <Input placeholder="Input big" size="big" leftIcon={<GeneralSetting />} />
            </Stack>

            <Stack direction="row" gap="component" className="docs-rem-scale-row">
              <Avatar level="display" content="text">
                AD
              </Avatar>
              <Avatar level="headline1" content="text">
                H1
              </Avatar>
              <Avatar level="title" content="icon" icon={<UsersUserCircle />} />
              <Avatar level="text" content="text">
                Tx
              </Avatar>
              <Badge level="caption" leftIcon={<GeneralSetting />}>
                Caption
              </Badge>
              <Badge level="text" leftIcon={<GeneralSetting />}>
                Text
              </Badge>
              <Tag level="caption" leftIcon={<GeneralSetting />}>
                Tag caption
              </Tag>
              <Tag level="text" leftIcon={<GeneralSetting />}>
                Tag text
              </Tag>
            </Stack>
          </Stack>
        </section>

        <section className="docs-rem-scale-panel docs-demo-surface">
          <Typography level="subtitle" as="h2">
            px 间距对照
          </Typography>
          <Typography level="caption" as="p" className="docs-page-description">
            下方色块间距来自 <code>--gap-*</code>（px），放大根字号时色块之间的缝隙不应跟着变宽；文字与图标会变大。
          </Typography>
          <div className="docs-rem-scale-gap-demo">
            <span className="docs-rem-scale-gap-chip">
              <Typography level="text" as="span">
                gap-inside
              </Typography>
            </span>
            <span className="docs-rem-scale-gap-chip">
              <Typography level="text" as="span">
                4px
              </Typography>
            </span>
            <span className="docs-rem-scale-gap-chip">
              <Typography level="text" as="span">
                stays
              </Typography>
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
