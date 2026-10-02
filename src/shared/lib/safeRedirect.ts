/**
 * Returns `target` only if it is a same-origin relative path, otherwise `fallback`.
 * Protects `?redirect=` query params from open-redirect attacks (`//evil.com`, `https://…`).
 */
export function getSafeRedirect(target: string | null | undefined, fallback: string): string {
  if (!target?.startsWith('/') || target.startsWith('//') || target.startsWith('/\\')) {
    return fallback
  }

  return target
}
