'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  plan: string
  emailVerified: boolean
  createdAt: string
  _count?: {
    conversations: number
    quizzes: number
    progress: number
  }
}

const mockUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'student', plan: 'pro', emailVerified: true, createdAt: '2025-01-15T10:30:00Z', _count: { conversations: 23, quizzes: 12, progress: 45 } },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'student', plan: 'free', emailVerified: true, createdAt: '2025-01-14T08:20:00Z', _count: { conversations: 5, quizzes: 2, progress: 8 } },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'admin', plan: 'enterprise', emailVerified: true, createdAt: '2025-01-13T14:10:00Z', _count: { conversations: 56, quizzes: 34, progress: 78 } },
  { id: '4', name: 'David Wilson', email: 'david@example.com', role: 'student', plan: 'pro', emailVerified: false, createdAt: '2025-01-12T16:45:00Z', _count: { conversations: 12, quizzes: 8, progress: 23 } },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', role: 'student', plan: 'free', emailVerified: true, createdAt: '2025-01-11T09:15:00Z', _count: { conversations: 3, quizzes: 1, progress: 5 } },
  { id: '6', name: 'Frank Brown', email: 'frank@example.com', role: 'student', plan: 'pro', emailVerified: true, createdAt: '2025-01-10T11:30:00Z', _count: { conversations: 18, quizzes: 15, progress: 34 } },
  { id: '7', name: 'Grace Lee', email: 'grace@example.com', role: 'student', plan: 'enterprise', emailVerified: true, createdAt: '2025-01-09T13:20:00Z', _count: { conversations: 45, quizzes: 22, progress: 67 } },
  { id: '8', name: 'Henry Taylor', email: 'henry@example.com', role: 'student', plan: 'free', emailVerified: false, createdAt: '2025-01-08T07:45:00Z', _count: { conversations: 1, quizzes: 0, progress: 2 } },
  { id: '9', name: 'Ivy Anderson', email: 'ivy@example.com', role: 'admin', plan: 'pro', emailVerified: true, createdAt: '2025-01-07T15:00:00Z', _count: { conversations: 34, quizzes: 28, progress: 56 } },
  { id: '10', name: 'Jack Thomas', email: 'jack@example.com', role: 'student', plan: 'free', emailVerified: true, createdAt: '2025-01-06T10:10:00Z', _count: { conversations: 7, quizzes: 4, progress: 12 } },
  { id: '11', name: 'Karen White', email: 'karen@example.com', role: 'student', plan: 'pro', emailVerified: true, createdAt: '2025-01-05T12:30:00Z', _count: { conversations: 29, quizzes: 18, progress: 41 } },
  { id: '12', name: 'Leo Harris', email: 'leo@example.com', role: 'student', plan: 'enterprise', emailVerified: true, createdAt: '2025-01-04T09:00:00Z', _count: { conversations: 38, quizzes: 25, progress: 52 } },
]

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

function getRoleBadge(role: string) {
  switch (role) {
    case 'admin':
      return <Badge className="bg-red-600/20 text-red-400 border-red-900/30 hover:bg-red-600/30">Admin</Badge>
    default:
      return <Badge variant="outline" className="text-gray-400 border-gray-700">Student</Badge>
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [total, setTotal] = useState(mockUsers.length)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Edit dialog state
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editRole, setEditRole] = useState('')
  const [editPlan, setEditPlan] = useState('')
  const [saving, setSaving] = useState(false)

  // Delete dialog state
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search ? { search } : {}),
      })
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { 'x-admin-password': 'akram2015' },
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || mockUsers)
        setTotal(data.total || mockUsers.length)
      } else {
        setError('Failed to load users')
        setUsers(mockUsers)
      }
    } catch {
      setError('Network error — using sample data')
      setUsers(mockUsers)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  const handleEdit = (user: User) => {
    setEditUser(user)
    setEditRole(user.role)
    setEditPlan(user.plan)
  }

  const handleSaveEdit = async () => {
    if (!editUser) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'akram2015',
        },
        body: JSON.stringify({
          userId: editUser.id,
          role: editRole,
          plan: editPlan,
        }),
      })
      if (res.ok) {
        // Update local state
        setUsers(prev =>
          prev.map(u =>
            u.id === editUser.id ? { ...u, role: editRole, plan: editPlan } : u
          )
        )
        setEditUser(null)
      }
    } catch {
      // Still update locally
      setUsers(prev =>
        prev.map(u =>
          u.id === editUser.id ? { ...u, role: editRole, plan: editPlan } : u
        )
      )
      setEditUser(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteUser) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/users?userId=${deleteUser.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': 'akram2015' },
      })
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== deleteUser.id))
        setTotal(prev => prev - 1)
        setDeleteUser(null)
      }
    } catch {
      setUsers(prev => prev.filter(u => u.id !== deleteUser.id))
      setTotal(prev => prev - 1)
      setDeleteUser(null)
    } finally {
      setDeleting(false)
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-gray-400 mt-1">Manage and monitor user accounts</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="h-4 w-4" />
          <span>{total} total users</span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-900/30 bg-yellow-950/20 px-4 py-3 text-sm text-yellow-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Search bar */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Users table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Users</CardTitle>
          <CardDescription className="text-gray-400">
            {search ? `Showing results for "${search}"` : 'All registered users'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-gray-800" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-gray-600 mb-3" />
              <p className="text-gray-400 font-medium">No users found</p>
              <p className="text-sm text-gray-500 mt-1">
                {search ? 'Try adjusting your search terms' : 'No users have signed up yet'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-transparent">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Plan</TableHead>
                      <TableHead className="text-gray-400">Role</TableHead>
                      <TableHead className="text-gray-400 hidden md:table-cell">Joined</TableHead>
                      <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-gray-800/50 hover:bg-gray-800/30">
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center gap-2">
                            {user.name || 'N/A'}
                            {!user.emailVerified && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-500 border border-yellow-900/30">
                                Unverified
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">{user.email}</TableCell>
                        <TableCell>{getPlanBadge(user.plan)}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="text-gray-400 hidden md:table-cell">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                              <DropdownMenuItem
                                onClick={() => handleEdit(user)}
                                className="text-gray-300 focus:text-white focus:bg-gray-800"
                              >
                                <UserCog className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-800" />
                              <DropdownMenuItem
                                onClick={() => setDeleteUser(user)}
                                className="text-red-400 focus:text-red-300 focus:bg-red-950/30"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages} • {total} users
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Pencil className="h-4 w-4 text-orange-400" />
              Edit User
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Change role and plan for {editUser?.name || editUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Role</label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Plan</label>
              <Select value={editPlan} onValueChange={setEditPlan}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditUser(null)}
              className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete <strong className="text-white">{deleteUser?.name || deleteUser?.email}</strong>?
              This action cannot be undone. All associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
