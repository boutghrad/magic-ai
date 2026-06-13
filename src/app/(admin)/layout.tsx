'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

const ADMIN_PASSWORD = 'akram2015'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
]

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'true')
      onAuth()
    } else {
      setError('Invalid password. Access denied.')
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div
        className={`w-full max-w-md transition-transform ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
        style={isShaking ? { animation: 'shake 0.5s ease-in-out' } : {}}
      >
        <Card className="border-red-900/30 bg-gray-900/80 backdrop-blur-xl shadow-2xl shadow-red-950/20">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10 ring-2 ring-red-600/20">
              <Shield className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Admin Access
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter the admin password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-400 bg-red-950/50 border border-red-900/30 rounded-md px-3 py-2 text-center">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-11 shadow-lg shadow-red-900/30"
              >
                <Shield className="mr-2 h-4 w-4" />
                Unlock Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
          }
        `}</style>
      </div>
    </div>
  )
}

function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-950 border-r border-red-900/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-red-900/20">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/10">
                <Shield className="h-4 w-4 text-red-500" />
              </div>
              <span className="font-bold text-white text-lg">Magic AI</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-red-600/10 text-red-400 border border-red-900/30 shadow-sm shadow-red-900/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/60 border border-transparent'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-red-400' : ''}`} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Sidebar footer */}
          <div className="border-t border-red-900/20 p-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to App
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const hasCheckedAuth = React.useRef(false)

  useEffect(() => {
    if (hasCheckedAuth.current) return
    hasCheckedAuth.current = true
    const auth = localStorage.getItem('admin_auth')
    // Using startTransition to avoid the cascading render warning
    React.startTransition(() => {
      setAuthState(auth === 'true' ? 'authenticated' : 'unauthenticated')
    })
  }, [])

  const handleAuth = useCallback(() => {
    setAuthState('authenticated')
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('admin_auth')
    setAuthState('unauthenticated')
  }, [])

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (authState !== 'authenticated') {
    return <PasswordGate onAuth={handleAuth} />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-red-900/20 bg-gray-950/95 backdrop-blur-lg px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            <span className="hidden sm:inline-flex items-center rounded-full bg-red-600/10 px-2.5 py-0.5 text-xs font-medium text-red-400 border border-red-900/30">
              Restricted
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Back to App</span>
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6 bg-red-900/20" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
