import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { db } from '@/lib/db'

export async function PUT(request: Request) {
  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || 'magic-ai-super-secret-key-2024-production-ready',
    })

    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email } = body

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Check if email is taken by another user
    const existingUser = await db.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (existingUser && existingUser.email !== token.email) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const updatedUser = await db.user.update({
      where: { email: token.email as string },
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      },
    })

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
