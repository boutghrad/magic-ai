'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  Users,
  TrendingUp,
  Activity,
  Zap,
  Target,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#f97316',
  Physics: '#ef4444',
  Chemistry: '#22c55e',
  Biology: '#3b82f6',
  'Computer Science': '#a855f7',
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [subjectProgress, setSubjectProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': 'akram2015' },
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats || {})
        setSubjectProgress(data.subjectProgress || [])
      } else {
        setError('Failed to load analytics data')
      }
    } catch {
      setError('Network error — please check your connection')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalUsers = stats?.totalUsers ?? 0
  const totalConversations = stats?.totalConversations ?? 0
  const totalQuizzes = stats?.totalQuizzes ?? 0

  // Build chart data from real subject progress
  const subjectChartData = subjectProgress.map((sp: any) => ({
    subject: sp.subject,
    users: sp._count?.subject ?? 0,
    avgScore: sp._avg?.score ? Math.round(sp._avg.score) : 0,
    color: SUBJECT_COLORS[sp.subject] || '#6b7280',
  }))

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics</h2>
          <p className="text-gray-400 mt-1">Insights into platform growth and usage patterns</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-800">
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-24 bg-gray-800" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="text-gray-400 mt-1">Insights into platform growth and usage patterns</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-900/30 bg-yellow-950/20 px-4 py-3 text-sm text-yellow-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Overview stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-orange-900/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-gray-400 font-medium">Total Users</CardDescription>
            <div className="rounded-lg p-2 bg-orange-600/10">
              <Users className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-white">{totalUsers.toLocaleString()}</span>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-red-900/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-gray-400 font-medium">Conversations</CardDescription>
            <div className="rounded-lg p-2 bg-red-600/10">
              <Activity className="h-4 w-4 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-white">{totalConversations.toLocaleString()}</span>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-emerald-900/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-gray-400 font-medium">Quizzes Generated</CardDescription>
            <div className="rounded-lg p-2 bg-emerald-600/10">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-white">{totalQuizzes.toLocaleString()}</span>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-blue-900/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-gray-400 font-medium">Monthly Revenue</CardDescription>
            <div className="rounded-lg p-2 bg-blue-600/10">
              <Target className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-white">${(stats?.revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </CardContent>
        </Card>
      </div>

      {/* Subject popularity bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-400" />
              <div>
                <CardTitle className="text-white">Subject Popularity</CardTitle>
                <CardDescription className="text-gray-400">Users by subject</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {subjectChartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectChartData} layout="vertical" barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis type="category" dataKey="subject" tickLine={false} axisLine={false} tick={{ fill: '#d1d5db', fontSize: 11 }} width={130} />
                    <Tooltip />
                    <Bar dataKey="users" name="Users" fill="#f97316" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <BarChart3 className="h-12 w-12 text-gray-600 mb-3" />
                <p className="text-gray-400">No subject data yet</p>
                <p className="text-sm text-gray-500 mt-1">Data will appear as users interact with subjects</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subject performance table */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Subject Performance</CardTitle>
            <CardDescription className="text-gray-400">Detailed metrics by subject</CardDescription>
          </CardHeader>
          <CardContent>
            {subjectChartData.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-transparent">
                      <TableHead className="text-gray-400">Subject</TableHead>
                      <TableHead className="text-gray-400">Users</TableHead>
                      <TableHead className="text-gray-400">Avg Score</TableHead>
                      <TableHead className="text-gray-400">Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectChartData.map((subject) => (
                      <TableRow key={subject.subject} className="border-gray-800/50 hover:bg-gray-800/30">
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: subject.color }} />
                            {subject.subject}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{subject.users}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${subject.avgScore >= 80 ? 'text-emerald-400' : subject.avgScore >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {subject.avgScore}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${subject.avgScore}%`, backgroundColor: subject.color }} />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <TrendingUp className="h-12 w-12 text-gray-600 mb-3" />
                <p className="text-gray-400">No performance data yet</p>
                <p className="text-sm text-gray-500 mt-1">Data will appear as users complete quizzes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plan distribution */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Plan Distribution</CardTitle>
          <CardDescription className="text-gray-400">Users by subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Free', count: stats?.freeUsers ?? 0, color: 'text-gray-400', bgColor: 'bg-gray-600/20', borderColor: 'border-gray-700/30' },
              { name: 'Pro', count: stats?.proUsers ?? 0, color: 'text-orange-400', bgColor: 'bg-orange-600/20', borderColor: 'border-orange-900/30' },
              { name: 'Enterprise', count: stats?.enterpriseUsers ?? 0, color: 'text-red-400', bgColor: 'bg-red-600/20', borderColor: 'border-red-900/30' },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-lg border ${plan.borderColor} ${plan.bgColor} p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${plan.color}`}>{plan.name}</h4>
                  <Badge variant="outline" className="text-gray-400 border-gray-700">{plan.count}</Badge>
                </div>
                <p className="text-2xl font-bold text-white">{plan.count}</p>
                <p className="text-xs text-gray-500">{totalUsers > 0 ? ((plan.count / totalUsers) * 100).toFixed(1) : 0}% of total</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
