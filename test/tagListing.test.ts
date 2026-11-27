import { describe, expect, it, vi } from "vitest";

vi.mock("../src/components/styles/listPage.scss", () => ({ default: "" }));

import TagContentConstructor from "../src/components/TagContent";
import { TagPage } from "../src/pageType";

type VNode = { type: unknown; props: Record<string, unknown> & { children?: unknown } };

function all(node: unknown, test: (v: VNode) => boolean, out: VNode[] = []): VNode[] {
  if (Array.isArray(node)) node.forEach((n) => all(n, test, out));
  else if (node && typeof node === "object" && "props" in node) {
    const v = node as VNode;
    if (typeof v.type === "function")
      return all((v.type as (p: unknown) => unknown)(v.props), test, out);
    if (test(v)) out.push(v);
    all(v.props.children, test, out);
  }
  return out;
}
const textOf = (node: unknown): string =>
  node === null || node === undefined || typeof node === "boolean"
    ? ""
    : typeof node === "string" || typeof node === "number"
      ? String(node)
      : Array.isArray(node)
        ? node.map(textOf).join("")
        : typeof (node as VNode).type === "function"
          ? textOf(((node as VNode).type as (p: unknown) => unknown)((node as VNode).props))
          : textOf((node as VNode).props.children);

const day = (d: string) => new Date(`${d}T12:00:00Z`);
function page(slug: string, tags: string[] = [], extra: Record<string, unknown> = {}) {
  return { slug, frontmatter: { title: slug, tags }, defaultDateType: "modified", ...extra };
}
const dated = (d: string) => ({ dates: { created: day(d), modified: day(d), published: day(d) } });

function render(
  slug: string,
  allFiles: unknown[],
  opts = {},
  fileData: Record<string, unknown> = {},
) {
  return TagContentConstructor(opts)({
    tree: { type: "root", children: [] },
    fileData: { slug, frontmatter: { title: slug }, ...fileData },
    allFiles,
    cfg: { locale: "en-US" },
  } as never);
}
const listed = (tree: unknown) =>
  all(tree, (v) => v.type === "a" && v.props.class === "internal").map((a) => textOf(a));

describe("a tag's page", () => {
  const files = [
    page("old", ["k8s"], dated("2020-01-01")),
    page("child", ["k8s/k3s"], dated("2024-01-01")),
    page("other", ["k8sx"]),
    page("hidden", ["k8s"], { unlisted: true }),
  ];

  it("lists the listed pages with the tag or a child tag, newest first", () => {
    const tree = render("tags/k8s/index", files);
    expect(listed(tree)).toEqual(["child", "old"]);
    expect(textOf(tree)).toContain("2 items with this tag.");
  });

  it("lists only the child tag's pages on the child tag's page", () => {
    expect(listed(render("tags/k8s/k3s", files))).toEqual(["child"]);
  });

  it("lists every page, however many (numPages limits the tag index only)", () => {
    const many = Array.from({ length: 12 }, (_, i) => page(`p${i}`, ["t"]));
    expect(listed(render("tags/t", many, { numPages: 3 }))).toHaveLength(12);
  });

  it("shows the tag page's own content, or its description without one", () => {
    expect(textOf(render("tags/k8s", files, {}, { description: "About k8s" }))).toContain(
      "About k8s",
    );
  });

  it("carries the tag page's cssclasses", () => {
    const tree = render(
      "tags/k8s",
      files,
      {},
      { frontmatter: { title: "k8s", cssclasses: ["a", "b"] } },
    );
    expect(all(tree, (v) => v.type === "article")[0]!.props.class).toBe("a b");
  });

  it("refuses to render a page that is not a tag page", () => {
    expect(() => render("notes/tags", files)).toThrow(/non-tag page: notes\/tags/);
  });
});

describe("the tag index", () => {
  it("lists every tag in order, with its pages, and says how many there are", () => {
    const tree = render("tags/index", [
      page("b1", ["beta"]),
      page("a1", ["Alpha", "beta"]),
      page("h", ["secret"], { unlisted: true }),
    ]);
    const text = textOf(tree);
    expect(text).toContain("Found 2 total tags.");
    expect(all(tree, (v) => v.type === "h2").map(textOf)).toEqual(["Alpha", "beta"]);
    expect(text).not.toContain("secret");
    expect(text).toContain("1 item with this tag.");
    expect(text).toContain("2 items with this tag.");
  });

  it("shows the first numPages pages of a tag, and says so", () => {
    const many = Array.from({ length: 4 }, (_, i) => page(`p${i}`, ["t"]));
    const tree = render("tags/index", many, { numPages: 3 });
    expect(listed(tree)).toHaveLength(3);
    expect(textOf(tree)).toContain("4 items with this tag. Showing first 3 tags.");
    expect(textOf(render("tags/index", many.slice(0, 3), { numPages: 3 }))).not.toContain(
      "Showing first",
    );
  });

  it("describes a tag with its hand-written page's content, else its description", () => {
    const htmlAst = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "em",
          properties: {},
          children: [{ type: "text", value: "Written" }],
        },
      ],
    };
    const tree = render("tags/index", [
      page("a", ["one", "two", "three"]),
      page("tags/one", [], { filePath: "content/tags/one.md", htmlAst }),
      // a virtual page's htmlAst is the generated listing, not a description
      page("tags/two", [], { htmlAst, description: "Two's description" }),
      page("tags/three/index", [], {
        filePath: "content/tags/three/index.md",
        description: "Third",
      }),
    ]);
    const descriptions = all(tree, (v) => v.type === "p" && v.props.class === undefined)
      .map(textOf)
      .filter((t) => !/total tags|with this tag/.test(t) && t !== "");
    expect(descriptions).toEqual(["Written", "Third", "Two's description"]);
  });
});

describe("TagPage", () => {
  const { match } = TagPage({});
  it("handles the tag index and tag pages only", () => {
    const m = (slug: string) => match({ slug } as never);
    expect([m("tags"), m("tags/index"), m("tags/a/b"), m("notes/tags"), m("tagsx")]).toEqual([
      true,
      true,
      true,
      false,
      false,
    ]);
  });
});
