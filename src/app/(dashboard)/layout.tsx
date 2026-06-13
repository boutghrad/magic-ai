import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardClient from './dashboard-client'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check using getServerSession()
  // This reads the JWT directly from request cookies — no race condition
  // Unlike client-side useSession() which can show "unauthenticated" before
  // the session cookie propagates, getServerSession() is always accurate
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <DashboardClient>{children}</DashboardClient>
}
