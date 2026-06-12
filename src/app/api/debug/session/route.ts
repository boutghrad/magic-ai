import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest) {
  try {
    // Try to get the token from the request
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET || "magic-ai-super-secret-key-2024-production-ready"
    })
    
    // Also check raw cookies
    const rawCookies = req.headers.get("cookie") || ""
    const sessionCookieMatch = rawCookies.match(/__Secure-next-auth\.session-token=([^;]+)/)
    const sessionCookie = sessionCookieMatch ? sessionCookieMatch[1].substring(0, 50) + "..." : "NOT FOUND"
    
    return NextResponse.json({
      token: token || "NO TOKEN",
      rawCookiePresent: !!sessionCookieMatch,
      rawCookiePrefix: sessionCookie,
      secretSet: !!process.env.NEXTAUTH_SECRET,
      secretPrefix: process.env.NEXTAUTH_SECRET?.substring(0, 10) + "...",
      allCookieNames: rawCookies.split(";").map(c => c.trim().split("=")[0]),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({
      error: errorMessage,
      secretSet: !!process.env.NEXTAUTH_SECRET,
    }, { status: 500 })
  }
}
