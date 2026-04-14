import { makeUniqueSlug } from "./makeUniqueSlug.js"
import { createSlugFromTitle } from "./createSlugFromTitle.js";

export function batchCreateSlugs(titles: string[], existingSlugs?: string[]): string[] {

    const errorIndexes: number[] = [];
// one loop to catch any invalid indecses, try/catch can't be used with if/else so it has to be it's own loop
    for (let i = 0; i < titles.length; i++) {
        try {
            createSlugFromTitle(titles[i]!);
        } catch {
            errorIndexes.push(i);
        }
    }
// catch any invalid indexes and add them to one array that get's surfaced to user with the Error message
    if (errorIndexes.length > 0) {
        throw new Error(`Invalid titles at indices: ${errorIndexes.join(', ')}`);
    }

// use spread operator ... make a copy of the existingSlugs to work with in the scope of the function, not mutating the og
// if existingSlugs is undefined (??) use empty list instead []
    const allSlugs = [...(existingSlugs ?? [])];
    const batchedSlugsResult: string[] = [];
// second for loop calls the other functions to create the slugs and verify/ create uniqueness
// then adds them to both the results array and the working allSlugs array so that the comparison for uniqueness
// gets updated (allSlugs needs to get new slugs added to then compare other new slugs to)
    for (const title of titles) {
        const slug = createSlugFromTitle(title);
        const uniqueSlug = makeUniqueSlug(slug, allSlugs);
        allSlugs.push(uniqueSlug);
        batchedSlugsResult.push(uniqueSlug);
    }

    return batchedSlugsResult;
}
