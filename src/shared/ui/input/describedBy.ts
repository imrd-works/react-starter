/** Id of the element that describes the control: the error wins over the hint. */
export function getDescribedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}
