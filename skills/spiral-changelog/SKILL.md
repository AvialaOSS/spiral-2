---
name: spiral-changelog
description: >-
  Writes Spiral component changelogs under packages/ui/changelogs with Chinese
  bullets and English section titles, pairs them with changesets, and keeps
  Unreleased headings for version:packages stamping. Use when editing
  changelogs/*.md, making user-visible UI changes, updating
  component-changelogs.json, or mentioning Unreleased / changeset / changelog.
---

# Spiral Component Changelog

## When

- User-visible changes in `packages/ui`
- Edits under `packages/ui/changelogs/`
- Anything that should appear on the docs site via `component-changelogs.json`

Also follow `skills/spiral-component` for component layout and exports.

## Rules

1. File: `packages/ui/changelogs/{DisplayName}.md` — `DisplayName` matches docs nav / export (`Button`, `SegmentatorGroup`, `CascaderField`, …).
2. Write only under `## [Unreleased]`. Do **not** hand-fill the next semver; `pnpm run version:packages` stamps Unreleased after `changeset version`.
3. Section titles (English): `Added` / `Changed` / `Fixed` / `Removed` / `Deprecated`.
4. Bullet body: **Chinese**. Keep API names, identifiers, and enum values in English.
5. For publishable packages, add a changeset (`pnpm changeset`) in the same change set.
6. Build emits `dist/component-changelogs.json` (`@aviala-design/spiral/component-changelogs.json`) for avialaWebsite docs scaffold.

## Template

```md
# Button

## [Unreleased]

### Added
- …

## 2.1.0
…
```

Legacy `## Unreleased` (no brackets) is still stamped for compatibility; prefer `## [Unreleased]`.

## Forbidden

- Inventing a version heading like `## 2.7.0` before release
- English-only changelog bullets for user-facing notes
- Changelog without a changeset when the package should publish

## Verify

After writing or editing a changelog entry:

1. Confirm `packages/ui/changelogs/{DisplayName}.md` has `## [Unreleased]` as the first version heading.
2. Confirm section titles are English (`Added` / `Changed` / `Fixed` / `Removed` / `Deprecated`) and bullet body is Chinese with English identifiers.
3. Run `pnpm --filter @aviala-design/spiral build` — build must succeed and emit `dist/component-changelogs.json`.
4. Confirm a matching changeset exists (`.changeset/*.md`) if the change is publishable.
