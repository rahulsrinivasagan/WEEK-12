'use client'

import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupFormValues } from '@/lib/validations'
import { signup } from '@/actions/auth-actions'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export function SignupForm() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: SignupFormValues) => {
    startTransition(async () => {
      const result = await signup(data)
      if (result?.error) {
        toast({
          title: 'Sign Up Error',
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
        <Label htmlFor="password">Password</Label>
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          disabled={isPending}
          className={errors.confirmPassword ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-rose-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full font-semibold" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground/80 mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-semibold transition-all">
          Sign In
        </Link>
      </div>
    </form>
  )
}
