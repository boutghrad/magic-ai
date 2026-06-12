'use client'

import React, { useState } from 'react'
import {
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

// Mock data for subscription stats
const subStats = {
  activeSubscriptions: 400,
  monthlyRevenue: 9555.42,
  churnRate: 3.2,
  avgRevenuePerUser: 23.89,
}

// Plan distribution data for pie chart
const planDistribution = [
  { name: 'Free', value: 847, color: '#6b7280' },
  { name: 'Pro', value: 342, color: '#f97316' },
  { name: 'Enterprise', value: 58, color: '#ef4444' },
]

// Monthly revenue data for bar chart
const monthlyRevenue = [
  { month: 'Jul', revenue: 5800 },
  { month: 'Aug', revenue: 6500 },
  { month: 'Sep', revenue: 7100 },
  { month: 'Oct', revenue: 7800 },
  { month: 'Nov', revenue: 8500 },
  { month: 'Dec', revenue: 9200 },
  { month: 'Jan', revenue: 9555 },
]

// Recent subscription changes
const recentChanges = [
  { id: '1', user: 'Alice Johnson', email: 'alice@example.com', action: 'upgraded', from: 'Free', to: 'Pro', date: '2 hours ago', amount: '+$19.99' },
  { id: '2', user: 'Bob Smith', email: 'bob@example.com', action: 'downgraded', from: 'Pro', to: 'Free', date: '5 hours ago', amount: '-$19.99' },
  { id: '3', user: 'Carol Davis', email: 'carol@example.com', action: 'upgraded', from: 'Pro', to: 'Enterprise', date: '1 day ago', amount: '+$30.00' },
  { id: '4', user: 'David Wilson', email: 'david@example.com', action: 'new', from: '-', to: 'Pro', date: '1 day ago', amount: '+$19.99' },
  { id: '5', user: 'Eva Martinez', email: 'eva@example.com', action: 'cancelled', from: 'Pro', to: 'Free', date: '2 days ago', amount: '-$19.99' },
  { id: '6', user: 'Frank Brown', email: 'frank@example.com', action: 'upgraded', from: 'Free', to: 'Pro', date: '2 days ago', amount: '+$19.99' },
  { id: '7', user: 'Grace Lee', email: 'grace@example.com', action: 'new', from: '-', to: 'Enterprise', date: '3 days ago', amount: '+$49.99' },
  { id: '8', user: 'Henry Taylor', email: 'henry@example.com', action: 'renewed', from: 'Free', to: 'Free', date: '3 days ago', amount: '$0.00' },
]

// Plan details for revenue summary
const planDetails = [
  { name: 'Free', users: 847, price: 0, revenue: 0, color: 'text-gray-400', bgColor: 'bg-gray-600/20', borderColor: 'border-gray-700/30' },
  { name: 'Pro', users: 342, price: 19.99, revenue: 6836.58, color: 'text-orange-400', bgColor: 'bg-orange-600/20', borderColor: 'border-orange-900/30' },
  { name: 'Enterprise', users: 58, price: 49.99, revenue: 2899.42, color: 'text-red-400', bgColor: 'bg-red-600/20', borderColor: 'border-red-900/30' },
]

function getActionBadge(action: string) {
  switch (action) {
    case 'upgraded':
      return <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-900/30 hover:bg-emerald-600/30">Upgraded</Badge>
    case 'downgraded':
      return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-900/30 hover:bg-yellow-600/30">Downgraded</Badge>
    case 'cancelled':
      return <Badge className="bg-red-600/20 text-red-400 border-red-900/30 hover:bg-red-600/30">Cancelled</Badge>
    case 'new':
      return <Badge className="bg-blue-600/20 text-blue-400 border-blue-900/30 hover:bg-blue-600/30">New</Badge>
    case 'renewed':
      return <Badge className="bg-purple-600/20 text-purple-400 border-purple-900/30 hover:bg-purple-600/30">Renewed</Badge>
    default:
      return <Badge variant="outline" className="text-gray-400">{action}</Badge>
  }
}

function getActionIcon(action: string) {
  switch (action) {
    case 'upgraded':
      return <ArrowUpRight className="h-3 w-3 text-emerald-400" />
    case 'downgraded':
      return <ArrowDownRight className="h-3 w-3 text-yellow-400" />
    case 'cancelled':
      return <XCircle className="h-3 w-3 text-red-400" />
    case 'new':
      return <CheckCircle2 className="h-3 w-3 text-blue-400" />
    case 'renewed':
      return <RefreshCw className="h-3 w-3 text-purple-400" />
    default:
      return <Clock className="h-3 w-3 text-gray-400" />
  }
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

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-white">{payload[0].name}</p>
        <p className="text-sm text-gray-400">{payload[0].value} users</p>
        <p className="text-sm text-gray-400">
          {((payload[0].value / 1247) * 100).toFixed(1)}% of total
        </p>
      </div>
    )
  }
  return null
}

export default function AdminSubscriptionsPage() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  const statCards = [
    {
      title: 'Active Subscriptions',
      value: subStats.activeSubscriptions.toLocaleString(),
      icon: Users,
      color: 'text-orange-400',
      bgColor: 'bg-orange-600/10',
      borderColor: 'border-orange-900/30',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Monthly Revenue',
      value: `$${subStats.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-600/10',
      borderColor: 'border-emerald-900/30',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Churn Rate',
      value: `${subStats.churnRate}%`,
      icon: TrendingUp,
      color: 'text-red-400',
      bgColor: 'bg-red-600/10',
      borderColor: 'border-red-900/30',
      change: '-0.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Avg. Revenue/User',
      value: `$${subStats.avgRevenuePerUser.toFixed(2)}`,
      icon: CreditCard,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/10',
      borderColor: 'border-blue-900/30',
      change: '+$2.30',
      changeType: 'positive' as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Subscriptions</h2>
        <p className="text-gray-400 mt-1">Monitor plans, revenue, and subscription activity</p>
      </div>

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
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{card.value}</span>
                  <span className={`flex items-center text-xs font-medium ${
                    card.changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    {card.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan distribution pie chart */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Plan Distribution</CardTitle>
            <CardDescription className="text-gray-400">
              Breakdown of users by subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-gray-300 text-sm">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Plan summary below chart */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-800">
              {planDistribution.map((plan) => (
                <div
                  key={plan.name}
                  className="text-center"
                  onMouseEnter={() => setHoveredPlan(plan.name)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                    <span className="text-sm font-medium text-gray-300">{plan.name}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{plan.value}</p>
                  <p className="text-xs text-gray-500">{((plan.value / 1247) * 100).toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly revenue bar chart */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Monthly Revenue</CardTitle>
            <CardDescription className="text-gray-400">
              Revenue trend over the last 7 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue summary by plan */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Revenue Summary</CardTitle>
          <CardDescription className="text-gray-400">
            Revenue breakdown by plan type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {planDetails.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border ${plan.borderColor} ${plan.bgColor} p-4 transition-all ${
                  hoveredPlan === plan.name ? 'ring-1 ring-offset-1 ring-offset-gray-900' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-semibold ${plan.color}`}>{plan.name}</h4>
                  <Badge variant="outline" className="text-gray-400 border-gray-700">
                    {plan.users} users
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Price</span>
                    <span className="text-white font-medium">
                      {plan.price === 0 ? 'Free' : `$${plan.price}/mo`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Revenue</span>
                    <span className="text-white font-semibold">
                      ${plan.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent subscription changes */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Subscription Changes</CardTitle>
          <CardDescription className="text-gray-400">
            Latest plan upgrades, downgrades, and cancellations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Action</TableHead>
                  <TableHead className="text-gray-400 hidden sm:table-cell">From</TableHead>
                  <TableHead className="text-gray-400 hidden sm:table-cell">To</TableHead>
                  <TableHead className="text-gray-400 hidden md:table-cell">Amount</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentChanges.map((change) => (
                  <TableRow key={change.id} className="border-gray-800/50 hover:bg-gray-800/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{change.user}</p>
                        <p className="text-xs text-gray-500">{change.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {getActionIcon(change.action)}
                        {getActionBadge(change.action)}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400 hidden sm:table-cell">{change.from}</TableCell>
                    <TableCell className="text-gray-400 hidden sm:table-cell">{change.to}</TableCell>
                    <TableCell className={`font-medium hidden md:table-cell ${
                      change.amount.startsWith('+') ? 'text-emerald-400' : change.amount.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {change.amount}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{change.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
