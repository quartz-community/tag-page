---
"@quartz-community/tag-page": patch
---

- Tags of pages from page types that run before tag pages (a canvas's text nodes' `#tags`, canvas-page 1.1.2+) get tag pages; their links were 404s.
- On the tag index, each tag's pages are `h3` headings under the tag's `h2` (they were `h2`, the tag's level); they look the same.
