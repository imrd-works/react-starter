import { z } from 'zod'

export const PASSWORD_MIN_LENGTH = 8

export interface LoginSchemaMessages {
  email: string
  passwordMinLength: string
}

/** Messages are injected so the schema stays pure and testable without i18n. */
export function createLoginSchema(messages: LoginSchemaMessages) {
  return z.object({
    email: z.email({ error: messages.email }),
    password: z.string().min(PASSWORD_MIN_LENGTH, { error: messages.passwordMinLength }),
  })
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>
