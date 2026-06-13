import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET || "magic-ai-super-secret-key-2024-production-ready"
    })

    if (!token || !token.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = token.id as string

    // Get real counts from the database
    const [
      conversationCount,
      quizCount,
      studyPlanCount,
      homeworkCount,
      recentConversations,
      recentQuizzes,
    ] = await Promise.all([
      db.conversation.count({ where: { userId } }),
      db.quiz.count({ where: { userId } }),
      db.studyPlan.count({ where: { userId } }),
      db.homework.count({ where: { userId } }),
      db.conversation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, type: true, createdAt: true },
      }),
      db.quiz.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, topic: true, score: true, completed: true, createdAt: true },
      }),
    ])

    // Build recent activity from real data
    const recentActivity = [
      ...recentConversations.map(c => ({
        id: c.id,
        type: c.type,
        title: c.title,
        createdAt: c.createdAt.toISOString(),
      })),
      ...recentQuizzes.map(q => ({
        id: q.id,
        type: 'quiz',
        title: `${q.topic} quiz${q.completed && q.score !== null ? ` — ${q.score}%` : ''}`,
        createdAt: q.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)

    return NextResponse.json({
      stats: {
        questions: conversationCount + homeworkCount,
        quizzes: quizCount,
        studyPlans: studyPlanCount,
        conversations: conversationCount,
      },
      recentActivity,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({
      stats: { questions: 0, quizzes: 0, studyPlans: 0, conversations: 0 },
      recentActivity: [],
    })
  }
}
