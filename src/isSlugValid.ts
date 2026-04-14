/**
 * Checks whether a slug follows the library's slug rules.
 * A valid slug contains only lowercase letters, numbers, and hyphens,
 * with no consecutive, leading, or trailing hyphens, and is at most 80 characters.
 * @param slug - The slug string to validate
 * @returns `true` if the slug is valid, `false` otherwise
 * @example
 * isSlugValid("tis-but-a-flesh-wound") // true
 * isSlugValid("Knights-Who-Say-Ni")    // false (uppercase)
 * isSlugValid("--double--hyphens--")   // false
 */
export function isSlugValid(slug: string): boolean {
  if (slug.length === 0 || slug.length >80) return false;

  if (slug.startsWith('-') || slug.endsWith('-')) return false;

// regex check: ^ means NOT, a-z0-9- means lowercase letters, digits and hyphens. So anything not matching what is in that
// set get returned as false
  if (/[^a-z0-9-]/.test(slug)) return false;
  if (/--/.test(slug)) return false;

  return true;
}
