'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Users,
  Crown,
  Building2,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowRight,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

interface Stats {
  totalUsers: number
  proUsers: number
  enterpriseUsers: number
  freeUsers: number
  totalConversations: number
  totalQuizzes: number
  revenue: number
}

interface RecentUser {
  id: string
  name: string | null
  email: string
  plan: string
  role: string
  createdAt: string
}

const defaultStats: Stats = {
  totalUsers: 0,
  proUsers: 0,
  enterpriseUsers: 0,
  freeUsers: 0,
  totalConversations: 0,
  totalQuizzes: 0,
  revenue: 0,
}

const defaultRecentUsers: RecentUser[] = []

function getPlanBadge(plan: string) {
  switch (plan) {
    case 'pro':
      return <Badge className="bg-orange-600/20 text-orange-400 border-orange-900/30 hover:bg-orange-600/30">Pro</Badge>
    case 'enterprise':
      return <Badge className="bg-red-600/20 text-red-400 border-red-900/30 hover:bg-red-600/30">Enterprise</Badge>
    default:
      return <Badge className="bg-gray-600/20 text-gray-400 border-gray-700/30 hover:bg-gray-600/30">Free</Badge>
  }
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(defaultStats)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>(defaultRecentUsers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/stats', {
        headers: {
          'x-admin-password': 'akram2015',
        },
      })
      if (res.ok) {
        const data = await res.json()
        if (data.stats) {
          setStats({
            totalUsers: data.stats.totalUsers ?? 0,
            proUsers: data.stats.proUsers ?? 0,
            enterpriseUsers: data.stats.enterpriseUsers ?? 0,
            freeUsers: data.stats.freeUsers ?? 0,
            totalConversations: data.stats.totalConversations ?? 0,
            totalQuizzes: data.stats.totalQuizzes ?? 0,
            revenue: data.stats.revenue ?? 0,
          })
        }
        if (data.recentUsers && data.recentUsers.length > 0) {
          setRecentUsers(data.recentUsers)
        }
      } else {
        setError('Failed to load stats from server')
      }
    } catch {
      setError('Network error — using sample data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/10',
      borderColor: 'border-blue-900/30',
    },
    {
      title: 'Pro Users',
      value: stats.proUsers.toLocaleString(),
      icon: Crown,
      color: 'text-orange-400',
      bgColor: 'bg-orange-600/10',
      borderColor: 'border-orange-900/30',
    },
    {
      title: 'Enterprise Users',
      value: stats.enterpriseUsers.toLocaleString(),
      icon: Building2,
      color: 'text-red-400',
      bgColor: 'bg-red-600/10',
      borderColor: 'border-red-900/30',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-600/10',
      borderColor: 'border-emerald-900/30',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400 mt-1">Overview of your Magic AI platform</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-900/30 bg-yellow-950/20 px-4 py-3 text-sm text-yellow-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card
              key={card.title}
              className={`bg-gray-900/50 ${card.borderColor} backdrop-blur-sm hover:bg-gray-900/70 transition-colors`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-gray-400 font-medium">
                  {card.title}
                </CardDescription>
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24 bg-gray-800" />
                ) : (
                  <span className="text-2xl font-bold text-white">{card.value}</span>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent signups and quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent signups table */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Signups</CardTitle>
                <CardDescription className="text-gray-400">
                  Latest users who joined the platform
                </CardDescription>
              </div>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full bg-gray-800" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Plan</TableHead>
                    <TableHead className="text-gray-400 hidden sm:table-cell">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user) => (
                      <TableRow key={user.id} className="border-gray-800/50 hover:bg-gray-800/30">
                        <TableCell className="font-medium text-white">
                          {user.name || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-400">{user.email}</TableCell>
                        <TableCell>{getPlanBadge(user.plan)}</TableCell>
                        <TableCell className="text-gray-400 hidden sm:table-cell">
                          {formatDate(user.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                        No users yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Navigate to admin sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/users" className="block">
              <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/30 p-3 hover:bg-gray-800/60 hover:border-orange-900/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-600/10 p-2">
                    <Users className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Manage Users</p>
                    <p className="text-xs text-gray-500">View & edit user accounts</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-orange-400 transition-colors" />
              </div>
            </Link>

            <Link href="/admin/subscriptions" className="block">
              <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/30 p-3 hover:bg-gray-800/60 hover:border-red-900/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-600/10 p-2">
                    <Activity className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Subscriptions</p>
                    <p className="text-xs text-gray-500">Plan & revenue overview</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-red-400 transition-colors" />
              </div>
            </Link>

            <Link href="/admin/analytics" className="block">
              <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/30 p-3 hover:bg-gray-800/60 hover:border-emerald-900/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-600/10 p-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Analytics</p>
                    <p className="text-xs text-gray-500">Growth & usage insights</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
              </div>
            </Link>

            {/* Additional stats */}
            <div className="mt-4 pt-4 border-t border-gray-800 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Total Conversations</span>
                <span className="font-semibold text-white">{stats.totalConversations.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Quizzes Generated</span>
                <span className="font-semibold text-white">{stats.totalQuizzes.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Conversion Rate</span>
                <span className="font-semibold text-emerald-400">
                  {stats.totalUsers > 0
                    ? (((stats.proUsers + stats.enterpriseUsers) / stats.totalUsers) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
