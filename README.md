# @quartz-community/tag-page

Renders tag pages showing all content tagged with a specific tag. Automatically generates virtual pages for all tags found across content.

## Installation

```bash
npx quartz plugin add @quartz-community/tag-page
```

Tag pages are already in Quartz's default configuration.

## Usage

```yaml title="quartz.config.yaml"
plugins:
  - source: "@quartz-community/tag-page"
    enabled: true
    options:
      numPages: 10
      prefixTags: false
```

`sort` takes a function, so it needs a TypeScript override:

```ts title="quartz.ts (override)"
import * as ExternalPlugin from "./.quartz/plugins";

ExternalPlugin.TagPage({
  numPages: 10,
  sort: (f1, f2) => (f1.frontmatter?.title ?? "").localeCompare(f2.frontmatter?.title ?? ""),
});
```

## Configuration

| Option       | Type      | Default                         | Description                                                                                                                                          |
| ------------ | --------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `numPages`   | `number`  | `10`                            | On the tag index page (`/tags`), the maximum number of pages listed under each tag; a tag's own page lists all of them.                              |
| `prefixTags` | `boolean` | `false`                         | Whether to prefix generated tag page titles with the localized "Tag" label (e.g. "Tag: recipes").                                                    |
| `sort`       | `SortFn`  | folders first, then date, title | A function `(f1, f2) => number` to sort the pages with the tag. By default: folders first, then newest first, then by title. Requires a TS override. |

`numPages` and `sort` take effect since version 1.0.4.

A page with a nested tag such as `#project/alpha` is listed under both `project/alpha` and `project`. Writing a note at `tags/<tag>.md` adds your own text above the generated listing.

## Documentation

See the [Quartz documentation](https://quartz.jzhao.xyz/plugins/TagPage) for more information.

## License

MIT
