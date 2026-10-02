import type { toast as sonnerToast } from 'sonner'

/**
 * Lazy toasts: `sonner` is loaded only on the first toast call, so it never
 * lands in the initial bundle. `<LazyToaster />` (shared/ui) mounts the host.
 */
type ToastApi = typeof sonnerToast
type ToastKind = 'success' | 'error' | 'info'

const listeners = new Set<() => void>()
const hostMounted = Promise.withResolvers<undefined>()
let hostRequested = false
let sonnerPromise: Promise<ToastApi> | undefined

export const toasterHost = {
  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  isRequested: (): boolean => hostRequested,
  markMounted: (): void => {
    hostMounted.resolve(undefined)
  },
}

async function importSonner(): Promise<ToastApi> {
  const { toast } = await import('sonner')
  return toast
}

async function loadToast(): Promise<ToastApi> {
  if (!hostRequested) {
    hostRequested = true
    for (const listener of listeners) listener()
  }

  sonnerPromise ??= importSonner()
  const toastApi = await sonnerPromise
  await hostMounted.promise
  return toastApi
}

async function show(kind: ToastKind, message: string, description?: string): Promise<void> {
  const toastApi = await loadToast()
  toastApi[kind](message, description ? { description } : {})
}

export const toast = {
  success: (message: string, description?: string): void => {
    void show('success', message, description)
  },
  error: (message: string, description?: string): void => {
    void show('error', message, description)
  },
  info: (message: string, description?: string): void => {
    void show('info', message, description)
  },
}
