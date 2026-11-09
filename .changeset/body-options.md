---
"@quartz-community/tag-page": patch
---

The `numPages` and `sort` options take effect. Quartz builds a page type's body with `body(undefined)`, and the tag listing was passed in directly, so it never received the plugin's options and always used its defaults.
