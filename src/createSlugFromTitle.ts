import { isSlugValid } from './isSlugValid.js';

const MAX_LENGTH = 80;

export function createSlugFromTitle(title: string): string {
// remove leading/trailing whitespace
    let slug = title.trim();
// early error out if empty string
    if (slug.length === 0) {
        throw new Error('Title cannot be empty.');
    }

    // chain all the various normalizing and converting actions together
    slug = slug
    // deconstructs é into e + ◌́ as two separate characters.
        .normalize('NFD')
    // strips those accent marks, leaving just e
        .replace(/[\u0300-\u036f]/g, '')
    // lowers everything
        .toLowerCase()
    // one or more spaces become a single hyphen
        .replace(/\s+/g, '-')
    // strip anything that's not a letter, digit, or hyphen (emojis, special chars, etc.)
        .replace(/[^a-z0-9-]/g, '')
    // collapse consecutive hyphens into one
        .replace(/-{2,}/g, '-')
    // trim leading/trailing hyphens
        .replace(/^-|-$/g, '');

    // now that things have been stripped, do a second empty check ('!!!' would have been stripped and now be empty string)
        if (slug.length === 0) {
        throw new Error('Title must contain at least one alphanumeric character.');
    }

    //if title is over MAX_LENGTH, truncate it back to the end of the last word
    if (slug.length > MAX_LENGTH) {
        slug = slug.substring(0, MAX_LENGTH);
    // lastIndexOf is a built in TS function, searches backwards and finds last instance of the char you provide as arg and returns the index of that last index
    // at this point, whitespaces have been converted to hyphens so I use hyphens as the boundary to find the last complete word so that the slug doesn't
    // cut off in the middle of a word
    const lastHyphen = slug.lastIndexOf('-');
    // use the provided index to slice the string and return the truncated slug
    if (lastHyphen > 0) {
            slug = slug.substring(0, lastHyphen);
        }
    }
    // call isSlugValid as a final safety net
    if (!isSlugValid(slug)) {
        throw new Error(`Generated slug is invalid: "${slug}"`);
    }

    return slug;
}