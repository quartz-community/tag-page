import { describe, expect, it, vi } from "vitest";

const received: unknown[] = [];
vi.mock("../src/components/TagContent", () => ({
  default: (opts: unknown) => {
    received.push(opts);
    return () => null;
  },
}));

const { TagPage } = await import("../src/pageType");

// Quartz builds the page body with `body(undefined)` (core pageTypes/dispatcher.ts), so the
// plugin must hand its own options to the tag listing.
describe("TagPage body", () => {
  it("passes the plugin's options to the tag listing", () => {
    const sort = () => 0;
    const plugin = TagPage({ numPages: 3, sort });
    plugin.body(undefined);
    expect(received.at(-1)).toEqual({ numPages: 3, sort });
  });
});
