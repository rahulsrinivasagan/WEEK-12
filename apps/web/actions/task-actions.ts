'use server'

import { createClient } from '@/lib/supabase/server'
import { taskSchema } from '@repo/common-types'
import { revalidatePath } from 'next/cache'

export async function createTask(formData: unknown) {
  const supabase = await createClient()

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'You must be logged in to perform this action.' }
  }

  // 2. Validate input on the server side
  const result = taskSchema.safeParse(formData)
  if (!result.success) {
    return {
      error: result.error.issues[0]?.message || 'Invalid task input.',
    }
  }

  const { title } = result.data

  // 3. Database INSERT
  const { error: dbError } = await supabase.from('tasks').insert({
    title,
    user_id: user.id,
  })

  if (dbError) {
    return { error: dbError.message }
  }

  // 4. Revalidate dashboard path
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateTask(id: string, isCompleted: boolean) {
  const supabase = await createClient()

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'You must be logged in to update a task.' }
  }

  if (!id) {
    return { error: 'Task ID is required.' }
  }

  // 2. Database UPDATE with user_id check
  const { error: dbError } = await supabase
    .from('tasks')
    .update({ is_completed: isCompleted })
    .eq('id', id)
    .eq('user_id', user.id)

  if (dbError) {
    return { error: dbError.message }
  }

  // 3. Revalidate dashboard path
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteTask(id: string) {
  const supabase = await createClient()

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'You must be logged in to delete a task.' }
  }

  if (!id) {
    return { error: 'Task ID is required.' }
  }

  // 2. Database DELETE with user_id check
  const { error: dbError } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (dbError) {
    return { error: dbError.message }
  }

  // 3. Revalidate dashboard path
  revalidatePath('/dashboard')
  return { success: true }
}
