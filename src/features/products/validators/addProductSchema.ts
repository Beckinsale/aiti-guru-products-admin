// @req FR-PROD-006
import { z } from 'zod'

export const addProductSchema = z.object({
  title: z.string().min(1, 'Обязательное поле'),
  price: z.coerce.number({ error: 'Введите число' }).positive('Должно быть положительным'),
  brand: z.string().min(1, 'Обязательное поле'),
  sku: z.string().min(1, 'Обязательное поле'),
})

export type AddProductFormValues = z.infer<typeof addProductSchema>
