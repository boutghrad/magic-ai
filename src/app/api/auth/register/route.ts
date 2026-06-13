import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    // Normalize email to lowercase
    const normalizedEmail = email?.toLowerCase().trim()

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(password, 12)

    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name || normalizedEmail.split("@")[0],
        plan: "free",
        role: "student",
      },
    })

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
