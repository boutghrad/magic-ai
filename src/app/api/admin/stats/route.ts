import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const ADMIN_PASSWORD = "akram2015"

function isAdminAuthenticated(req: NextRequest): boolean {
  const adminPassword = req.headers.get("x-admin-password")
  if (adminPassword === ADMIN_PASSWORD) return true
  return false
}

async function isSessionAdmin(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions)
    return !!(session?.user && (session.user as any).role === "admin")
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  try {
    const headerAuth = isAdminAuthenticated(req)
    const sessionAuth = headerAuth ? false : await isSessionAdmin()

    if (!headerAuth && !sessionAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let stats: any = {}
    let recentUsers: any[] = []
    let subjectProgress: any[] = []

    try {
      const [
        totalUsers,
        proUsers,
        enterpriseUsers,
        totalConversations,
        totalQuizzes,
        recentUsersData,
        subjectProgressData,
      ] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { plan: "pro" } }),
        db.user.count({ where: { plan: "enterprise" } }),
        db.conversation.count(),
        db.quiz.count(),
        db.user.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            name: true,
            plan: true,
            role: true,
            createdAt: true,
          },
        }),
        db.progress.groupBy({
          by: ["subject"],
          _count: { subject: true },
          _avg: { score: true },
        }),
      ])

      stats = {
        totalUsers,
        proUsers,
        enterpriseUsers,
        freeUsers: totalUsers - proUsers - enterpriseUsers,
        totalConversations,
        totalQuizzes,
        revenue: proUsers * 19.99 + enterpriseUsers * 49.99,
      }
      recentUsers = recentUsersData
      subjectProgress = subjectProgressData
    } catch (dbError) {
      console.error("DB error in admin stats:", dbError)
      // Return zeroed stats instead of mock data
      stats = {
        totalUsers: 0,
        proUsers: 0,
        enterpriseUsers: 0,
        freeUsers: 0,
        totalConversations: 0,
        totalQuizzes: 0,
        revenue: 0,
      }
      recentUsers = []
      subjectProgress = []
    }

    return NextResponse.json({ stats, recentUsers, subjectProgress })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
