'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  title?: string
  description?: string
  type?: ToastType
}

interface ToastContextType {
  toast: (options: Omit<Toast, 'id'>) => void
  toasts: Toast[]
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((options: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...options }])

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      <Toaster toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function Toaster({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info
        let iconColor = 'text-blue-500'
        if (toast.type === 'success') {
          Icon = CheckCircle
          iconColor = 'text-emerald-500'
        } else if (toast.type === 'error') {
          Icon = AlertCircle
          iconColor = 'text-rose-500'
        }

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-5',
              'glass-card'
            )}
          >
            <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconColor)} />
            <div className="flex-1 grid gap-1">
              {toast.title && <h4 className="font-semibold text-sm leading-none">{toast.title}</h4>}
              {toast.description && <p className="text-xs text-muted-foreground">{toast.description}</p>}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary rounded-lg p-0.5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
