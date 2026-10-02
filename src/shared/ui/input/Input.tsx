import { useId, type InputHTMLAttributes, type Ref } from 'react'

import { cx } from '@/shared/lib'

import { getDescribedBy } from './describedBy'
import { Field } from './Field'
import fieldStyles from './Field.module.scss'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  error?: string | undefined
  hint?: string | undefined
  ref?: Ref<HTMLInputElement>
}

export function Input({ label, error, hint, className, ...rest }: InputProps) {
  const id = useId()

  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <input
        {...rest}
        id={id}
        className={cx(fieldStyles.control, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={getDescribedBy(id, error, hint)}
      />
    </Field>
  )
}
