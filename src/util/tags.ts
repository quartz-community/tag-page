import { joinSegments } from "./path";

/** Whether `tag` has nested child tags (e.g. `kubernetes` for `kubernetes/k3s`). */
export function hasChildTags(tag: string, allTags: Iterable<string>): boolean {
  const prefix = `${tag}/`;
  for (const t of allTags) {
    if (t.startsWith(prefix)) return true;
  }
  return false;
}

/**
 * Slug of a tag's listing page. Tags with child tags are emitted as
 * `tags/<tag>/index` so the page lives inside the `tags/<tag>/` directory that
 * holds its children; a sibling `tags/<tag>.html` is unreachable on static hosts
 * that resolve the directory first (jackyzha0/quartz#2556). Leaf tags keep
 * `tags/<tag>`.
 */
export function tagPageSlug(tag: string, allTags: Iterable<string>): string {
  if (tag === "index") return "tags/index";
  return hasChildTags(tag, allTags)
    ? joinSegments("tags", tag, "index")
    : joinSegments("tags", tag);
}
