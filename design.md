# Package 1 — Slug Library [Faith](https://github.com/FaithKauwe/postkit-slug-library)

## Purpose
Convert post titles into URL-safe slugs.
A slug is just the URL-friendly version of a title (or any text) that shows up in a web address.

For example, if you write a blog post titled:

"My Awesome Post! (Part 2)"

The slug would be something like:

my-awesome-post-part-2

That slug gets used in the URL:


https://myblog.com/posts/my-awesome-post-part-2

## Exports

1. **`createSlugFromTitle`**
  - **Input:** a title string
  - **Output:** a slug string
  - **Description:** convert a post title into a lowercase, URL-safe slug

2. **`isSlugValid`**
  - **Input:** a slug string
  - **Output:** a boolean
  - **Description:** return whether a slug matches your library's slug rules

3. **`makeUniqueSlug`**
  - **Input:** a slug string and a list of existing slugs
  - **Output:** a unique slug string
  - **Description:** return a slug that does not conflict with existing slugs

4. **`convertSlugToString`**
  - **Input:** a slug string
  - **Output:** a human-readable string
  - **Description:** convert a slug back into display-friendly text (e.g., `"my-awesome-post"` → `"My Awesome Post"`)

5. **`createSlugFromPostObject`**
  - **Input:** a `Post` object (shared PostKit type)
  - **Output:** a slug string
  - **Description:** extract the title from a `Post` and return a URL-safe slug

6. **`createMultipleUniqueSlugsFromMultipleTitles`**
  - **Input:** an array of title strings and an optional array of existing slugs
  - **Output:** an array of unique slug strings
  - **Description:** generate slugs for multiple posts at once, ensuring all are unique relative to each other and to any existing slugs
