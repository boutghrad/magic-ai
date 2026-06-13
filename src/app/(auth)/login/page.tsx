'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Chrome,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Show success message if redirected from registration
  const [successMessage, setSuccessMessage] = useState('')
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('registered') === 'true') {
      setSuccessMessage('Account created successfully! Please sign in.')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!password) {
      setError('Please enter your password')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error === 'CredentialsSignin'
          ? 'Invalid email or password'
          : result.error)
        setIsLoading(false)
      } else if (result?.ok) {
        // Use window.location.href for a full page reload
        // This is the most reliable way to establish the session in serverless environments
        window.location.href = '/dashboard'
      } else {
        setError('Sign in failed. Please try again.')
        setIsLoading(false)
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError('')
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch {
      setError('Failed to sign in with Google')
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px] animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-[150px] animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[200px]"
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, oklch(0.55 0.2 270) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-white/10 dark:border-white/[0.06] shadow-2xl shadow-purple-500/5">
          <CardHeader className="text-center space-y-4 pb-2">
            {/* Logo & Branding */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shadow-purple-500/25">
                  <Image
                    src="/logo.svg"
                    alt="Magic AI"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="absolute -inset-1 rounded-2xl magic-gradient opacity-30 blur-md -z-10" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  <span className="magic-text">Magic AI</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1.5">
                  Sign in to your account to continue learning
                </CardDescription>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Error Display */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    className="pl-10 h-11 bg-background/50 border-white/10 dark:border-white/[0.06] focus-visible:border-purple-500 focus-visible:ring-purple-500/20"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError('')
                    }}
                    className="pl-10 pr-10 h-11 bg-background/50 border-white/10 dark:border-white/[0.06] focus-visible:border-purple-500 focus-visible:ring-purple-500/20"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 magic-gradient text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10 dark:border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground uppercase tracking-wider">
                  or
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="w-full h-11 border-white/10 dark:border-white/[0.06] bg-background/50 hover:bg-accent/50 transition-all duration-200"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Chrome className="w-4 h-4" />
              )}
              Continue with Google
            </Button>
          </CardContent>

          <CardFooter className="justify-center pb-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
              >
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
