# postkit-slug-library

## Purpose

Convert post titles into URL-safe slugs for the PostKit ecosystem. A slug is the URL-friendly version of a title that appears in a web address (e.g., `"My Awesome Post!"` becomes `my-awesome-post`).

## Exports

### 1. `createSlugFromTitle`

- **Input:** `title: string`
- **Output:** `string`
- **Description:** Convert a post title into a lowercase, URL-safe slug. The output is always validated with `isSlugValid` before being returned, so the result is guaranteed to be a valid slug.

#### Example Usage

```ts
import { createSlugFromTitle } from 'postkit-slug-library'

createSlugFromTitle("My Awesome Post!")
// → "my-awesome-post"

createSlugFromTitle("Hello World: A Journey")
// → "hello-world-a-journey"

createSlugFromTitle("  Lots   of   Spaces  ")
// → "lots-of-spaces"
```

#### Edge Cases

- **Empty string** — throws an error prompting the user to provide a valid title
- **Only whitespace** (e.g., `"   "`) — treated the same as an empty string
- **Special characters and emojis** (e.g., `"Hello! 🎉 World"`) — stripped out via regex, producing `"hello-world"`
- **Title that is only special characters** (e.g., `"!!!"`) — after stripping, becomes empty; throws an error
- **Multiple consecutive spaces or hyphens** (e.g., `"hello   world"`) — collapsed to a single hyphen: `"hello-world"`
- **Leading/trailing spaces or hyphens** — trimmed so slugs never start or end with `-`
- **Accented characters** (e.g., `"café résumé"`) — converted to ASCII equivalents: `"cafe-resume"`
- **Very long titles** — truncated to 80 characters at a word boundary to keep URLs reasonable
- **Hyphens in the title** (e.g., `"The Black-Knight Fights On"`) — existing hyphens are preserved and consecutive hyphens are collapsed, producing `"the-black-knight-fights-on"`

---

### 2. `isSlugValid`

- **Input:** `slug: string`
- **Output:** `boolean`
- **Description:** Return whether a slug matches the library's slug rules. A valid slug contains only lowercase letters, numbers, and hyphens, with no consecutive/leading/trailing hyphens, and is at most 80 characters long.

#### Example Usage

```ts
import { isSlugValid } from 'postkit-slug-library'

isSlugValid("my-awesome-post")
// → true

isSlugValid("Hello World!")
// → false (uppercase, spaces, special characters)

isSlugValid("--double--hyphens--")
// → false (leading/trailing/consecutive hyphens)
```

#### Edge Cases

- **Empty string** — returns `false`
- **Contains uppercase letters** (e.g., `"My-Post"`) — returns `false`
- **Contains spaces** (e.g., `"my post"`) — returns `false`
- **Contains special characters or emojis** — returns `false`
- **Consecutive hyphens** (e.g., `"my--post"`) — returns `false`
- **Starts or ends with a hyphen** (e.g., `"-my-post"`) — returns `false`
- **Exceeds max length (80 characters)** — returns `false`
- **Contains only numbers** (e.g., `"12345"`) — returns `true` (numbers are valid slug characters)

---

### 3. `makeUniqueSlug`

- **Input:** `slug: string` (must be a valid slug — use `createSlugFromTitle` first if starting from a raw title), `existingSlugs: string[]`
- **Output:** `string`
- **Description:** Return a slug that does not conflict with existing slugs. The output is validated with `isSlugValid` before being returned. Accepts any slug produced by `createSlugFromTitle` — no need to validate the input yourself when piping from other functions in this library. The `existingSlugs` array is assumed to contain valid slugs and is not validated — use `isSlugValid` to check entries if you are unsure.

#### Example Usage

```ts
import { makeUniqueSlug } from 'postkit-slug-library'

makeUniqueSlug("my-post", [])
// → "my-post"

makeUniqueSlug("my-post", ["my-post"])
// → "my-post-1"

makeUniqueSlug("my-post", ["my-post", "my-post-1", "my-post-2"])
// → "my-post-3"
```

#### Edge Cases

- **Slug is already unique** (not in the list) — returns it unchanged
- **Multiple collisions** (e.g., `"my-post"`, `"my-post-1"`, `"my-post-2"` all exist) — keeps incrementing until it finds an available number (`"my-post-3"`)
- **Empty existing slugs array** — slug is unique by default, returned as-is
- **Slug already ends with a number** (e.g., `"my-post-2"` collides) — appends a collision suffix like any other slug: `"my-post-2-1"`. Numbers that are part of the original title content (e.g., `"the-meaning-of-life-is-42"`) are never modified — the collision suffix is always appended separately
- **Invalid slug passed in** — throws an error. However, output from `createSlugFromTitle` is always valid, so piping between functions works safely without manual validation
- **Appending a suffix pushes slug over 80 characters** — the slug is truncated at a word boundary before the suffix is added to stay within the max length

---

### 4. `batchCreateSlugs`

- **Input:** `titles: string[]`, `existingSlugs?: string[]`
- **Output:** `string[]`
- **Description:** Generate slugs for multiple posts at once, ensuring all are unique relative to each other and to any existing slugs. Returns only the newly created slugs — the `existingSlugs` array is used as a reference to avoid collisions but is not included in or modified by the output.

#### Example Usage

```ts
import { batchCreateSlugs } from 'postkit-slug-library'

batchCreateSlugs(["My Post", "Another Post"])
// → ["my-post", "another-post"]

batchCreateSlugs(["My Post", "My Post"])
// → ["my-post", "my-post-1"]

batchCreateSlugs(
  ["My Post", "My Post"],
  ["my-post"]
)
// → ["my-post-1", "my-post-2"]
```

#### Edge Cases

- **Empty array** — returns an empty array
- **Single title in the array** — works normally, does not break
- **Duplicate titles in the array** (e.g., `["My Post", "My Post"]`) — the second one gets a suffix to stay unique: `["my-post", "my-post-1"]`
- **Collisions with existing slugs AND with each other** — handles both simultaneously (see third example above)
- **Some titles are invalid** (empty strings, only special characters) — throws an error for the whole batch, including the indices of all invalid titles so the caller can identify and fix every problem in one pass
- **`existingSlugs` not provided** — defaults to an empty array; slugs only need to be unique relative to each other
- **All `makeUniqueSlug` edge cases apply** for the uniqueness logic

---

## Design Notes

- **Hyphens as separators** — Hyphens are the web standard for URL slugs. Search engines treat hyphens as word separators (unlike underscores), which is better for SEO and readability.

- **80 character max length** — Keeps URLs clean and avoids issues with URL length limits in browsers and servers. Truncation happens at word boundaries so slugs don't end mid-word.

- **Accented characters converted to ASCII** — Characters like `é` and `ñ` are converted to `e` and `n` rather than stripped entirely. This preserves meaning while keeping slugs URL-safe and easy to type on any keyboard.

- **Errors thrown on invalid input** — Functions throw errors for empty strings, invalid objects, and bad slugs rather than silently returning defaults. This makes bugs easier to catch and forces the caller to handle bad data explicitly, which leads to more reliable integrations.

- **Batch function for multiple titles** — The import feature in PostKit can bring in many posts at once. `batchCreateSlugs` ensures all slugs are unique relative to each other and to existing slugs in a single call, avoiding the need for callers to loop and track state themselves.
