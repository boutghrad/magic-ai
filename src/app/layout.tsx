import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/shared/theme-provider"
import { SessionProvider } from "@/components/shared/session-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Magic AI - AI-Powered Learning Platform",
  description:
    "Master Mathematics, Physics, Chemistry, Biology, and Computer Science with AI-powered tutoring, step-by-step solutions, personalized quizzes, and smart study plans.",
  keywords: [
    "Magic AI",
    "AI tutor",
    "math solver",
    "science tutor",
    "homework help",
    "quiz generator",
    "study planner",
    "online learning",
    "AI education",
  ],
  authors: [{ name: "Magic AI" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Magic AI - AI-Powered Learning Platform",
    description:
      "Master any subject with AI-powered tutoring, step-by-step solutions, and personalized study plans.",
    type: "website",
    siteName: "Magic AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Magic AI - AI-Powered Learning Platform",
    description:
      "Master any subject with AI-powered tutoring, step-by-step solutions, and personalized study plans.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
