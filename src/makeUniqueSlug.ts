// - **Input:** `slug: string`, `existingSlugs: string[]`
// - **Output:** `string`
// - **Description:** Return a slug that does not conflict with existing slugs. The output is validated with `isSlugValid` before being returned. Accepts any slug produced by `createSlugFromTitle` — no need to validate the input yourself when piping from other functions in this library.
// - **Slug is already unique** (not in the list) — returns it unchanged
// - **Multiple collisions** (e.g., `"my-post"`, `"my-post-1"`, `"my-post-2"` all exist) — keeps incrementing until it finds an available number (`"my-post-3"`)
// - **Empty existing slugs array** — slug is unique by default, returned as-is
// - **Slug already ends with a number** (e.g., `"my-post-2"` collides) — appends a collision suffix like any other slug: `"my-post-2-1"`
// - **Invalid slug passed in** — throws an error. However, output from `createSlugFromTitle` is always valid, so piping between functions works safely without manual validation
// - **Appending a suffix pushes slug over 80 characters** — the slug is truncated at a word boundary before the suffix is added to stay within the max length

import { isSlugValid } from './isSlugValid.js';

const MAX_LENGTH = 80;

export function makeUniqueSlug(slug: string, existingSlugs: string[]): string {
    // check validity 
    if (!isSlugValid(slug)) {
        throw new Error(`Invalid slug: "${slug}"`);
    }
    // convert to a set in order to use the set's ability for fast lookup
    const existingSet = new Set(existingSlugs);
    // use set method .has to check if the given slug argument is unique, if so return it
    if (!existingSet.has(slug)) {
        return slug;
    }

    let counter = 1;
    // create a test string that is the slug + a numeric counter to use while searching through the set to see where
    // the next numeric increment needs to be
    let candidate = `${slug}-${counter}`;

    // if the set has a matching slug then the numeric counter isn't high enough, slug is not unique, keep increasing the counter
    // until is is unique (not found in the set)
    while (existingSet.has(candidate)) {
        counter++;
        candidate = `${slug}-${counter}`;
    }

    // check for length and truncate if needed using the same process as in createSlugFromTitle
    if (candidate.length > MAX_LENGTH) {
        const suffix = `-${counter}`;
        let base = slug.substring(0, MAX_LENGTH - suffix.length);
        const lastHyphen = base.lastIndexOf('-');
        if (lastHyphen > 0) {
            base = base.substring(0, lastHyphen);
        }
        candidate = `${base}${suffix}`;
    }

    // the slug has been altered, do one final validity check before returning to user
    if (!isSlugValid(candidate)) {
        throw new Error(`Generated slug is invalid: "${candidate}"`);
    }

    return candidate;
}