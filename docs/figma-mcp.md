# Figma MCP & API

Spiral 2 reads design specs from three Figma files. Configure locally (never commit tokens).

## Environment

Copy `.env.example` → `.env.local` and set:

```bash
FIGMA_ACCESS_TOKEN=your_token_here
```

## Figma files

| Resource | File Key |
|---|---|
| Colour For Design | `RbhKI6PNBWXMUmFijJ6Zuz` |
| Components | `aykyMmGyzVPkAsf8oRBZg0` |
| Icons | `kLrxJHsDob2VoX7PfkD5PW` |

## Cursor MCP

Add a Figma MCP server in Cursor settings pointing at `FIGMA_ACCESS_TOKEN`.

## CLI export

```bash
FIGMA_ACCESS_TOKEN=... node scripts/figma-export/export-icons.mjs
pnpm icons:build
```
