import { isSlugValid } from './isSlugValid.js';

const MAX_LENGTH = 80;

/**
 * Returns a slug that does not conflict with any existing slugs.
 * If the slug already exists, appends `-1`, `-2`, etc. until a unique slug is found.
 * The output is validated with `isSlugValid` before returning.
 * @param slug - A valid slug (use `createSlugFromTitle` first if starting from a raw title)
 * @param existingSlugs - Array of slugs to check against (assumed to contain valid slugs)
 * @returns A unique slug that is not in the existing slugs list
 * @throws {Error} If the input slug is not valid
 * @example
 * makeUniqueSlug("holy-hand-grenade", [])                          // "holy-hand-grenade"
 * makeUniqueSlug("holy-hand-grenade", ["holy-hand-grenade"])       // "holy-hand-grenade-1"
 * makeUniqueSlug("bring-us-a-shrubbery", ["bring-us-a-shrubbery",
 *   "bring-us-a-shrubbery-1", "bring-us-a-shrubbery-2"])          // "bring-us-a-shrubbery-3"
 */
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