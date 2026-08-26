import { z } from 'zod'

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title cannot be empty.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),
})

export type TaskFormValues = z.infer<typeof taskSchema>
