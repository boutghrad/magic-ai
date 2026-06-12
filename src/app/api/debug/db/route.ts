import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Test basic database connection
    const userCount = await db.user.count()

    // Test if we can find a specific user
    const testUser = await db.user.findFirst({
      select: { id: true, email: true, name: true, role: true }
    })

    return NextResponse.json({
      status: "ok",
      database: "connected",
      userCount,
      sampleUser: testUser,
      env: {
        DATABASE_URL_set: !!process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_SECRET_set: !!process.env.NEXTAUTH_SECRET,
      }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined
    return NextResponse.json({
      status: "error",
      database: "failed",
      error: errorMessage,
      stack: errorStack,
      env: {
        DATABASE_URL_set: !!process.env.DATABASE_URL,
        DATABASE_URL_prefix: process.env.DATABASE_URL?.substring(0, 30) + "...",
        NODE_ENV: process.env.NODE_ENV,
      }
    }, { status: 500 })
  }
}
