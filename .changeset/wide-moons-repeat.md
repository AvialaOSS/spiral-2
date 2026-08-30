---
"@aviala-design/spiral": major
---

Move `Form` and `FormField` to the `@aviala-design/spiral/form` subpath entry.

The main entry no longer references `react-hook-form`, so consumers without that
peer installed can import from `@aviala-design/spiral` again. `react-hook-form`
stays on `>=7.50` and is now marked optional — it is only required by `/form`.

Migration: `import { Form, FormField } from "@aviala-design/spiral/form";`
