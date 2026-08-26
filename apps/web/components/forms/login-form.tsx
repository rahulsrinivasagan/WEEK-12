'use client'

import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '@/lib/validations'
import { login } from '@/actions/auth-actions'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export function LoginForm({ message }: { message?: string }) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  React.useEffect(() => {
    if (message) {
      // Small timeout to ensure provider is fully ready
      const timer = setTimeout(() => {
        toast({
          title: 'Notification',
          description: message,
          type: 'success',
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [message, toast])

  const onSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      const result = await login(data)
      if (result?.error) {
        toast({
          title: 'Authentication Error',
          description: result.error,
          type: 'error',
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          disabled={isPending}
          className={errors.email ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          disabled={isPending}
          className={errors.password ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full font-semibold" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground/80 mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary hover:underline font-semibold transition-all">
          Sign up
        </Link>
      </div>
    </form>
  )
}
