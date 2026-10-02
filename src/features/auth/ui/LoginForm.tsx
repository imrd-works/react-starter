import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Input, Stack } from '@/shared/ui'

import styles from './LoginForm.module.scss'
import { createLoginSchema, PASSWORD_MIN_LENGTH, type LoginFormValues } from '../model/loginSchema'
import { useLogin } from '../model/useLogin'

export interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation('auth')
  const loginMutation = useLogin()
  const schema = createLoginSchema({
    email: t('validation.email', { ns: 'common' }),
    passwordMinLength: t('validation.minLength', { ns: 'common', count: PASSWORD_MIN_LENGTH }),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, { onSuccess })
  })

  return (
    <form className={styles.root} noValidate onSubmit={(event) => void onSubmit(event)}>
      <Stack gap="l">
        <Input
          label={t('form.email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label={t('form.password')}
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {loginMutation.isError ? (
          <p className={styles.error} role="alert">
            {loginMutation.error.message}
          </p>
        ) : null}
        <Button type="submit" size="l" loading={loginMutation.isPending}>
          {t('form.submit')}
        </Button>
      </Stack>
    </form>
  )
}
