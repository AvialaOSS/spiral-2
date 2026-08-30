---
"@aviala-design/spiral": minor
---

Replace `role="application"` panels with real widget semantics and fill in the missing keyboard models.

- `DatePickerCalendar` / `TimePickerPanel`: `role="application"` is gone (`role="group"` instead), and the day grid gains `role="row"` wrappers so its existing gridcell + arrow / Home / End / PageUp / PageDown model is exposed correctly
- `SegmentatorGroup`: a true radiogroup — roving tabindex (only the checked item is a tab stop), arrow keys move and select along the group's axis (RTL mirrored), Home / End jump to the ends
- `VideoSpeed`: listbox roving tabindex plus Up / Down / Home / End and `aria-activedescendant`
- `ListItem`: interactive rows without `href` are now focusable (`tabIndex`, `role="button"`, Enter / Space); nested controls keep their own activation and the `href` anchor branch is unchanged
- `ScrollPickerColumn`: a non-looping column pinned to either end no longer calls `preventDefault` on wheel, so the page keeps scrolling
- `CascaderItem`: Up / Down / Home / End move focus within a column, skipping titles and disabled rows
- `SelectSubItem`: Up / Down / Home / End across menu rows (including mixed Radix items), expand key opens the sub-menu and moves focus into it, collapse key / Esc returns focus to the parent row
