'use client'

import React from 'react'
import {
  BarChart3,
  Users,
  MessageSquare,
  Brain,
  BookOpen,
  Calculator,
  FlaskConical,
  Atom,
  Monitor,
  TrendingUp,
  Activity,
  Zap,
  Target,
  Flame,
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
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// User growth data over 12 months
const userGrowthData = [
  { month: 'Feb', totalUsers: 245, newUsers: 45, activeUsers: 180 },
  { month: 'Mar', totalUsers: 380, newUsers: 135, activeUsers: 290 },
  { month: 'Apr', totalUsers: 520, newUsers: 140, activeUsers: 410 },
  { month: 'May', totalUsers: 650, newUsers: 130, activeUsers: 520 },
  { month: 'Jun', totalUsers: 780, newUsers: 130, activeUsers: 630 },
  { month: 'Jul', totalUsers: 870, newUsers: 90, activeUsers: 720 },
  { month: 'Aug', totalUsers: 950, newUsers: 80, activeUsers: 790 },
  { month: 'Sep', totalUsers: 1020, newUsers: 70, activeUsers: 860 },
  { month: 'Oct', totalUsers: 1090, newUsers: 70, activeUsers: 920 },
  { month: 'Nov', totalUsers: 1160, newUsers: 70, activeUsers: 980 },
  { month: 'Dec', totalUsers: 1210, newUsers: 50, activeUsers: 1030 },
  { month: 'Jan', totalUsers: 1247, newUsers: 37, activeUsers: 1080 },
]

// Subject popularity data
const subjectPopularity = [
  { subject: 'Mathematics', users: 456, quizzes: 1280, avgScore: 78, color: '#f97316' },
  { subject: 'Physics', users: 312, quizzes: 890, avgScore: 72, color: '#ef4444' },
  { subject: 'Chemistry', users: 289, quizzes: 760, avgScore: 75, color: '#22c55e' },
  { subject: 'Biology', users: 234, quizzes: 620, avgScore: 81, color: '#3b82f6' },
  { subject: 'Computer Science', users: 567, quizzes: 1890, avgScore: 85, color: '#a855f7' },
  { subject: 'English', users: 198, quizzes: 450, avgScore: 88, color: '#ec4899' },
  { subject: 'History', users: 145, quizzes: 320, avgScore: 76, color: '#14b8a6' },
]

// Feature usage stats
const featureUsage = [
  { feature: 'AI Solver', icon: Calculator, usage: 4520, users: 890, growth: 12, color: 'text-orange-400', bgColor: 'bg-orange-600/10' },
  { feature: 'Quiz Generator', icon: Brain, usage: 3156, users: 678, growth: 8, color: 'text-red-400', bgColor: 'bg-red-600/10' },
  { feature: 'Study Planner', icon: BookOpen, usage: 2180, users: 456, growth: 15, color: 'text-emerald-400', bgColor: 'bg-emerald-600/10' },
  { feature: 'Homework Help', icon: MessageSquare, usage: 1820, users: 389, growth: 22, color: 'text-blue-400', bgColor: 'bg-blue-600/10' },
  { feature: 'Science Lab', icon: FlaskConical, usage: 980, users: 234, growth: 5, color: 'text-purple-400', bgColor: 'bg-purple-600/10' },
]

// Activity heatmap data (simulating weekly patterns)
const activityHeatmap = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm']
  const data: { day: string; hour: string; activity: number }[] = []

  days.forEach(day => {
    hours.forEach(hour => {
      let base = 20
      // Weekdays have more activity during school hours
      if (day !== 'Sat' && day !== 'Sun') {
        if (hour === '10am' || hour === '12pm' || hour === '2pm') base = 80
        else if (hour === '8am' || hour === '4pm') base = 60
        else if (hour === '6pm' || hour === '8pm') base = 50
      } else {
        // Weekends have different patterns
        if (hour === '10am' || hour === '12pm') base = 50
        else if (hour === '2pm' || hour === '4pm') base = 45
      }
      // Night time is always low
      if (hour === '6am' || hour === '10pm') base = 15

      data.push({
        day,
        hour,
        activity: base + Math.floor(Math.random() * 20),
      })
    })
  })
  return data
})()

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-white mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-white mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function getHeatmapColor(activity: number) {
  if (activity >= 90) return 'bg-red-500'
  if (activity >= 70) return 'bg-orange-500'
  if (activity >= 50) return 'bg-yellow-600'
  if (activity >= 30) return 'bg-orange-800'
  if (activity >= 15) return 'bg-gray-700'
  return 'bg-gray-800'
}

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="text-gray-400 mt-1">Insights into platform growth and usage patterns</p>
      </div>

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
            <span className="text-2xl font-bold text-white">1,247</span>
            <span className="ml-2 text-xs font-medium text-emerald-400">+37 this month</span>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-red-900/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-gray-400 font-medium">Active Users</CardDescription>
            <div className="rounded-lg p-2 bg-red-600/10">
              <Activity className="h-4 w-4 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-white">1,080</span>
            <span className="ml-2 text-xs font-medium text-emerald-400">86.6% of total</span>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-emerald-900/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-gray-400 font-medium">AI Interactions</CardDescription>
            <div className="rounded-lg p-2 bg-emerald-600/10">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-white">12,656</span>
            <span className="ml-2 text-xs font-medium text-emerald-400">+18% MoM</span>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-blue-900/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-gray-400 font-medium">Avg. Session</CardDescription>
            <div className="rounded-lg p-2 bg-blue-600/10">
              <Target className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-white">24 min</span>
            <span className="ml-2 text-xs font-medium text-emerald-400">+3 min</span>
          </CardContent>
        </Card>
      </div>

      {/* User growth line chart */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-400" />
            <div>
              <CardTitle className="text-white">User Growth</CardTitle>
              <CardDescription className="text-gray-400">
                Total, new, and active users over the past 12 months
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value: string) => (
                    <span className="text-gray-300 text-sm">{value}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="totalUsers"
                  name="Total Users"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{ fill: '#f97316', r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  name="Active Users"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  name="New Users"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#ef4444', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subject popularity bar chart and feature usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject popularity */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-red-400" />
              <div>
                <CardTitle className="text-white">Subject Popularity</CardTitle>
                <CardDescription className="text-gray-400">
                  Users and quizzes by subject
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPopularity} layout="vertical" barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="subject"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#d1d5db', fontSize: 11 }}
                    width={110}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-gray-300 text-sm">{value}</span>
                    )}
                  />
                  <Bar
                    dataKey="users"
                    name="Users"
                    fill="#f97316"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="quizzes"
                    name="Quizzes"
                    fill="#ef4444"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Feature usage stats */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-400" />
              <div>
                <CardTitle className="text-white">Feature Usage</CardTitle>
                <CardDescription className="text-gray-400">
                  Most popular features and their engagement
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featureUsage.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.feature}
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-800 bg-gray-800/20 hover:bg-gray-800/40 transition-colors"
                  >
                    <div className={`rounded-lg p-2.5 ${feature.bgColor}`}>
                      <Icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-white">{feature.feature}</h4>
                        <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-900/30 text-[10px]">
                          +{feature.growth}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{feature.usage.toLocaleString()} uses</span>
                        <span>{feature.users} users</span>
                      </div>
                      {/* Usage bar */}
                      <div className="mt-2 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-600 to-red-500"
                          style={{ width: `${(feature.usage / 4520) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity heatmap */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <div>
              <CardTitle className="text-white">Activity Heatmap</CardTitle>
              <CardDescription className="text-gray-400">
                Platform usage patterns by day and time
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Time labels */}
              <div className="flex items-center mb-2 pl-14">
                {['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'].map((hour) => (
                  <div key={hour} className="flex-1 text-center text-xs text-gray-500">
                    {hour}
                  </div>
                ))}
              </div>

              {/* Heatmap rows */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="flex items-center gap-2 mb-1">
                  <div className="w-12 text-right text-xs text-gray-400 font-medium">
                    {day}
                  </div>
                  <div className="flex-1 flex gap-1">
                    {activityHeatmap
                      .filter((item) => item.day === day)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 h-8 rounded-sm ${getHeatmapColor(item.activity)} transition-colors hover:ring-1 hover:ring-white/20 cursor-default relative group`}
                          title={`${day} ${item.hour}: ${item.activity}% activity`}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                            {item.activity}% activity
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-800">
                <span className="text-xs text-gray-500">Less</span>
                <div className="flex gap-0.5">
                  <div className="h-3 w-3 rounded-sm bg-gray-800" />
                  <div className="h-3 w-3 rounded-sm bg-gray-700" />
                  <div className="h-3 w-3 rounded-sm bg-orange-800" />
                  <div className="h-3 w-3 rounded-sm bg-yellow-600" />
                  <div className="h-3 w-3 rounded-sm bg-orange-500" />
                  <div className="h-3 w-3 rounded-sm bg-red-500" />
                </div>
                <span className="text-xs text-gray-500">More</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject performance table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Subject Performance Details</CardTitle>
          <CardDescription className="text-gray-400">
            Detailed breakdown of each subject&apos;s metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">Subject</TableHead>
                  <TableHead className="text-gray-400">Users</TableHead>
                  <TableHead className="text-gray-400">Quizzes</TableHead>
                  <TableHead className="text-gray-400">Avg Score</TableHead>
                  <TableHead className="text-gray-400 hidden sm:table-cell">Performance</TableHead>
                  <TableHead className="text-gray-400">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectPopularity.map((subject) => (
                  <TableRow key={subject.subject} className="border-gray-800/50 hover:bg-gray-800/30">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: subject.color }} />
                        {subject.subject}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{subject.users}</TableCell>
                    <TableCell className="text-gray-300">{subject.quizzes.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        subject.avgScore >= 80 ? 'text-emerald-400' : subject.avgScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {subject.avgScore}%
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${subject.avgScore}%`,
                              backgroundColor: subject.color,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-900/30 hover:bg-emerald-600/30 text-[10px]">
                        +{(Math.random() * 10 + 2).toFixed(1)}%
                      </Badge>
                    </TableCell>
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
