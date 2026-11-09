# Changelog

## 1.0.2

### Patch Changes

- 9c6c593: Bundles `@quartz-community/utils` 1.1.0: a short wikilink to an Obsidian folder note (`[[Topic]]` for `Topic/Topic.md`) reaches the folder page, and anchors to headings use the same slug as heading ids. `github-slugger` is no longer a dependency of this plugin.

## 1.0.1

### Patch Changes

- 6977c9a: On the tag index, a tag with child tags and a hand-written `tags/<tag>.md` page links to that page instead of the virtual `tags/<tag>/` page it replaces, which was never emitted (a broken link).
- d1bec5e: Tags that have child tags (e.g. `kubernetes` with `kubernetes/k3s`) are now emitted as `tags/<tag>/index.html` instead of `tags/<tag>.html`, so the parent tag page is reachable on static hosts that resolve the `tags/<tag>/` directory first (jackyzha0/quartz#2556). Leaf tag URLs are unchanged.

## 1.0.0

### Major Changes

- Stable 1.0 release. All `@quartz-community/*` dependencies now use `^1.0.0` ranges.

  Pre-1.0 caret ranges pinned the minor version (`^0.2.1` means `>=0.2.1 <0.3.0`), so
  published fixes to shared packages could never be resolved by dependents. Moving the
  ecosystem to 1.0 makes caret ranges behave conventionally.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Respect the `file.data.unlisted` convention in tag discovery (virtual tag page generation) and tag listings (`TagContent.tsx`). Unlisted pages are never used to discover tags and never appear in any tag listing. A tag that exists only on unlisted pages will not cause a tag page to be generated.
- Unit tests for tag discovery covering the unlisted-filter behavior.

- Initial Quartz community plugin template.
