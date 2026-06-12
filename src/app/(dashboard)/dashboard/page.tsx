'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calculator,
  Atom,
  Brain,
  TrendingUp,
  MessageCircle,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowUpRight,
  Zap,
  BookOpen,
  Trophy,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts'

const weeklyData = [
  { day: 'Mon', questions: 12, quizzes: 2 },
  { day: 'Tue', questions: 18, quizzes: 3 },
  { day: 'Wed', questions: 8, quizzes: 1 },
  { day: 'Thu', questions: 22, quizzes: 4 },
  { day: 'Fri', questions: 15, quizzes: 2 },
  { day: 'Sat', questions: 25, quizzes: 5 },
  { day: 'Sun', questions: 10, quizzes: 1 },
]

const recentActivity = [
  {
    id: 1,
    type: 'math',
    title: 'Solved quadratic equation',
    time: '2 min ago',
    icon: Calculator,
  },
  {
    id: 2,
    type: 'quiz',
    title: 'Completed Physics quiz — 85%',
    time: '15 min ago',
    icon: Brain,
  },
  {
    id: 3,
    type: 'science',
    title: 'Asked about Newton\'s Laws',
    time: '1 hour ago',
    icon: Atom,
  },
  {
    id: 4,
    type: 'homework',
    title: 'Uploaded Chemistry homework',
    time: '2 hours ago',
    icon: BookOpen,
  },
  {
    id: 5,
    type: 'quiz',
    title: 'Completed Math quiz — 92%',
    time: '3 hours ago',
    icon: Trophy,
  },
  {
    id: 6,
    type: 'math',
    title: 'Solved calculus derivative',
    time: '5 hours ago',
    icon: Calculator,
  },
]

const subjectProgress = [
  { name: 'Mathematics', progress: 78, color: 'hsl(270, 70%, 60%)' },
  { name: 'Physics', progress: 65, color: 'hsl(200, 70%, 55%)' },
  { name: 'Chemistry', progress: 52, color: 'hsl(330, 70%, 60%)' },
  { name: 'Biology', progress: 71, color: 'hsl(160, 70%, 50%)' },
  { name: 'Computer Science', progress: 85, color: 'hsl(50, 70%, 55%)' },
]

const statsCards = [
  {
    title: 'Questions Asked',
    value: '247',
    change: '+12%',
    icon: MessageCircle,
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  {
    title: 'Quizzes Completed',
    value: '34',
    change: '+8%',
    icon: CheckCircle2,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'Study Plans',
    value: '5',
    change: '+2',
    icon: Calendar,
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
  {
    title: 'Learning Streak',
    value: '12 days',
    change: '🔥',
    icon: Flame,
    gradient: 'from-orange-500/20 to-red-500/20',
  },
]

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
                Welcome back, <span className="magic-text">{userName}</span>! ✨
              </h1>
              <p className="text-muted-foreground mt-1">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-3 py-1">
                <Zap className="mr-1 h-3 w-3" /> 12 day streak
              </Badge>
            </div>
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
                <div className="flex items-center mt-3 text-xs">
                  <span className="text-emerald-500 font-medium flex items-center gap-0.5">
                    <ArrowUpRight size={12} />
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground ml-2">vs last week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Charts and Activity row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Weekly Activity Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Weekly Activity
                </CardTitle>
                <CardDescription>
                  Questions asked & quizzes completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis
                        dataKey="day"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: 'var(--popover)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="questions"
                        stroke="hsl(270, 70%, 60%)"
                        strokeWidth={2.5}
                        dot={{ fill: 'hsl(270, 70%, 60%)', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Questions"
                      />
                      <Line
                        type="monotone"
                        dataKey="quizzes"
                        stroke="hsl(200, 70%, 55%)"
                        strokeWidth={2.5}
                        dot={{ fill: 'hsl(200, 70%, 55%)', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Quizzes"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest learning actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon
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
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Subject Progress and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Subject Progress */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Subject Progress
                </CardTitle>
                <CardDescription>Your mastery across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectProgress.map((subject) => (
                    <div key={subject.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{subject.name}</span>
                        <span className="text-muted-foreground">
                          {subject.progress}%
                        </span>
                      </div>
                      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{ backgroundColor: subject.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${subject.progress}%` }}
                          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
