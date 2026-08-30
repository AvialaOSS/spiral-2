# Lint 与格式化

Spiral 2 使用 **ESLint 10 flat config** + **Prettier 3**，配置集中在仓库根目录：

| 文件                | 作用                                            |
| ------------------- | ----------------------------------------------- |
| `eslint.config.mjs` | 全仓唯一的 ESLint flat config（含 ignore 列表） |
| `.prettierrc.json`  | Prettier 选项                                   |
| `.prettierignore`   | Prettier 跳过的生成物与外部同步内容             |

## 命令

| 命令                | 说明                                                                        |
| ------------------- | --------------------------------------------------------------------------- |
| `pnpm lint`         | `turbo run lint`（各包 `eslint .`）+ 根目录 `scripts/`、`eslint.config.mjs` |
| `pnpm lint:fix`     | 单次全仓 `eslint --fix`（含 `apps/docs/.storybook`）                        |
| `pnpm format`       | `prettier --write .`                                                        |
| `pnpm format:check` | `prettier --check .`（CI 门禁）                                             |

`pnpm lint` 与 `pnpm format:check` 均在 `ci.yml` 中执行，与 `build` / `typecheck` / `test` 并列。

各包也有 `lint` script，因此 `turbo run lint --filter=@aviala-design/spiral` 可以单独跑。

## Prettier 选项如何得出

选项是对 `packages/ui` 取样后匹配出来的，不是凭默认值拍的：

| 选项                   | 取值          | 依据                                                                                                   |
| ---------------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `tabWidth` / `useTabs` | `2` / `false` | `packages/ui/src` 157 个 `.ts`/`.tsx`，0 处 tab 缩进                                                   |
| `singleQuote`          | `false`       | `from "…"` 为全库多数派，无 `from '…'`                                                                 |
| `semi`                 | `true`        | 语句以 `;` 结尾                                                                                        |
| `trailingComma`        | `es5`         | 对象/数组普遍带尾逗号；函数参数列表不带（`"all"` 会改写大量签名）                                      |
| `arrowParens`          | `always`      | 现有箭头函数均带括号                                                                                   |
| `printWidth`           | `80`          | `packages/ui/src` 27454 行中 97% 已在 80 列内                                                          |
| `endOfLine`            | `auto`        | Git 索引存 LF；Windows `core.autocrlf=true` 工作区是 CRLF。`auto` 让本地与 CI 的 `format:check` 都能绿 |

## ESLint 规则集选择

基础组合：`@eslint/js` recommended + `typescript-eslint` recommended + `eslint-plugin-react-hooks`（经典两条）+ `eslint-config-prettier`。

### 有意做出的取舍

- **不启用 type-aware 规则**（`recommendedTypeChecked` / `projectService`）。启用后 `lint` 必须等上游包 `build` 完成才能拿到类型，turbo 里就得重新挂 `dependsOn: ["^build"]`。未加类型信息的规则集已经覆盖我们关心的正确性问题。
- **`react-hooks` 只用经典规则**：`rules-of-hooks`（error）与 `exhaustive-deps`（warn）。插件 v7 的 `recommended` 还会打开 React Compiler 检查（如 `set-state-in-effect`），会把 playground 里合理的同步 effect 打成 error，不在本批范围。
- **`react-hooks/rules-of-hooks` 在 `*.stories.tsx` 关闭**。Storybook CSF 的 `render` 会被当作组件挂载，里面调用 hook 是合法的，但规则的命名启发式识别不了。
- **hygiene 类规则降为 warn**：`@typescript-eslint/no-unused-vars`（允许 `_` 前缀）、`no-explicit-any`、`no-empty-object-type`、`no-useless-assignment`。这样 `pnpm lint` 可以立刻作为「零 error」门禁使用。
- **正确性类规则保持 error**：`rules-of-hooks`（非 story）、`no-undef`、`no-case-declarations` 等 recommended 默认 error 的规则均未放宽。
- **`no-empty` 允许空 `catch`**：代码里存在带注释的「吞掉异常」写法（如 `animation.finish()`）。

### `video-animated-icon.tsx`

挂载时注入 SVG markup 的 effect 改为从 `nameRef` 读取当前 `name`，依赖只列稳定的 `uid`（`useId()`）。不再使用 `eslint-disable-next-line react-hooks/exhaustive-deps`。play/pause 与 skip 是不同实例，后续 `name` 翻转由另外两个 effect 处理。

### Ignore 列表

生成物与外部同步内容不参与 lint / format，否则每次 `pnpm icons:build` 或 `pnpm sync:ald` 都会产生噪音 diff：

- `packages/icons/src/components/`、`packages/icons/src/catalog.ts`、`packages/icons/src/index.ts`（SVGR 产物）
- `packages/icons/raw/`
- `packages/tokens/source/`（ALD 同步）
- `dist/`、`.turbo/`、`storybook-static/`、`coverage/`、`node_modules/`
- `packages/*/src/**/*.js`、`packages/*/src/**/*.d.ts`（误落在源码旁的 tsc 产物，见 `.gitignore`）
- 仅 Prettier：`.changeset/`、`**/CHANGELOG.md`、`packages/ui/changelogs/`（由 Changesets 与 `stamp-unreleased.mjs` 生成或解析）
- 仅 Prettier：`packages/ui/src/components/video/video-animated-icon-markup.ts`（约 97KB 转义 SVG 字符串）

## Warning backlog

当前 `pnpm lint` 为 **0 error / 15 warning**。下面是全部存量 warning，可作为后续清理清单。

### 未使用的导入 / 变量（10 处，删除即可）

| 位置                                                   | 符号                |
| ------------------------------------------------------ | ------------------- |
| `apps/playground/src/App.tsx:14`                       | `RadioGroupItem`    |
| `packages/ui/scripts/stamp-unreleased.mjs:6`           | `dirname`           |
| `packages/ui/src/components/button.tsx:10`             | `ReactElement`      |
| `packages/ui/src/components/cascader.tsx:7`            | `AvialaIconProps`   |
| `packages/ui/src/components/cascader.tsx:11`           | `cloneElement`      |
| `packages/ui/src/components/cascader.tsx:24`           | `ReactElement`      |
| `packages/ui/src/components/hover-popover.tsx:10`      | `PopoverAnchor`     |
| `packages/ui/src/components/navigation.stories.tsx:27` | `NavigationSection` |
| `packages/ui/src/components/select.tsx:23`             | `CSSProperties`     |
| `scripts/crawl-storybook.mjs:13`                       | `ROOT`              |

### `react-hooks/exhaustive-deps`（3 处，需要真实重构）

| 位置                                                         | 内容                                                                                    |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `packages/ui/src/components/cascader.tsx:300`                | `selectedPath` 是条件赋值，会让 `useEffect`(331) 与 `useMemo`(427) 每次渲染都拿到新依赖 |
| `packages/ui/src/components/date-picker/date-picker.tsx:217` | `rangeValue` 同上，影响 `useMemo`(484)                                                  |

修复方式是把这些条件初始化包进自己的 `useMemo`，属于组件状态模型调整，不放在 lint 接入这一步做。

### `no-useless-assignment`（2 处）

| 位置                                                                    | 内容                                                            |
| ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| `packages/ui/src/components/date-picker/date-picker-time-wheel.tsx:374` | `let targetRaw: number \| null = null` 的初始 `null` 从未被读取 |
| `packages/ui/src/components/scroll-picker.tsx:394`                      | 同上                                                            |

去掉初始赋值即可；switch 的 `default` 已经 `return`。
