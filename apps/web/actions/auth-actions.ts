'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema } from '@/lib/validations'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: unknown) {
  const result = loginSchema.safeParse(formData)
  if (!result.success) {
    return {
      error: result.error.issues[0]?.message || 'Invalid input validation.',
    }
  }

  const { email, password } = result.data
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: unknown) {
  const result = signupSchema.safeParse(formData)
  if (!result.success) {
    return {
      error: result.error.issues[0]?.message || 'Invalid input validation.',
    }
  }

  const { email, password } = result.data
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')

  // If a session is returned (email confirmation disabled), redirect to dashboard
  if (data.session) {
    redirect('/dashboard')
  } else {
    // If confirmation is required, redirect to login with a friendly message
    redirect('/login?message=Registration successful! Please check your email to verify your account.')
  }
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
