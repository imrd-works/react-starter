/**
 * Dependency inversion: `shared` must not import upper layers (session, router),
 * so the app layer injects these callbacks at startup (see app/setup/configureApi.ts).
 */
export interface ApiHooks {
  getAccessToken: () => string | null
  onUnauthorized: () => void
}

const hooks: ApiHooks = {
  getAccessToken: () => null,
  onUnauthorized: () => undefined,
}

export function configureApi(overrides: Partial<ApiHooks>): void {
  Object.assign(hooks, overrides)
}

export function getApiHooks(): Readonly<ApiHooks> {
  return hooks
}
