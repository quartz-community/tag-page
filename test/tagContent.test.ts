import { describe, expect, it, vi } from "vitest";

vi.mock("../src/components/styles/tagContent.scss", () => ({ default: "" }));
vi.mock("../src/components/styles/listPage.scss", () => ({ default: "" }));

import TagContentConstructor from "../src/components/TagContent";

type VNode = { type: unknown; props: { class?: string; href?: string; children?: unknown } };

/** Every `<h2><a href>` in a rendered vnode tree, as href. */
function headingLinks(node: unknown, inH2 = false, out: string[] = []): string[] {
  if (Array.isArray(node)) {
    node.forEach((n) => headingLinks(n, inH2, out));
    return out;
  }
  if (!node || typeof node !== "object" || !("props" in node)) return out;
  const v = node as VNode;
  if (inH2 && v.type === "a" && v.props.href) out.push(v.props.href);
  headingLinks(v.props.children, inH2 || v.type === "h2", out);
  return out;
}

function page(slug: string, tags: string[] = [], filePath?: string) {
  return { slug, filePath, frontmatter: { title: slug, tags }, dates: {} };
}

function renderTagIndex(allFiles: ReturnType<typeof page>[]) {
  const TagContent = TagContentConstructor();
  const tagIndex = { slug: "tags/index", frontmatter: { title: "Tags" } };
  return TagContent({
    tree: { type: "root", children: [] },
    fileData: tagIndex,
    allFiles,
    cfg: { locale: "en-US" },
    displayClass: undefined,
  } as never);
}

describe("tag index headings", () => {
  it("link a parent tag to its virtual tags/<tag>/index page", () => {
    const links = headingLinks(renderTagIndex([page("notes/a", ["plugin/component"])]));
    expect(links).toContain("../tags/plugin/");
    expect(links).toContain("../tags/plugin/component");
  });

  it("link a parent tag to a hand-written tags/<tag> page where it is", () => {
    const links = headingLinks(
      renderTagIndex([
        page("notes/a", ["plugin/component"]),
        page("tags/plugin", [], "content/tags/plugin.md"),
      ]),
    );
    expect(links).toContain("../tags/plugin");
    expect(links).not.toContain("../tags/plugin/");
  });
});
