import { useId, type Ref, type TextareaHTMLAttributes } from 'react'

import { cx } from '@/shared/lib'

import { getDescribedBy } from './describedBy'
import { Field } from './Field'
import fieldStyles from './Field.module.scss'

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  error?: string | undefined
  hint?: string | undefined
  ref?: Ref<HTMLTextAreaElement>
}

export function Textarea({ label, error, hint, className, ...rest }: TextareaProps) {
  const id = useId()

  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <textarea
        {...rest}
        id={id}
        className={cx(fieldStyles.control, fieldStyles.textarea, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={getDescribedBy(id, error, hint)}
      />
    </Field>
  )
}
