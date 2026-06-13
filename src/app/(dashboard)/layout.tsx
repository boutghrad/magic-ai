'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calculator,
  Atom,
  BookOpen,
  Brain,
  Calendar,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  ChevronLeft,
  Menu,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Calculator, label: 'Math Solver', href: '/math-solver' },
  { icon: Atom, label: 'Science Tutor', href: '/science-tutor' },
  { icon: BookOpen, label: 'Homework', href: '/homework' },
  { icon: Brain, label: 'Quiz Generator', href: '/quiz-generator' },
  { icon: Calendar, label: 'Study Planner', href: '/study-planner' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 px-2">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href))
        const Icon = item.icon

        const linkContent = (
          <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary/15 text-primary shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              collapsed && 'justify-center px-2'
            )}
          >
            <Icon
              className={cn(
                'shrink-0 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
              size={20}
            />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="truncate"
              >
                {item.label}
              </motion.span>
            )}
            {isActive && !collapsed && (
              <motion.div
                layoutId="activeNav"
                className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </Link>
        )

        if (collapsed) {
          return (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {item.label}
              </TooltipContent>
            </Tooltip>
          )
        }

        return <div key={item.href}>{linkContent}</div>
      })}
    </nav>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sessionCheckDone, setSessionCheckDone] = useState(false)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  // Wait for session to resolve, then handle auth state
  // We do NOT redirect immediately - we wait for session to fully load first
  useEffect(() => {
    // Only act after session status is no longer loading
    if (status === 'loading') return

    setSessionCheckDone(true)

    // If session is confirmed unauthenticated after loading is done,
    // redirect to login. But use a small delay to avoid race conditions
    // with middleware and cookie setting.
    if (status === 'unauthenticated') {
      const timer = setTimeout(() => {
        router.replace('/login')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [status, router])

  // Show loading state while session is being checked
  // This is the critical fix: we wait for session to fully resolve
  // before showing anything, and we never redirect during loading
  if (status === 'loading' || !sessionCheckDone) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-xl overflow-hidden animate-pulse">
            <Image src="/logo.svg" alt="Magic AI" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
          </div>
          <p className="text-sm text-muted-foreground">Loading Magic AI...</p>
        </div>
      </div>
    )
  }

  // If unauthenticated after loading, show redirecting state (not a flash of content)
  if (status === 'unauthenticated') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-xl overflow-hidden">
            <Image src="/logo.svg" alt="Magic AI" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Authenticated - show dashboard
  const userName = session?.user?.name || 'Student'
  const userEmail = session?.user?.email || ''
  const userImage = session?.user?.image || ''
  const userPlan = (session?.user as any)?.plan || 'free'

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-svh overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        <motion.aside
          className="hidden md:flex flex-col border-r border-border bg-sidebar shrink-0"
          animate={{ width: collapsed ? 72 : 256 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden">
              <Image src="/logo.svg" alt="Magic AI" width={36} height={36} className="w-full h-full object-cover" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col"
              >
                <span className="font-bold text-sm magic-text">Magic AI</span>
                <span className="text-[10px] text-muted-foreground">
                  Learning Platform
                </span>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <SidebarNav collapsed={collapsed} />
          </ScrollArea>

          {/* Collapse toggle */}
          <div className="px-2 py-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft
                className={cn(
                  'transition-transform duration-300',
                  collapsed && 'rotate-180'
                )}
                size={16}
              />
              {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
            </Button>
          </div>

          {/* User profile */}
          <div className="border-t border-border p-3 shrink-0">
            <div
              className={cn(
                'flex items-center gap-3',
                collapsed && 'justify-center'
              )}
            >
              <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/20">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userName}</p>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4"
                    >
                      {userPlan === 'pro' ? 'Pro' : 'Free'}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.aside>

        {/* Mobile sidebar (sheet) */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 p-0 bg-sidebar">
            <SheetHeader className="px-4 h-16 flex flex-row items-center gap-3 border-b border-border">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden">
                <Image src="/logo.svg" alt="Magic AI" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm magic-text">Magic AI</span>
                <span className="text-[10px] text-muted-foreground">
                  Learning Platform
                </span>
              </div>
            </SheetHeader>
            <ScrollArea className="flex-1 py-4">
              <SidebarNav
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
              />
            </ScrollArea>
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userName}</p>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4"
                  >
                    {userPlan === 'pro' ? 'Pro' : 'Free'}
                  </Badge>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Top bar */}
          <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 gap-4 shrink-0 z-10">
            <div className="flex items-center gap-3">
              {/* Mobile menu trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={20} />
              </Button>

              {/* Search */}
              <div className="relative hidden sm:block">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 h-9 bg-muted/50 border-0 focus-visible:ring-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              {mounted && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setTheme(theme === 'dark' ? 'light' : 'dark')
                      }
                      className="h-9 w-9"
                    >
                      <AnimatePresence mode="wait">
                        {theme === 'dark' ? (
                          <motion.div
                            key="sun"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Sun size={18} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="moon"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Moon size={18} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Notifications */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Bell size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 px-2 gap-2 hidden sm:flex"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={userImage} alt={userName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {userName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={async () => {
                      await signOut({ redirect: false })
                      window.location.href = '/login'
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
