'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Loader2,
  AlertCircle,
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const PLAN_COLORS: Record<string, string> = {
  free: '#6b7280',
  pro: '#f97316',
  enterprise: '#ef4444',
}

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  pro: 19.99,
  enterprise: 49.99,
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-white">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminSubscriptionsPage() {
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { 'x-admin-password': 'akram2015' } }),
        fetch('/api/admin/users?limit=50', { headers: { 'x-admin-password': 'akram2015' } }),
      ])

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data.stats || {})
      }
      if (usersRes.ok) {
        const data = await usersRes.json()
        setUsers(data.users || [])
      }
    } catch {
      setError('Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Compute plan distribution from real data
  const planDistribution = [
    { name: 'Free', value: stats?.freeUsers ?? 0, color: PLAN_COLORS.free },
    { name: 'Pro', value: stats?.proUsers ?? 0, color: PLAN_COLORS.pro },
    { name: 'Enterprise', value: stats?.enterpriseUsers ?? 0, color: PLAN_COLORS.enterprise },
  ]

  const totalUsers = stats?.totalUsers ?? 0
  const activeSubscriptions = (stats?.proUsers ?? 0) + (stats?.enterpriseUsers ?? 0)
  const monthlyRevenue = stats?.revenue ?? 0
  const avgRevenuePerUser = activeSubscriptions > 0 ? monthlyRevenue / activeSubscriptions : 0

  const planDetails = [
    { name: 'Free', users: stats?.freeUsers ?? 0, price: 0, revenue: 0, color: 'text-gray-400', bgColor: 'bg-gray-600/20', borderColor: 'border-gray-700/30' },
    { name: 'Pro', users: stats?.proUsers ?? 0, price: 19.99, revenue: (stats?.proUsers ?? 0) * 19.99, color: 'text-orange-400', bgColor: 'bg-orange-600/20', borderColor: 'border-orange-900/30' },
    { name: 'Enterprise', users: stats?.enterpriseUsers ?? 0, price: 49.99, revenue: (stats?.enterpriseUsers ?? 0) * 49.99, color: 'text-red-400', bgColor: 'bg-red-600/20', borderColor: 'border-red-900/30' },
  ]

  const recentUsersList = users.slice(0, 10)

  const statCards = [
    { title: 'Active Subscriptions', value: activeSubscriptions.toLocaleString(), icon: Users, color: 'text-orange-400', bgColor: 'bg-orange-600/10', borderColor: 'border-orange-900/30' },
    { title: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-emerald-400', bgColor: 'bg-emerald-600/10', borderColor: 'border-emerald-900/30' },
    { title: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, color: 'text-blue-400', bgColor: 'bg-blue-600/10', borderColor: 'border-blue-900/30' },
    { title: 'Avg. Revenue/User', value: `$${avgRevenuePerUser.toFixed(2)}`, icon: CreditCard, color: 'text-purple-400', bgColor: 'bg-purple-600/10', borderColor: 'border-purple-900/30' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Subscriptions</h2>
          <p className="text-gray-400 mt-1">Monitor plans, revenue, and subscription activity</p>
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
        <h2 className="text-2xl font-bold text-white">Subscriptions</h2>
        <p className="text-gray-400 mt-1">Monitor plans, revenue, and subscription activity</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-900/30 bg-yellow-950/20 px-4 py-3 text-sm text-yellow-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className={`bg-gray-900/50 ${card.borderColor} backdrop-blur-sm`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-gray-400 font-medium">{card.title}</CardDescription>
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold text-white">{card.value}</span>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan distribution pie chart */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Plan Distribution</CardTitle>
            <CardDescription className="text-gray-400">Breakdown of users by subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            {totalUsers > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value" stroke="none">
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} formatter={(value: string) => <span className="text-gray-300 text-sm">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <Users className="h-12 w-12 text-gray-600 mb-3" />
                <p className="text-gray-400">No user data yet</p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-800">
              {planDistribution.map((plan) => (
                <div key={plan.name} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                    <span className="text-sm font-medium text-gray-300">{plan.name}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{plan.value}</p>
                  <p className="text-xs text-gray-500">{totalUsers > 0 ? ((plan.value / totalUsers) * 100).toFixed(1) : 0}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue summary by plan */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Revenue Summary</CardTitle>
            <CardDescription className="text-gray-400">Revenue breakdown by plan type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {planDetails.map((plan) => (
                <div key={plan.name} className={`rounded-lg border ${plan.borderColor} ${plan.bgColor} p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${plan.color}`}>{plan.name}</h4>
                    <Badge variant="outline" className="text-gray-400 border-gray-700">{plan.users} users</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Price</span>
                      <span className="text-white font-medium">{plan.price === 0 ? 'Free' : `$${plan.price}/mo`}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Revenue</span>
                      <span className="text-white font-semibold">${plan.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent users table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Users</CardTitle>
          <CardDescription className="text-gray-400">Latest user signups and their plans</CardDescription>
        </CardHeader>
        <CardContent>
          {recentUsersList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-400">User</TableHead>
                    <TableHead className="text-gray-400">Plan</TableHead>
                    <TableHead className="text-gray-400">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsersList.map((user: any) => (
                    <TableRow key={user.id} className="border-gray-800/50 hover:bg-gray-800/30">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{user.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${
                          user.plan === 'pro' ? 'bg-orange-600/20 text-orange-400 border-orange-900/30' :
                          user.plan === 'enterprise' ? 'bg-red-600/20 text-red-400 border-red-900/30' :
                          'bg-gray-600/20 text-gray-400 border-gray-700/30'
                        }`}>
                          {user.plan?.charAt(0).toUpperCase() + user.plan?.slice(1) || 'Free'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-gray-600 mb-3" />
              <p className="text-gray-400">No users yet</p>
              <p className="text-sm text-gray-500 mt-1">Users will appear here when they sign up</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
