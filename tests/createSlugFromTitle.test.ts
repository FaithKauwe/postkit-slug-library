import { describe, it, expect } from 'vitest';
import { createSlugFromTitle } from '../src/createSlugFromTitle.js';

describe('createSlugFromTitle', () => {
    it('returns slug from normal title', () => {
        expect(createSlugFromTitle("Tis But a Flesh Wound")).toBe("tis-but-a-flesh-wound");
    });

    it('returns normalized slug from string with special characters', () => {
        expect(createSlugFromTitle('What Is Your Quest!')).toBe('what-is-your-quest');
    });

    it('returns normalized slug from string with emojis', () => {
        expect(createSlugFromTitle('Holy Grail 🏆 Quest')).toBe('holy-grail-quest');
    });

    it('collapses multiple consecutive spaces into a single hyphen', () => {
        expect(createSlugFromTitle('She   Turned Me   Into a Newt')).toBe('she-turned-me-into-a-newt');
    });

    it('trims leading and trailing spaces', () => {
        expect(createSlugFromTitle('  I Got Better  ')).toBe('i-got-better');
    });

    it('converts accented characters to ASCII equivalents', () => {
        expect(createSlugFromTitle('Café Résumé')).toBe('cafe-resume');
    });

    it('does not double-hyphenate titles that already contain hyphens', () => {
        expect(createSlugFromTitle('The Black-Knight Fights On')).toBe('the-black-knight-fights-on');
    });

    it('truncates long titles to 80 characters at a word boundary', () => {
        const slug = createSlugFromTitle(
            'We Are the Knights Who Say Ni and We Demand a Sacrifice so Please Bring Us a Shrubbery Before We Say Ni Again'
        );
        expect(slug.length).toBeLessThanOrEqual(80);
        expect(slug).not.toMatch(/-$/);
    });

    it('throws an error for an empty string', () => {
        expect(() => createSlugFromTitle('')).toThrow();
    });

    it('throws an error for a whitespace-only string', () => {
        expect(() => createSlugFromTitle('   ')).toThrow();
    });

    it('throws an error when title is only special characters', () => {
        expect(() => createSlugFromTitle('!!!')).toThrow();
    });
})