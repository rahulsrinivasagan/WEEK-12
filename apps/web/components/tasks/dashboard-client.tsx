'use client'

import React, { useState, useTransition } from 'react'
import type { Task } from '@repo/common-types'
import { CreateTaskForm } from './create-task-form'
import { TaskItem } from './task-item'
import { ThemeToggle } from '@/components/theme-toggle'
import { logout } from '@/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  CheckSquare,
  LogOut,
  Search,
  ArrowUpDown,
  Inbox,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  ClipboardList,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardClient({
  initialTasks,
  userEmail,
}: {
  initialTasks: Task[]
  userEmail: string
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest')
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
    })
  }

  // Filter & Sort tasks on the client side for instant responsiveness
  const processedTasks = React.useMemo(() => {
    let result = [...initialTasks]

    // Search
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter((task) => task.title.toLowerCase().includes(query))
    }

    // Filter
    if (filter === 'completed') {
      result = result.filter((task) => task.is_completed)
    } else if (filter === 'pending') {
      result = result.filter((task) => !task.is_completed)
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }

    return result
  }, [initialTasks, search, filter, sortBy])

  // Counters computation
  const totalCount = initialTasks.length
  const completedCount = initialTasks.filter((task) => task.is_completed).length
  const pendingCount = totalCount - completedCount

  const todayStr = React.useMemo(() => {
    const today = new Date()
    return today.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Navbar Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-md transition-all">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground shadow-md shadow-primary/20">
              <CheckSquare className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              TaskZen
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 h-10 px-3 rounded-lg border-border/50 bg-background/50 hover:bg-secondary/50 font-medium max-w-[200px]"
                >
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="hidden md:inline truncate">{userEmail}</span>
                  <span className="md:hidden truncate">User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2.5 py-2">
                  <p className="text-xs text-muted-foreground/60">Signed in as</p>
                  <p className="text-sm font-medium truncate mt-0.5">{userEmail}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isPending}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg py-2"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>{isPending ? 'Logging out...' : 'Log out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Dashboard Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              Workspace
            </h1>
            <p className="text-sm md:text-base text-muted-foreground/80 flex items-center gap-1.5 mt-1 font-medium">
              <Calendar className="h-4 w-4 text-primary/70 shrink-0" />
              {todayStr}
            </p>
          </div>
        </div>

        {/* Counter cards */}
        <section className="grid grid-cols-3 gap-3 md:gap-4">
          {/* Total Counter Card */}
          <Card className="glass-card shadow-sm border border-border/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-semibold text-muted-foreground/80">Total</p>
                <p className="text-xl md:text-3xl font-bold tracking-tight">{totalCount}</p>
              </div>
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl hidden sm:block">
                <ClipboardList className="h-5 w-5 stroke-[2.2]" />
              </div>
            </CardContent>
          </Card>

          {/* Completed Counter Card */}
          <Card className="glass-card shadow-sm border border-border/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-semibold text-muted-foreground/80">Completed</p>
                <p className="text-xl md:text-3xl font-bold tracking-tight text-emerald-500">
                  {completedCount}
                </p>
              </div>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hidden sm:block">
                <CheckCircle2 className="h-5 w-5 stroke-[2.2]" />
              </div>
            </CardContent>
          </Card>

          {/* Pending Counter Card */}
          <Card className="glass-card shadow-sm border border-border/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-semibold text-muted-foreground/80">Pending</p>
                <p className="text-xl md:text-3xl font-bold tracking-tight text-amber-500">
                  {pendingCount}
                </p>
              </div>
              <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl hidden sm:block">
                <Clock className="h-5 w-5 stroke-[2.2]" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Task CRUD Creator Input */}
        <section className="bg-card/40 border border-border/50 rounded-2xl p-4 md:p-6 shadow-sm glass-panel">
          <h2 className="text-sm font-semibold text-muted-foreground/80 mb-3 tracking-wide uppercase">
            Create New Task
          </h2>
          <CreateTaskForm />
        </section>

        {/* Filters and Controls Area */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-secondary/20 p-2 rounded-2xl border border-border/30 backdrop-blur-sm">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/60 border-border/30 h-10 w-full focus-visible:ring-primary/40 focus-visible:ring-1"
                aria-label="Search tasks input"
              />
            </div>

            {/* Controls Filters / Sort */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Filter Tabs */}
              <div className="flex items-center bg-background/50 border border-border/30 rounded-xl p-1 shrink-0">
                {(['all', 'completed', 'pending'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200',
                      filter === item
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground/80 hover:text-foreground'
                    )}
                    aria-label={`Filter by ${item}`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-border/30 bg-background/50 hover:bg-secondary/50 h-10 w-10 p-0 rounded-xl shrink-0"
                    aria-label="Sort tasks menu"
                  >
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <span className="text-xs font-semibold text-muted-foreground/60">Sort Tasks</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setSortBy('newest')}
                    className={cn(
                      'cursor-pointer rounded-lg py-2',
                      sortBy === 'newest' && 'bg-primary/10 text-primary font-semibold'
                    )}
                  >
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy('oldest')}
                    className={cn(
                      'cursor-pointer rounded-lg py-2',
                      sortBy === 'oldest' && 'bg-primary/10 text-primary font-semibold'
                    )}
                  >
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy('alphabetical')}
                    className={cn(
                      'cursor-pointer rounded-lg py-2',
                      sortBy === 'alphabetical' && 'bg-primary/10 text-primary font-semibold'
                    )}
                  >
                    Alphabetical (A-Z)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Selected Filter indicator */}
          {(filter !== 'all' || sortBy !== 'newest' || search !== '') && (
            <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
              <span className="text-muted-foreground/60 mr-1">Active criteria:</span>
              {filter !== 'all' && (
                <Badge variant="secondary" className="gap-1 rounded-lg">
                  Filter: <span className="text-primary font-semibold capitalize">{filter}</span>
                </Badge>
              )}
              {sortBy !== 'newest' && (
                <Badge variant="secondary" className="gap-1 rounded-lg">
                  Sort:{' '}
                  <span className="text-primary font-semibold capitalize">
                    {sortBy === 'alphabetical' ? 'A-Z' : sortBy}
                  </span>
                </Badge>
              )}
              {search !== '' && (
                <Badge variant="secondary" className="gap-1 rounded-lg truncate max-w-[200px]">
                  Search: <span className="text-primary font-semibold">&quot;{search}&quot;</span>
                </Badge>
              )}
              <button
                onClick={() => {
                  setFilter('all')
                  setSortBy('newest')
                  setSearch('')
                }}
                className="text-primary hover:underline font-semibold ml-1.5"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Task List container */}
          <div className="space-y-3">
            {processedTasks.length > 0 ? (
              processedTasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              /* Beautiful Empty State SVG Illustration */
              <div className="text-center py-16 px-4 border border-dashed border-border/50 rounded-2xl bg-secondary/5 backdrop-blur-xs flex flex-col items-center justify-center">
                <div className="relative mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl w-16 h-16 animate-pulse" />
                  <Inbox className="h-12 w-12 text-muted-foreground/40 stroke-[1.25] relative" />
                </div>
                <h3 className="text-base font-bold text-foreground/90">No tasks found</h3>
                <p className="text-sm text-muted-foreground/80 max-w-sm mt-1">
                  {initialTasks.length === 0
                    ? "Welcome! You don't have any tasks created yet. Get started by adding one above."
                    : "No tasks matched your search or filters. Try adjustments or clear criteria."}
                </p>
                {initialTasks.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilter('all')
                      setSortBy('newest')
                      setSearch('')
                    }}
                    className="mt-4 border-border/50 rounded-xl"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
