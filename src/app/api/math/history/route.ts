import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || 'magic-ai-super-secret-key-2024-production-ready',
    })

    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: token.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const conversations = await db.conversation.findMany({
      where: {
        userId: user.id,
        type: 'math',
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      history: conversations.map((c) => ({
        id: c.id,
        problem: c.title || 'Untitled problem',
        createdAt: c.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Math history error:', error)
    return NextResponse.json({ history: [] })
  }
}
