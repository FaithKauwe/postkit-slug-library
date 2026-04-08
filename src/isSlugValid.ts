export function isSlugValid(slug: string): boolean {
  if (slug.length === 0 || slug.length >80) return false;

  if (slug.startsWith('-') || slug.endsWith('-')) return false;

// regex check: ^ means NOT, a-z0-9- means lowercase letters, digits and hyphens. So anything not matching what is in that
// set get returned as false
  if (/[^a-z0-9-]/.test(slug)) return false;
  if (/--/.test(slug)) return false;

  return true;
}
