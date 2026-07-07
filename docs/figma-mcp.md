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

## Icons file structure

Icons are stored as **Figma component sets**:

- Set name: `direction/arrowLeft` → export folder `raw/direction/`
- Variant name (property order varies): `thickness=Regular, mode=default, name=direction_arrowLeft`
- Exported file: `raw/direction/direction_arrowLeft-regular-default.svg`

Supported `thickness` values: `Light`, `Regular`, `Medium`, `Bold`.

Canvas frame names (e.g. `direction_arrowLeft-default&Light`) are layout only — not used for export.

## Icons export workflow

```bash

pnpm icons:export              # all variants → raw/{category}/

pnpm icons:export:dry          # preview export plan

pnpm icons:build               # SVGR → React components

pnpm icons:sync                # export + build @aviala/icons



# Optional filters (CLI or .env.local):

pnpm icons:export -- --thickness=Regular --mode=default

ICONS_THICKNESS=Regular,Bold ICONS_MODE=default pnpm icons:export

```

After export, see `packages/icons/raw/manifest.json` for the full variant list.

## Cursor MCP

Add a Figma MCP server in Cursor settings pointing at `FIGMA_ACCESS_TOKEN`.