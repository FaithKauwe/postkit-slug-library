import { describe, it, expect } from 'vitest';
import { batchCreateSlugs } from '../src/batchCreateSlugs.js';

describe('batchCreateSlugs', () => {
    it('returns array of unique slugs when given array of unique title strings', () => {
        expect(batchCreateSlugs(['Tis But a Flesh Wound', 'Knights who say Ni', 'First shalt thou take out the Holy Pin' ],
            ['what-is-your-quest','she-turned-me-into-a-newt', 'airspeed-velocity-of-an-unladen-swallow']))
// use .toEqual for arrays. toBe compares the exact same objects in memory, which arrays never are
            .toEqual(['tis-but-a-flesh-wound', 'knights-who-say-ni', 'first-shalt-thou-take-out-the-holy-pin'])
    })

    it ('returns array of single slug when given array with only one, unique title string', () => {
        expect(batchCreateSlugs(['First shalt thou take out the Holy Pin'],
            ['what-is-your-quest','she-turned-me-into-a-newt', 'airspeed-velocity-of-an-unladen-swallow']
        )).toEqual(['first-shalt-thou-take-out-the-holy-pin'])
    })

    it('returns an empty array when given an empty array', () => {
        expect(batchCreateSlugs([])).toEqual([])
    })

    it('appends suffixes to duplicate titles within the same batch', () => {
        expect(batchCreateSlugs([
            'We Are the Knights Who Say Ni',
            'We Are the Knights Who Say Ni'
        ])).toEqual(['we-are-the-knights-who-say-ni', 'we-are-the-knights-who-say-ni-1'])
    })

    it('handles collisions with existing slugs and with each other simultaneously', () => {
        expect(batchCreateSlugs(
            ['Bring Us a Shrubbery', 'Bring Us a Shrubbery'],
            ['bring-us-a-shrubbery']
        )).toEqual(['bring-us-a-shrubbery-1', 'bring-us-a-shrubbery-2'])
    })

    it('throws an error when any title in the batch is invalid', () => {
        expect(() => batchCreateSlugs([
            'Tis But a Flesh Wound',
            '',
            'I Got Better'
        ])).toThrow()
    })

    it('surfaces the indices of all invalid titles in the error message', () => {
        expect(() => batchCreateSlugs([
            'Tis But a Flesh Wound',
            '',
            'I Got Better',
            '!!!'
        ])).toThrow(/1, 3/)
    })

    it('defaults to empty existing slugs when not provided', () => {
        expect(batchCreateSlugs(['Run Away', 'Run Away']))
            .toEqual(['run-away', 'run-away-1'])
    })
})
