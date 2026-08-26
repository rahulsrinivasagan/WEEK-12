import { LoginForm } from '@/components/forms/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const message = typeof resolvedParams.message === 'string' ? resolvedParams.message : undefined

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-background">
      {/* Decorative gradient background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />

      <Card className="w-full max-w-md shadow-2xl relative z-10 glass-card">
        <CardHeader className="space-y-2 text-center pb-2">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-md shadow-primary/20">
              <CheckSquare className="h-6 w-6 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              TaskZen
            </span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground/80">
            Sign in to your account to manage your tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <LoginForm message={message} />
        </CardContent>
      </Card>
    </div>
  )
}
