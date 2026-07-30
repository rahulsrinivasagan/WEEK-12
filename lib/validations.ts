import { z } from 'zod'

// Task Schema
export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title cannot be empty.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),
})

export type TaskFormValues = z.infer<typeof taskSchema>

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    email: z.string().trim().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type SignupFormValues = z.infer<typeof signupSchema>
