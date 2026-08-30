# `.agents/audit/` — Repository audit record

Durable record of a 50-item repository audit and its remediation plan, kept for agents and maintainers working on Spiral 2.

| File                     | What it is                                                                                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verification-report.md` | The 50 findings with a verdict and evidence pointer each. **Start here.**                                                                                       |
| `fix-plan.md`            | Archived remediation plan (Chinese) — per-wave task cards with exact file:line locations and acceptance criteria. The canonical detail behind every report row. |

**Baseline**: `main` @ `251de1d` (2026-08-30) · **Outcome**: 42 true · 7 partial · 1 false (#49)

Line numbers in both files are from the baseline commit and drift as work lands. Anchor on file plus symbol name, then re-locate.

## Waves → items

Each wave is one branch and one PR, sequenced so a wave lands before the next opens. Items appear exactly once except #31/#32, whose symptoms are cleaned in Wave 1 and whose root cause is fixed in Wave 8.

| Wave | Theme                                                     | Items                       | Risk                             | Changelog + changeset |
| ---- | --------------------------------------------------------- | --------------------------- | -------------------------------- | --------------------- |
| 0    | `chore: hygiene cleanup`                                  | #33 #36 #37 #38 #40 #41 #42 | none                             | no                    |
| 1    | `fix(ui): remove dead code`                               | #31 #32 #47 #48             | none (no behavior change)        | no                    |
| 2    | `fix(ui): remove placeholder defaults`                    | #5–#11                      | medium (visible behavior change) | **yes** (minor)       |
| 3    | `fix(ui): class and token hygiene`                        | #12–#23                     | low (target: zero visual change) | tokens side           |
| 4a   | `fix(ui)!: move form components to subpath export`        | #1 #2                       | **high (breaking)**              | **yes** (major)       |
| 4b   | `fix(ui): pin slider radix version and split icons story` | #3 #4                       | low                              | no                    |
| 5    | `fix(ui): a11y improvements`                              | #24–#30                     | medium                           | **yes** (minor)       |
| 6    | `chore: agent-friendliness`                               | #34 #35 (as convention)     | low                              | no                    |
| 7    | `refactor(ui): shared logic and asset splits`             | #43 #44 #45 #50             | medium (deferrable as a whole)   | if behavior changes   |
| 8    | `chore: add lint and format tooling`                      | #31 #32 (root cause)        | medium (large diff)              | no                    |

**Won't fix**: #49 (false), #39 (mostly does not reproduce), #46 (architectural trade-off, recorded only), #35 (no history rewrite; constrained forward by convention). Rationale for each is in the report's won't-fix table.

## Status (as of Wave 6)

Read this as a starting point, not truth — check the branches and PRs for the current state.

| Wave           | Status                                             |
| -------------- | -------------------------------------------------- |
| 0              | merged to `main`                                   |
| 1              | open on `fix/audit-wave-1`                         |
| 3              | open on `fix/audit-wave-3` (Wave 6 is based on it) |
| 4b             | open on `fix/audit-wave-4b`                        |
| 6              | this change, on `chore/audit-wave-6`               |
| 2, 4a, 5, 7, 8 | not started                                        |

## Working rules carried over from the plan

1. Touch only the files listed for your wave. Findings outside your wave go in the PR description, not into your diff.
2. Follow the root `AGENTS.md` — tokens-only styling, catalog-only icons (see the closed inline-SVG exemption list), Radix + `cn()` + `cva`, English comments and semantic commit scopes.
3. User-visible waves (2, 4a, 5) need both a `packages/ui/changelogs/{DisplayName}.md` entry and a changeset. See `skills/spiral-changelog/SKILL.md`.
4. Verify every step with `pnpm typecheck` and `pnpm --filter @aviala-design/spiral build`; inspect UI changes in the playground.
5. Do not rewrite git history, modify `.changeset/config.json`, bump Radix or React majors, or add dependencies outside your wave's scope.

The class-name↔CSS and hardcoded-color checks that back Wave 3 are documented as copy-pasteable commands, with their known-clean baselines, under **Class ↔ CSS cross-check** in the root `AGENTS.md`.
