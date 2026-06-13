import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { compare } from "bcryptjs"
import { db } from "./db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Auth: Missing email or password")
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          })

          if (!user) {
            console.error("Auth: No user found for email:", credentials.email)
            return null
          }

          if (!user.password) {
            console.error("Auth: User has no password set (OAuth user?):", credentials.email)
            return null
          }

          const isValid = await compare(credentials.password, user.password)
          if (!isValid) {
            console.error("Auth: Invalid password for:", credentials.email)
            return null
          }

          console.log("Auth: Successfully authenticated:", credentials.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            plan: user.plan,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error (database/connection issue):", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: { email: user.email! },
        })
        if (!existingUser) {
          await db.user.create({
            data: {
              email: user.email!,
              name: user.name || "User",
              image: user.image,
              googleId: account.providerAccountId,
              emailVerified: true,
            },
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.user.findUnique({
          where: { email: user.email! },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.plan = dbUser.plan
          token.id = dbUser.id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        (session.user as any).plan = token.plan
        ;(session.user as any).id = token.id
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "magic-ai-super-secret-key-2024-production-ready",
}
