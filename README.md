# postkit-slug-library

## Purpose

Convert post titles into URL-safe slugs for the PostKit ecosystem. A slug is the URL-friendly version of a title that appears in a web address (e.g., `"My Awesome Post!"` becomes `my-awesome-post`).

## Exports

### 1. `createSlugFromTitle`

- **Input:** `title: string`
- **Output:** `string`
- **Description:** Convert a post title into a lowercase, URL-safe slug.

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
- **Very long titles** — truncated to a maximum length (at a word boundary) to keep URLs reasonable

---

### 2. `isSlugValid`

- **Input:** `slug: string`
- **Output:** `boolean`
- **Description:** Return whether a slug matches the library's slug rules.

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

- **Input:** `slug: string`, `existingSlugs: string[]`
- **Output:** `string`
- **Description:** Return a slug that does not conflict with existing slugs.

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
- **Slug already ends with a number** (e.g., `"my-post-2"` collides) — appends a new suffix: `"my-post-2-1"` (does not try to increment the existing number)
- **Invalid slug passed in** — throws an error (slug should be validated first with `isSlugValid`)

---

### 4. `convertSlugToString`

- **Input:** `slug: string`
- **Output:** `string`
- **Description:** Convert a slug back into display-friendly text (e.g., `"my-awesome-post"` → `"My Awesome Post"`).

#### Example Usage

```ts
import { convertSlugToString } from 'postkit-slug-library'

convertSlugToString("my-awesome-post")
// → "My Awesome Post"

convertSlugToString("hello-world-a-journey")
// → "Hello World A Journey"

convertSlugToString("my-post-3")
// → "My Post 3"
```

#### Edge Cases

- **Empty string** — throws an error
- **Invalid slug** (e.g., contains uppercase, spaces, special characters) — throws an error (validate with `isSlugValid` first)
- **Slug with uniqueness suffix** (e.g., `"my-post-3"`) — converted literally to `"My Post 3"`; the function does not guess whether trailing numbers are meaningful or suffixes
- **Single word slug** (e.g., `"hello"`) — returns `"Hello"`
- **Slug with consecutive numbers** (e.g., `"top-10-tips"`) — all parts preserved: `"Top 10 Tips"`

---

### 5. `createSlugFromPostObject`

- **Input:** `post: Post`
- **Output:** `string`
- **Description:** Extract the title from a `Post` and return a URL-safe slug.

#### Example Usage

```ts
import { createSlugFromPostObject } from 'postkit-slug-library'

const post: Post = {
  id: "1",
  title: "My Awesome Post!",
  body: "Some content here...",
  author: "Faith",
  tags: ["javascript", "typescript"],
  category: "tutorials",
  status: "published",
  createdAt: "2026-04-02T00:00:00Z",
  updatedAt: "2026-04-02T00:00:00Z"
}

createSlugFromPostObject(post)
// → "my-awesome-post"
```

#### Edge Cases

- **All `createSlugFromTitle` edge cases apply** — empty title, special characters, emojis, accented characters, long titles, etc. are all handled the same way
- **`null` or `undefined` passed as input** — throws an error
- **Object missing `title` field** — throws an error
- **`title` is not a string** (e.g., `null`, `undefined`, a number) — throws an error

---

### 6. `createMultipleUniqueSlugsFromMultipleTitles`

- **Input:** `titles: string[]`, `existingSlugs?: string[]`
- **Output:** `string[]`
- **Description:** Generate slugs for multiple posts at once, ensuring all are unique relative to each other and to any existing slugs.

#### Example Usage

```ts
import { createMultipleUniqueSlugsFromMultipleTitles } from 'postkit-slug-library'

createMultipleUniqueSlugsFromMultipleTitles(["My Post", "Another Post"])
// → ["my-post", "another-post"]

createMultipleUniqueSlugsFromMultipleTitles(["My Post", "My Post"])
// → ["my-post", "my-post-1"]

createMultipleUniqueSlugsFromMultipleTitles(
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
- **Some titles are invalid** (empty strings, only special characters) — throws an error for the whole batch
- **`existingSlugs` not provided** — defaults to an empty array; slugs only need to be unique relative to each other
- **All `makeUniqueSlug` edge cases apply** for the uniqueness logic

---

## Design Notes

- **Hyphens as separators** — Hyphens are the web standard for URL slugs. Search engines treat hyphens as word separators (unlike underscores), which is better for SEO and readability.

- **80 character max length** — Keeps URLs clean and avoids issues with URL length limits in browsers and servers. Truncation happens at word boundaries so slugs don't end mid-word.

- **Accented characters converted to ASCII** — Characters like `é` and `ñ` are converted to `e` and `n` rather than stripped entirely. This preserves meaning while keeping slugs URL-safe and easy to type on any keyboard.

- **Literal conversion in `convertSlugToString`** — The function converts everything as-is, including uniqueness suffixes like `-3`. Trying to guess whether trailing numbers are meaningful or auto-generated would introduce unreliable behavior. The caller knows their own data and can strip suffixes if needed.

- **Errors thrown on invalid input** — Functions throw errors for empty strings, invalid objects, and bad slugs rather than silently returning defaults. This makes bugs easier to catch and forces the caller to handle bad data explicitly, which leads to more reliable integrations.

- **`createSlugFromPostObject` uses the shared `Post` type** — This ties the library directly into the PostKit ecosystem and makes integration straightforward. It delegates to `createSlugFromTitle` internally, keeping slug logic in one place.

- **Batch function for multiple titles** — The import feature in PostKit can bring in many posts at once. `createMultipleUniqueSlugsFromMultipleTitles` ensures all slugs are unique relative to each other and to existing slugs in a single call, avoiding the need for callers to loop and track state themselves.
