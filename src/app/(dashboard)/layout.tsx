import { getToken } from 'next-auth/jwt'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import DashboardClient from './dashboard-client'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check using getToken() (same as middleware)
  // We construct a request-like object from next/headers since server components
  // don't receive a NextRequest. getToken() reads the JWT from cookies directly,
  // which is reliable and matches what the middleware does.
  const token = await getToken({
    req: {
      headers: Object.fromEntries(await headers()),
      cookies: Object.fromEntries(
        (await cookies()).getAll().map((c) => [c.name, c.value])
      ),
    } as any,
    secret: process.env.NEXTAUTH_SECRET || 'magic-ai-super-secret-key-2024-production-ready',
  })

  if (!token) {
    redirect('/login')
  }

  return <DashboardClient>{children}</DashboardClient>
}
