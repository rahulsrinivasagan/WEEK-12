'use client'

import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, type TaskFormValues } from '@repo/common-types'
import { createTask } from '@/actions/task-actions'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Loader2 } from 'lucide-react'

export function CreateTaskForm() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
    },
  })

  const onSubmit = (data: TaskFormValues) => {
    startTransition(async () => {
      const result = await createTask(data)
      if (result?.error) {
        toast({
          title: 'Error Creating Task',
          description: result.error,
          type: 'error',
        })
      } else {
        toast({
          title: 'Success!',
          description: 'Task added successfully.',
          type: 'success',
        })
        reset()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="title"
            placeholder="Add a new task (e.g. Clean the kitchen)..."
            disabled={isPending}
            className={errors.title ? 'border-rose-500 focus-visible:ring-rose-500 pr-10' : 'pr-10'}
            aria-label="New task title"
            {...register('title')}
          />
        </div>
        <Button type="submit" disabled={isPending} className="shrink-0 font-semibold gap-1.5">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 stroke-[2.5]" />
          )}
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </div>
      {errors.title && (
        <p className="text-xs text-rose-500 font-medium ml-1">{errors.title.message}</p>
      )}
    </form>
  )
}
