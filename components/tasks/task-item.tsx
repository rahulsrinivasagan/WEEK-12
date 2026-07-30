'use client'

import React, { useTransition, useState } from 'react'
import { updateTask, deleteTask } from '@/actions/task-actions'
import { useToast } from '@/components/ui/toast'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Task } from '@/types'
import { cn } from '@/lib/utils'

export function TaskItem({ task }: { task: Task }) {
  const { toast } = useToast()
  const [isUpdatePending, startUpdateTransition] = useTransition()
  const [isDeletePending, startDeleteTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleToggle = (checked: boolean) => {
    startUpdateTransition(async () => {
      const result = await updateTask(task.id, checked)
      if (result?.error) {
        toast({
          title: 'Error updating task',
          description: result.error,
          type: 'error',
        })
      }
    })
  }

  const handleDelete = () => {
    setIsDialogOpen(false)
    startDeleteTransition(async () => {
      const result = await deleteTask(task.id)
      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          type: 'error',
        })
      } else {
        toast({
          title: 'Success!',
          description: 'Task deleted successfully.',
          type: 'success',
        })
      }
    })
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  const isPending = isUpdatePending || isDeletePending

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:scale-[1.01] glass-panel',
          task.is_completed ? 'opacity-70 bg-secondary/20 border-border/40' : 'bg-card/45 border-border',
          isPending && 'pointer-events-none opacity-50'
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Checkbox
            id={`task-check-${task.id}`}
            checked={task.is_completed}
            onCheckedChange={handleToggle}
            disabled={isPending}
            aria-label={`Toggle task: ${task.title}`}
          />
          <div className="flex flex-col min-w-0">
            <span
              className={cn(
                'text-sm md:text-base font-medium break-words transition-all duration-200',
                task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'
              )}
            >
              {task.title}
            </span>
            <span className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground/60 mt-1">
              <Calendar className="h-3 w-3" />
              {formatDate(task.created_at)}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDialogOpen(true)}
          disabled={isPending}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
          aria-label={`Delete task: ${task.title}`}
        >
          {isDeletePending ? (
            <Loader2 className="h-4 w-4 animate-spin text-destructive" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
