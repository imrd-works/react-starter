import { useEffect, useState } from 'react'

/**
 * Returns `value` once it has stopped changing for `delayMs`. Use for search inputs.
 * @public Starter utility, kept even while unused.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value)
    }, delayMs)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delayMs])

  return debounced
}
