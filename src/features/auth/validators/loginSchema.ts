// @req FR-AUTH-001
import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Обязательное поле'),
  password: z.string().min(1, 'Обязательное поле'),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
