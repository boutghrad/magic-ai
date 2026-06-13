'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  // If user is already authenticated, redirect to dashboard
  // Use window.location.href for a full page reload to ensure
  // the middleware and session are in sync
  useEffect(() => {
    if (status === 'authenticated' && session) {
      window.location.href = '/dashboard'
    }
  }, [status, session])

  // Show nothing while checking session to prevent flash
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    )
  }

  // If authenticated, don't render auth pages (redirect in progress)
  if (status === 'authenticated' && session) {
    return null
  }

  return <>{children}</>
}
