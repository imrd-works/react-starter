import { describe, expect, it } from 'vitest'

import { createLoginSchema } from './loginSchema'

const schema = createLoginSchema({ email: 'bad-email', passwordMinLength: 'short' })

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(schema.safeParse({ email: 'a@b.co', password: 'password123' }).success).toBe(true)
  })

  it('returns injected messages for invalid fields', () => {
    const result = schema.safeParse({ email: 'nope', password: '123' })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.message)).toEqual(['bad-email', 'short'])
  })
})
