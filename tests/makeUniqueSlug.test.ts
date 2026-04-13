
// - **Slug is already unique** (not in the list) — returns it unchanged
// - **Multiple collisions** (e.g., `"my-post"`, `"my-post-1"`, `"my-post-2"` all exist) — keeps incrementing until it finds an available number (`"my-post-3"`)
// - **Empty existing slugs array** — slug is unique by default, returned as-is
// - **Slug already ends with a number** (e.g., `"my-post-2"` collides) — appends a collision suffix like any other slug: `"my-post-2-1"`
// - **Invalid slug passed in** — throws an error. However, output from `createSlugFromTitle` is always valid, so piping between functions works safely without manual validation
// - **Appending a suffix pushes slug over 80 characters** — the slug is truncated at a word boundary before the suffix is added to stay within the max length

import { describe, it, expect } from 'vitest';
import { makeUniqueSlug } from '../src/makeUniqueSlug.js';

describe('makeUniqueSlug', () => {
    it('returns already unique slug when not found in list of given slugs', () => {
        expect(makeUniqueSlug('bring-us-a-shrubbery', ['what-is-your-quest', 'she-turned-me-into-a-newt', 'airspeed-velocity-of-an-unladen-swallow']))
            .toBe('bring-us-a-shrubbery')
    })

    it('returns a uniquely numbered slug when given an array of colliding slugs with the same content', () => {
        expect(makeUniqueSlug('bring-us-a-shrubbery', ['bring-us-a-shrubbery', 'bring-us-a-shrubbery-1', 'bring-us-a-shrubbery-2']))
            .toBe('bring-us-a-shrubbery-3')
    })

    it('appends -1 on the first collision', () => {
        expect(makeUniqueSlug('holy-hand-grenade', ['holy-hand-grenade']))
            .toBe('holy-hand-grenade-1')
    })

    it('returns slug as-is when existing slugs array is empty', () => {
        expect(makeUniqueSlug('i-told-him-we-already-got-one', []))
            .toBe('i-told-him-we-already-got-one')
    })

    it('appends collision suffix to slug that already ends with a number', () => {
        expect(makeUniqueSlug('the-meaning-of-life-is-42', ['the-meaning-of-life-is-42']))
            .toBe('the-meaning-of-life-is-42-1')
    })

    it('throws an error when an invalid slug is passed in', () => {
        expect(() => makeUniqueSlug('Not A Valid Slug!', [])).toThrow();
    })

    it('truncates before appending suffix when result would exceed 80 characters', () => {
        const longSlug = 'we-are-the-knights-who-say-ni-and-we-demand-a-sacrifice-bring-us-a-shrubbery-now';
        const slug = makeUniqueSlug(longSlug, [longSlug]);
        expect(slug.length).toBeLessThanOrEqual(80);
        expect(slug).not.toMatch(/-$/);
        expect(slug).not.toBe(longSlug);
    })
})
