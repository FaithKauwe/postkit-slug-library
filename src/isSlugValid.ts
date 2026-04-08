// #### Edge Cases

// - **Empty string** — returns `false`
// - **Contains uppercase letters** (e.g., `"My-Post"`) — returns `false`
// - **Contains spaces** (e.g., `"my post"`) — returns `false`
// - **Contains special characters or emojis** — returns `false`
// - **Consecutive hyphens** (e.g., `"my--post"`) — returns `false`
// - **Starts or ends with a hyphen** (e.g., `"-my-post"`) — returns `false`
// - **Exceeds max length (80 characters)** — returns `false`
// - **Contains only numbers** (e.g., `"12345"`) — returns `true` (numbers are valid slug characters)

// ---

export function isSlugValid(slug: string): boolean {
  if (slug.length === 0 || slug.length >80) return false;

  if (slug.startsWith('-') || slug.endsWith('-')) return false;

// regex check: ^ means NOT, a-z0-9- means lowercase letters, digits and hyphens. So anything not matching what is in that
// set get returned as false
  if (/[^a-z0-9-]/.test(slug)) return false;
  if (/--/.test(slug)) return false;

  return true;
}
