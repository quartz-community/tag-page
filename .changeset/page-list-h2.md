---
"@quartz-community/tag-page": patch
---

Page list entries are `h2` headings under the page's `h1`; they were `h3`, which skipped a level for screen readers. They keep the `h3` size, so lists look the same. Dates are at 80% opacity instead of 60%, the lowest that keeps 4.5:1 contrast (WCAG AA) in light and dark mode.
