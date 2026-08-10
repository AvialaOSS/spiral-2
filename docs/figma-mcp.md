# Figma MCP & API

Spiral 2 reads design specs from three Figma files. Configure locally (never commit tokens).

## Environment

Copy `.env.example` → `.env.local` and set:

```bash
FIGMA_ACCESS_TOKEN=your_token_here
```

CLI scripts load `.env.local` automatically from the repo root.

## Figma files

| Resource | File Key |
|---|---|
| Colour For Design | `RbhKI6PNBWXMUmFijJ6Zuz` |
| Components | `aykyMmGyzVPkAsf8oRBZg0` |
| Icons | `kLrxJHsDob2VoX7PfkD5PW` |

## Icons sync source

`pnpm icons:export` discovers icons from the **published library catalog** of the Icons file (`GET /v1/files/{key}/components` + `component_sets`), then renders SVGs from the **live file** (`/images`).

- New or renamed component sets appear in sync only after **Publish library** in Figma.
- Unpublished local-only components are not listed.
- SVG geometry reflects the current file for the published node ids.

## Icons file structure

Icons are stored as **Figma component sets**:

- Set name: `direction/arrowLeft` → export folder `raw/direction/`
- Variant name (property order varies): `thickness=Regular, mode=default, name=direction_arrowLeft`
- Exported file: `raw/direction/direction_arrowLeft-regular-default.svg`

Supported `thickness` values: `Light`, `Regular`, `Medium`, `Bold`, `Black`.

Canvas frame names (e.g. `direction_arrowLeft-default&Light`) are layout only — not used for export.

## Icons export workflow

```bash
pnpm icons:export              # stage → promote into raw/{category}/
pnpm icons:export:dry          # preview export plan
pnpm icons:build               # SVGR → React components
pnpm icons:sync                # export + build @aviala-design/icons

# Optional filters (CLI or .env.local):
pnpm icons:export -- --thickness=Regular --mode=default
ICONS_THICKNESS=Regular,Bold ICONS_MODE=default pnpm icons:export
```

Export writes to `packages/icons/raw/.staging/` first. Promote into `raw/` only after success, or after you choose skip in the interactive prompt. Abort / rate-limit exhaustion leave the previous `raw/` unchanged.

| Situation | Local TTY | CI / `--non-interactive` |
|---|---|---|
| Null SVG URL / download error | Prompt retry / skip / abort | `exit 1`, no promote |
| 429 retries exhausted | Hard fail, no promote | Hard fail, no promote |

After export, see `packages/icons/raw/manifest.json` (includes `skipped` when you chose skip).

## Cursor MCP

Add a Figma MCP server in Cursor settings pointing at `FIGMA_ACCESS_TOKEN`.
