import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { solveMathProblem } from "@/lib/ai"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { problem } = await req.json()
    if (!problem) {
      return NextResponse.json({ error: "Problem is required" }, { status: 400 })
    }

    const result = await solveMathProblem(problem)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Save conversation
    const user = await db.user.findUnique({
      where: { email: session.user.email! },
    })

    if (user) {
      await db.conversation.create({
        data: {
          userId: user.id,
          type: "math",
          title: problem.substring(0, 100),
          messages: [
            { role: "user", content: problem, timestamp: new Date().toISOString() },
            { role: "assistant", content: result.content, timestamp: new Date().toISOString() },
          ],
        },
      })

      await db.progress.create({
        data: {
          userId: user.id,
          subject: "mathematics",
          topic: "problem_solving",
          score: 1,
          total: 1,
        },
      })
    }

    return NextResponse.json({ solution: result.content })
  } catch (error) {
    console.error("Math solver error:", error)
    return NextResponse.json(
      { error: "Failed to solve problem" },
      { status: 500 }
    )
  }
}
