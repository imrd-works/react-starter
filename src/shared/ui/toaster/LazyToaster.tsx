import { lazy, Suspense, useEffect, useSyncExternalStore } from 'react'

import { toasterHost } from '@/shared/lib'

const SonnerToaster = lazy(async () => {
  const { Toaster } = await import('sonner')

  function MountedToaster() {
    useEffect(() => {
      toasterHost.markMounted()
    }, [])

    return <Toaster richColors closeButton position="bottom-right" />
  }

  return { default: MountedToaster }
})

/** Mounts `sonner` only after the first `toast.*()` call (see shared/lib/toast). */
export function LazyToaster() {
  const requested = useSyncExternalStore(toasterHost.subscribe, toasterHost.isRequested)

  if (!requested) return null

  return (
    <Suspense fallback={null}>
      <SonnerToaster />
    </Suspense>
  )
}
