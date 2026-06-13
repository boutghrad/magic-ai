import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createStudyPlan } from "@/lib/ai"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subjects, goals, availableHours, duration } = await req.json()
    if (!subjects || subjects.length === 0) {
      return NextResponse.json(
        { error: "At least one subject is required" },
        { status: 400 }
      )
    }

    const result = await createStudyPlan(
      subjects,
      goals || "Master all subjects",
      availableHours || 4,
      duration || "4 weeks"
    )

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! },
    })

    if (user) {
      await db.studyPlan.create({
        data: {
          userId: user.id,
          title: `Study Plan: ${subjects.join(", ")}`,
          subjects,
          schedule: { duration, availableHours },
          goals: { description: goals },
        },
      })
    }

    return NextResponse.json({ plan: result.content })
  } catch (error) {
    console.error("Study plan error:", error)
    return NextResponse.json(
      { error: "Failed to create study plan" },
      { status: 500 }
    )
  }
}
