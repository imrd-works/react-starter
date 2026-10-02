import { api, type ApiSchemas } from '@/shared/api'

export type ContactMessage = ApiSchemas['ContactRequest']

export async function sendContactMessage(
  message: ContactMessage,
  successToast: string
): Promise<ApiSchemas['ContactResponse']> {
  const { data } = await api.post<ApiSchemas['ContactResponse']>('/contacts', message, {
    toast: { success: successToast },
  })
  return data
}
