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

/** The heading tags in a rendered vnode tree, in order, with the text of their link. */
function headings(node: unknown, out: string[] = []): string[] {
  if (Array.isArray(node)) {
    node.forEach((n) => headings(n, out));
    return out;
  }
  if (!node || typeof node !== "object" || !("props" in node)) return out;
  const v = node as VNode;
  if (typeof v.type === "string" && /^h[1-6]$/.test(v.type)) {
    const link = ([] as unknown[])
      .concat(v.props.children)
      .find((c): c is VNode => !!c && typeof c === "object" && (c as VNode).type === "a");
    out.push(`${v.type}:${String(link?.props.children ?? "")}`);
  }
  headings(v.props.children, out);
  return out;
}

describe("tag index heading levels", () => {
  it("puts each tag's pages one level below the tag's h2", () => {
    const tree = renderTagIndex([page("notes/a", ["alpha"]), page("notes/b", ["beta"])]);
    expect(headings(tree)).toEqual(["h2:alpha", "h3:notes/a", "h2:beta", "h3:notes/b"]);
  });

  it("keeps a single tag's pages at h2, under the page's h1", () => {
    const TagContent = TagContentConstructor();
    const tree = TagContent({
      tree: { type: "root", children: [] },
      fileData: { slug: "tags/alpha", frontmatter: { title: "alpha" } },
      allFiles: [page("notes/a", ["alpha"])],
      cfg: { locale: "en-US" },
      displayClass: undefined,
    } as never);
    expect(headings(tree)).toEqual(["h2:notes/a"]);
  });
});
