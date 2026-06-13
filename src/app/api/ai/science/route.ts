import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { answerScienceQuestion } from "@/lib/ai"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subject, question } = await req.json()
    if (!subject || !question) {
      return NextResponse.json(
        { error: "Subject and question are required" },
        { status: 400 }
      )
    }

    const result = await answerScienceQuestion(subject, question)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! },
    })

    if (user) {
      await db.conversation.create({
        data: {
          userId: user.id,
          type: "science",
          title: `${subject}: ${question.substring(0, 80)}`,
          messages: [
            { role: "user", content: `[${subject}] ${question}`, timestamp: new Date().toISOString() },
            { role: "assistant", content: result.content, timestamp: new Date().toISOString() },
          ],
        },
      })
    }

    return NextResponse.json({ answer: result.content })
  } catch (error) {
    console.error("Science tutor error:", error)
    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 }
    )
  }
}
