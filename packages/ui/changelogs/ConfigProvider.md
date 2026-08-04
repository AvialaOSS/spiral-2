# ConfigProvider

## Unreleased

### Added
- `ConfigProvider` with `direction` (`ltr` | `rtl`), optional `locale` (nests `LocaleProvider`), and `syncDocumentDir` for portalled overlays
- `useDirection` / `useRtl` plus `mirrorSide` / `forwardChevronSide` / `backChevronSide` helpers

### Fixed
- Pagination / Breadcrumb / List / Card / Cascader / Select / Navigation / DatePicker 方向性箭头与侧向行为跟随 `direction`
