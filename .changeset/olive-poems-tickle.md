---
"@aviala-design/tokens": minor
"@aviala-design/spiral": patch
---

Remove ghost BEM class outputs that had no matching CSS (Progress, Scroll, Breadcrumb, Modal, Tag, Slider, Avatar, Pagination ellipsis, Loading mode, ConfigProvider), emit the documented `aviala-link--caption` / `aviala-link--text` level classes on Link, and replace hardcoded colors with token variables. Adds `--loading-mask-reveal` so the Loading ring mask no longer needs an inline hex. No visual change.
