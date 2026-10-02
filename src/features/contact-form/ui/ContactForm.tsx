import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Input, Stack, Textarea } from '@/shared/ui'

import { sendContactMessage, type ContactMessage } from '../api/contactApi'
import {
  createContactSchema,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  type ContactFormValues,
} from '../model/contactSchema'

export function ContactForm() {
  const { t } = useTranslation('contact-form')
  const schema = createContactSchema({
    email: t('validation.email', { ns: 'common' }),
    messageMinLength: t('validation.minLength', { ns: 'common', count: MESSAGE_MIN_LENGTH }),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', message: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: ContactMessage) => sendContactMessage(values, t('success')),
    onSuccess: () => {
      reset()
    },
  })

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values)
  })

  return (
    <form noValidate onSubmit={(event) => void onSubmit(event)}>
      <Stack gap="l">
        <Input
          label={t('email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Textarea
          label={t('message')}
          hint={t('messageHint', { max: MESSAGE_MAX_LENGTH })}
          maxLength={MESSAGE_MAX_LENGTH}
          error={errors.message?.message}
          {...register('message')}
        />
        <Button type="submit" loading={mutation.isPending}>
          {t('submit')}
        </Button>
      </Stack>
    </form>
  )
}
