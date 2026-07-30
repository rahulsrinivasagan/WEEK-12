import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/tasks/dashboard-client'
import { Task } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Authenticate user server-side
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Fetch tasks sorted newest first by default
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 3. Handle connection or Supabase error states
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md border-destructive/20 glass-card">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle className="h-6 w-6 stroke-[2]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold">Failed to load tasks</h2>
              <p className="text-sm text-muted-foreground">
                There was an error connecting to Supabase: {error.message}. Please check your connection and configuration.
              </p>
            </div>
            <Button asChild className="w-full font-semibold">
              <a href="/dashboard">Retry</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 4. Render main Dashboard Client Panel
  return (
    <DashboardClient
      initialTasks={(tasks as Task[]) || []}
      userEmail={user.email || 'user@example.com'}
    />
  )
}
