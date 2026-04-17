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
  - **Input:** a sluggified string
  - **Output:** a boolean
  - **Description:** return whether a slug matches your library's slug rules

3. **`makeUniqueSlug`**
  - **Input:** a slug string and a list of existing slugs
  - **Output:** a unique slug string
  - **Description:** return a slug that does not conflict with existing slugs

---

## TODOs

- [ ] **Check back ~April 4:** See if Package 5 (Validation Library) has been assigned. Reach out to that student to align on minimum title/slug length constraints. Our slug library currently has no minimum length — a single character like `"a"` is valid. Waiting on Julia's input on this too. Validation library should match everyone's constraints so the ecosystem is consistent.

4. **`batchCreateSlugs`**
  - **Input:** an array of title strings and an optional array of existing slugs
  - **Output:** an array of unique slug strings
  - **Description:** generate slugs for multiple posts at once, ensuring all are unique relative to each other and to any existing slugs
