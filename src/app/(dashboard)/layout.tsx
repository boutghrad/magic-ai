import { getToken } from 'next-auth/jwt'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import DashboardClient from './dashboard-client'

const SECRET = process.env.NEXTAUTH_SECRET || 'magic-ai-super-secret-key-2024-production-ready'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check using getToken() — same approach as middleware.
  // getToken() reads the JWT directly from cookies, so there's no race condition
  // with client-side useSession() which can return "unauthenticated" before the
  // cookie is fully propagated in the browser.
  const cookieStore = await cookies()
  const headersList = await headers()

  const token = await getToken({
    req: {
      headers: Object.fromEntries(headersList),
      cookies: Object.fromEntries(
        cookieStore.getAll().map((c) => [c.name, c.value])
      ),
    } as any,
    secret: SECRET,
  })

  if (!token) {
    redirect('/login')
  }

  return <DashboardClient>{children}</DashboardClient>
}
