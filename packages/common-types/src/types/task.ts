export interface Task {
  id: string
  title: string
  is_completed: boolean
  user_id: string
  created_at: string
}

export interface CreateTaskInput {
  title: string
}

export interface UpdateTaskInput {
  id: string
  is_completed: boolean
}

export interface TaskActionState {
  error?: string
  success?: boolean
}
