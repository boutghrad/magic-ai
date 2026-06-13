'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calculator,
  Atom,
  Brain,
  MessageCircle,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Zap,
  BookOpen,
  Trophy,
  Sparkles,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'Student'
  const userPlan = (session?.user as any)?.plan || 'free'

  const [stats, setStats] = useState({
    questions: 0,
    quizzes: 0,
    studyPlans: 0,
    conversations: 0,
  })
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string
    type: string
    title: string
    createdAt: string
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/dashboard/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats || { questions: 0, quizzes: 0, studyPlans: 0, conversations: 0 })
          setRecentActivity(data.recentActivity || [])
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const statsCards = [
    {
      title: 'Questions Asked',
      value: stats.questions.toString(),
      icon: MessageCircle,
      gradient: 'from-violet-500/20 to-purple-500/20',
    },
    {
      title: 'Quizzes Completed',
      value: stats.quizzes.toString(),
      icon: CheckCircle2,
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      title: 'Study Plans',
      value: stats.studyPlans.toString(),
      icon: Calendar,
      gradient: 'from-emerald-500/20 to-green-500/20',
    },
    {
      title: 'Conversations',
      value: stats.conversations.toString(),
      icon: Zap,
      gradient: 'from-orange-500/20 to-red-500/20',
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'math': return Calculator
      case 'science': return Atom
      case 'quiz': return Brain
      case 'homework': return BookOpen
      case 'study-plan': return Calendar
      default: return Sparkles
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Welcome section */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, <span className="magic-text">{userName}</span>!
              </h1>
              <p className="text-muted-foreground mt-1">
                Ready to continue your learning journey?
              </p>
            </div>
            {userPlan === 'pro' && (
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  Pro Plan
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, i) => (
            <Card key={i} className="relative overflow-hidden border-0 shadow-md">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="rounded-lg bg-background/60 p-2">
                    <stat.icon className="text-primary" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-md h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest learning actions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                    </div>
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {recentActivity.map((activity) => {
                      const Icon = getActivityIcon(activity.type)
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                            <Icon className="text-primary" size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {activity.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">No activity yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Start learning to see your progress here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Quick Actions
                </CardTitle>
                <CardDescription>Jump right in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/math-solver" className="block">
                  <Button
                    className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md"
                    size="lg"
                  >
                    <Calculator size={18} />
                    Solve Math Problem
                  </Button>
                </Link>
                <Link href="/science-tutor" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    size="lg"
                  >
                    <Atom size={18} className="text-primary" />
                    Ask Science Question
                  </Button>
                </Link>
                <Link href="/quiz-generator" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    size="lg"
                  >
                    <Brain size={18} className="text-primary" />
                    Take a Quiz
                  </Button>
                </Link>
                <Link href="/study-planner" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    size="lg"
                  >
                    <Calendar size={18} className="text-primary" />
                    Plan Study Schedule
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
