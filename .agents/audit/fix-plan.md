# Spiral 2 审计修复任务书（归档件 / archived reference）

> **状态：归档。** 本文件原为一次性任务交付稿，现作为审计记录长期保留在 `.agents/audit/`，供后续 Agent 复用背景与证据定位。**不要**把它当成待办清单——各 wave 的实际落地状态见 `README.md`。
>
> 背景：对仓库 50 条审计结论完成逐条核验，结果为 **42 条属实、7 条部分属实、1 条不实（#49）**。本任务书覆盖所有属实/部分属实项，按 8 个批次（wave）组织，**每批一个独立 PR，前一批合并后再开下一批**，可独立验证、独立回滚。
>
> 核验基准：`main` @ `251de1d`（2026-08-30）。所有定位均精确到 文件:行号；行号会随后续提交漂移，请以文件与符号名为准。
>
> **已知偏差（归档时修订）**：本文写作时假设技能目录为 `.agents/skills/`、`.qoder/` 追踪 19 个文件（含 `repowiki/`）。实际仓库在此期间已重构：技能源目录是根 `skills/`，`.cursor/skills/` 为重定向壳；`.qoder/` 仅剩 6 个重定向壳，`repowiki/` 早已不在版本控制中。Wave 6 据实执行：`.qoder/` 整目录移出版本控制并加入 `.gitignore`。下文出现的 `.agents/skills/` 一律已订正为 `skills/`。

---

## 0. 全局约定（每个 Agent 开工前必读）

1. **只改任务清单内的文件**。发现清单外问题时记录到 PR 描述，不要顺手改。
2. **遵循仓库根 `AGENTS.md`**：
   - 样式只用 `@aviala-design/tokens` 的 CSS 变量，**禁止硬编码 hex/rgb**；
   - 图标只用 `@aviala-design/icons`，禁止 `lucide-react` 与内联 SVG（豁免清单见 Wave 3 #22）；
   - 组件基于 Radix 原语 + shadcn 模式，类合并用 `src/lib/utils` 的 `cn()`，变体用 `class-variance-authority`；
   - 注释与 commit message 一律英文；scope 用 `fix(ui)` / `fix(tokens)` / `fix(playground)` / `chore` / `docs`。
3. **用户可见的行为变更**（Wave 2、Wave 4a、Wave 5）必须：
   - 在 `packages/ui/changelogs/{DisplayName}.md` 追加条目（**中文 bullet + 英文 section 标题**，保持 Unreleased 结构）；
   - 在 `.changeset/` 添加对应 changeset（`pnpm changeset`）；
   - 细节遵循 `skills/spiral-changelog/SKILL.md`。
4. **每步验证**：`pnpm typecheck` + `pnpm --filter @aviala-design/spiral build`；涉及 UI 行为的改动，开 `pnpm --filter @spiral/playground dev` 目测。
5. **不要做的事**：不重写 git 历史、不动 `.changeset/config.json`、不升级 Radix/React 主版本、不在本任务书范围外引入新依赖。

---

## 1. 批次总览

| Wave | PR 标题（建议）                                           | 覆盖条目                    | 风险                    | 需要 changelog/changeset |
| ---- | --------------------------------------------------------- | --------------------------- | ----------------------- | ------------------------ |
| 0    | `chore: hygiene cleanup`                                  | #33 #36 #37 #38 #40 #41 #42 | 零                      | 否                       |
| 1    | `fix(ui): remove dead code`                               | #31 #32 #47 #48             | 零（无行为变化）        | 否                       |
| 2    | `fix(ui): remove placeholder defaults`                    | #5–#11                      | 中（可见行为变化）      | **是**                   |
| 3    | `fix(ui): class and token hygiene`                        | #12–#23                     | 低（目标零视觉变化）    | 建议（tokens 侧）        |
| 4a   | `fix(ui)!: move form components to subpath export`        | #1 #2                       | **高（破坏性，major）** | **是（major）**          |
| 4b   | `fix(ui): pin slider radix version and split icons story` | #3 #4                       | 低                      | 否                       |
| 5    | `fix(ui): a11y improvements`                              | #24–#30                     | 中                      | **是**                   |
| 6    | `chore: agent-friendliness`                               | #34 #35（约定）             | 低                      | 否                       |
| 7    | `refactor(ui): shared logic and asset splits`             | #43 #44 #45 #50             | 中（可整体推迟）        | 视行为变化               |
| 8    | `chore: add lint and format tooling`                      | #31 #32 根治                | 中（大 diff）           | 否                       |

**不修清单**：#49（不实，`cascader.tsx:789-792` 已有 `hasChildren` 守卫）、#39（悬空 junction 不成立）、#46（文档站架构权衡，仅记录）。

---

## 2. 各批次任务卡

### Wave 0 — 零风险清理 `chore: hygiene cleanup`

| #   | 任务                       | 定位                                                                 | 步骤                                                                                                                                                                  |
| --- | -------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0-1 | 删 11 个空 `_tmp_*` 目录   | 仓库根 `_tmp_12040_*` … `_tmp_39168_*`（已 gitignore）               | 直接 `rm -rf`                                                                                                                                                         |
| 0-2 | 删孤儿目录                 | `apps/admin-demo`（仅含 node_modules，未追踪）                       | 直接 `rm -rf`                                                                                                                                                         |
| 0-3 | 删散落临时脚本             | `test-segmentator-animation.mjs`（2,257 B，**已追踪**）              | `git rm test-segmentator-animation.mjs`                                                                                                                               |
| 0-4 | 修正 description 乱码字符  | `packages/ui/package.json:4` `"Spiral 2 ? Aviala…"`（0x3F 字面问号） | 改为 `"Spiral 2 — Aviala Design React component library"`（UTF-8 em-dash）                                                                                            |
| 0-5 | .env.example 去本机指纹    | `.env.example:18` `ALD_PATH=C:/Users/kailunlark/Documents/ALD`       | 改为 `ALD_PATH=../ald-tokens` 并加注释说明"指向本地 ALD token 源（仅图标/令牌同步脚本需要）"                                                                          |
| 0-6 | README 语言统一 + 环境说明 | `README.md:45-59`（"公开文档站"整节中文）；无环境搭建说明            | 该节补英文对照；新增 "Environment" 小节：Node >= 20、`corepack enable` 或全局安装 `pnpm@9.15.4`（仓库 `packageManager` 锁定）、`.env.local` 需要 `FIGMA_ACCESS_TOKEN` |

**验收**：`git status` 只剩预期变更；`pnpm build` 通过。

---

### Wave 1 — 死代码与小重构 `fix(ui): remove dead code`（无行为变化）

| #   | 任务               | 定位                                                                                                                             | 步骤                                                         |
| --- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1-1 | 删死分支           | `badge.tsx:55-60` `resolveLineHeightFix`：`:57-59` 的 if 与 `:60` 兜底返回同一表达式                                             | 删 if，只留 `return level === "text" ? "subtitle" : "text";` |
| 1-2 | 删同值三元         | `list.tsx:115-121` `renderLeadingIcon`：两分支同为 `<GeneralSetting aria-hidden />`，真正差异是 `:114` 的 `iconSize`（20 vs 22） | 保留 iconSize 三元，图标直接写一份                           |
| 1-3 | 删无效 linter 咒语 | `video/video-animated-icon.tsx:128` `// eslint-disable-next-line react-hooks/exhaustive-deps`                                    | 删除该行（仓库当前无 linter；Wave 8 引入后再评估是否需要）   |
| 1-4 | 重排异常格式       | `navigation.tsx` 全文件（`:1-34` imports、`:55-65` type 成员、`:67-69`、`:72-80` 逐句空行）                                      | 去除多余空行，对齐全库风格；**纯格式变更，逻辑零改动**       |

**验收**：`pnpm typecheck` + build；Storybook 打开 Badge / List / Video / Navigation 故事目测无变化。

---

### Wave 2 — 占位符清除 `fix(ui): remove placeholder defaults`（⚠️ 有可见行为变化）

> 诱因统一：Figma 画板占位文本（"Text" / "Title" / "A"）被实现为组件默认值。**修复原则：缺省参数改为不渲染，而非换一个占位词。**

| #   | 任务                                        | 定位                                                                                                                                                                                                                                                                                  | 步骤                                                                                                               |
| --- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 2-1 | Typeface 无内容不再渲染 "Text"              | `typeface.tsx:128-129` `children == null` 时 `typefaceLayouts[content].map(() => "Text")`                                                                                                                                                                                             | 无内容时渲染空结构（保留占位布局骨架但不输出文字），或删除兜底渲染                                                 |
| 2-2 | 级联菜单去硬编码 "Title"                    | `cascader.tsx:1005` `<CascaderItemGroup label="Title" showDivider>`；`CascaderOptionsMenu` 仅收 `className`（:857）；`CascaderItemGroup` 本身支持可选 `label`（:652-672，falsy 时不渲染组头）                                                                                         | 给 `CascaderOptionsMenu` 增加可选 `groupTitle?: ReactNode` 参数，透传给 `CascaderItemGroup`；缺省不传 → 不渲染组头 |
| 2-3 | showBadge 缺省不再渲染 "Text"               | `cascader.tsx:814`、`select.tsx:921`、`select.tsx:1133`：`renderBadgeSlot(badge ?? "Text")`                                                                                                                                                                                           | 删 `?? "Text"`：`badge` 缺省时渲染空或不渲染                                                                       |
| 2-4 | moreAction 缺省不再渲染 `<Link>Text</Link>` | `select.tsx:927-933`、`select.tsx:1137-1143`                                                                                                                                                                                                                                          | `moreAction ?? null`，缺省不渲染                                                                                   |
| 2-5 | actionLabel 去默认 "Text"                   | `card.tsx:75`（CardHead）、`card.tsx:193`（CardBottom）、`list.tsx:216`；按钮渲染处 `card.tsx:90-95 / 208-213`、`list.tsx:243-248`                                                                                                                                                    | 去掉默认参数值；`actionLabel` 缺省时不渲染动作按钮                                                                 |
| 2-6 | Table 去 "Text" / "A" 占位                  | `table.tsx:270-273` `badgeLabel ?? "Text"`；`table.tsx:236-239`、`table.tsx:254-257` `<Avatar …>A</Avatar>`                                                                                                                                                                           | `badgeLabel` 缺省不渲染 Badge；头像缺省渲染图标占位或空                                                            |
| 2-7 | stories 示例数据替换                        | `placeholder="Text"` 8 处：`select.stories.tsx:85,109,132`、`cascader.stories.tsx:169,257,286`、`list.stories.tsx:34`、`input.stories.tsx:42`；`label="Title"` 9 处：`cascader.stories.tsx:177,188,195,205,225`、`select.stories.tsx:48,52,91,95`；另 `segmentator.stories.tsx:80-81` | 替换为贴近真实场景的文案（中文产品语境）                                                                           |

**验收**：

- playground 逐组件验证：不传相关参数时界面**不出现** "Text" / "Title" / "A"；
- `packages/ui/changelogs/` 涉及组件（Typography/Cascader/Select/Card/List/Table）各追加中文 bullet；
- `.changeset/` 添加 **minor** changeset（行为变化但非破坏性）。

---

### Wave 3 — 幽灵类 + 硬编码颜色 `fix(ui): class and token hygiene`（目标：零视觉变化）

> 核验结论：TSX 输出 530 个 `aviala-*` 类，其中 21 个无任何 CSS。修复原则：**无 CSS 的类不再输出**（而非为它们补 CSS——这些类本就是语义空壳）。

**3-A. 移除幽灵类输出**

| #    | 类                                                                         | 定位                                                       | 步骤                                                                         |
| ---- | -------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 3-1  | `aviala-progress--size-default`                                            | `progress.tsx:19`                                          | cva `size.default` 改为 `""`                                                 |
| 3-2  | `aviala-scroll--size-default`                                              | `scroll.tsx:12`                                            | 同上                                                                         |
| 3-3  | `aviala-breadcrumb--size-default`                                          | `breadcrumb.tsx:37`                                        | 同上                                                                         |
| 3-4  | `aviala-modal-content--size-default`                                       | `modal.tsx:30`                                             | 同上                                                                         |
| 3-5  | `aviala-tag--content-text`                                                 | `tag.tsx:30`                                               | cva `content.text` 改为 `""`                                                 |
| 3-6  | `aviala-slider--size-default / --type-default / --type-range`              | `slider.tsx:23,27,28`                                      | cva 对应 default 分支改 `""`（注意 `--size-big` 有 CSS，保留）               |
| 3-7  | `aviala-avatar--content-text/picture/icon`                                 | `avatar.tsx:36-38`                                         | 三个 content 变体改 `""`                                                     |
| 3-8  | `aviala-pagination__page--ellipsis / __ellipsis-content / __ellipsis-page` | `pagination.tsx:173,183,192`                               | 删除这三个类名（保留有 CSS 的 `__ellipsis-menu` :184）                       |
| 3-9  | `aviala-loading--mode-*` 5 个                                              | `loading.tsx:30-34`（theme/themeText/black/white/inherit） | 删除 mode 类映射与输出；颜色本就由内联 `conic-gradient` 驱动（:63-79, :124） |
| 3-10 | `aviala-config-provider`                                                   | `packages/ui/src/config/config-provider.tsx:69`            | 移除该无效类（保留用户传入的 `className`）                                   |

**3-B. Link 样式契约对齐（#12，双向脱节）**

| 任务           | 定位                                                                                                                                                                                           | 步骤                                                                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 对齐 TSX ↔ CSS | TSX：`link.tsx:131` 输出 `aviala-link__label`（无 CSS）；CSS：`packages/tokens/src/semantic/basic-input-effects.css:178-179` 定义 `.aviala-link--caption / .aviala-link--text`（组件从不输出） | 先读这两处确认语义：按 Link 的 `level` prop 输出对应 `aviala-link--caption/--text` 修饰类；`__label` 若确无样式需求则移除。改完在 Storybook 目测 Link 各 level 无视觉回归 |

**3-C. 硬编码颜色治理（#19 #20 #21 #23）**

| #    | 任务               | 定位                                                                                           | 步骤                                                                                              |
| ---- | ------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 3-11 | `#343333`          | `input.tsx:125`、`number-input.tsx:231`（`text-[var(--input-fg,#343333)]`）                    | 兜底改为引用 tokens 变量；若无合适变量，在 `@aviala-design/tokens` 定义并在组件引用               |
| 3-12 | `stroke="#fff"`    | `loading.tsx:120`（SVG mask 内）                                                               | 改 `currentColor` 或 CSS 变量                                                                     |
| 3-13 | `#FF5532` 三处收敛 | `packages/ui/src/theme/theme-provider.tsx:74,80,255`                                           | 抽为单一常量（如 `DEFAULT_PRIMARY_COLOR`，放在 theme 模块顶部或 tokens 包导出），三处引用同一来源 |
| 3-14 | 动态 rgba 豁免注释 | `color-picker/color-picker-slider.tsx:60` `rgba(${r},${g},${b},0)`                             | 加英文注释说明颜色数学必需（为 Wave 8 lint 白名单做准备）                                         |
| 3-15 | stories 硬编码色   | `tab.stories.tsx:95,124`、`typography.stories.tsx:75`、`color-picker.stories.tsx:22,67,79,111` | stories 演示值可保留，但统一加注释标注为演示数据（颜色选择器示例属功能数据）                      |

**3-D. 内联 SVG 豁免清单（#22）**：实为 **6 文件 9 处**（审计漏算 1 处）。执行前产出清单供维护者确认，默认豁免：
`checkbox-check-icon.tsx:14`、`loading.tsx:117`、`overlay-pointer.tsx:38`、`progress.tsx:116`、`tab.tsx:201`、`video/video-animated-icon-markup.ts:3-6`（4 处）。
处理方式：在根 `AGENTS.md` 的 Icons 规则下补一段豁免说明（这些图形与组件结构强耦合），本批不改代码（`markup.ts` 的结构性改造在 Wave 7）。

**验收**：

- Storybook 全量冒烟无视觉变化（重点：Slider/Avatar/Pagination/Loading/Link/Progress/Scroll/Breadcrumb/Modal/Tag/ConfigProvider）；
- 重跑类名↔CSS 一致性检查：`grep -rhoE "aviala-[a-z0-9_-]+" packages/ui/src --include=*.tsx | sort -u` 对比全部 CSS，缺失数应从 21 归零（仅剩豁免说明的项）；
- `grep -rn "#343333\|#fff\|#FF5532" packages/ui/src` 清零（豁免项除外）。

---

### Wave 4a — 打包修复（破坏性）`fix(ui)!: move form components to subpath export`

> 核验结论：`form-field.tsx:13-23` 顶层 `import { FormProvider, useController } from "react-hook-form"`；RHF 是非 optional 的 peerDependency（`packages/ui/package.json:63`）；tsup 隐式外部化（`tsup.config.ts:8` 的 external 未含 RHF），产物 `dist/index.js:1205-1208` 只剩悬空 import。主入口 `src/index.ts:157-165` eager 再导出 → 未装 RHF 的使用者 import 整个库即报错。

| 任务                | 定位                                                                                                     | 步骤                                                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 4a-1 新建 form 入口 | 新文件 `packages/ui/src/form.ts`                                                                         | 从 `src/index.ts:157-165` 移出所有 form 相关导出（Form、FormField 等），集中到此入口                                                             |
| 4a-2 tsup 双入口    | `packages/ui/tsup.config.ts`（当前 `entry: ["src/index.ts"]`，external 仅 react/react-dom/icons/tokens） | `entry` 增加 `"src/form.ts"`；**同时把显式 external 列表补全**（#2：至少写明依赖与 peer 全集，或改为从 package.json 自动生成），不再依赖隐式行为 |
| 4a-3 exports 子路径 | `packages/ui/package.json:18-28` `exports`                                                               | 增加 `"./form"`：`types: ./dist/form.d.ts, import: ./dist/form.js, require: ./dist/form.cjs`（development 条件对齐现有 `.` 的写法）              |
| 4a-4 主入口移除     | `packages/ui/src/index.ts:157-165`                                                                       | 删除 form 相关再导出                                                                                                                             |
| 4a-5 peer 语义      | `packages/ui/package.json:60-64`                                                                         | RHF 保留 peerDependency（`>=7.50`），README/changelog 注明**仅 `/form` 子路径需要安装**；可选：`peerDependenciesMeta` 标 `optional: true`        |
| 4a-6 版本与变更日志 | `.changeset/`、`packages/ui/changelogs/Form.md`（如无则建）                                              | **major** changeset（破坏性：主入口移除 form 导出）；changelog 写明迁移方式 `import { Form } from "@aviala-design/spiral/form"`                  |

**验收**：

- `grep "react-hook-form" packages/ui/dist/index.js packages/ui/dist/index.cjs` → **0 命中**；
- `packages/ui/dist/form.js` 含 RHF import 且类型产物齐全；
- `apps/playground` 改为从 `@aviala-design/spiral/form` 引入后运行正常（workspace `*` 依赖，`exports` 的 `development` 条件同步处理）；
- `pnpm build` + `pnpm typecheck` 全绿。

---

### Wave 4b — `fix(ui): pin slider radix version and split icons story`

| #    | 任务                       | 定位                                                                                                                                                                                                         | 步骤                                                                                                       |
| ---- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| 4b-1 | Slider 锁定版本 + 风险注释 | `packages/ui/package.json:51` `"@radix-ui/react-slider": "^1.4.4"`；`slider.tsx:1` import、`:109-126` 使用 `unstable_ThumbProvider / unstable_ThumbTrigger / unstable_BubbleInput`                           | 去掉 `^` 锁定精确版本；`slider.tsx` 顶部加英文注释：依赖三个 `unstable_` API，升级 Radix 前必须回归 slider |
| 4b-2 | icons 故事拆分             | `packages/ui/src/components/icons.stories.tsx:1-10`（全量导入）、`:35`（`iconCatalog.map` 全渲染，354 个图标）；当前产物 `apps/docs/storybook-static/assets/icons.stories-*.js` 达 3,521,321 B / gzip 862 KB | 改为搜索/过滤式渲染（一个文本输入 + 分页/虚拟化渲染当前子集），或按首字母/类别拆成多个故事文件             |

**验收**：`pnpm --filter @spiral/docs build` 后 icons 相关最大 chunk 显著小于 3.5MB（目标 < 1MB 或按需加载）；Storybook 中图标检索可用。

---

### Wave 5 — 可访问性 `fix(ui): a11y improvements`（⚠️ 需要 changelog/changeset）

| #   | 任务                        | 定位                                                                                                                                                                   | 步骤                                                                                                                                                                          |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5-1 | 移除 `role="application"`   | `date-picker/date-picker.tsx:1338-1341`、`time-picker/time-picker.tsx:261-264`（面板根 div，全库仅此 2 处）                                                            | 移除该 role；为日历面板改用 `grid` 语义（行列 + `aria-` 状态），为时间面板改用 `listbox`/自管语义，并补齐配套键盘交互。**注意**：这两个组件键盘模型改动大，先出交互说明再动手 |
| 5-2 | Segmentator 真 radiogroup   | `segmentator.tsx:865`（radiogroup）、`:929`（原生 button 全在 tab 序）、`:932-933`（radio + aria-checked）                                                             | 实现 roving tabindex（仅选中项 `tabIndex=0`）+ ←/→ 方向键切换 + Home/End                                                                                                      |
| 5-3 | VideoSpeed listbox 键盘支持 | `video/video-speed.tsx:51-54`（listbox）、`:62-63`（option）                                                                                                           | roving tabindex + ↑/↓ 方向键 + `aria-activedescendant`                                                                                                                        |
| 5-4 | List 交互行可聚焦           | `list.tsx:354-362`（非 href 分支：纯 `div + onClick`，无 tabIndex/keydown）；对照 `:336-351`（href 分支渲染 `<a>`）；`interactive` 仅设 `data-interactive`（:239,313） | 有 `onClick`/`interactive` 时渲染 `<button>`（首选），或加 `role="button"` + `tabIndex={0}` + Enter/Space 处理                                                                |
| 5-5 | ScrollPicker 滚轮放行       | `scroll-picker.tsx:318-320`（`preventDefault()` 为第一句，无条件）、`:360-361`（边缘 clamp 在其后）、`:377`（`{passive:false}`）；loop 默认 true（:104）               | 非循环列到达边缘时不再 `preventDefault()`，把滚动还给页面                                                                                                                     |
| 5-6 | 消除 `ref as never`         | `anchor.tsx:20`、`navigation.tsx:739`、`typography.tsx:63`（全库恰 3 处）                                                                                              | 用正确的多态 ref 类型（如 `ComponentPropsWithRef<Tag>["ref"]`）替代 `as never`                                                                                                |
| 5-7 | 菜单项间导航                | `cascader.tsx:758-770`（仅 Enter/Space + 展开方向键）、`select.tsx:1090-1103` + `:279-296`（Escape）                                                                   | 补 ↑/↓ 项间移动、Home/End；字符 typeahead 可作为后续跟进                                                                                                                      |

**验收**：每个组件 keyboard-only 走查（Tab 进入 → 方向键导航 → Enter/Space 激活 → Esc 退出）；涉及组件追加 changelog 条目 + minor changeset。

---

### Wave 6 — Agent 友好化 `chore: agent-friendliness`

> 决策：`skills/`（6 个 SKILL.md，唯一真源）**保留**并升级；`.qoder/` **移出版本控制并 gitignore**。`.cursor/skills/` 保留为重定向壳。
>
> 归档订正：执行时 `.qoder/` 实际只有 6 个重定向壳（`repowiki/` 已不在追踪中），因此 6-1 的收益从"删体积"变成"消除与 `skills/` 漂移的重复壳 + 阻止生成缓存回流"。

| 任务                 | 定位                                                                             | 步骤                                                                                                                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6-1 移除 .qoder      | `.qoder/repowiki/`、`.qoder/better-harness/`（`git ls-files .qoder` 共 19 文件） | `git rm -r .qoder`；若希望本地保留，先把目录移出仓库再删追踪                                                                                                                                                                                            |
| 6-2 更新根 AGENTS.md | 根 `AGENTS.md`                                                                   | 补充：① 本次审计沉淀的已知坑（RHF 子路径、Radix unstable API 清单、类名↔CSS 一致性）；② "类名↔CSS 交叉校验"命令（Wave 3 验收用的两条 grep）；③ 内联 SVG 豁免清单；④ 提交规范重申（避免再出现 #35 类"Skill maintain"裸提交——技能维护也要语义化 message） |
| 6-3 新增审计资产     | 新建 `.agents/audit/`                                                            | 放入本次 50 条核验报告（判定 + 证据）与本任务书副本，供后续 Agent 复用                                                                                                                                                                                  |
| 6-4 核对子包指引     | `packages/icons/AGENTS.md`（如存在）                                             | 确认与根 AGENTS.md 一致、命令可跑通                                                                                                                                                                                                                     |

**验收**：`git ls-files .qoder` 为空；`skills/` 6 个 SKILL.md 完好；`pnpm build` 不受影响（确认各包 `files` 白名单未引入新内容）。

---

### Wave 7 — 重构 `refactor(ui): shared logic and asset splits`（可整体推迟）

| #   | 任务                            | 定位                                                                                                                                                                                        | 步骤                                                                                                                                                                                                                                    |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7-1 | 抽 `useCloseSuppression()` hook | 四处近乎逐字重复：`select.tsx:531-536`（守卫 :551）、`cascader.tsx:303-308`（:349）、`date-picker/date-picker.tsx:231-236`（:266）、`time-picker/time-picker.tsx:76-81`（:100）             | 新 hook 封装 `windowBlurCloseRef` / `pointerDownCloseRef` + blur/pointerdown 监听 + 关闭守卫；统一四处间细微的 `disabled` 守卫差异（以带 `disabled` 守卫的版本为准）；四处逐一替换并回归开合行为（含窗口失焦、点击外部、disabled 场景） |
| 7-2 | 拆分 97KB 动画 markup           | `video/video-animated-icon-markup.ts`（97,837 B；`__UID__` × 96；play/pause/next/previous 四个 key）；注入点 `video/video-animated-icon.tsx:68-71`（`innerHTML` + `replaceAll("__UID__")`） | 按图标拆为 4 个独立模块（或生成式资产），保持运行时注入行为与 `__UID__` 替换语义不变；`innerHTML` 注入内容为静态资产可保留，需在注释中说明                                                                                              |
| 7-3 | changelog 双轨治理              | `packages/ui/changelogs/`（26 个 .md）+ `packages/ui/scripts/aggregate-changelogs.mjs`（:12-18）+ `packages/ui/package.json:33`（build 内粘合）+ `.changeset/`                              | 明确双轨职责写入 `skills/spiral-changelog/SKILL.md`；在 CI 或 pre-commit 加检查：存在未发布的 changeset 时，对应组件的 `changelogs/*.md` 是否有同步更新（可先做成 lint 脚本提示）                                                       |
| 7-4 | ThemeScript 输入校验            | `packages/ui/src/theme/theme-provider.tsx:263-275`（模板插值 `storageKey`/`defaultMode`/`defaultPrimary`/`defaultDensity`，无转义）、`:276`（`dangerouslySetInnerHTML`）                    | 对四个插值做白名单校验（如 storageKey 限 `[a-zA-Z0-9_-]`，mode/primary 枚举/格式校验），非法值回退默认；反 FOUC 结构本身保留                                                                                                            |

**验收**：四项独立回归——开合行为（7-1）、动画播放 play/pause/next/previous（7-2）、`pnpm build` 产物含 `component-changelogs.json`（7-3）、主题切换无 FOUC + 恶意输入被拒（7-4）。

---

### Wave 8 — 工具链基建 `chore: add lint and format tooling`

> 核验结论：全仓库无任何 linter / formatter 配置与依赖（#31 #32）。此批为根治方案。

| 任务           | 步骤                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 8-1 ESLint     | 引入 ESLint（flat config）：`typescript-eslint` + `eslint-plugin-react-hooks`；根 `package.json` 加 `lint` 脚本，turbo 管道接入       |
| 8-2 Prettier   | 引入 Prettier；配置对齐全库现有风格（缩进、引号以现存代码多数派为准）；加 `format` / `format:check` 脚本                              |
| 8-3 全库格式化 | **单独一个提交**跑全库格式化（与规则配置提交分离，便于 review）；`navigation.tsx` 在 Wave 1 已重排，此处只会被统一风格                |
| 8-4 CI 接入    | `.github/workflows/ci.yml` 在 build + typecheck 之外增加 `pnpm lint` 与 `pnpm format:check`                                           |
| 8-5 清理       | 格式化后评估 `video-animated-icon.tsx` 是否真的需要 `react-hooks/exhaustive-deps` 豁免（Wave 1 已删注释，若规则报警再按规则正确处理） |

**验收**：CI 绿；`pnpm lint` 零错误（既有警告建一份跟进清单，不阻塞合并）。

---

## 3. 明确不修清单（及理由）

| #   | 结论         | 理由                                                                                                                                     |
| --- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| #49 | ❌ 不实      | `cascader.tsx:789-792` 已有 `if (hasChildren)` 守卫（:734 定义；键盘路径 :766、`selectPath` :384-396 同样有守卫），叶子不会进 activePath |
| #39 | 部分不实     | `.pnpm-store` 近空是 pnpm 正常机制；悬空 junction 抽样验证全部解析正常                                                                   |
| #46 | 不修（记录） | 文档站迁出属架构权衡（发版→派发→docs scaffold PR），非缺陷；可选优化：canary 文档通道                                                    |
| #35 | 不修历史     | 两条技能维护提交（`8a669fb`、`7c18293`）已成历史，不重写；通过 Wave 6 的提交规范约束未来                                                 |

---

## 4. 全局回归验证（每批合并前）

1. `pnpm build`（turbo 全包）+ `pnpm typecheck`；
2. `pnpm --filter @spiral/docs dev`（:6006）Storybook 冒烟；
3. `pnpm --filter @spiral/playground dev` 冒烟；
4. 专项：
   - Wave 2/3/5：逐组件目测 / 键盘走查；
   - Wave 3：类名↔CSS 一致性脚本复跑（缺失数归零）；
   - Wave 4a：`grep "react-hook-form" packages/ui/dist/index.js packages/ui/dist/index.cjs` = 0；
   - Wave 4b：docs 构建产物 chunk 体量复测；
5. 发布面变更（Wave 4a）合并前：走一遍 `pnpm version:packages` 干跑，确认 major changeset 与组件 changelog 一致。

---

_任务书生成于 2026-08-31，基于 main @ 251de1d 的多 Agent 逐条核验（42 属实 / 7 部分属实 / 1 不实）。_
