import { z } from 'zod'

export const MESSAGE_MIN_LENGTH = 10
export const MESSAGE_MAX_LENGTH = 1000

export interface ContactSchemaMessages {
  email: string
  messageMinLength: string
}

export function createContactSchema(messages: ContactSchemaMessages) {
  return z.object({
    email: z.email({ error: messages.email }),
    message: z
      .string()
      .trim()
      .min(MESSAGE_MIN_LENGTH, { error: messages.messageMinLength })
      .max(MESSAGE_MAX_LENGTH),
  })
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>
