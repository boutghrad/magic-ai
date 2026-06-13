import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { analyzeHomework } from "@/lib/ai"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { question, imageUrl, subject } = await req.json()
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    const result = await analyzeHomework(question, imageUrl)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! },
    })

    if (user) {
      await db.homework.create({
        data: {
          userId: user.id,
          question,
          imageUrl: imageUrl || null,
          solution: result.content,
          subject: subject || "general",
          status: "solved",
        },
      })
    }

    return NextResponse.json({ solution: result.content })
  } catch (error) {
    console.error("Homework error:", error)
    return NextResponse.json(
      { error: "Failed to analyze homework" },
      { status: 500 }
    )
  }
}
