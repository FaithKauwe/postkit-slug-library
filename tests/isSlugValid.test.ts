import { describe, it, expect } from 'vitest';
import { isSlugValid } from '../src/isSlugValid.js';

describe('isSlugValid', () => {
  it('returns true for a valid slug', () => {
    expect(isSlugValid('tis-but-a-flesh-wound')).toBe(true);
  });

  it('returns true for slug made of only numbers', () => {
    expect(isSlugValid('050143')).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isSlugValid('')).toBe(false);
  });

  it('returns false when slug contains uppercase letters', () => {
    expect(isSlugValid('Knights-Who-Say-Ni')).toBe(false);
  });

  it('returns false when slug contains spaces', () => {
    expect(isSlugValid('bring us a shrubbery')).toBe(false);
  });

  it('returns false when slug contains special characters', () => {
    expect(isSlugValid('what-is-your-quest!')).toBe(false);
  });

  it('returns false when slug contains emojis', () => {
    expect(isSlugValid('holy-grail-🏆')).toBe(false);
  });

  it('returns false when slug has consecutive hyphens', () => {
    expect(isSlugValid('she--turned-me-into-a-newt')).toBe(false);
  });

  it('returns false when slug starts with a hyphen', () => {
    expect(isSlugValid('-i-got-better')).toBe(false);
  });

  it('returns false when slug ends with a hyphen', () => {
    expect(isSlugValid('i-got-better-')).toBe(false);
  });

  it('returns false when slug exceeds 80 characters', () => {
    expect(isSlugValid(
      'we-are-the-knights-who-say-ni-and-we-demand-a-sacrifice-bring-us-a-shrubbery-now-please'
    )).toBe(false);
  });
});


