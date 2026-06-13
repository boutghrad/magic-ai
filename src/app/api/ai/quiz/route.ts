import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateQuiz } from "@/lib/ai"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { topic, numQuestions, difficulty, questionTypes } = await req.json()
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const result = await generateQuiz(
      topic,
      numQuestions || 5,
      difficulty || "medium",
      questionTypes || ["multiple_choice", "true_false", "open_ended"]
    )

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Parse the JSON quiz from AI response
    let quizData
    try {
      // Try to extract JSON from the response (may have markdown wrapping)
      const jsonMatch = result.content.match(/\{[\s\S]*\}/)
      quizData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(result.content)
    } catch {
      quizData = { title: `Quiz: ${topic}`, questions: [], raw: result.content }
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! },
    })

    if (user) {
      await db.quiz.create({
        data: {
          userId: user.id,
          topic,
          questions: quizData.questions || [],
        },
      })
    }

    return NextResponse.json({ quiz: quizData })
  } catch (error) {
    console.error("Quiz generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    )
  }
}
