---
"@quartz-community/tag-page": patch
---

Tags that have child tags (e.g. `kubernetes` with `kubernetes/k3s`) are now emitted as `tags/<tag>/index.html` instead of `tags/<tag>.html`, so the parent tag page is reachable on static hosts that resolve the `tags/<tag>/` directory first (jackyzha0/quartz#2556). Leaf tag URLs are unchanged.
