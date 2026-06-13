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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""

    try {
      const where = search
        ? {
            OR: [
              { email: { contains: search } },
              { name: { contains: search } },
            ],
          }
        : {}

      const [users, total] = await Promise.all([
        db.user.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            plan: true,
            emailVerified: true,
            createdAt: true,
            _count: {
              select: {
                conversations: true,
                quizzes: true,
                progress: true,
              },
            },
          },
        }),
        db.user.count({ where }),
      ])

      return NextResponse.json({ users, total, page, limit })
    } catch (dbError) {
      console.error("DB error in admin users:", dbError)
      return NextResponse.json({ users: [], total: 0, page, limit })
    }
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const headerAuth = isAdminAuthenticated(req)
    const sessionAuth = headerAuth ? false : await isSessionAdmin()

    if (!headerAuth && !sessionAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, role, plan } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    try {
      const updateData: any = {}
      if (role) updateData.role = role
      if (plan) updateData.plan = plan

      const user = await db.user.update({
        where: { id: userId },
        data: updateData,
      })

      return NextResponse.json({ user })
    } catch (dbError) {
      console.error("DB error in admin update user:", dbError)
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }
  } catch (error) {
    console.error("Admin update user error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const headerAuth = isAdminAuthenticated(req)
    const sessionAuth = headerAuth ? false : await isSessionAdmin()

    if (!headerAuth && !sessionAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    try {
      await db.user.delete({ where: { id: userId } })
    } catch (dbError) {
      console.error("DB error in admin delete user:", dbError)
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }

    return NextResponse.json({ message: "User deleted" })
  } catch (error) {
    console.error("Admin delete user error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
