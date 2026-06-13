'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Settings,
  User,
  CreditCard,
  Lock,
  Trash2,
  Moon,
  Sun,
  Bell,
  Shield,
  Camera,
  Save,
  Loader2,
  AlertTriangle,
  Check,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

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

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [name, setName] = useState(session?.user?.name || 'Student')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const [notifications, setNotifications] = useState({
    email: true,
    studyReminders: true,
    quizResults: true,
    weeklyReport: false,
    newFeatures: true,
  })

  const userPlan = (session?.user as any)?.plan || 'free'

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      if (res.ok) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (res.ok) {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        toast.success('Password changed successfully!')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to change password')
      }
    } catch {
      toast.error('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = () => {
    toast.success('Account deletion request submitted. You will be logged out.')
    setTimeout(() => router.push('/login'), 2000)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3">
            <Settings className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground text-sm">
              Manage your account and preferences
            </p>
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="text-primary" size={18} />
                <CardTitle className="text-base">Profile</CardTitle>
              </div>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                  <AvatarImage
                    src={session?.user?.image || ''}
                    alt={name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera size={14} />
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="text-primary" size={18} />
                <CardTitle className="text-base">Subscription</CardTitle>
              </div>
              <CardDescription>
                Manage your subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-primary/20">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold capitalize">
                      {userPlan} Plan
                    </h3>
                    {userPlan === 'pro' && (
                      <Badge className="bg-primary text-primary-foreground">
                        ✨ Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {userPlan === 'pro'
                      ? 'Unlimited AI questions, quizzes, and study plans'
                      : 'Limited to 10 questions per day'}
                  </p>
                </div>
                {userPlan !== 'pro' && (
                  <Button className="mt-3 sm:mt-0 gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                    <Sparkles size={14} />
                    Upgrade to Pro
                  </Button>
                )}
              </div>

              {userPlan === 'pro' && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Billing cycle</span>
                    <span className="font-medium text-foreground">Monthly</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Amount</span>
                    <span className="font-medium text-foreground">$9.99/mo</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Change Password */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="text-primary" size={18} />
                <CardTitle className="text-base">Change Password</CardTitle>
              </div>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm font-medium">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirm-password"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={saving}
                variant="outline"
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Shield size={16} />
                )}
                Change Password
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme & Notifications */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Moon className="text-primary" size={18} />
                <CardTitle className="text-base">Preferences</CardTitle>
              </div>
              <CardDescription>
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    {mounted && theme === 'dark' ? (
                      <Moon size={16} className="text-primary" />
                    ) : (
                      <Sun size={16} className="text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">
                      Toggle between light and dark theme
                    </p>
                  </div>
                </div>
                <Switch
                  checked={mounted ? theme === 'dark' : true}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? 'dark' : 'light')
                  }
                />
              </div>

              <Separator />

              {/* Notifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="text-primary" size={16} />
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                {[
                  {
                    key: 'email' as const,
                    label: 'Email Notifications',
                    desc: 'Receive email updates',
                  },
                  {
                    key: 'studyReminders' as const,
                    label: 'Study Reminders',
                    desc: 'Get reminded of your study schedule',
                  },
                  {
                    key: 'quizResults' as const,
                    label: 'Quiz Results',
                    desc: 'Get notified about quiz scores',
                  },
                  {
                    key: 'weeklyReport' as const,
                    label: 'Weekly Report',
                    desc: 'Receive a weekly learning summary',
                  },
                  {
                    key: 'newFeatures' as const,
                    label: 'New Features',
                    desc: 'Be the first to know about updates',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle size={18} />
                <CardTitle className="text-base text-destructive">
                  Danger Zone
                </CardTitle>
              </div>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                <div>
                  <p className="text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-3 sm:mt-0 gap-2"
                    >
                      <Trash2 size={14} />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove all of your data from our
                        servers, including your conversations, quizzes, and study
                        plans.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Delete My Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
