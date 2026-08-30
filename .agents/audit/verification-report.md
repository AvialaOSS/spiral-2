# Spiral 2 Audit — 50-Item Verification Report

Condensed record of the item-by-item verification of a 50-point repository audit.

- **Baseline**: `main` @ `251de1d` (2026-08-30)
- **Outcome**: **42 true · 7 partial · 1 false**
- **Canonical detail**: `fix-plan.md` in this folder holds the full evidence and step-by-step remediation for every item. This file is the index you read first.

## How to read this

- **Verdict** — `true`: the finding reproduces as stated. `partial`: the underlying problem is real but the audit's framing, count, or severity was off. `false`: does not reproduce.
- **Evidence** — file plus line where the finding was confirmed. **Line numbers are from the baseline commit and drift with later work** — anchor on the file and symbol name, then re-locate.
- **Wave** — remediation batch. `—` means the item is on the won't-fix list at the bottom.
- Item titles are condensed restatements, grouped where one wave task covers several related sites. Where a row covers a group, the evidence column lists every confirmed site.

## Packaging and build (Wave 4a / 4b)

| # | Verdict | Finding | Evidence | Wave |
|---|---|---|---|---|
| 1 | true | `react-hook-form` imported at the top level of a module reachable from the main entry; RHF is a non-optional peer, tsup externalizes it, so `dist/index.js` ships a dangling import and any consumer without RHF crashes on importing the library | `form-field.tsx:13-23`; `packages/ui/package.json:63`; `src/index.ts:157-165`; `dist/index.js:1205-1208` | 4a |
| 2 | partial | tsup `external` list is incomplete — externalization currently works via tsup's implicit peer/dep handling, so nothing is broken today, but the config does not state the contract and silently changes behavior when deps move | `packages/ui/tsup.config.ts:8` (external omits RHF) | 4a |
| 3 | true | Slider depends on three `@radix-ui/react-slider` `unstable_*` APIs while the version range is a caret, so a patch bump can break it silently | `packages/ui/package.json:51` (`^1.4.4`); `slider.tsx:1`, `:109-126` (`unstable_ThumbProvider` / `unstable_ThumbTrigger` / `unstable_BubbleInput`) | 4b |
| 4 | true | Icons story imports and renders the entire 354-icon catalog eagerly, producing a 3.5 MB chunk (862 KB gzip) in the Storybook build | `icons.stories.tsx:1-10`, `:35`; `apps/docs/storybook-static/assets/icons.stories-*.js` = 3,521,321 B | 4b |

## Figma placeholder defaults leaking into the API (Wave 2)

Shared root cause: Figma artboard placeholder text (`"Text"`, `"Title"`, `"A"`) was implemented as component default values, so omitting a prop renders placeholder copy in production.

| # | Verdict | Finding | Evidence | Wave |
|---|---|---|---|---|
| 5 | true | `Typeface` renders the literal string `"Text"` once per layout slot when it has no children | `typeface.tsx:128-129` | 2 |
| 6 | true | Cascader options menu hardcodes a `"Title"` group header; `CascaderItemGroup` already omits the header when `label` is falsy, but the menu gives it no way to pass one | `cascader.tsx:1005`, `:857` (`CascaderOptionsMenu` props), `:652-672` (`CascaderItemGroup`) | 2 |
| 7 | true | `showBadge` with no `badge` value renders a badge reading `"Text"` via `badge ?? "Text"` | `cascader.tsx:814`; `select.tsx:921`, `:1133` | 2 |
| 8 | true | Omitted `moreAction` still renders a `<Link>Text</Link>` footer | `select.tsx:927-933`, `:1137-1143` | 2 |
| 9 | true | `actionLabel` defaults to `"Text"`, so the action button renders unlabeled-but-visible when the consumer wanted no action at all | `card.tsx:75`, `:193` (defaults), `:90-95`, `:208-213` (render); `list.tsx:216`, `:243-248` | 2 |
| 10 | true | Table renders `"Text"` badges and `"A"` avatars as fallbacks | `table.tsx:270-273` (`badgeLabel ?? "Text"`), `:236-239`, `:254-257` (`<Avatar>A</Avatar>`) | 2 |
| 11 | true | Story fixtures propagate the placeholders: 8 × `placeholder="Text"`, 9 × `label="Title"` | `select.stories.tsx:85,109,132` + `:48,52,91,95`; `cascader.stories.tsx:169,257,286` + `:177,188,195,205,225`; `list.stories.tsx:34`; `input.stories.tsx:42`; `segmentator.stories.tsx:80-81` | 2 |

## Class-name / CSS drift and hardcoded colors (Wave 3)

Verified by diffing `aviala-*` classes emitted from TSX (530 total) against every selector in the tokens CSS: **21 classes had no CSS anywhere**. These are semantic shells, so remediation removes the emission rather than inventing styles.

| # | Verdict | Finding | Evidence | Wave |
|---|---|---|---|---|
| 12 | partial | Link's class contract is broken in **both** directions, not just one: the component emits `aviala-link__label` which has no CSS, while the CSS defines `.aviala-link--caption` / `.aviala-link--text` which the component never emits | `link.tsx:131`; `packages/tokens/src/semantic/basic-input-effects.css:178-179` | 3 |
| 13 | true | Ghost `--size-default` modifier classes on four components | `progress.tsx:19`; `scroll.tsx:12`; `breadcrumb.tsx:37`; `modal.tsx:30` | 3 |
| 14 | true | Ghost `aviala-tag--content-text` | `tag.tsx:30` | 3 |
| 15 | true | Ghost slider modifiers `--size-default`, `--type-default`, `--type-range` (`--size-big` does have CSS and stays) | `slider.tsx:23,27,28` | 3 |
| 16 | true | Ghost avatar content modifiers `--content-text` / `--content-picture` / `--content-icon` | `avatar.tsx:36-38` | 3 |
| 17 | true | Ghost pagination ellipsis classes `__page--ellipsis`, `__ellipsis-content`, `__ellipsis-page` (`__ellipsis-menu` is styled and stays) | `pagination.tsx:173,183,192`; cf. `:184` | 3 |
| 18 | true | Ghost `aviala-loading--mode-*` (5 variants — color is actually driven by an inline conic-gradient) and ghost `aviala-config-provider` | `loading.tsx:30-34`, cf. `:63-79`, `:124`; `config/config-provider.tsx:69` | 3 |
| 19 | true | Hardcoded `#343333` as a CSS-variable fallback | `input.tsx:125`; `number-input.tsx:231` (`text-[var(--input-fg,#343333)]`) | 3 |
| 20 | true | Hardcoded `stroke="#fff"` inside the loading SVG mask | `loading.tsx:120` | 3 |
| 21 | true | Brand primary `#FF5532` duplicated at three sites in one module | `theme/theme-provider.tsx:74,80,255` | 3 |
| 22 | partial | Inline-SVG count understated — actual scope is **6 files / 9 occurrences**, one more than the audit reported. All 9 are legitimate exemptions (geometry-coupled graphics), so this is a documentation task, not a code fix | `checkbox-check-icon.tsx:14`; `loading.tsx:117`; `overlay-pointer.tsx:38`; `progress.tsx:116`; `tab.tsx:201`; `video/video-animated-icon-markup.ts:3-6` (4 occurrences) | 3 |
| 23 | true | Hardcoded colors in stories, plus a dynamic `rgba()` in the color picker that is genuinely required | `tab.stories.tsx:95,124`; `typography.stories.tsx:75`; `color-picker.stories.tsx:22,67,79,111`; `color-picker/color-picker-slider.tsx:60` | 3 |

## Accessibility (Wave 5)

| # | Verdict | Finding | Evidence | Wave |
|---|---|---|---|---|
| 24 | true | `role="application"` on picker panel roots suppresses the AT's own navigation without the components providing a replacement keyboard model | `date-picker/date-picker.tsx:1338-1341`; `time-picker/time-picker.tsx:261-264` (only 2 sites repo-wide) | 5 |
| 25 | true | Segmentator claims `role="radiogroup"` with `aria-checked`, but every native button stays in the tab order and there are no arrow-key semantics — no roving tabindex | `segmentator.tsx:865`, `:929`, `:932-933` | 5 |
| 26 | true | VideoSpeed exposes `listbox`/`option` roles with no arrow-key handling and no `aria-activedescendant` | `video/video-speed.tsx:51-54`, `:62-63` | 5 |
| 27 | true | Non-`href` List rows are click-only `div`s — no `tabIndex`, no keydown, unreachable by keyboard; `interactive` only sets a data attribute | `list.tsx:354-362`, cf. `:336-351` (`href` branch renders `<a>`), `:239`, `:313` | 5 |
| 28 | true | ScrollPicker calls `preventDefault()` unconditionally as the first statement with `{passive:false}`, so a non-looping column swallows page scroll even at its end stop | `scroll-picker.tsx:318-320`, `:360-361`, `:377`; `loop` defaults true at `:104` | 5 |
| 29 | true | `ref as never` casts defeat ref typing in the three polymorphic components | `anchor.tsx:20`; `navigation.tsx:739`; `typography.tsx:63` (exactly 3 repo-wide) | 5 |
| 30 | true | Menus handle activation and expansion keys but not item-to-item movement (no ↑/↓, Home/End) | `cascader.tsx:758-770`; `select.tsx:1090-1103`, `:279-296` | 5 |

## Tooling, hygiene, and dead code (Waves 0 / 1 / 8)

| # | Verdict | Finding | Evidence | Wave |
|---|---|---|---|---|
| 31 | true | No ESLint config or dependency anywhere in the repo; the dead-code findings below are its symptoms | repo-wide: no `eslint*` config, no `eslint` dep | 1 (symptoms) / 8 (root fix) |
| 32 | true | No Prettier or any formatter; style drift is unchecked | repo-wide: no `prettier` config or dep | 1 (symptoms) / 8 (root fix) |
| 33 | true | Repo root accumulates untracked scratch state that no `.gitignore` rule or cleanup step covers | repo root | 0 |
| 34 | true | Agent-config sprawl: three parallel skill directories with overlapping content and drift risk, plus a generated wiki committed alongside | `skills/`, `.cursor/skills/`, `.qoder/skills/` (6 SKILL.md each) | 6 |
| 35 | partial | Non-semantic commit messages are real, but both offenders are history that will not be rewritten — actionable only as a forward-looking convention | `8a669fb`, `7c18293` (`Skill maintain`) | 6 (convention only) |
| 36 | true | 11 empty `_tmp_*` scratch directories at repo root | `_tmp_12040_*` … `_tmp_39168_*` (gitignored) | 0 |
| 37 | true | Orphan `apps/admin-demo` containing only `node_modules` | `apps/admin-demo` (untracked) | 0 |
| 38 | true | Stray tracked test script at repo root | `test-segmentator-animation.mjs` (2,257 B, tracked) | 0 |
| 39 | partial | Mostly does not reproduce: a near-empty `.pnpm-store` is normal pnpm behavior, and sampled junctions all resolved correctly — no dangling links found | `.pnpm-store`; junction sampling | — |
| 40 | true | Mojibake in the published package description — a literal `?` where an em dash belongs | `packages/ui/package.json:4` | 0 |
| 41 | true | `.env.example` leaks a developer's absolute local path | `.env.example:18` (`ALD_PATH=C:/Users/…/ALD`) | 0 |
| 42 | true | README mixes languages mid-document and has no environment-setup section (Node version, pnpm pinning, required tokens) | `README.md:45-59` | 0 |
| 47 | true | Stale `eslint-disable` directive with no linter in the repo to consume it | `video/video-animated-icon.tsx:128` | 1 |
| 48 | true | Dead code the absent linter would have caught: an `if` whose body equals its fallback, and a ternary with identical branches | `badge.tsx:55-60`; `list.tsx:115-121`, cf. `:114` | 1 |

## Structural and refactor findings (Wave 7)

| # | Verdict | Finding | Evidence | Wave |
|---|---|---|---|---|
| 43 | true | Close-suppression logic (`windowBlurCloseRef` / `pointerDownCloseRef` + listeners + guard) is duplicated near-verbatim at four sites, with a subtle inconsistency: not every copy has the `disabled` guard | `select.tsx:531-536` (guard `:551`); `cascader.tsx:303-308` (`:349`); `date-picker/date-picker.tsx:231-236` (`:266`); `time-picker/time-picker.tsx:76-81` (`:100`) | 7 |
| 44 | true | A single 97 KB TypeScript module holds animation markup for four icons, injected via `innerHTML` with `__UID__` templating | `video/video-animated-icon-markup.ts` (97,837 B, `__UID__` × 96); injection at `video/video-animated-icon.tsx:68-71` | 7 |
| 45 | true | Two parallel changelog systems (hand-written per-component files and Changesets) with no cross-check, glued together only inside the build script | `packages/ui/changelogs/` (26 files); `scripts/aggregate-changelogs.mjs:12-18`; `packages/ui/package.json:33`; `.changeset/` | 7 |
| 46 | partial | Not a defect: the docs site living outside this repo is a deliberate release→dispatch→scaffold architecture, not an oversight. Recorded as an optional improvement (a canary docs channel), not a fix | `apps/docs` publishing flow | — |
| 50 | partial | The anti-FOUC theme script does interpolate four values into `dangerouslySetInnerHTML` without escaping, but all four are developer-supplied props rather than end-user input — a hardening task, not an exploitable XSS | `theme/theme-provider.tsx:263-275`, `:276` | 7 |

## The one false finding

| # | Verdict | Finding | Why it does not reproduce |
|---|---|---|---|
| 49 | **false** | Claimed that Cascader pushes leaf nodes into `activePath`, so leaves would be treated as expandable | A `hasChildren` guard is already present on every path into `activePath`: `cascader.tsx:789-792` (guard), `:734` (`hasChildren` definition), `:766` (keyboard path), `:384-396` (`selectPath`). Leaves never enter `activePath`. |

## Won't fix

| # | Verdict | Decision | Reason |
|---|---|---|---|
| 49 | false | No change | Does not reproduce — the guard the audit says is missing is already there (`cascader.tsx:789-792`). |
| 39 | partial | No change | `.pnpm-store` being near-empty is normal pnpm content-addressing, and junction sampling found no dangling links. Nothing to repair. |
| 46 | partial | Record only | Moving the docs site out of this repo is an architectural trade-off (release → dispatch → docs scaffold PR), not a bug. Optional follow-up noted: a canary docs channel. |
| 35 | partial | No history rewrite | The two non-semantic commits (`8a669fb`, `7c18293`) are already published history. Rewriting shared history costs more than it fixes; constrained going forward by the commit conventions in the root `AGENTS.md`. |

## Re-running the checks

The two drift checks that back items #12–#23 are documented as copy-pasteable commands under **Class ↔ CSS cross-check** in the root `AGENTS.md`, including the known-clean baseline for each. Run them after any change to class names or semantic CSS.
