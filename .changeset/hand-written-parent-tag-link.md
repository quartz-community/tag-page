---
"@quartz-community/tag-page": patch
---

On the tag index, a tag with child tags and a hand-written `tags/<tag>.md` page links to that page instead of the virtual `tags/<tag>/` page it replaces, which was never emitted (a broken link).
